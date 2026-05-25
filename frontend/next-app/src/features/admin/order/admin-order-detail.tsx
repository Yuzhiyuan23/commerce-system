"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";

import { refundOrder } from "@/lib/admin/client";
import type { OrderDetail } from "@/lib/order/types";

type AdminOrderDetailProps = {
  order: OrderDetail;
};

export function AdminOrderDetail({ order }: AdminOrderDetailProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const canRefund = order.orderStatus === "PAID" || order.orderStatus === "SHIPPED";
  const canShip = order.orderStatus === "PAID";

  return (
    <div className="space-y-6">
      {/* 订单状态卡片 */}
      <section className="rounded-[28px] border border-black/10 bg-white/90 p-6 shadow-[0_16px_40px_rgba(29,20,13,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">订单 {order.orderNo}</h2>
            <p className="mt-2 text-sm text-black/65">创建时间：{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <span className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white">
            {renderStatus(order.orderStatus)}
          </span>
        </div>
      </section>

      {/* 操作按钮 */}
      {(canShip || canRefund) && (
        <section className="rounded-[28px] border border-black/10 bg-white/90 p-6 shadow-[0_16px_40px_rgba(29,20,13,0.06)]">
          <h3 className="text-lg font-semibold mb-4">订单操作</h3>
          <div className="flex flex-wrap gap-3">
            {canShip && (
              <Link
                className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
                href={`/admin/orders/${order.id}/ship`}
              >
                去发货
              </Link>
            )}
            {canRefund && (
              <button
                className="rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-700 disabled:opacity-50"
                disabled={isPending}
                onClick={() => {
                  setError("");
                  setMessage("");
                  startTransition(async () => {
                    try {
                      await refundOrder(order.id);
                      setMessage("退款成功，订单已取消");
                      router.refresh();
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "退款失败");
                    }
                  });
                }}
              >
                {isPending ? "处理中..." : "退款"}
              </button>
            )}
          </div>
          {message && <p className="mt-4 text-sm text-green-700">{message}</p>}
          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
        </section>
      )}

      {/* 收货地址 */}
      <section className="rounded-[28px] border border-black/10 bg-white/90 p-6 shadow-[0_16px_40px_rgba(29,20,13,0.06)]">
        <h3 className="text-lg font-semibold mb-4">收货地址</h3>
        <div className="space-y-2 text-sm">
          <p><span className="text-black/65">收货人：</span>{order.address.receiverName}</p>
          <p><span className="text-black/65">联系电话：</span>{order.address.receiverPhone}</p>
          <p><span className="text-black/65">地址：</span>{order.address.province}{order.address.city}{order.address.district}{order.address.detailAddress}</p>
          {order.address.postalCode && <p><span className="text-black/65">邮编：</span>{order.address.postalCode}</p>}
        </div>
      </section>

      {/* 商品列表 */}
      <section className="rounded-[28px] border border-black/10 bg-white/90 p-6 shadow-[0_16px_40px_rgba(29,20,13,0.06)]">
        <h3 className="text-lg font-semibold mb-4">商品清单</h3>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-[16px] border border-black/10 bg-[#fffaf5] p-4">
              {item.productImageSnapshot && (
                <img src={item.productImageSnapshot} alt={item.productNameSnapshot} className="h-16 w-16 rounded-lg object-cover" />
              )}
              <div className="flex-1">
                <p className="font-medium">{item.productNameSnapshot}</p>
                <p className="text-sm text-black/65">{item.skuAttrTextSnapshot}</p>
                <p className="text-sm text-black/65">单价：¥{item.unitPrice.toFixed(2)} × {item.quantity}</p>
              </div>
              <p className="font-semibold">¥{item.subtotalAmount.toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between border-t border-black/10 pt-4">
          <span className="text-black/65">订单金额</span>
          <span className="text-2xl font-semibold text-[var(--accent-strong)]">¥{order.payableAmount.toFixed(2)}</span>
        </div>
      </section>

      {/* 状态历史 */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <section className="rounded-[28px] border border-black/10 bg-white/90 p-6 shadow-[0_16px_40px_rgba(29,20,13,0.06)]">
          <h3 className="text-lg font-semibold mb-4">状态变更记录</h3>
          <div className="space-y-3">
            {order.statusHistory.map((history) => (
              <div key={history.id} className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-black/65">{history.fromStatus || "创建"}</span>
                  <span className="mx-2">→</span>
                  <span>{history.toStatus}</span>
                  {history.changeReason && <span className="ml-2 text-black/65">({history.changeReason})</span>}
                </div>
                <span className="text-black/50">{new Date(history.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <Link className="inline-flex rounded-full border border-black/10 px-5 py-3 text-sm font-medium" href="/admin/orders">
        返回订单列表
      </Link>
    </div>
  );
}

function renderStatus(status: string) {
  switch (status) {
    case "PENDING_PAYMENT":
      return "待支付";
    case "PAID":
      return "已支付";
    case "SHIPPED":
      return "已发货";
    case "COMPLETED":
      return "已完成";
    case "CANCELLED":
      return "已取消";
    case "CLOSED":
      return "已关闭";
    default:
      return status;
  }
}
