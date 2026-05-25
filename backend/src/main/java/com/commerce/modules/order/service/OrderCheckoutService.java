package com.commerce.modules.order.service;

import static com.commerce.modules.order.dto.OrderDtos.CheckoutAddressResponse;
import static com.commerce.modules.order.dto.OrderDtos.CheckoutItemResponse;
import static com.commerce.modules.order.dto.OrderDtos.CheckoutResponse;
import static com.commerce.modules.order.dto.OrderDtos.CheckoutSummaryMetaResponse;
import static com.commerce.modules.order.dto.OrderDtos.CreateOrderResponse;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.commerce.modules.order.enums.OrderStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.commerce.modules.cart.mapper.CartItemMapper;
import com.commerce.modules.cart.service.CartService;
import com.commerce.modules.cart.dto.CartDtos;
import com.commerce.modules.common.infrastructure.BusinessIdGenerator;
import com.commerce.modules.common.infrastructure.NumberPrefix;
import com.commerce.modules.order.entity.OrderEntity;
import com.commerce.modules.order.entity.OrderItemEntity;
import com.commerce.modules.order.entity.OrderStatusHistoryEntity;
import com.commerce.modules.order.mapper.OrderItemMapper;
import com.commerce.modules.order.mapper.OrderMapper;
import com.commerce.modules.order.mapper.OrderStatusHistoryMapper;
import com.commerce.modules.product.entity.ProductSkuEntity;
import com.commerce.modules.product.mapper.ProductSkuMapper;
import com.commerce.modules.user.entity.UserEntity;
import com.commerce.modules.user.mapper.UserMapper;

/**
 * 订单结账服务。
 *
 * 负责从购物车到订单的完整流程：结账预览（只读校验）与订单创建（事务性写入）。
 * 创建订单时将商品快照、地址快照写入订单，保证订单数据的不可变性——
 * 后续即使商品信息或用户地址变更，已生成订单不受影响。
 */
@Service
public class OrderCheckoutService {

    private final CartService cartService;
    private final CartItemMapper cartItemMapper;
    private final ProductSkuMapper productSkuMapper;
    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final OrderStatusHistoryMapper orderStatusHistoryMapper;
    private final BusinessIdGenerator businessIdGenerator;
    private final JavaMailSender mailSender;
    private final UserMapper userMapper;

    public OrderCheckoutService(
        CartService cartService,
        CartItemMapper cartItemMapper,
        ProductSkuMapper productSkuMapper,
        OrderMapper orderMapper,
        OrderItemMapper orderItemMapper,
        OrderStatusHistoryMapper orderStatusHistoryMapper,
        BusinessIdGenerator businessIdGenerator,
        JavaMailSender mailSender,
        UserMapper userMapper
    ) {
        this.cartService = cartService;
        this.cartItemMapper = cartItemMapper;
        this.productSkuMapper = productSkuMapper;
        this.orderMapper = orderMapper;
        this.orderItemMapper = orderItemMapper;
        this.orderStatusHistoryMapper = orderStatusHistoryMapper;
        this.businessIdGenerator = businessIdGenerator;
        this.mailSender = mailSender;
        this.userMapper = userMapper;
    }

    /**
     * 结账预览（只读），不做任何数据变更，仅展示当前购物车选中项、默认地址和可下单状态。
     */
    public CheckoutResponse getCheckout(Long userId) {
        CartDtos.CheckoutSummaryResponse checkoutSummary = cartService.getCheckoutSummary(userId);
        return new CheckoutResponse(
            mapItems(checkoutSummary.items()),
            mapAddress(checkoutSummary.defaultAddress()),
            mapSummary(checkoutSummary.summary()));
    }

    private List<CheckoutItemResponse> mapItems(List<CartDtos.CheckoutItemResponse> items) {
        return items.stream()
            .map(item -> new CheckoutItemResponse(
                item.id(),
                item.productId(),
                item.productName(),
                item.productCoverImageUrl(),
                item.skuId(),
                item.skuCode(),
                item.skuSpecText(),
                item.unitPrice(),
                item.quantity(),
                item.subtotalAmount(),
                item.anomalyCode(),
                item.anomalyMessage(),
                item.canCheckout()))
            .toList();
    }

