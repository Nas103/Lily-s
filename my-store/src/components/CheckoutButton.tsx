"use client";

import { useState } from "react";
import { useCart } from "@/stores/cartStore";

export function CheckoutButton() {
  const items = useCart((state) => state.items);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (!items.length) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      // Checkout requires a signed-in user (so the order can be recorded).
      if (res.status === 401) {
        window.location.href = "/login?next=/checkout";
        return;
      }

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.error || "Checkout failed");
      }

      const { url } = await res.json();
      if (!url) {
        throw new Error("Unable to start checkout. Please try again.");
      }

      window.location.href = url;
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to start checkout. Please try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading || !items.length}
      className="w-full rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium uppercase tracking-[0.3em] text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading ? "Redirecting…" : "Checkout"}
    </button>
  );
}
