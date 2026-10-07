"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Package } from "lucide-react";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  orderItems: { id: string }[];
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PAID: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-indigo-50 text-indigo-700 border-indigo-200",
  SHIPPED: "bg-purple-50 text-purple-700 border-purple-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-zinc-100 text-zinc-600 border-zinc-200",
  FAILED: "bg-red-50 text-red-700 border-red-200",
};

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/orders", { credentials: "same-origin" });
        if (!res.ok) throw new Error("Unable to load orders");
        const data = await res.json();
        if (active) setOrders(data.orders || []);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unable to load orders");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12 text-zinc-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center text-sm text-zinc-500">
        <Package className="mx-auto mb-4 h-8 w-8 text-zinc-300" />
        <p>You have not placed any orders yet.</p>
        <Link href="/" className="mt-3 inline-block underline underline-offset-4">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/orders/${order.orderNumber}`}
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 p-4 transition hover:border-zinc-400"
        >
          <div>
            <p className="text-sm font-semibold text-zinc-900">
              {order.orderNumber}
            </p>
            <p className="text-xs text-zinc-500">
              {new Date(order.createdAt).toLocaleDateString()} ·{" "}
              {order.orderItems.length} item
              {order.orderItems.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                statusStyles[order.status] || statusStyles.PENDING
              }`}
            >
              {order.status}
            </span>
            <span className="text-sm font-semibold text-zinc-900">
              R{order.total.toFixed(2)}
            </span>
          </div>
        </Link>
      ))}
      <Link
        href="/orders"
        className="block pt-2 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-900 underline underline-offset-4"
      >
        View all orders
      </Link>
    </div>
  );
}