import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { requireBrandAccount } from "@/lib/brandAuth";
import { applySecurityMiddleware, getPublicOrigin } from "@/lib/middleware";
import { handleApiError } from "@/lib/errorHandler";

/**
 * POST /api/brand/onboarding
 * Create (or reuse) a Stripe Connect Express account for this brand and
 * return the hosted onboarding URL. The platform collects the brand's bank /
 * tax details on Stripe's page — no payout data ever touches our servers.
 *
 * Only the account id is persisted (brand.stripeAccountId); capabilities and
 * payout status stay authoritative in Stripe.
 */
export async function POST(request: NextRequest) {
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
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY." },
      { status: 503 }
    );
  }

  const gate = await requireBrandAccount(request);
  if (gate instanceof NextResponse) return gate;
  if (!gate.brand) {
    return NextResponse.json(
      { error: "Brand profile not found. Complete brand signup first.", code: "NO_BRAND" },
      { status: 403 }
    );
  }
  const brand = gate.brand;
  if (!brand.country) {
    return NextResponse.json(
      { error: "Brand country is required before payouts setup." },
      { status: 400 }
    );
  }

  try {
    const origin = getPublicOrigin(request);

    // Reuse an existing account unless it no longer exists in Stripe.
    let accountId = brand.stripeAccountId;
    if (accountId) {
      try {
        const existing = await stripe.accounts.retrieve(accountId);
        if (existing.deleted) accountId = null;
      } catch {
        // Account was removed in the Stripe dashboard — create a fresh one.
        accountId = null;
      }
    }

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: brand.country,
        email: brand.contactEmail,
        business_profile: { name: brand.name },
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: { brandId: brand.id },
      });
      accountId = account.id;
      await (prisma as any).brand.update({
        where: { id: brand.id },
        data: { stripeAccountId: accountId },
      });
    }

    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/brand?section=payouts&refresh=1`,
      return_url: `${origin}/brand?section=payouts&done=1`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: link.url, accountId });
  } catch (error: any) {
    return await handleApiError(
      error,
      "brand/onboarding",
      "Unable to start payouts setup. Please try again.",
      502
    );
  }
}
