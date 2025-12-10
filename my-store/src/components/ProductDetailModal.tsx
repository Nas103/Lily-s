"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { AddToCartButton } from "./AddToCartButton";
import { AddToWishlistButton } from "./AddToWishlistButton";
import { QuickBuyButton } from "./QuickBuyButton";
import type { ProductCardProps } from "./ProductCard";
import { useRecommendationStore } from "@/stores/recommendationStore";
import { useCurrency } from "@/hooks/useCurrency";

type ProductDetailModalProps = {
  product: (ProductCardProps & { description?: string; tags?: string[]; sizes?: string[]; colors?: string[] }) | null;
  onClose: () => void;
};

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { formatPrice, convertPrice, loading } = useCurrency();
  
  if (!product) return null;
  
  // Use converted price if available, otherwise use USD
  const converted = loading ? null : (convertPrice ? convertPrice(product.price) : null);
  const formattedPrice = loading 
    ? `$${product.price.toFixed(2)}` 
    : (converted ? converted.formatted : formatPrice(product.price));

  const sizes = product.sizes; // Only use sizes if they exist (not for perfumes)
  const colors = product.colors ?? ["Onyx", "Sand", "Oat", "Shadow", "Fog"];

  const [activeSize, setActiveSize] = useState<string | undefined>(sizes?.[0]);
  const [activeColor, setActiveColor] = useState<string | undefined>(colors[0]);
  const trackView = useRecommendationStore((state) => state.trackView);

  useEffect(() => {
    // Track deep product views for AI personalization.
    trackView(product.id);
  }, [product.id, trackView]);

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 px-0 md:px-4 py-0 md:py-10 backdrop-blur-sm">
      <div className="flex h-[95vh] md:h-auto md:max-h-[90vh] w-full md:max-w-4xl flex-col overflow-hidden rounded-t-[36px] md:rounded-[36px] bg-white shadow-2xl">
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          <div className="relative flex-1 min-h-[40vh] md:min-h-0">
            {/* TODO: Swap modal hero image with final asset. */}
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={700}
              height={900}
              priority
              className="h-full w-full object-cover"
            />
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-zinc-900"
              aria-label="Close product details"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex flex-1 flex-col gap-4 p-6 md:p-8 overflow-y-auto">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                {product.category ?? "Drop"}
              </p>
              {/* TODO: Finalize product naming before publishing. */}
              <h3 className="text-2xl font-semibold tracking-tight text-zinc-900">
                {product.name}
              </h3>
              <p className="text-sm text-zinc-500">{product.highlight}</p>
            </div>
            {/* TODO: Lock in final retail price. */}
            <p className="text-3xl font-semibold text-zinc-900">
              {formattedPrice}
            </p>
            <p className="text-sm leading-relaxed text-zinc-600">
              {product.description ??
                "Designed for the Lily capsule: balanced cushioning, premium fabrics, and studio-grade finishing."}
            </p>
            {product.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-zinc-200 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-zinc-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-4 flex flex-col gap-4">
              {sizes && sizes.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                    Size
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setActiveSize(size)}
                        className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] ${
                          activeSize === size
                            ? "bg-black text-white"
                            : "border border-zinc-200 text-zinc-700 hover:border-zinc-900"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                  Color
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {colors.slice(0, 5).map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setActiveColor(color)}
                      className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] ${
                        activeColor === color
                          ? "bg-black text-white"
                          : "border border-zinc-200 text-zinc-700 hover:border-zinc-900"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 pb-2 md:pb-0">
              <div className="flex gap-2 md:flex-col">
                <AddToCartButton
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  size={activeSize}
                  color={activeColor}
                />
                <QuickBuyButton
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  size={activeSize}
                  color={activeColor}
                />
              </div>
              <AddToWishlistButton
                id={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

