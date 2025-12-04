"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/stores/wishlistStore";

type AddToWishlistButtonProps = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

export function AddToWishlistButton({
  id,
  name,
  price,
  imageUrl,
}: AddToWishlistButtonProps) {
  const toggleItem = useWishlist((state) => state.toggleItem);
  const isSaved = useWishlist((state) => state.isSaved(id));

  return (
    <button
      aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
      onClick={() => toggleItem({ id, name, price, imageUrl })}
      className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
        isSaved
          ? "border-pink-200 bg-pink-50 text-pink-700"
          : "border-zinc-200 bg-white/80 text-zinc-900 hover:border-zinc-900"
      }`}
    >
      <span className="inline-flex items-center gap-2 tracking-[0.2em] uppercase">
        <Heart
          size={16}
          className={isSaved ? "fill-pink-600 text-pink-600" : "text-zinc-900"}
        />
        Save
      </span>
    </button>
  );
}