    private CheckoutAddressResponse mapAddress(CartDtos.CheckoutAddressResponse address) {
        if (address == null) {
            return null;
        }
        return new CheckoutAddressResponse(
            address.id(),
            address.receiverName(),
            address.receiverPhone(),
            address.province(),
            address.city(),
            address.district(),
            address.detailAddress(),
            address.postalCode(),
            address.isDefault());
    }

    private CheckoutSummaryMetaResponse mapSummary(CartDtos.CheckoutSummaryMetaResponse summary) {
        return new CheckoutSummaryMetaResponse(
            summary.selectedItemCount(),
            summary.selectedQuantity(),
            summary.selectedAmount(),
            summary.validSelectedItemCount(),
            summary.validSelectedQuantity(),
            summary.validSelectedAmount(),
            summary.canProceed(),
            summary.blockingReasons());
    }

    /**
     * 创建订单（事务性写入）。
     *
     * 流程：再次校验购物车 → 插入订单 → 扣减库存 → 写入订单明细 → 清空已购购物车项 → 记录状态历史。
     * 注意：库存扣减采用 read-modify-write，高并发下存在超卖风险，
     * 应改为 SQL 原子更新（SET stock = stock - quantity WHERE stock >= quantity）。
     */
    @Transactional
    public CreateOrderResponse createOrder(Long userId) {
        CartDtos.CheckoutSummaryResponse checkoutSummary = cartService.getCheckoutSummary(userId);
        if (!Boolean.TRUE.equals(checkoutSummary.summary().canProceed())) {
            throw new IllegalArgumentException("Selected cart items are not ready for checkout");
        }

        OrderEntity order = buildOrder(userId, checkoutSummary);
        orderMapper.insert(order);

        /**
         * 检查库存，库存不足则回滚
         */
        for (CartDtos.CheckoutItemResponse item : checkoutSummary.items()) {
            UpdateWrapper<ProductSkuEntity> updateWrapper = new UpdateWrapper<>();
            updateWrapper.eq("id",  item.skuId())
                    .ge("stock", item.quantity())
                    .setDecrBy(true, "stock", item.quantity());
            int updated = productSkuMapper.update(null, updateWrapper);
            if (updated == 0) {
                throw new IllegalArgumentException("Insufficient stock for SKU: " + item.skuId());
            }

            OrderItemEntity orderItem = buildOrderItem(order, item);
            orderItemMapper.insert(orderItem);
            cartItemMapper.deleteById(item.id());
        }

        OrderStatusHistoryEntity history = new OrderStatusHistoryEntity();
        history.setOrderId(order.getId());
        history.setFromStatus(null);
        history.setToStatus(OrderStatus.PENDING_PAYMENT.name());
        history.setChangedBy(userId);
        history.setChangeReason("order created");
        orderStatusHistoryMapper.insert(history);

        // 异步发送订单确认邮件
        sendOrderConfirmationEmail(userId, order, checkoutSummary.items());

        return new CreateOrderResponse(order.getId(), order.getOrderNo(), order.getOrderStatus(), order.getPayableAmount());
    }

    /**
     * 构建订单实体，将地址信息快照到订单中，使订单成为独立的不可变记录。
     */
    private OrderEntity buildOrder(Long userId, CartDtos.CheckoutSummaryResponse checkoutSummary) {
        CartDtos.CheckoutAddressResponse address = checkoutSummary.defaultAddress();
        CartDtos.CheckoutSummaryMetaResponse summary = checkoutSummary.summary();

        OrderEntity order = new OrderEntity();
        order.setOrderNo(businessIdGenerator.next(NumberPrefix.ORDER));
        order.setUserId(userId);
        order.setOrderStatus(OrderStatus.PENDING_PAYMENT.name());
        order.setTotalAmount(summary.validSelectedAmount());
        order.setPayableAmount(summary.validSelectedAmount());
        order.setPaymentDeadlineAt(LocalDateTime.now().plusMinutes(30));
        order.setAddressSnapshotName(address.receiverName());
        order.setAddressSnapshotPhone(address.receiverPhone());
        order.setAddressSnapshotProvince(address.province());
        order.setAddressSnapshotCity(address.city());
        order.setAddressSnapshotDistrict(address.district());
        order.setAddressSnapshotDetail(address.detailAddress());
        order.setAddressSnapshotPostalCode(address.postalCode());
        return order;
    }

