package com.commerce.modules.order.web;

import static com.commerce.modules.order.dto.OrderCenterDtos.OrderListQuery;
import static com.commerce.modules.order.dto.OrderCenterDtos.OrderListResponse;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.commerce.modules.order.service.OrderCenterService;
import com.commerce.modules.user.security.AuthenticatedUserPrincipal;

@RestController
@RequestMapping("/api/orders")
public class OrderCenterController {

    private final OrderCenterService orderCenterService;

    public OrderCenterController(OrderCenterService orderCenterService) {
        this.orderCenterService = orderCenterService;
    }

    @GetMapping
    public OrderListResponse listOrders(
        @RequestParam(required = false) Integer page,
        @RequestParam(required = false) Integer size,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String orderNo,
        Authentication authentication
    ) {
        return orderCenterService.listOrders(requireUserId(authentication), new OrderListQuery(page, size, status, orderNo));
    }

    @GetMapping("/merchant")
    public OrderListResponse listMerchantOrders(
        @RequestParam(required = false) Integer page,
        @RequestParam(required = false) Integer size,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String orderNo,
        Authentication authentication
    ) {
        // 商家只能查看包含自己家产品的订单
        return orderCenterService.listMerchantOrders(requireUserId(authentication), new OrderListQuery(page, size, status, orderNo));
    }

    private Long requireUserId(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUserPrincipal principal)) {
            throw new IllegalStateException("Authenticated user is required");
        }
        return principal.id();
    }
}
