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
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Checkout failed");
      }

      const { paymentUrl, paymentData } = await res.json();

      // Create a form and submit it to PayFast
      const form = document.createElement("form");
      form.method = "POST";
      form.action = paymentUrl;

      // Add all payment data as hidden inputs
      Object.entries(paymentData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        }
      });

      // Append form to body and submit
      document.body.appendChild(form);
      form.submit();
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


