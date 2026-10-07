import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-middleware";
import { handleApiError } from "@/lib/errorHandler";
import { sanitizeInput } from "@/lib/security";
import { applySecurityMiddleware } from "@/lib/middleware";

function summarize(reviews: any[]) {
  const count = reviews.length;
  const average =
    count === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.rating, 0) / count;
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
  }));
  return { count, average: Math.round(average * 10) / 10, distribution };
}

/**
 * GET /api/reviews?productId=... - list reviews for a product
 */
export async function GET(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  try {
    const productId = request.nextUrl.searchParams.get("productId");
    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    const reviews = await (prisma as any).review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true } } },
    });

    return NextResponse.json({
      reviews: reviews.map((r: any) => ({
        id: r.id,
        productId: r.productId,
        rating: r.rating,
        title: r.title,
        body: r.body,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        userName: r.user?.name || "Anonymous",
        userId: r.userId,
      })),
      summary: summarize(reviews),
    });
  } catch (error: any) {
    return await handleApiError(error, "reviews/GET", "Unable to load reviews.", 503);
  }
}

/**
 * POST /api/reviews - create or update the current user's review
 */
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
  if (securityResponse) {
    return securityResponse;
  }

  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const productId = String(body.productId || "").trim();
    const rating = Number(body.rating);

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "rating must be an integer between 1 and 5" },
        { status: 400 }
      );
    }

    const data = {
      rating,
      title: body.title ? sanitizeInput(String(body.title)).slice(0, 120) : null,
      body: body.body ? sanitizeInput(String(body.body)).slice(0, 2000) : null,
    };

    const review = await (prisma as any).review.upsert({
      where: { productId_userId: { productId, userId: user.id } },
      update: data,
      create: { productId, userId: user.id, ...data },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error: any) {
    return await handleApiError(error, "reviews/POST", "Unable to save review.", 503);
  }
}