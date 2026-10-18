"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Package } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  orderItems: { id: string }[];
};

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-950/40 text-amber-400 border-amber-900",
  PAID: "bg-blue-950/40 text-blue-400 border-blue-900",
  PROCESSING: "bg-indigo-950/40 text-indigo-400 border-indigo-900",
  SHIPPED: "bg-purple-950/40 text-purple-400 border-purple-900",
  DELIVERED: "bg-emerald-950/40 text-emerald-400 border-emerald-900",
  CANCELLED: "bg-zinc-800 text-zinc-300 border-zinc-700",
  FAILED: "bg-red-950/40 text-red-400 border-red-900",
};

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { convertPrice } = useCurrency();

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
      <div className="flex justify-center py-12 text-zinc-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-900 bg-red-950/40 p-6 text-sm text-red-400">
        {error}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-700 p-12 text-center text-sm text-zinc-400">
        <Package className="mx-auto mb-4 h-8 w-8 text-zinc-600" />
        <p>You have not placed any orders yet.</p>
        <Link href="/" className="mt-3 inline-block underline underline-offset-4 text-zinc-200 hover:text-white">
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
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-800 p-4 transition hover:border-zinc-600"
        >
          <div>
            <p className="text-sm font-semibold text-zinc-100">
              {order.orderNumber}
            </p>
            <p className="text-xs text-zinc-400">
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
            <span className="text-sm font-semibold text-zinc-100">
              {convertPrice(order.total).formatted}
            </span>
          </div>
        </Link>
      ))}
      <Link
        href="/orders"
        className="block pt-2 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-200 underline underline-offset-4 hover:text-white"
      >
        View all orders
      </Link>
    </div>
  );
}