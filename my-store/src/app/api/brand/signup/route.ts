import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-middleware";
import { createAuthResponse } from "@/lib/auth";
import { applySecurityMiddleware } from "@/lib/middleware";
import {
  isValidCountryCode,
  isValidEmail,
  isValidPhone,
  isValidUrl,
  sanitizeInput,
  validateText,
} from "@/lib/security";
import { handleApiError } from "@/lib/errorHandler";

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "brand"
  );
}

/**
 * POST /api/brand/signup
 * Create the Brand row for the signed-in user and promote them to the BRAND
 * role. Returns a fresh session token whose JWT claim matches the new role so
 * the edge middleware (claim-based) admits them to /brand immediately.
 *
 * One Brand per user is enforced by the schema's unique userId constraint.
 */
export async function POST(request: NextRequest) {
  const response = NextResponse.next();
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: {
      maxRequests: process.env.NODE_ENV !== "production" ? 50 : 10,
      windowMs: 60000,
    },
    csrf: true,
    securityHeaders: true,
  });
  if (securityResponse) return securityResponse;

  if (!prisma) {
    return NextResponse.json(
      { error: "Service temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (user.role === "ADMIN") {
      return NextResponse.json(
        { error: "Admin accounts cannot register as brands." },
        { status: 403 }
      );
    }

    const existing = await (prisma as any).brand.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        { error: "This account already has a brand profile." },
        { status: 409 }
      );
    }

    const body = await request.json();
    let {
      name,
      contactEmail,
      country,
      description,
      website,
      contactPhone,
      businessName,
      verificationDocUrl,
    } = body as Record<string, unknown>;

    const nameCheck = validateText(name as string, 100, true);
    if (!nameCheck.valid) {
      return NextResponse.json({ error: nameCheck.error }, { status: 400 });
    }
    const sanitizedName = nameCheck.sanitized;

    const email = sanitizeInput(String(contactEmail ?? "")).toLowerCase();
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "A valid contact email is required." },
        { status: 400 }
      );
    }

    const countryCode = sanitizeInput(String(country ?? "")).toUpperCase();
    if (!isValidCountryCode(countryCode)) {
      return NextResponse.json(
        { error: "A valid 2-letter country code is required (e.g. US, GB, ZA)." },
        { status: 400 }
      );
    }

    const descriptionCheck = validateText(description as string, 2000, false);
    if (!descriptionCheck.valid) {
      return NextResponse.json({ error: descriptionCheck.error }, { status: 400 });
    }
    const businessCheck = validateText(businessName as string, 200, false);
    if (!businessCheck.valid) {
      return NextResponse.json({ error: businessCheck.error }, { status: 400 });
    }

    if (website && !isValidUrl(String(website))) {
      return NextResponse.json({ error: "Invalid website URL." }, { status: 400 });
    }
    if (contactPhone && !isValidPhone(String(contactPhone))) {
      return NextResponse.json({ error: "Invalid phone number." }, { status: 400 });
    }
    if (verificationDocUrl && !isValidUrl(String(verificationDocUrl))) {
      return NextResponse.json(
        { error: "Verification document must be a valid http(s) URL." },
        { status: 400 }
      );
    }

    // Unique slug: base, then numeric suffixes if taken.
    const baseSlug = slugify(sanitizedName);
    let slug = baseSlug;
    for (let i = 2; i <= 50; i++) {
      const clash = await (prisma as any).brand.findUnique({
        where: { slug },
        select: { id: true },
      });
      if (!clash) break;
      slug = `${baseSlug}-${i}`;
    }

    const brand = await (prisma as any).$transaction(async (tx: any) => {
      const row = await tx.brand.create({
        data: {
          userId: user.id,
          name: sanitizedName,
          slug,
          description: descriptionCheck.sanitized || null,
          website: website ? String(website) : null,
          contactEmail: email,
          contactPhone: contactPhone ? String(contactPhone) : null,
          country: countryCode,
          businessName: businessCheck.sanitized || null,
          verificationDocUrl: verificationDocUrl ? String(verificationDocUrl) : null,
          verificationStatus: verificationDocUrl ? "PENDING" : "UNSUBMITTED",
          status: "PENDING",
        },
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          verificationStatus: true,
          contactEmail: true,
          country: true,
          commissionRate: true,
          subscriptionTier: true,
          stripeAccountId: true,
          createdAt: true,
        },
      });
      await tx.user.update({
        where: { id: user.id },
        data: {
          role: "BRAND",
          country: countryCode,
          ...(user.name ? {} : { name: sanitizedName }),
        },
      });
      return row;
    });

    // Fresh token with the BRAND claim so edge middleware admits /brand now.
    return await createAuthResponse(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name ?? sanitizedName,
          role: "BRAND",
        },
        brand,
      },
      { userId: user.id, email: user.email, role: "BRAND" },
      201
    );
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "A brand with this name already exists." },
        { status: 409 }
      );
    }
    return await handleApiError(
      error,
      "brand/signup",
      "Unable to create the brand profile. Please try again.",
      503
    );
  }
}
