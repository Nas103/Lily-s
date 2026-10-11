import { cache } from "react";
import { prisma } from "@/lib/prisma";

export type ProductOverrideValue = {
  name: string | null;
  price: number | null;
};

export type ProductOverrideMap = Map<string, ProductOverrideValue>;

const OVERRIDE_TABLE = '"ProductOverride"';

/**
 * Load all admin product overrides. Uses raw SQL so it works without a
 * regenerated Prisma client (the ProductOverride model is keyed by the static
 * catalog product id). Fails safe to an empty map when the DB or table is
 * unavailable. Cached once per request via React's `cache()`.
 */
export const loadProductOverrides = cache(async (): Promise<ProductOverrideMap> => {
  const map: ProductOverrideMap = new Map();
  if (!prisma) return map;
  try {
    const rows = (await (prisma as any).$queryRawUnsafe(
      `SELECT "productId" AS "id", "name", "price" FROM ${OVERRIDE_TABLE}`
    )) as { id: string; name: string | null; price: string | number | null }[];
    for (const row of rows) {
      map.set(row.id, {
        name: row.name ?? null,
        price: row.price == null ? null : Number(row.price),
      });
    }
  } catch (error) {
    console.warn("[productOverrides] load failed:", error);
  }
  return map;
});

/**
 * Apply overrides to an array of products (any object with id/name/price).
 * A null override field falls back to the catalogue value.
 */
export function applyOverrides<T extends { id: string; name?: string; price?: number }>(
  products: T[],
  overrides: ProductOverrideMap
): T[] {
  if (overrides.size === 0) return products;
  return products.map((product) => {
    const override = overrides.get(product.id);
    if (!override) return product;
    return {
      ...product,
      name: override.name ?? product.name,
      price: override.price ?? product.price,
    } as T;
  });
}

/**
 * Upsert name/price overrides for a product. Sending a value of `null` clears
 * that field (revert to catalogue). At least one field must be provided.
 */
export async function saveProductOverride(input: {
  productId: string;
  name?: string | null;
  price?: number | null;
  updatedBy?: string | null;
}): Promise<{ name: string | null; price: number | null }> {
  if (!prisma) throw new Error("Database is not configured.");

  const { productId, name = null, price = null, updatedBy = null } = input;
  const haveName = input.name !== undefined;
  const havePrice = input.price !== undefined;
  if (!haveName && !havePrice) {
    throw new Error("Nothing to update. Provide name and/or price.");
  }
  if (price !== null && (typeof price !== "number" || !Number.isFinite(price) || price < 0 || price > 1_000_000)) {
    throw new Error("Invalid price. Must be a positive dollar amount.");
  }

  await (prisma as any).$executeRawUnsafe(
    `INSERT INTO ${OVERRIDE_TABLE} ("productId", "name", "price", "updatedBy", "updatedAt")
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT ("productId") DO UPDATE SET
       "name" = COALESCE(EXCLUDED."name", ${OVERRIDE_TABLE}."name"),
       "price" = COALESCE(EXCLUDED."price", ${OVERRIDE_TABLE}."price"),
       "updatedBy" = EXCLUDED."updatedBy",
       "updatedAt" = NOW()`,
    productId,
    haveName ? name : null,
    havePrice ? price : null,
    updatedBy ?? null
  );

  // Re-read what was persisted so the response reflects actual state.
  const rows = (await (prisma as any).$queryRawUnsafe(
    `SELECT "name", "price" FROM ${OVERRIDE_TABLE} WHERE "productId" = $1`,
    productId
  )) as { name: string | null; price: string | null }[];
  const row = rows[0];
  return {
    name: row?.name ?? null,
    price: row?.price == null ? null : Number(row.price),
  };
}

/** Remove all overrides for a product (revert to the catalogue). */
export async function resetProductOverride(productId: string): Promise<void> {
  if (!prisma) throw new Error("Database is not configured.");
  await (prisma as any).$executeRawUnsafe(
    `DELETE FROM ${OVERRIDE_TABLE} WHERE "productId" = $1`,
    productId
  );
}

export function serializeOverrides(map: ProductOverrideMap): Record<string, ProductOverrideValue> {
  return Object.fromEntries(map);
}