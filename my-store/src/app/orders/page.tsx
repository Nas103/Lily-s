"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Loader2 } from "lucide-react";
import { useAuth } from "@/stores/authStore";
import { BRAND } from "@/lib/brand";

type OrderItem = {
  id: string;
  name: string;
  imageUrl?: string | null;
  quantity: number;
  price: number;
  size?: string | null;
  color?: string | null;
};

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  currency: string;
  createdAt: string;
  trackingNumber?: string | null;
  orderItems: OrderItem[];
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

export default function OrdersPage() {
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/orders", { credentials: "same-origin" });
        if (res.status === 401) {
          router.push("/login?next=/orders");
          return;
        }
        if (!res.ok) throw new Error("Unable to load orders");
        const data = await res.json();
        if (active) setOrders(data.orders || []);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unable to load orders");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [router, user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6 text-zinc-700" />
          <h1 className="text-3xl font-semibold tracking-tight h1-gradient">
            Your orders
          </h1>
        </div>
        <p className="mt-2 text-sm text-zinc-600">
          Track the status of every order you have placed with {BRAND.name}.
        </p>

        {loading && (
          <div className="mt-16 flex justify-center text-zinc-500">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="mt-10 rounded-3xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="mt-10 rounded-3xl border border-dashed border-zinc-200 p-12 text-center text-sm text-zinc-500">
            You have not placed any orders yet.{" "}
            <Link href="/" className="underline underline-offset-4">
              Start shopping
            </Link>
          </div>
        )}

        <div className="mt-10 space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.orderNumber}`}
              className="block rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm transition hover:border-zinc-300"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    {" · "}
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
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}