import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminOrderDetail } from "@/features/admin/order/admin-order-detail";
import { AdminShell } from "@/features/admin/catalog/admin-shell";
import { requireRole } from "@/lib/auth/server";
import { getAdminOrderDetail } from "@/lib/admin/server";
import { OrderRequestError } from "@/lib/order/errors";

type AdminOrderDetailPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { orderId } = await params;
  const user = await requireRole(["ADMIN", "SALES"], `/admin/orders/${orderId}`);

  try {
    const order = await getAdminOrderDetail(Number(orderId));

    return (
      <AdminShell
        description="查看订单详情，处理退款等操作。"
        title="订单详情"
        user={user}
      >
        <AdminOrderDetail order={order} />
      </AdminShell>
    );
  } catch (error) {
    if (error instanceof OrderRequestError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}
