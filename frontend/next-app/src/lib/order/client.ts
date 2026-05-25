"use client";

import { OrderRequestError } from "@/lib/order/errors";
import type {
  ApiErrorResponse,
  CancelOrderResult,
  ConfirmReceiptResult,
  CreateOrderResult,
  MockPayResult,
  OrderCheckout,
  OrderDetail,
  OrderListQuery,
  OrderListResult
} from "@/lib/order/types";

export async function listOrders(query?: OrderListQuery): Promise<OrderListResult> {
  return sendOrderRequest<OrderListResult>(`/api/orders${buildOrderListSearch(query)}`);
}

// 商家查询订单（只包含自己产品的订单）
export async function listMerchantOrders(query?: OrderListQuery): Promise<OrderListResult> {
  return sendOrderRequest<OrderListResult>(`/api/orders/merchant${buildOrderListSearch(query)}`);
}

export async function getOrderCheckout(): Promise<OrderCheckout> {
  return sendOrderRequest<OrderCheckout>("/api/orders/checkout");
}

export async function createOrder(): Promise<CreateOrderResult> {
  return sendOrderRequest<CreateOrderResult>("/api/orders", {
    method: "POST"
  });
}

export async function getOrder(orderId: number): Promise<OrderDetail> {
  return sendOrderRequest<OrderDetail>(`/api/orders/${orderId}`);
}

export async function cancelOrder(orderId: number): Promise<CancelOrderResult> {
  return sendOrderRequest<CancelOrderResult>(`/api/orders/${orderId}/cancel`, {
    method: "POST"
  });
}

export async function confirmReceipt(orderId: number): Promise<ConfirmReceiptResult> {
  return sendOrderRequest<ConfirmReceiptResult>(`/api/orders/${orderId}/receive`, {
    method: "POST"
  });
}

export async function mockPayOrder(orderId: number): Promise<MockPayResult> {
  return sendOrderRequest<MockPayResult>(`/api/payments/orders/${orderId}/mock-pay`, {
    method: "POST"
  });
}

async function sendOrderRequest<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
      credentials: "include",
      headers: {
        "content-type": "application/json",
        ...(init?.headers ?? {})
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const payload = (await safeJson(response)) as ApiErrorResponse | null;
      throw new OrderRequestError(response.status, payload?.message ?? "请求失败，请稍后重试");
    }

    return (await response.json()) as T;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new OrderRequestError(408, "请求超时，请检查网络连接");
    }
    throw error;
  }
}

function buildOrderListSearch(query?: OrderListQuery): string {
  if (!query) {
    return "";
  }

  const searchParams = new URLSearchParams();
  if (query.page !== undefined) {
    searchParams.set("page", String(query.page));
  }
  if (query.size !== undefined) {
    searchParams.set("size", String(query.size));
  }
  if (query.status) {
    searchParams.set("status", query.status);
  }
  if (query.orderNo?.trim()) {
    searchParams.set("orderNo", query.orderNo.trim());
  }

  const search = searchParams.toString();
  return search ? `?${search}` : "";
}

async function safeJson(response: Response): Promise<unknown | null> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
