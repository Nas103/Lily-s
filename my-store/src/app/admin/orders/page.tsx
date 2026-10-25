"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/stores/authStore";

type AdminItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string | null;
  color?: string | null;
  imageUrl?: string | null;
};

type AdminOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  paymentMethod?: string | null;
  paymentRef?: string | null;
  trackingNumber?: string | null;
  notes?: string | null;
  shippingEmail?: string | null;
  shippingName?: string | null;
  userEmail?: string | null;
  userName?: string | null;
  createdAt: string;
  updatedAt?: string;
  orderItems: AdminItem[];
  notification?: "sent" | "logged" | "failed";
};

const ORDER_STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "FAILED"];
const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];

const money = (value: number) =>
  `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const statusClass = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-zinc-100 text-zinc-600";
    case "PAID":
    case "PROCESSING":
      return "bg-blue-100 text-blue-700";
    case "SHIPPED":
      return "bg-violet-100 text-violet-700";
    case "DELIVERED":
      return "bg-emerald-100 text-emerald-700";
    case "CANCELLED":
      return "bg-red-100 text-red-600";
    case "FAILED":
      return "bg-red-100 text-red-600";
    default:
      return "bg-zinc-100 text-zinc-600";
  }
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const isAdmin = useAuth((state) => state.isAdmin);

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (!user || !isAdmin()) {
      router.push("/");
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/orders", {
        headers: { "x-user-id": user!.id, "x-user-email": user!.email },
      });
      if (!res.ok) throw new Error("Unable to load orders.");
      const data = (await res.json()) as AdminOrder[];
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      if (statusFilter && order.status !== statusFilter) return false;
      if (!q) return true;
      return `${order.orderNumber} ${order.userEmail ?? ""} ${order.shippingEmail ?? ""} ${order.shippingName ?? ""}`
        .toLowerCase()
        .includes(q);
    });
  }, [orders, query, statusFilter]);

  const handleUpdated = (orderNumber: string, row: Partial<AdminOrder>) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderNumber === orderNumber ? { ...order, ...row } : order
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
          Fulfillment
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Orders
        </h1>
        <p className="text-sm text-zinc-600">
          Update statuses, add tracking numbers, cancel orders, and email customers.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search order number, email…"
          className="w-64 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
        >
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600 transition hover:border-zinc-900 hover:text-zinc-900"
        >
          Refresh
        </button>
        <span className="text-xs text-zinc-500">
          {filtered.length} of {orders.length}
        </span>
      </div>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="py-16 text-center text-sm text-zinc-500">Loading orders…</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} onUpdated={handleUpdated} />
          ))}
          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-10 text-center text-sm text-zinc-500">
              No orders found.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

function OrderCard({
  order,
  onUpdated,
}: {
  order: AdminOrder;
  onUpdated: (orderNumber: string, row: Partial<AdminOrder>) => void;
}) {
  const user = useAuth((state) => state.user);
  const isAdmin = useAuth((state) => state.isAdmin);

  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [tracking, setTracking] = useState(order.trackingNumber ?? "");
  const [notes, setNotes] = useState(order.notes ?? "");
  const [expanded, setExpanded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const dirty =
    status !== order.status ||
    paymentStatus !== order.paymentStatus ||
    tracking.trim() !== (order.trackingNumber ?? "");

  const save = async (extra?: { notify?: boolean; cancel?: boolean }) => {
    if (!user || !isAdmin() || busy) return;
    setBusy(true);
    setFeedback(null);
    try {
      const body: { status?: string; paymentStatus?: string; trackingNumber?: string; notes?: string; notify?: boolean } = {
        status: extra?.cancel ? "CANCELLED" : status,
        paymentStatus,
        trackingNumber: tracking,
        notes,
      };
      if (extra?.notify) body.notify = true;
      if (extra?.cancel) body.notify = true;

      const res = await fetch(`/api/admin/orders/${order.orderNumber}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
          "x-user-email": user.email,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Update failed");
      }
      const updated = (await res.json()) as AdminOrder;
      onUpdated(order.orderNumber, {
        status: updated.status,
        paymentStatus: updated.paymentStatus,
        trackingNumber: updated.trackingNumber,
        notes: updated.notes,
        notification: updated.notification,
      });
      setStatus(updated.status);
      setPaymentStatus(updated.paymentStatus);
      setTracking(updated.trackingNumber ?? "");
      setNotes(updated.notes ?? "");
      setFeedback(
        updated.notification === "sent"
          ? "Saved — email sent to customer"
          : updated.notification === "failed"
            ? "Saved — email failed to send"
            : "Saved"
      );
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const customer = order.userEmail || order.shippingEmail || order.shippingName || "Unknown";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-zinc-100 px-3 py-1 font-mono text-xs text-zinc-700">
            {order.orderNumber}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] ${statusClass(order.status)}`}
          >
            {order.status}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span>{new Date(order.createdAt).toLocaleString()}</span>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="font-semibold text-zinc-600 transition hover:text-zinc-900"
          >
            {expanded ? "Hide details" : "Show details"}
          </button>
        </div>
      </div>

      <div className="mt-3 grid gap-x-6 gap-y-2 md:grid-cols-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
            Customer
          </p>
          <p className="font-medium text-zinc-900">{customer}</p>
          <p className="text-xs text-zinc-500">
            {order.shippingName ? `Attn: ${order.shippingName}` : ""}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
            Total
          </p>
          <p className="font-medium text-zinc-900">{money(order.total)}</p>
          <p className="text-xs text-zinc-500">
            {order.paymentMethod ?? "—"} · paid via {order.paymentStatus}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[160px_160px_1fr]">
        <label>
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
            Order status
          </span>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setFeedback(null);
            }}
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
          >
            {ORDER_STATUSES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
            Payment status
          </span>
          <select
            value={paymentStatus}
            onChange={(event) => {
              setPaymentStatus(event.target.value);
              setFeedback(null);
            }}
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
          >
            {PAYMENT_STATUSES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
            Tracking number
          </span>
          <input
            type="text"
            value={tracking}
            onChange={(event) => {
              setTracking(event.target.value);
              setFeedback(null);
            }}
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
          />
        </label>
      </div>

      {expanded ? (
        <div className="mt-4 space-y-4 border-t border-zinc-100 pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
              Items
            </p>
            <table className="mt-2 w-full text-left text-xs">
              <tbody>
                {order.orderItems.map((item) => (
                  <tr key={item.id} className="border-b border-zinc-50 last:border-0">
                    <td className="py-1.5 pr-3 font-medium text-zinc-900">
                      {item.name}
                    </td>
                    <td className="py-1.5 pr-3 text-zinc-500">
                      {[item.size, item.color].filter(Boolean).join(" · ")}
                    </td>
                    <td className="py-1.5 pr-3 text-zinc-500">×{item.quantity}</td>
                    <td className="py-1.5 text-right font-medium text-zinc-900">
                      {money(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <label>
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
              Admin notes
            </span>
            <textarea
              value={notes}
              onChange={(event) => {
                setNotes(event.target.value);
                setFeedback(null);
              }}
              rows={2}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
            />
          </label>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-4">
        {dirty ? (
          <button
            type="button"
            onClick={() => void save()}
            disabled={busy}
            className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:opacity-80 disabled:opacity-50"
          >
            {busy ? "Saving…" : "Save status"}
          </button>
        ) : null}
        {order.status !== "CANCELLED" ? (
          <button
            type="button"
            onClick={() => void save({ cancel: true })}
            disabled={busy}
            className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:border-red-500 hover:text-red-700 disabled:opacity-50"
          >
            Cancel order & email
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => void save({ notify: true })}
          disabled={busy}
          className="rounded-full border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-600 transition hover:border-zinc-900 hover:text-zinc-900 disabled:opacity-50"
        >
          Email customer
        </button>
        {feedback ? (
          <span
            className={`text-xs font-medium ${
              feedback.includes("failed") || feedback.includes("Error")
                ? "text-red-600"
                : "text-emerald-600"
            }`}
          >
            {feedback}
          </span>
        ) : null}
      </div>
    </div>
  );
}