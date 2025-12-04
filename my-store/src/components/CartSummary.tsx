"use client";

import Link from "next/link";
import { useCart } from "@/stores/cartStore";
import { CheckoutButton } from "./CheckoutButton";

export function CartSummary() {
  const items = useCart((state) => state.items);
  const subtotal = useCart((state) => state.total());
  const removeItem = useCart((state) => state.removeItem);

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-dashed border-zinc-200 p-10 text-center text-sm text-zinc-500">
        Cart is empty.{" "}
        <Link href="/" className="underline underline-offset-4">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={`${item.id}-${item.size ?? "default"}-${item.color ?? "default"}`}
            className="flex items-start justify-between gap-3 text-sm text-zinc-700"
          >
            <div className="space-y-1">
              {/* TODO: Swap product name with final merchandising copy. */}
              <p className="font-medium text-zinc-900">{item.name}</p>
              <p className="text-xs text-zinc-500">
                Qty {item.quantity} · {/* TODO: Confirm the price for this SKU. */}
                ${item.price.toFixed(2)}
                {item.size ? ` · Size ${item.size}` : ""}
                {item.color ? ` · ${item.color}` : ""}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {/* TODO: Update subtotal display once final pricing tiers are set. */}
              <p className="text-sm font-semibold text-zinc-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                type="button"
                onClick={() => removeItem(item.id, item.size, item.color)}
                className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400 hover:text-zinc-900"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-zinc-100 pt-4 text-sm">
        <p className="text-zinc-500">Subtotal</p>
        <p className="text-base font-semibold text-zinc-900">
          ${subtotal.toFixed(2)}
        </p>
      </div>
      <CheckoutButton />
    </div>
  );
}


