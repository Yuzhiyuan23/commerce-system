import Link from "next/link";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth/server";
import { getServerOrder } from "@/lib/order/server";
import { OrderRequestError } from "@/lib/order/errors";

type PaymentSuccessPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function PaymentSuccessPage({ params }: PaymentSuccessPageProps) {
  const { orderId } = await params;
  await requireUser(`/orders/${orderId}/success`);

  try {
    const order = await getServerOrder(Number(orderId));

    if (order.orderStatus !== "PAID") {
      notFound();
    }

    return (
      <main className="min-h-screen px-6 py-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
          <div className="rounded-full bg-emerald-100 p-6">
            <svg
              className="h-16 w-16 text-emerald-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-emerald-700">
              支付成功！
            </h1>
            <p className="mt-3 text-sm text-black/65">
              您的订单已成功支付，订单金额：¥{order.payableAmount.toFixed(2)}
            </p>
          </div>

          <div className="w-full rounded-[24px] border border-black/10 bg-white/90 p-6 shadow-[0_16px_40px_rgba(29,20,13,0.06)]">
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-sm text-black/50">订单号</span>
                <span className="font-medium">{order.orderNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-black/50">订单状态</span>
                <span className="font-medium text-emerald-600">已支付</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-black/50">实付金额</span>
                <span className="font-semibold text-[var(--accent-strong)]">
                  ¥{order.payableAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white"
              href="/"
            >
              返回首页
            </Link>
            <Link
              className="rounded-full border border-black/10 px-6 py-3 text-sm font-medium"
              href={`/orders/${orderId}`}
            >
              查看订单详情
            </Link>
            <Link
              className="rounded-full border border-black/10 px-6 py-3 text-sm font-medium"
              href="/orders"
            >
              全部订单
            </Link>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    if (error instanceof OrderRequestError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}
