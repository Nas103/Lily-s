import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireBrandAccount } from "@/lib/brandAuth";
import { getCurrentUser } from "@/lib/auth-middleware";
import { applySecurityMiddleware } from "@/lib/middleware";
import { isValidUrl, validateText } from "@/lib/security";
import { handleApiError } from "@/lib/errorHandler";

const SELECT = {
  id: true,
  name: true,
  slug: true,
  description: true,
  logoUrl: true,
  website: true,
  contactEmail: true,
  contactPhone: true,
  country: true,
  status: true,
  verificationStatus: true,
  verificationDocUrl: true,
  businessName: true,
  rejectionReason: true,
  stripeAccountId: true,
  commissionRate: true,
  subscriptionTier: true,
  subscriptionExpiresAt: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * GET /api/brand/me
 * The caller's own brand profile (or null when brand signup is not done yet).
 * Allowed for any signed-in user so the /brand page can decide between the
 * signup form and the dashboard. Always scoped to the session user — no brand
 * ids are accepted from clients.
 */
export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!prisma) return NextResponse.json({ brand: null });
  try {
    const row = await (prisma as any).brand.findUnique({
      where: { userId: user.id },
    });
    if (!row) return NextResponse.json({ brand: null });
    const brand = Object.fromEntries(
      Object.entries(row).filter(([key]) => key in SELECT)
    );
    return NextResponse.json({ brand });
  } catch (error: any) {
    return await handleApiError(error, "brand/me.get", "Unable to load the brand profile.", 500);
  }
}

/**
 * PATCH /api/brand/me
 * Update profile details and/or (re)submit the verification document.
 * Submitting a document flips verificationStatus to PENDING so an admin can
 * review it (REJECTED brands may resubmit; APPROVED brands cannot downgrade).
 */
export async function PATCH(request: NextRequest) {
  const response = NextResponse.next();
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 10, windowMs: 60000 },
    csrf: true,
    securityHeaders: true,
  });
  if (securityResponse) return securityResponse;
  if (!prisma) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 500 });
  }

  const gate = await requireBrandAccount(request);
  if (gate instanceof NextResponse) return gate;
  if (!gate.brand) {
    return NextResponse.json(
      { error: "Brand profile not found. Complete brand signup first.", code: "NO_BRAND" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const data: Record<string, unknown> = {};

    if ("description" in body) {
      const check = validateText(body.description, 2000, false);
      if (!check.valid) return NextResponse.json({ error: check.error }, { status: 400 });
      data.description = check.sanitized || null;
    }
    if ("website" in body) {
      if (body.website && !isValidUrl(String(body.website))) {
        return NextResponse.json({ error: "Invalid website URL." }, { status: 400 });
      }
      data.website = body.website ? String(body.website) : null;
    }
    if ("logoUrl" in body) {
      if (body.logoUrl && !isValidUrl(String(body.logoUrl))) {
        return NextResponse.json({ error: "Invalid logo URL." }, { status: 400 });
      }
      data.logoUrl = body.logoUrl ? String(body.logoUrl) : null;
    }
    if ("contactPhone" in body) {
      const check = validateText(body.contactPhone, 30, false);
      if (!check.valid) return NextResponse.json({ error: check.error }, { status: 400 });
      data.contactPhone = check.sanitized || null;
    }
    if ("verificationDocUrl" in body) {
      const url = body.verificationDocUrl;
      if (url && !isValidUrl(String(url))) {
        return NextResponse.json(
          { error: "Verification document must be a valid http(s) URL." },
          { status: 400 }
        );
      }
      if (url) {
        data.verificationDocUrl = String(url);
        if (gate.brand.verificationStatus !== "APPROVED") {
          data.verificationStatus = "PENDING";
        }
      } else if (gate.brand.verificationStatus !== "APPROVED") {
        data.verificationDocUrl = null;
        data.verificationStatus = "UNSUBMITTED";
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
    }

    const brand = await (prisma as any).brand.update({
      where: { id: gate.brand.id },
      data,
      select: SELECT,
    });
    return NextResponse.json({ brand });
  } catch (error: any) {
    return await handleApiError(
      error,
      "brand/me.patch",
      "Unable to update the brand profile.",
      500
    );
  }
}
