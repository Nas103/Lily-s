import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveUserId } from "@/lib/auth-middleware";
import { handleApiError } from "@/lib/errorHandler";
import { applySecurityMiddleware } from "@/lib/middleware";

const PROVIDERS = ["google", "apple"] as const;
type Provider = (typeof PROVIDERS)[number];

function fieldFor(provider: Provider) {
  return provider === "google" ? "googleLinked" : "appleLinked";
}

export async function GET(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
  try {
    const userId = await resolveUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const links = await (prisma as any).user.findUnique({
      where: { id: userId },
      select: { googleLinked: true, appleLinked: true },
    });
    return NextResponse.json({ links });
  } catch (error: any) {
    return await handleApiError(error, "profile/links/GET", "Unable to load linked accounts.", 503);
  }
}

export async function POST(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
  const response = NextResponse.next();
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 20, windowMs: 60000 },
    csrf: true,
    securityHeaders: true,
  });
  if (securityResponse) return securityResponse;

  try {
    const userId = await resolveUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const provider = body.provider as Provider;
    const action = body.action as "link" | "unlink";

    if (!PROVIDERS.includes(provider)) {
      return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
    }
    if (action !== "link" && action !== "unlink") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const links = await (prisma as any).user.update({
      where: { id: userId },
      data: { [fieldFor(provider)]: action === "link" },
      select: { googleLinked: true, appleLinked: true },
    });

    return NextResponse.json({ links });
  } catch (error: any) {
    return await handleApiError(error, "profile/links/POST", "Unable to update linked account.", 503);
  }
}