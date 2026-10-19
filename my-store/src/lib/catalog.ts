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
 *
 * `price` is the FINAL chargeable unit price (post-discount), matching what
 * the storefront renders via effectivePrice(price, discountPercent).
 * `brandId` attributes the item to its owning brand for the marketplace
 * split (null = house catalog item).
 */
export type CatalogPrice = {
  id: string;
  name: string;
  price: number;
  brandId: string | null;
  discountPercent: number | null;
};

type CatalogRow = {
  id: string;
  name: string;
  price: number;
  brandId: string | null;
  discountPercent: number | null;
};

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
    const map = new Map<string, CatalogRow>();

    const mobile = await loadMobileCatalog();
    for (const product of [...staticProducts, ...mobile] as any[]) {
      if (!product?.id) continue;
      const price = toPrice(product.price);
      if (price === null) continue;
      map.set(product.id, {
        id: product.id,
        name: product.name ?? "",
        price,
        brandId: null,
        discountPercent: toPrice(product.discountPercent),
      });
    }

    if (prisma) {
      try {
        // Only purchasable rows: ACTIVE products from the house catalog or an
        // APPROVED brand — mirrors /api/products so a delisted product can't
        // sneak through checkout.
        const rows = (await (prisma as any).product.findMany({
          where: {
            status: "ACTIVE",
            AND: [
              { OR: [{ brandId: null }, { brand: { status: "APPROVED" } }] },
            ],
          },
          select: {
            id: true,
            name: true,
            price: true,
            discountPercent: true,
            brandId: true,
          },
        })) as {
          id: string;
          name: string | null;
          price: unknown;
          discountPercent: unknown;
          brandId: string | null;
        }[];
        for (const row of rows) {
          const price = toPrice(row.price);
          if (price === null) continue;
          map.set(row.id, {
            id: row.id,
            name: row.name ?? "",
            price,
            brandId: row.brandId ?? null,
            discountPercent: toPrice(row.discountPercent),
          });
        }
      } catch (error) {
        console.warn("[catalog] product table query failed:", error);
      }
    }

    // Layer admin overrides (raw name/price/discount), then apply the final
    // discount for every row so the charged price matches the storefront.
    const overrides = await loadProductOverrides();
    for (const [id, row] of map) {
      const override = overrides.get(id);
      if (override) {
        row.name = override.name ?? row.name;
        row.price = override.price ?? row.price;
        row.discountPercent = override.discountPercent ?? row.discountPercent;
      }
    }
    for (const row of map.values()) {
      row.price = effectivePrice(row.price, row.discountPercent);
    }

    const result = new Map<string, CatalogPrice>();
    for (const row of map.values()) {
      result.set(row.id, row);
    }
    return result;
  }
);
