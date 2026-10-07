export function generateOrderNumber(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, "");
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${dateStr}-${timeStr}-${randomStr}`;
}

export function serializeOrder(order: any) {
  if (!order) return order;
  return {
    ...order,
    subtotal: Number(order.subtotal ?? 0),
    shipping: Number(order.shipping ?? 0),
    total: Number(order.total ?? 0),
    createdAt: order.createdAt?.toISOString?.() ?? order.createdAt,
    updatedAt: order.updatedAt?.toISOString?.() ?? order.updatedAt,
    orderItems: (order.orderItems ?? []).map((item: any) => ({
      ...item,
      price: Number(item.price ?? 0),
    })),
  };
}

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "FAILED";

export const ORDER_STATUS_STEPS: OrderStatus[] = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

export function statusLabel(status: string): string {
  return status.charAt(0) + status.slice(1).toLowerCase();
}