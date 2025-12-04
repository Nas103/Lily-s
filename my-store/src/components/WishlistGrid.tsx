"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/stores/wishlistStore";
import { AddToCartButton } from "./AddToCartButton";

export function WishlistGrid() {
  const items = useWishlist((state) => state.items);
  const removeItem = useWishlist((state) => state.removeItem);

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-dashed border-zinc-200 p-12 text-center text-sm text-zinc-500">
        Wishlist is empty.{" "}
        <Link href="/" className="underline underline-offset-4">
          Discover products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-[30px] border border-zinc-100 bg-white p-4 shadow-sm"
        >
          <div className="relative h-64 w-full overflow-hidden rounded-3xl bg-zinc-100">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="(min-width: 1024px) 320px, 50vw"
              className="object-cover"
            />
            <button
              className="absolute right-4 top-4 rounded-full bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em]"
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
              Wishlist
            </p>
            <p className="text-lg font-semibold">{item.name}</p>
            <p className="text-sm text-zinc-500">${item.price.toFixed(2)}</p>
            <AddToCartButton
              id={item.id}
              name={item.name}
              price={item.price}
              imageUrl={item.imageUrl}
            />
          </div>
        </div>
      ))}
    </div>
  );
}


