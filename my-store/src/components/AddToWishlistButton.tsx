"use client";

import { useState, useEffect } from "react";
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
  const isSavedCheck = useWishlist((state) => state.isSaved(id));
  const [isSaved, setIsSaved] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Only check wishlist state after component mounts (client-side)
  // This prevents hydration mismatch between server and client
  useEffect(() => {
    setIsMounted(true);
    setIsSaved(isSavedCheck);
  }, [isSavedCheck]);

  // During SSR and initial render, always show "not saved" state
  // This ensures server and client render the same HTML initially
  const displayIsSaved = isMounted ? isSaved : false;

  return (
    <button
      aria-label={displayIsSaved ? "Remove from wishlist" : "Add to wishlist"}
      onClick={() => toggleItem({ id, name, price, imageUrl })}
      className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
        displayIsSaved
          ? "border-pink-200 bg-pink-50 text-pink-700"
          : "border-zinc-200 bg-white/80 text-zinc-900 hover:border-zinc-900"
      }`}
    >
      <span className="inline-flex items-center gap-2 tracking-[0.2em] uppercase">
        <Heart
          size={16}
          className={displayIsSaved ? "fill-pink-600 text-pink-600" : "text-zinc-900"}
        />
        Save
      </span>
    </button>
  );
}


