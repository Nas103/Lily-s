"use client";

import { products } from "@/data/products";
import { useRecommendationStore } from "@/stores/recommendationStore";
import { ProductGrid } from "./ProductGrid";

type RecommendationsRailProps = {
  /** Optionally hint the current product so we can suggest similar ones. */
  currentProductId?: string;
};

export function RecommendationsRail({
  currentProductId,
}: RecommendationsRailProps) {
  const recentlyViewedIds = useRecommendationStore(
    (state) => state.recentlyViewed
  );

  if (!recentlyViewedIds.length && !currentProductId) {
    return null;
  }

  const idSet = new Set(recentlyViewedIds);
  const baseProduct =
    currentProductId &&
    products.find((product) => product.id === currentProductId);

  const recentlyViewed = products
    .filter((product) => idSet.has(product.id))
    .slice(0, 6);

  const similarCandidates = baseProduct
    ? products.filter(
        (product) =>
          product.id !== baseProduct.id &&
          product.category === baseProduct.category &&
          Math.abs(product.price - baseProduct.price) < 80
      )
    : [];

  const similar = similarCandidates.slice(0, 6);

  if (!recentlyViewed.length && !similar.length) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 space-y-12">
      {recentlyViewed.length ? (
        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
                Recently viewed
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Pick up where you left off
              </h2>
            </div>
          </div>
          <div className="mt-8">
            {/* TODO: Swap to AI-ranked results when your recommendation API is live. */}
            <ProductGrid
              products={recentlyViewed.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl,
                category: item.category.toUpperCase(),
                highlight: item.highlight,
                badge: item.badge,
              }))}
            />
          </div>
        </div>
      ) : null}

      {similar.length ? (
        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
                You might also like
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Frequently bought together vibes
              </h2>
            </div>
          </div>
          <div className="mt-8">
            {/* TODO: Call AI \"frequently bought together\" endpoint here. */}
            <ProductGrid
              products={similar.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                imageUrl: item.imageUrl,
                category: item.category.toUpperCase(),
                highlight: item.highlight,
                badge: item.badge,
              }))}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}


