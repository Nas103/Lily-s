import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser, requireBrand, type AuthenticatedUser } from "./auth-middleware";
import { prisma } from "./prisma";

export type BrandRow = {
  id: string;
  userId: string;
  name: string;
  slug: string;
  contactEmail: string;
  country: string | null;
  status: "PENDING" | "APPROVED" | "SUSPENDED" | "REJECTED";
  verificationStatus: "UNSUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";
  commissionRate: any;
  subscriptionTier: "FREE" | "PRO";
  stripeAccountId: string | null;
};

/**
 * Resolve the Brand row owned by the authenticated BRAND user.
 * Returns { user, brand } where brand may be null (account created but brand
 * signup not completed yet), or null when the caller is not a brand/admin.
 *
 * Never trusts client-supplied brand ids: the brand is ALWAYS looked up via
 * the session user's one-to-one Brand row.
 */
export async function getBrandForUser(
  req: NextRequest
): Promise<{ user: AuthenticatedUser; brand: BrandRow | null } | null> {
  const user = await getCurrentUser(req);
  if (!user || (user.role !== "BRAND" && user.role !== "ADMIN")) return null;
  if (!prisma) return { user, brand: null };
  try {
    const brand = await (prisma as any).brand.findUnique({
      where: { userId: user.id },
    });
    return { user, brand: brand ?? null };
  } catch {
    return { user, brand: null };
  }
}

/**
 * Require a brand/admin session. Allows brand signup/status routes for users
 * who have not created their Brand row yet (brand = null).
 */
export async function requireBrandAccount(
  req: NextRequest
): Promise<{ user: AuthenticatedUser; brand: BrandRow | null } | NextResponse> {
  const gate = await requireBrand(req);
  if (gate instanceof NextResponse) return gate;
  const resolved = await getBrandForUser(req);
  if (!resolved) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return resolved;
}

/**
 * Require a fully approved Brand row. Use for anything that mutates
 * marketplace state (create/update/publish products, view brand orders).
 * Rejections return a structured reason so the dashboard can route users:
 *   NO_BRAND      – brand signup not completed
 *   NOT_APPROVED  – PENDING / SUSPENDED / REJECTED (body includes status)
 */
export async function requireApprovedBrand(
  req: NextRequest
): Promise<{ user: AuthenticatedUser; brand: BrandRow } | NextResponse> {
  const gate = await requireBrandAccount(req);
  if (gate instanceof NextResponse) return gate;

  if (!gate.brand) {
    return NextResponse.json(
      { error: "Brand profile not found. Complete brand signup first.", code: "NO_BRAND" },
      { status: 403 }
    );
  }
  if (gate.brand.status !== "APPROVED") {
    return NextResponse.json(
      {
        error: "Brand is not approved.",
        code: "NOT_APPROVED",
        status: gate.brand.status,
      },
      { status: 403 }
    );
  }
  return { user: gate.user, brand: gate.brand };
}
