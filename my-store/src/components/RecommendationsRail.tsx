"use client";

import { useEffect, useMemo, useState } from "react";
import {
  catalogProducts,
  toGridProduct,
  type CatalogProduct,
} from "@/data/catalog";
import { useCart } from "@/stores/cartStore";
import { useRecommendationStore } from "@/stores/recommendationStore";
import { ProductGrid } from "./ProductGrid";

const LIMIT = 6;

type GridProduct = ReturnType<typeof toGridProduct>;

/** Admin overrides keyed by product id (from src/lib/productOverrides). */
export type AdminOverrides = Record<
  string,
  { name?: string | null; price?: number | null }
>;

const norm = (value?: string | null) => (value || "").trim().toLowerCase();

const applyOverrides = (
  product: CatalogProduct,
  overrides?: AdminOverrides
): CatalogProduct => {
  if (!overrides) return product;
  const override = overrides[product.id];
  if (!override) return product;
  return {
    ...product,
    name: override.name ?? product.name,
    price: override.price ?? product.price,
  };
};

/**
 * Same brand OR same category as something in the cart, ranked brand-first.
 * Used as an offline fallback when the AI endpoint is unreachable.
 */
function localRecommendations(
  cartProducts: CatalogProduct[],
  cartIds: Set<string>,
  source: CatalogProduct[]
): CatalogProduct[] {
  const brands = new Set(cartProducts.map((p) => norm(p.brand)).filter(Boolean));
  const categories = new Set(cartProducts.map((p) => norm(p.category)));

  const score = (product: CatalogProduct) => {
    let value = 0;
    if (norm(product.brand) && brands.has(norm(product.brand))) value += 2;
    if (categories.has(norm(product.category))) value += 1;
    return value;
  };

  return source
    .filter((product) => !cartIds.has(product.id))
    .map((product) => ({ product, score: score(product) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, LIMIT)
    .map((entry) => entry.product);
}

export function RecommendationsRail({
  overrides,
  className,
}: {
  overrides?: AdminOverrides;
  className?: string;
}) {
  const items = useCart((state) => state.items);
  const recentlyViewedIds = useRecommendationStore(
    (state) => state.recentlyViewed
  );
  const [recommended, setRecommended] = useState<GridProduct[]>([]);

  const overriddenCatalog = useMemo(
    () => catalogProducts.map((product) => applyOverrides(product, overrides)),
    [overrides]
  );

  const idSet = useMemo(() => new Set(recentlyViewedIds), [recentlyViewedIds]);
  const recentlyViewed = useMemo(
    () =>
      overriddenCatalog
        .filter((product) => idSet.has(product.id))
        .slice(0, LIMIT)
        .map(toGridProduct),
    [idSet, overriddenCatalog]
  );

  const cartIds = useMemo(() => new Set(items.map((item) => item.id)), [items]);
  const cartProducts = useMemo(
    () =>
      items
        .map((item) =>
          overriddenCatalog.find((product) => product.id === item.id)
        )
        .filter((product): product is CatalogProduct => Boolean(product)),
    [items, overriddenCatalog]
  );

  useEffect(() => {
    if (items.length === 0) {
      setRecommended([]);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const fallback = () =>
      localRecommendations(cartProducts, cartIds, overriddenCatalog).map(toGridProduct);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            limit: LIMIT,
            cartItems: items.map((item) => {
              const product = overriddenCatalog.find((p) => p.id === item.id);
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
          .map((rec: { id: string }) =>
            overriddenCatalog.find((product) => product.id === rec.id)
          )
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
  }, [items, cartProducts, cartIds, overriddenCatalog]);

  if (!recentlyViewed.length && !recommended.length) {
    return null;
  }

  return (
    <section
      className={`mx-auto max-w-6xl px-6 pb-20 space-y-12 ${className ?? ""}`}
    >
      {recommended.length ? (
        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-zinc-700">
                Recommended for you
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
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
              <p className="text-xs uppercase tracking-[0.4em] text-zinc-700">
                Recently viewed
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
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
