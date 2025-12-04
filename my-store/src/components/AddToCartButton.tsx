"use client";

import { useTransition } from "react";
import { useCart } from "@/stores/cartStore";

type AddToCartButtonProps = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  size?: string;
  color?: string;
  variant?: "pill" | "minimal";
};

export function AddToCartButton({
  variant = "pill",
  ...props
}: AddToCartButtonProps) {
  const addItem = useCart((state) => state.addItem);
  const [pending, startTransition] = useTransition();

  const baseClasses =
    "inline-flex items-center justify-center rounded-full border uppercase tracking-[0.2em] transition";
  const variantClasses =
    variant === "pill"
      ? "w-full border-zinc-900 px-4 py-2 text-xs font-medium text-zinc-900 hover:bg-zinc-900 hover:text-white"
      : "border-zinc-200 px-3 py-2 text-[10px] font-semibold text-zinc-600 hover:border-zinc-900 hover:text-zinc-900";

  return (
    <button
      onClick={() =>
        startTransition(() =>
          addItem({
            ...props,
            quantity: 1,
          })
        )
      }
      className={`${baseClasses} ${variantClasses}`}
      disabled={pending}
    >
      {pending ? "Adding…" : "Add"}
    </button>
  );
}

