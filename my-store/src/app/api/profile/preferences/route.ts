import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveUserId } from "@/lib/auth-middleware";
import { handleApiError } from "@/lib/errorHandler";
import { applySecurityMiddleware } from "@/lib/middleware";

const VISIBILITIES = ["PUBLIC", "FOLLOWERS", "PRIVATE"];
const CURRENCIES = ["ZAR", "USD", "EUR", "GBP", "NGN", "KES"];
const MAX_LIST = 20;

function cleanStringList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, MAX_LIST);
}

const SELECT = {
  profileVisibility: true,
  locationSharing: true,
  emailNotifications: true,
  smsNotifications: true,
  marketingEmails: true,
  pushNotifications: true,
  orderUpdates: true,
  productUpdates: true,
  preferredCategories: true,
  preferredSizes: true,
  preferredColors: true,
  preferredCurrency: true,
  showEmail: true,
  showPhone: true,
  showOrderHistory: true,
  profileDiscoverable: true,
  twoFactorEnabled: true,
} as const;

/**
 * GET /api/profile/preferences - load the user's preference settings
 */
export async function GET(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  try {
    const userId = await resolveUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prefs = await (prisma as any).user.findUnique({
      where: { id: userId },
      select: SELECT,
    });

    return NextResponse.json({ preferences: prefs });
  } catch (error: any) {
    return await handleApiError(
      error,
      "profile/preferences/GET",
      "Unable to load preferences.",
      503
    );
  }
}

/**
 * PATCH /api/profile/preferences - persist preference settings
 */
export async function PATCH(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const response = NextResponse.next();
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 20, windowMs: 60000 },
    csrf: true,
    securityHeaders: true,
  });
  if (securityResponse) {
    return securityResponse;
  }

  try {
    const userId = await resolveUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data: Record<string, unknown> = {};

    const bools = [
      "locationSharing",
      "emailNotifications",
      "smsNotifications",
      "marketingEmails",
      "pushNotifications",
      "orderUpdates",
      "productUpdates",
      "showEmail",
      "showPhone",
      "showOrderHistory",
      "profileDiscoverable",
      "twoFactorEnabled",
    ];
    for (const key of bools) {
      if (typeof body[key] === "boolean") data[key] = body[key];
    }

    if (VISIBILITIES.includes(body.profileVisibility)) {
      data.profileVisibility = body.profileVisibility;
    }
    if (CURRENCIES.includes(body.preferredCurrency)) {
      data.preferredCurrency = body.preferredCurrency;
    }

    const sizes = cleanStringList(body.preferredSizes);
    if (sizes) data.preferredSizes = sizes;
    const colors = cleanStringList(body.preferredColors);
    if (colors) data.preferredColors = colors;
    const categories = cleanStringList(body.preferredCategories);
    if (categories) data.preferredCategories = categories;

    if (!Object.keys(data).length) {
      return NextResponse.json(
        { error: "No valid preference fields provided" },
        { status: 400 }
      );
    }

    const prefs = await (prisma as any).user.update({
      where: { id: userId },
      data,
      select: SELECT,
    });

    return NextResponse.json({ preferences: prefs });
  } catch (error: any) {
    return await handleApiError(
      error,
      "profile/preferences/PATCH",
      "Unable to save preferences.",
      503
    );
  }
}