    /**
     * 构建订单商品实体
     * @param order
     * @param item
     * @return
     */
    private OrderItemEntity buildOrderItem(OrderEntity order, CartDtos.CheckoutItemResponse item) {
        OrderItemEntity orderItem = new OrderItemEntity();

        orderItem.setOrderId(order.getId());
        orderItem.setProductId(item.productId());
        orderItem.setSkuId(item.skuId());
        orderItem.setProductNameSnapshot(item.productName());
        orderItem.setSkuCodeSnapshot(item.skuCode());
        orderItem.setSkuAttrTextSnapshot(item.skuSpecText());
        orderItem.setProductImageSnapshot(item.productCoverImageUrl());
        orderItem.setUnitPrice(item.unitPrice());
        orderItem.setQuantity(item.quantity());
        orderItem.setSubtotalAmount(item.subtotalAmount());

        return orderItem;
    }

    @Async
    public void sendOrderConfirmationEmail(Long userId, OrderEntity order, List<CartDtos.CheckoutItemResponse> items) {
        try {
            UserEntity user = userMapper.selectById(userId);
            if (user == null || user.getEmail() == null) {
                return;
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("【Hill购】订单确认 - " + order.getOrderNo());
            message.setText(buildOrderEmailContent(order, items));

            mailSender.send(message);
        } catch (Exception e) {
            // 邮件发送失败不应影响订单创建，仅记录日志
            System.err.println("Failed to send order confirmation email: " + e.getMessage());
        }
    }

    private String buildOrderEmailContent(OrderEntity order, List<CartDtos.CheckoutItemResponse> items) {
        StringBuilder sb = new StringBuilder();
        sb.append("尊敬的用户，您好！\n\n");
        sb.append("您的订单已成功创建，以下是订单详情：\n\n");
        sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        sb.append("订单编号：").append(order.getOrderNo()).append("\n");
        sb.append("订单状态：待付款\n");
        sb.append("下单时间：").append(order.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append("\n");
        sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");

        sb.append("【收货信息】\n");
        sb.append("收件人：").append(order.getAddressSnapshotName()).append("\n");
        sb.append("联系电话：").append(order.getAddressSnapshotPhone()).append("\n");
        sb.append("收货地址：")
          .append(order.getAddressSnapshotProvince())
          .append(order.getAddressSnapshotCity())
          .append(order.getAddressSnapshotDistrict())
          .append(order.getAddressSnapshotDetail())
          .append("\n\n");

        sb.append("【商品清单】\n");
        for (CartDtos.CheckoutItemResponse item : items) {
            sb.append("• ").append(item.productName());
            if (item.skuSpecText() != null && !item.skuSpecText().isEmpty()) {
                sb.append(" (").append(item.skuSpecText()).append(")");
            }
            sb.append("\n");
            sb.append("  单价：¥").append(String.format("%.2f", item.unitPrice()))
              .append(" × ").append(item.quantity())
              .append(" = ¥").append(String.format("%.2f", item.subtotalAmount()))
              .append("\n\n");
        }

        sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        sb.append("订单金额：¥").append(String.format("%.2f", order.getTotalAmount())).append("\n");
        sb.append("应付金额：¥").append(String.format("%.2f", order.getPayableAmount())).append("\n");
        sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");

        sb.append("【支付说明】\n");
        sb.append("请在30分钟内完成支付，超时订单将自动关闭。\n");
        sb.append("支付截止时间：").append(order.getPaymentDeadlineAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append("\n\n");

        sb.append("感谢您选择Hill购，祝您购物愉快！\n\n");
        sb.append("如有任何问题，请联系客服。\n");
        sb.append("Hill购团队\n");

        return sb.toString();
    }
}
