/**
 * Absolute site origin for redirects and links (Stripe success/cancel URLs,
 * PayFast return + notify, email links, OpenRouter referer, currency fetches).
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL / APP_URL — explicit configuration always wins
 *   2. PUBLIC_ASSET_ORIGIN — shared override for public URLs
 *   3. VERCEL_URL / VERCEL_BRANCH_URL — injected by Vercel (bare hostnames)
 *   4. http://localhost:3000 — local development only
 *
 * Deliberately request-free so queue jobs and email senders (where no
 * NextRequest exists) can build links too. Handlers that do have a request
 * should prefer getPublicOrigin() from "@/lib/middleware".
 */

const LOCALHOST_ORIGIN = "http://localhost:3000";

/** Parse a config value into a bare origin, tolerating a missing scheme. */
function toOrigin(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    return new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`).origin;
  } catch {
    return null;
  }
}

/**
 * Public origin for this deployment, without a trailing slash.
 * Never throws — always returns something an absolute URL can build on.
 */
export function getSiteUrl(): string {
  const configured =
    toOrigin(process.env.NEXT_PUBLIC_SITE_URL) ??
    toOrigin(process.env.APP_URL) ??
    toOrigin(process.env.PUBLIC_ASSET_ORIGIN);

  // Vercel hosting implies a real deployment origin, so a value still pointing
  // at localhost would send Stripe/PayFast callbacks to nowhere — ignore it.
  const deployed = toOrigin(process.env.VERCEL_URL) ?? toOrigin(process.env.VERCEL_BRANCH_URL);
  if (deployed && configured === LOCALHOST_ORIGIN) return deployed;

  return configured ?? deployed ?? LOCALHOST_ORIGIN;
}
