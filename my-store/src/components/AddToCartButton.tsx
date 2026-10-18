"use client";

import { useTransition } from "react";
import { useCart } from "@/stores/cartStore";
import { useRecommendationStore } from "@/stores/recommendationStore";
import { useToastStore } from "@/stores/toastStore";

type AddToCartButtonProps = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  size?: string;
  color?: string;
  variant?: "pill" | "minimal";
  disabled?: boolean;
  showToast?: boolean;
  onAdded?: () => void;
};

export function AddToCartButton({
  variant = "pill",
  disabled,
  showToast = true,
  onAdded,
  ...props
}: AddToCartButtonProps) {
  const addItem = useCart((state) => state.addItem);
  const pushToast = useToastStore((state) => state.showToast);
  const [pending, startTransition] = useTransition();
  const trackAddToCart = useRecommendationStore(
    (state) => state.trackAddToCart
  );

  const baseClasses =
    "inline-flex items-center justify-center rounded-full border uppercase tracking-[0.2em] transition";
  const variantClasses =
    variant === "pill"
      ? "flex-1 md:w-full border-zinc-900 px-4 py-2.5 md:py-2 text-xs font-medium text-zinc-900 hover:bg-zinc-900 hover:text-white"
      : "border-zinc-200 px-3 py-2 text-[10px] font-semibold text-zinc-600 hover:border-zinc-900 hover:text-zinc-900";

  const handleAddToCart = () => {
    startTransition(() =>
      addItem({
        ...props,
        quantity: 1,
      })
    );

    if (showToast) {
      const variants = [props.size, props.color].filter(Boolean).join(" · ");
      pushToast({
        title: "Added to cart",
        description: variants ? `${props.name} — ${variants}` : props.name,
        imageUrl: props.imageUrl,
        href: "/cart",
        linkLabel: "View cart",
      });
    }
    onAdded?.();
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`${baseClasses} ${variantClasses} ${disabled ? "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-zinc-900" : ""}`}
      disabled={pending || disabled}
      onMouseUp={() => {
        // Lightweight behavior tracking for AI recommendations.
        trackAddToCart(props.id);
      }}
    >
      {disabled ? "Sold Out" : pending ? "Adding…" : "Add"}
    </button>
  );
}

