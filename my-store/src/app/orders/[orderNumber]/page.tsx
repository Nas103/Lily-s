"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, ArrowLeft, Check } from "lucide-react";
import Image from "next/image";

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
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  trackingNumber?: string | null;
  createdAt: string;
  shippingName?: string | null;
  shippingEmail?: string | null;
  shippingAddressLine1?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  shippingPostcode?: string | null;
  shippingCountry?: string | null;
  orderItems: OrderItem[];
};

const STEPS = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function OrderDetailPage() {
  const params = useParams();
  const orderNumber = String(params?.orderNumber || "");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch(`/api/orders/${orderNumber}`, {
          credentials: "same-origin",
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Order not found");
        }
        const data = await res.json();
        if (active) setOrder(data.order);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Order not found");
      } finally {
        if (active) setLoading(false);
      }
    };
    if (orderNumber) load();
    return () => {
      active = false;
    };
  }, [orderNumber]);

  const currentStep = order
    ? order.status === "CANCELLED" || order.status === "FAILED"
      ? -1
      : STEPS.indexOf(order.status)
    : -1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
      <main className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500 hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" /> All orders
        </Link>

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

        {order && !loading && (
          <>
            <header className="mt-6 space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight h1-gradient">
                {order.orderNumber}
              </h1>
              <p className="text-sm text-zinc-600">
                Placed{" "}
                {new Date(order.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </header>

            {(order.status === "CANCELLED" || order.status === "FAILED") && (
              <div className="mt-8 rounded-3xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
                This order was {order.status.toLowerCase()}.
              </div>
            )}

            {currentStep >= 0 && (
              <div className="mt-8 flex items-center justify-between">
                {STEPS.map((step, index) => (
                  <div key={step} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                          index <= currentStep
                            ? "border-zinc-900 bg-zinc-900 text-white"
                            : "border-zinc-200 bg-white text-zinc-400"
                        }`}
                      >
                        {index <= currentStep ? <Check className="h-4 w-4" /> : index + 1}
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                        {step}
                      </span>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`mx-2 h-px flex-1 ${
                          index < currentStep ? "bg-zinc-900" : "bg-zinc-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {order.trackingNumber && (
              <p className="mt-8 text-sm text-zinc-700">
                Tracking number:{" "}
                <span className="font-semibold">{order.trackingNumber}</span>
              </p>
            )}

            <section className="mt-10 space-y-4 rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-zinc-100">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-900">{item.name}</p>
                    <p className="text-xs text-zinc-500">
                      Qty {item.quantity}
                      {item.size ? ` · Size ${item.size}` : ""}
                      {item.color ? ` · ${item.color}` : ""}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-zinc-900">
                    R{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              <div className="space-y-1 border-t border-zinc-100 pt-4 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span>R{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Shipping</span>
                  <span>R{order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-zinc-900">
                  <span>Total</span>
                  <span>R{order.total.toFixed(2)}</span>
                </div>
              </div>
            </section>

            {(order.shippingAddressLine1 || order.shippingCity) && (
              <section className="mt-6 rounded-3xl border border-zinc-100 bg-white p-6 text-sm text-zinc-700 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                  Shipping to
                </p>
                <p className="mt-2">{order.shippingName}</p>
                <p>{order.shippingAddressLine1}</p>
                <p>
                  {[order.shippingCity, order.shippingState, order.shippingPostcode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p>{order.shippingCountry}</p>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}