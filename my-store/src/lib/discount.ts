/**
 * Pure, client-safe discount helpers. Kept free of server-only imports so both
 * the storefront components and the server catalog can share the same math.
 */

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isFinite(n) ? n : null;
}

/**
 * Compute the effective (post-discount) unit price in the USD base currency.
 */
export function effectivePrice(
  price: number,
  discountPercent?: number | null
): number {
  const percent = toNumber(discountPercent) ?? 0;
  if (percent <= 0) return Math.round(price * 100) / 100;
  const clamped = Math.min(percent, 100);
  return Math.round(price * (1 - clamped / 100) * 100) / 100;
}
