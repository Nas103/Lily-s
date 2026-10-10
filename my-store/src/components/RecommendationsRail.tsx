"use client";

import { useEffect, useMemo, useState } from "react";
import {
  catalogProducts,
  getCatalogProduct,
  toGridProduct,
  type CatalogProduct,
} from "@/data/catalog";
import { useCart } from "@/stores/cartStore";
import { useRecommendationStore } from "@/stores/recommendationStore";
import { ProductGrid } from "./ProductGrid";

const LIMIT = 6;

type GridProduct = ReturnType<typeof toGridProduct>;

const norm = (value?: string | null) => (value || "").trim().toLowerCase();

/**
 * Same brand OR same category as something in the cart, ranked brand-first.
 * Used as an offline fallback when the AI endpoint is unreachable.
 */
function localRecommendations(
  cartProducts: CatalogProduct[],
  cartIds: Set<string>
): CatalogProduct[] {
  const brands = new Set(cartProducts.map((p) => norm(p.brand)).filter(Boolean));
  const categories = new Set(cartProducts.map((p) => norm(p.category)));

  const score = (product: CatalogProduct) => {
    let value = 0;
    if (norm(product.brand) && brands.has(norm(product.brand))) value += 2;
    if (categories.has(norm(product.category))) value += 1;
    return value;
  };

  return catalogProducts
    .filter((product) => !cartIds.has(product.id))
    .map((product) => ({ product, score: score(product) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, LIMIT)
    .map((entry) => entry.product);
}

export function RecommendationsRail() {
  const items = useCart((state) => state.items);
  const recentlyViewedIds = useRecommendationStore(
    (state) => state.recentlyViewed
  );
  const [recommended, setRecommended] = useState<GridProduct[]>([]);

  const idSet = useMemo(() => new Set(recentlyViewedIds), [recentlyViewedIds]);
  const recentlyViewed = useMemo(
    () =>
      catalogProducts
        .filter((product) => idSet.has(product.id))
        .slice(0, LIMIT)
        .map(toGridProduct),
    [idSet]
  );

  const cartIds = useMemo(() => new Set(items.map((item) => item.id)), [items]);
  const cartProducts = useMemo(
    () =>
      items
        .map((item) => getCatalogProduct(item.id))
        .filter((product): product is CatalogProduct => Boolean(product)),
    [items]
  );

  useEffect(() => {
    if (items.length === 0) {
      setRecommended([]);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const fallback = () =>
      localRecommendations(cartProducts, cartIds).map(toGridProduct);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            limit: LIMIT,
            cartItems: items.map((item) => {
              const product = getCatalogProduct(item.id);
              return {
                id: item.id,
                name: item.name,
                brand: product?.brand,
                category: product?.category,
              };
            }),
          }),
        });

        if (!res.ok) throw new Error(`Request failed: ${res.status}`);

        const data = await res.json();
        const mapped: GridProduct[] = (data.recommendations || [])
          .map((rec: { id: string }) => getCatalogProduct(rec.id))
          .filter((product: CatalogProduct | undefined): product is CatalogProduct =>
            Boolean(product)
          )
          .map(toGridProduct);

        if (!cancelled) setRecommended(mapped.length ? mapped : fallback());
      } catch (error) {
        if (cancelled || (error as Error)?.name === "AbortError") return;
        setRecommended(fallback());
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [items, cartProducts, cartIds]);

  if (!recentlyViewed.length && !recommended.length) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 space-y-12">
      {recommended.length ? (
        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
                Recommended for you
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Pairs well with your cart
              </h2>
            </div>
          </div>
          <div className="mt-8">
            <ProductGrid products={recommended} />
          </div>
        </div>
      ) : null}

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
            <ProductGrid products={recentlyViewed} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
