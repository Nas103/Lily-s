"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/stores/authStore";

type AdminMessage = {
  id: string;
  body: string;
  fromUserId: string;
  fromRole: string;
  toUserId: string | null;
  orderId: string | null;
  createdAt: string;
  readAt: string | null;
  fromName: string | null;
  toName: string | null;
  brandId: string;
  brandName: string | null;
};

const roleLabel = (message: AdminMessage) => {
  if (message.fromRole === "ADMIN") return "Platform";
  if (message.fromRole === "BRAND") return message.fromName ?? "Brand";
  return message.fromName ?? "Customer";
};

export default function AdminMessagesPage() {
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const isAdmin = useAuth((state) => state.isAdmin);
  const logout = useAuth((state) => state.logout);

  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (user && !isAdmin()) {
      router.push("/");
    } else if (!user) {
      router.push("/login?next=/admin/messages");
    }
  }, [user, isAdmin, router]);

  const fetchMessages = async () => {
    if (!user || !isAdmin()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/messages", { cache: "no-store" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Unable to load messages.");
        setMessages([]);
        return;
      }
      const data = await res.json();
      setMessages(data.messages ?? []);
    } catch {
      setError("Unable to reach the server right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin()) void fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const reply = async (message: AdminMessage) => {
    if (!user || !isAdmin()) return;
    const input = window.prompt(
      `Reply in thread — to ${
        message.fromRole === "ADMIN"
          ? message.toName || "previous recipient"
          : roleLabel(message)
      }${message.brandName ? ` (${message.brandName})` : ""}:`
    );
    if (input === null) return;
    const body = input.trim();
    if (!body) return;

    // Reply to the message sender; for our own past messages, to whoever we
    // originally wrote to.
    const toUserId =
      message.fromRole === "ADMIN" ? message.toUserId : message.fromUserId;

    setBusyId(message.id);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId: message.brandId,
          orderId: message.orderId ?? undefined,
          toUserId: toUserId ?? undefined,
          body,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Reply failed.");
        return;
      }
      await fetchMessages();
    } catch {
      alert("Unable to reach the server. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="text-white">
      <p className="text-xs uppercase tracking-[0.35em] text-white/40">Internal tool</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
        Messages
      </h1>
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-sm text-white/50">
          Client, brand and platform threads across the marketplace. Logged in as{" "}
          <span className="font-medium text-white">{user?.email}</span>
        </p>
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:border-white/30 hover:text-white"
        >
          Logout
        </button>
      </div>

      {error ? (
        <p className="mt-4 text-xs text-red-500" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-8 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm text-zinc-900"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-zinc-900">
                  {roleLabel(message)}
                  <span className="ml-2 text-xs font-normal text-zinc-500">
                    {message.fromRole === "ADMIN" ? "outbound" : "inbound"}
                    {message.brandName ? ` · ${message.brandName}` : ""}
                    {message.orderId ? " · order thread" : ""}
                    {message.readAt === null && message.fromRole !== "ADMIN"
                      ? " · unread"
                      : ""}
                  </span>
                </p>
                <p className="mt-1 whitespace-pre-wrap break-words text-zinc-700">
                  {message.body}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                disabled={busyId === message.id}
                onClick={() => void reply(message)}
                className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                {busyId === message.id ? "Sending…" : "Reply"}
              </button>
            </div>
          </div>
        ))}

        {messages.length === 0 && !loading ? (
          <p className="text-xs text-white/40">No marketplace messages yet.</p>
        ) : null}
        {loading ? <p className="text-xs text-white/40">Loading…</p> : null}
      </div>
    </div>
  );
}
