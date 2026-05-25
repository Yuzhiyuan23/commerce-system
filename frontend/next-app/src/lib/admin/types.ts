export type CategoryStatus = "ENABLED" | "DISABLED";
export type ProductStatus = "DRAFT" | "ON_SHELF" | "OFF_SHELF";
export type SkuStatus = "ENABLED" | "DISABLED";

export type Category = {
  id: number;
  name: string;
  sortOrder: number;
  status: CategoryStatus;
};

export type ProductImage = {
  id?: number;
  imageUrl: string;
  sortOrder: number;
};

export type ProductAttribute = {
  id?: number;
  name: string;
  value: string;
  sortOrder: number;
};

export type ProductSalesAttributeValue = {
  id?: number;
  value: string;
  sortOrder: number;
};

export type ProductSalesAttribute = {
  id?: number;
  name: string;
  sortOrder: number;
  values: ProductSalesAttributeValue[];
};

export type ProductSku = {
  id?: number;
  skuCode: string;
  salesAttrValueKey: string;
  salesAttrValueText: string;
  price: string;
  stock: number;
  lowStockThreshold: number;
  status: SkuStatus;
};

export type ProductSummary = {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  spuCode: string;
  status: ProductStatus;
  minSalePrice: string | null;
  coverImageUrl: string | null;
  merchantId: number | null;
};

export type ProductDetail = {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  spuCode: string;
  subtitle: string | null;
  coverImageUrl: string | null;
  description: string | null;
  status: ProductStatus;
  tags: string | null;
  minSalePrice: string | null;
  detailImages: ProductImage[];
  attributes: ProductAttribute[];
  salesAttributes: ProductSalesAttribute[];
  skus: ProductSku[];
};

export type ProductPayload = {
  categoryId: number;
  name: string;
  spuCode: string;
  subtitle: string;
  coverImageUrl: string;
  description: string;
  status: ProductStatus;
  tags: string;
  detailImages: ProductImage[];
  attributes: ProductAttribute[];
  salesAttributes: ProductSalesAttribute[];
  skus: ProductSku[];
};

export type ProductListFilters = {
  name?: string;
  categoryId?: string;
  status?: string;
};

export type ApiErrorResponse = {
  message?: string;
};

export type SalesUser = {
  id: number;
  email: string;
  nickname: string;
  enabled: boolean;
  createdAt: string;
};

export type SalesUserListResult = {
  users: SalesUser[];
};

export type CreateSalesInput = {
  email: string;
  nickname: string;
  password: string;
};

export type ResetPasswordInput = {
  password: string;
};

export type DisableResult = {
  userId: number;
  enabled: boolean;
};

export type SalesRankItem = {
  nickname: string;
  orderCount: number;
};

export type DashboardSummary = {
  orderStatusCounts: Record<string, number>;
  totalSalesAmount: number;
  salesRanking: SalesRankItem[];
};

export type AdminOrderStatus = "PENDING_PAYMENT" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED" | "CLOSED";

export type AdminOrderListItem = {
  orderId: number;
  orderNo: string;
  userId: number;
  orderStatus: AdminOrderStatus;
  payableAmount: number;
  createdAt: string;
  summaryProductName: string | null;
  summaryItemCount: number;
};

export type AdminOrderListResult = {
  items: AdminOrderListItem[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
};

export type ShipOrderResult = {
  orderId: number;
  orderStatus: string;
  shipmentId: number;
  shipmentStatus: string;
};

export type AutoCompleteResult = {
  completedCount: number;
};

export type SessionUserRole = "CUSTOMER" | "SALES" | "ADMIN";

export type LoginLogEntry = {
  id: number;
  userId: number | null;
  emailSnapshot: string;
  roleSnapshot: string;
  loginResult: string;
  ipAddress: string;
  userAgent: string | null;
  loginAt: string;
};

export type LoginLogListResult = {
  items: LoginLogEntry[];
};

export type OperationLogEntry = {
  id: number;
  operatorUserId: number;
  operatorRole: string;
  actionType: string;
  targetType: string;
  targetId: string;
  actionDetail: string;
  ipAddress: string;
  createdAt: string;
};

export type OperationLogListResult = {
  items: OperationLogEntry[];
};

export type ProductViewLogEntry = {
  id: number;
  userId: number | null;
  anonymousId: string | null;
  productId: number;
  categoryId: number;
  viewedAt: string;
};

export type ProductViewLogListResult = {
  items: ProductViewLogEntry[];
};

export type AdminOrderLineItem = {
  id: number;
  productId: number;
  skuId: number;
  productName: string;
  productNameSnapshot: string;
  skuCode: string;
  skuSpecText: string;
  skuAttrTextSnapshot: string;
  productImageUrl: string | null;
  productImageSnapshot: string | null;
  unitPrice: number;
  quantity: number;
  subtotalAmount: number;
};

export type AdminOrderAddress = {
  id: number | null;
  receiverName: string;
  receiverPhone: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  postalCode: string | null;
  isDefault: boolean;
};

export type AdminOrderStatusHistory = {
  id: number;
  fromStatus: string | null;
  toStatus: string;
  changedBy: number | null;
  changeReason: string | null;
  createdAt: string;
};

export type AdminShipmentInfo = {
  carrierName: string;
  trackingNo: string;
  shippedAt: string | null;
};

export type OrderDetail = {
  id: number;
  orderNo: string;
  orderStatus: string;
  totalAmount: number;
  payableAmount: number;
  paymentDeadlineAt: string | null;
  createdAt: string;
  address: AdminOrderAddress;
  items: AdminOrderLineItem[];
  statusHistory: AdminOrderStatusHistory[];
  shipment: AdminShipmentInfo | null;
};
