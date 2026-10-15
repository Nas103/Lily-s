import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { products as staticProducts } from "@/data/products";
import { effectivePrice, loadProductOverrides } from "@/lib/productOverrides";

/**
 * Server-side price catalog.
 *
 * Mirrors the merge performed by /api/products (static catalog + the mobile
 * data files + database products) and layers admin overrides on top, so any
 * product the client can see resolves to its authoritative USD price. Used to
 * validate cart prices before charging, so a tampered client can't underpay.
 */
export type CatalogPrice = { id: string; name: string; price: number };

function toPrice(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isFinite(n) ? n : null;
}

async function loadMobileCatalog(): Promise<
  { id?: string; name?: string; price?: unknown }[]
> {
  try {
    const [
      { womenProducts },
      { menProducts },
      { lifestyleProducts },
      { runningProducts },
      { boxrawProducts },
      { electronicsProducts },
      { perfumesProducts },
      { featuredProducts },
    ] = await Promise.all([
      import("../../mobile-app/src/data/womenProducts"),
      import("../../mobile-app/src/data/menProducts"),
      import("../../mobile-app/src/data/lifestyleProducts"),
      import("../../mobile-app/src/data/runningProducts"),
      import("../../mobile-app/src/data/boxrawProducts"),
      import("../../mobile-app/src/data/electronicsProducts"),
      import("../../mobile-app/src/data/perfumesProducts"),
      import("../../mobile-app/src/data/featuredProducts"),
    ]);

    return [
      ...(womenProducts || []),
      ...(menProducts || []),
      ...(lifestyleProducts || []),
      ...(runningProducts || []),
      ...(boxrawProducts || []),
      ...(electronicsProducts || []),
      ...(perfumesProducts || []),
      ...(featuredProducts || []),
    ];
  } catch (error) {
    console.warn("[catalog] failed to load mobile product data:", error);
    return [];
  }
}

/**
 * Build the id -> price map once per request. Later sources win, so database
 * products override static entries and admin overrides win over everything.
 */
export const loadCatalog = cache(
  async (): Promise<Map<string, CatalogPrice>> => {
    const map = new Map<string, CatalogPrice>();

    const mobile = await loadMobileCatalog();
    for (const product of [...staticProducts, ...mobile] as any[]) {
      if (!product?.id) continue;
      const price = toPrice(product.price);
      if (price === null) continue;
      map.set(product.id, {
        id: product.id,
        name: product.name ?? "",
        price,
      });
    }

    if (prisma) {
      try {
        const rows = (await (prisma as any).product.findMany({
          select: { id: true, name: true, price: true },
        })) as { id: string; name: string | null; price: unknown }[];
        for (const row of rows) {
          const price = toPrice(row.price);
          if (price === null) continue;
          map.set(row.id, { id: row.id, name: row.name ?? "", price });
        }
      } catch (error) {
        console.warn("[catalog] product table query failed:", error);
      }
    }

    const overrides = await loadProductOverrides();
    for (const [id, override] of overrides) {
      const existing = map.get(id);
      const basePrice = override.price ?? existing?.price;
      if (basePrice === null || basePrice === undefined) continue;
      map.set(id, {
        id,
        name: override.name ?? existing?.name ?? "",
        // Apply the admin discount so the charged price matches the storefront.
        price: effectivePrice(basePrice, override.discountPercent),
      });
    }

    return map;
  }
);
