import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/server";

type PaymentPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { orderId } = await params;
  await requireUser(`/pay/${orderId}`);

  // 直接跳转到支付成功页面（模拟支付成功）
  redirect(`/orders/${orderId}/result`);
}
