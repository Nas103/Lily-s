"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, ArrowLeft, Check, Send } from "lucide-react";
import Image from "next/image";
import { useCurrency } from "@/hooks/useCurrency";
import { useAuth } from "@/stores/authStore";

type OrderItem = {
  id: string;
  name: string;
  imageUrl?: string | null;
  quantity: number;
  price: number;
  size?: string | null;
  color?: string | null;
  brandId?: string | null;
};

type BrandOrder = {
  id: string;
  brandId: string;
  brandName: string | null;
  status: string;
  trackingNumber: string | null;
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
  brandOrders?: BrandOrder[];
};

const BRAND_STATUS_COLORS: Record<string, string> = {
  PENDING: "border-zinc-200 text-zinc-600 bg-zinc-50",
  PROCESSING: "border-amber-200 text-amber-700 bg-amber-50",
  SHIPPED: "border-blue-200 text-blue-700 bg-blue-50",
  DELIVERED: "border-emerald-200 text-emerald-700 bg-emerald-50",
  CANCELLED: "border-red-200 text-red-700 bg-red-50",
};

const STEPS = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function OrderDetailPage() {
  const params = useParams();
  const orderNumber = String(params?.orderNumber || "");
  const { convertPrice } = useCurrency();
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

            {(order.brandOrders?.length ?? 0) > 0 ? (
              <section className="mt-8 rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                  Fulfilled by our brands
                </p>
                <div className="mt-4 space-y-3">
                  {order.brandOrders!.map((bo) => (
                    <div
                      key={bo.id}
                      className="rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-zinc-900">
                            {bo.brandName ?? "Brand"}
                          </p>
                          {bo.trackingNumber ? (
                            <p className="text-xs text-zinc-500">
                              Tracking:{" "}
                              <span className="font-semibold">{bo.trackingNumber}</span>
                            </p>
                          ) : (
                            <p className="text-xs text-zinc-500">Not shipped yet</p>
                          )}
                        </div>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                            BRAND_STATUS_COLORS[bo.status] ?? BRAND_STATUS_COLORS.PENDING
                          }`}
                        >
                          {bo.status}
                        </span>
                      </div>
                      <BrandThread
                        brandId={bo.brandId}
                        brandName={bo.brandName}
                        orderId={order.id}
                      />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

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
                      {item.brandId
                        ? ` · ${
                            order.brandOrders?.find((bo) => bo.brandId === item.brandId)
                              ?.brandName ?? "Brand"
                          }`
                        : ""}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-zinc-900">
                    {convertPrice(item.price * item.quantity).formatted}
                  </p>
                </div>
              ))}
              <div className="space-y-1 border-t border-zinc-100 pt-4 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span>{convertPrice(order.subtotal).formatted}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Shipping</span>
                  <span>{convertPrice(order.shipping).formatted}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-zinc-900">
                  <span>Total</span>
                  <span>{convertPrice(order.total).formatted}</span>
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

type ThreadMessage = {
  id: string;
  body: string;
  fromUserId: string;
  fromRole: string;
  createdAt: string;
  fromName: string | null;
};

function BrandThread({
  brandId,
  brandName,
  orderId,
}: {
  brandId: string;
  brandName: string | null;
  orderId: string;
}) {
  const user = useAuth((state) => state.user);
  const [messages, setMessages] = useState<ThreadMessage[] | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/messages?brandId=${encodeURIComponent(brandId)}&orderId=${encodeURIComponent(orderId)}`,
        { cache: "no-store" }
      );
      if (!res.ok) {
        setMessages([]);
        return;
      }
      const data = await res.json();
      setMessages(data.messages ?? []);
    } catch {
      setMessages([]);
    }
  }, [brandId, orderId]);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  const send = async () => {
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId, orderId, body }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Unable to send.");
        return;
      }
      setDraft("");
      await load();
    } catch {
      setError("Unable to reach the server.");
    } finally {
      setSending(false);
    }
  };

  const label = (message: ThreadMessage) => {
    if (message.fromUserId === user?.id) return "You";
    if (message.fromRole === "BRAND") return brandName ?? "Brand";
    if (message.fromRole === "ADMIN") return "Marketplace team";
    return message.fromName ?? "Customer";
  };

  return (
    <div className="mt-3 border-t border-zinc-200 pt-3">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-900"
      >
        {open ? "Hide messages" : `Message ${brandName ?? "the brand"}`}
      </button>

      {open ? (
        <div className="mt-3">
          {messages === null ? (
            <p className="text-xs text-zinc-500">Loading messages…</p>
          ) : messages.length === 0 ? (
            <p className="text-xs text-zinc-500">
              No messages yet. Ask {brandName ?? "the brand"} a question about this
              order.
            </p>
          ) : (
            <div className="space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    message.fromUserId === user?.id
                      ? "ml-auto bg-black text-white"
                      : "bg-white text-zinc-800 border border-zinc-200"
                  }`}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-60">
                    {label(message)}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap break-words">{message.body}</p>
                  <p className="mt-1 text-[10px] opacity-50">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          {error ? (
            <p className="mt-2 text-xs text-red-500" role="alert">
              {error}
            </p>
          ) : null}

          <div className="mt-3 flex items-center gap-2">
            <input
              className="flex-1 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
              placeholder={`Message ${brandName ?? "the brand"}…`}
              maxLength={1000}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
            />
            <button
              type="button"
              disabled={sending || !draft.trim()}
              onClick={() => void send()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white disabled:opacity-50"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}