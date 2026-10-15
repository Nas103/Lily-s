import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { effectivePrice } from "@/lib/discount";

export { effectivePrice };

export type ProductOverrideValue = {
  name: string | null;
  price: number | null;
  discountPercent: number | null;
  soldOut: boolean;
  soldOutSizes: string[];
  soldOutColors: string[];
};

export type ProductOverrideMap = Map<string, ProductOverrideValue>;

/** Extra fields layered onto a product by applyOverrides. */
export type OverrideExtras = {
  discountPercent?: number | null;
  soldOut?: boolean;
  soldOutSizes?: string[];
  soldOutColors?: string[];
};

function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string");
    }
  } catch {
    // Legacy / malformed values fall back to a comma-separated list.
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

/**
 * Load all admin product overrides. Uses raw SQL so it works without a
 * regenerated Prisma client (the ProductOverride model is keyed by the static
 * catalog product id). Fails safe to an empty map when the DB or table is
 * unavailable. Cached once per request via React's `cache()`.
 */
type OverrideRow = {
  id: string;
  name: string | null;
  price: string | number | null;
  discountPercent?: string | number | null;
  soldOut?: boolean | null;
  soldOutSizes?: string | null;
  soldOutColors?: string | null;
};

export const loadProductOverrides = cache(async (): Promise<ProductOverrideMap> => {
  const map: ProductOverrideMap = new Map();
  if (!prisma) return map;

  const ingest = (rows: OverrideRow[]) => {
    for (const row of rows) {
      map.set(row.id, {
        name: row.name ?? null,
        price: row.price == null ? null : Number(row.price),
        discountPercent:
          row.discountPercent == null ? null : Number(row.discountPercent),
        soldOut: Boolean(row.soldOut),
        soldOutSizes: parseStringArray(row.soldOutSizes),
        soldOutColors: parseStringArray(row.soldOutColors),
      });
    }
  };

  try {
    const rows = (await (prisma as any).$queryRaw`
      SELECT "productId" AS "id", "name", "price", "discountPercent",
             "soldOut", "soldOutSizes", "soldOutColors"
      FROM "ProductOverride"
    `) as OverrideRow[];
    ingest(rows);
    return map;
  } catch {
    // Deployments that haven't run the variant/discount migration yet still
    // have the legacy columns. Fall back so name/price overrides keep working.
    try {
      const rows = (await (prisma as any).$queryRaw`
        SELECT "productId" AS "id", "name", "price"
        FROM "ProductOverride"
      `) as OverrideRow[];
      ingest(rows);
    } catch (error) {
      console.warn("[productOverrides] load failed:", error);
    }
  }
  return map;
});

/**
 * Apply overrides to an array of products (any object with id/name/price).
 * A null override field falls back to the catalogue value. Discount and
 * sold-out variant state are attached so downstream UI can render them.
 */
export function applyOverrides<
  T extends {
    id: string;
    name?: string;
    price?: number;
    discountPercent?: number | null;
    soldOut?: boolean;
    soldOutSizes?: string[];
    soldOutColors?: string[];
  }
>(products: T[], overrides: ProductOverrideMap): T[] {
  if (overrides.size === 0) return products;
  return products.map((product) => {
    const override = overrides.get(product.id);
    if (!override) return product;
    return {
      ...product,
      name: override.name ?? product.name,
      price: override.price ?? product.price,
      discountPercent:
        override.discountPercent ?? product.discountPercent ?? null,
      soldOut: override.soldOut || Boolean(product.soldOut),
      soldOutSizes: override.soldOutSizes.length
        ? override.soldOutSizes
        : product.soldOutSizes ?? [],
      soldOutColors: override.soldOutColors.length
        ? override.soldOutColors
        : product.soldOutColors ?? [],
    } as T;
  });
}

export type SaveProductOverrideInput = {
  productId: string;
  name?: string | null;
  price?: number | null;
  discountPercent?: number | null;
  soldOut?: boolean;
  soldOutSizes?: string[];
  soldOutColors?: string[];
  updatedBy?: string | null;
};

function validatePrice(price: number | null): void {
  if (price !== null && (typeof price !== "number" || !Number.isFinite(price) || price < 0 || price > 1_000_000)) {
    throw new Error("Invalid price. Must be a positive dollar amount.");
  }
}

function validateDiscount(discount: number | null): void {
  if (discount !== null && (typeof discount !== "number" || !Number.isFinite(discount) || discount < 0 || discount > 90)) {
    throw new Error("Invalid discount. Must be between 0 and 90 percent.");
  }
}

function encodeList(list: string[] | undefined): string | null {
  if (!list || !list.length) return null;
  return JSON.stringify(list);
}

/**
 * Write the full override for a product (upsert). Any field that is omitted is
 * stored as null/false, i.e. the override always reflects exactly what the
 * admin panel last submitted. Use `resetProductOverride` to clear entirely.
 */
export async function saveProductOverride(input: SaveProductOverrideInput): Promise<ProductOverrideValue> {
  if (!prisma) throw new Error("Database is not configured.");

  const {
    productId,
    name = null,
    price = null,
    discountPercent = null,
    soldOut = false,
    soldOutSizes,
    soldOutColors,
    updatedBy = null,
  } = input;

  validatePrice(price);
  validateDiscount(discountPercent);

  const sizesJson = encodeList(soldOutSizes);
  const colorsJson = encodeList(soldOutColors);

  await (prisma as any).$executeRaw`
    INSERT INTO "ProductOverride"
      ("productId", "name", "price", "discountPercent", "soldOut", "soldOutSizes", "soldOutColors", "updatedBy", "updatedAt")
    VALUES (
      ${productId}, ${name}, ${price}, ${discountPercent}, ${soldOut},
      ${sizesJson}, ${colorsJson}, ${updatedBy}, NOW()
    )
    ON CONFLICT ("productId") DO UPDATE SET
      "name" = EXCLUDED."name",
      "price" = EXCLUDED."price",
      "discountPercent" = EXCLUDED."discountPercent",
      "soldOut" = EXCLUDED."soldOut",
      "soldOutSizes" = EXCLUDED."soldOutSizes",
      "soldOutColors" = EXCLUDED."soldOutColors",
      "updatedBy" = EXCLUDED."updatedBy",
      "updatedAt" = NOW()
  `;

  return {
    name,
    price,
    discountPercent,
    soldOut,
    soldOutSizes: soldOutSizes ?? [],
    soldOutColors: soldOutColors ?? [],
  };
}

/** Remove all overrides for a product (revert to the catalogue). */
export async function resetProductOverride(productId: string): Promise<void> {
  if (!prisma) throw new Error("Database is not configured.");
  await (prisma as any).$executeRaw`
    DELETE FROM "ProductOverride" WHERE "productId" = ${productId}
  `;
}

export function serializeOverrides(map: ProductOverrideMap): Record<string, ProductOverrideValue> {
  return Object.fromEntries(map);
}
