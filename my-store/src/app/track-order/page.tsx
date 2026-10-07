"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

type Order = {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  trackingNumber?: string | null;
  createdAt: string;
  orderItems: { id: string; name: string; quantity: number }[];
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order not found");
      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            After purchase
          </p>
          <h1 className="text-3xl font-semibold tracking-tight h1-gradient">
            Track your order
          </h1>
          <p className="text-sm text-zinc-600">
            Enter your order number and the email you used during checkout. We
            will return the latest status instantly.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6 rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm"
        >
          <label className="block text-sm font-medium text-zinc-700">
            Order Number
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(event) => setOrderNumber(event.target.value)}
              placeholder="ORD-20240101-120000-ABCDE"
              className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-500"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            Email address
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-base text-zinc-900 placeholder:text-zinc-500"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Track order
          </button>
        </form>

        {error && (
          <div className="mt-8 rounded-3xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        )}

        {order && (
          <div className="mt-8 rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  {order.orderNumber}
                </p>
                <p className="text-xs text-zinc-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-700">
                {order.status}
              </span>
            </div>
            {order.trackingNumber && (
              <p className="mt-4 text-sm text-zinc-700">
                Tracking number:{" "}
                <span className="font-semibold">{order.trackingNumber}</span>
              </p>
            )}
            <p className="mt-4 text-sm text-zinc-600">
              {order.orderItems.length} item
              {order.orderItems.length === 1 ? "" : "s"} · Total R
              {order.total.toFixed(2)}
            </p>
            <Link
              href={`/orders/${order.orderNumber}`}
              className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-zinc-900 underline underline-offset-4"
            >
              View order details
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}