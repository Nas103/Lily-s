import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-middleware";
import { handleApiError } from "@/lib/errorHandler";
import { sanitizeInput } from "@/lib/security";
import { applySecurityMiddleware } from "@/lib/middleware";
import {
  getVerifiedReviewerIds,
  getViewerEligibility,
  hasPurchasedProduct,
} from "@/lib/reviewEligibility";

type ReviewRecord = {
  id: string;
  productId: string;
  rating: number;
  title: string | null;
  body: string | null;
  createdAt: string;
  updatedAt: string;
  user?: { id?: string; name?: string | null } | null;
  userId: string;
};

// The shared Prisma client is typed loosely (the schema is optional in this
// starter), so the review model gets a narrow structural type instead of `any`.
type ReviewModel = {
  findMany: (args: Record<string, unknown>) => Promise<ReviewRecord[]>;
  upsert: (args: Record<string, unknown>) => Promise<unknown>;
};

function reviewModel(): ReviewModel | null {
  return prisma ? (prisma as unknown as { review: ReviewModel }).review : null;
}

function summarize(reviews: ReviewRecord[]) {
  const count = reviews.length;
  const average =
    count === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / count;
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
  }));
  return { count, average: Math.round(average * 10) / 10, distribution };
}

/**
 * GET /api/reviews?productId=... - list reviews for a product
 *
 * When the caller is signed in, the response also carries `viewer` (whether
 * they have purchased / already reviewed the product) and each review carries
 * `verified` (its author actually bought the item).
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

    const model = reviewModel();
    if (!model) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    const [reviews, viewer] = await Promise.all([
      model.findMany({
        where: { productId },
        orderBy: { createdAt: "desc" },
        include: { user: { select: { id: true, name: true } } },
      }),
      getCurrentUser(request),
    ]);

    const reviewerIds = reviews.map((r) => r.userId);
    const verified = await getVerifiedReviewerIds(productId, reviewerIds);

    let viewerEligibility: {
      purchased: boolean;
      reviewed: boolean;
    } | null = null;
    if (viewer) {
      const eligibility = await getViewerEligibility(viewer.id, [productId]);
      viewerEligibility = eligibility.get(productId) ?? {
        purchased: false,
        reviewed: false,
      };
    }

    return NextResponse.json({
      reviews: reviews.map((r: ReviewRecord) => ({
        id: r.id,
        productId: r.productId,
        rating: r.rating,
        title: r.title,
        body: r.body,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        userName: r.user?.name || "Anonymous",
        userId: r.userId,
        verified: verified.has(r.userId),
      })),
      summary: summarize(reviews),
      viewer: viewerEligibility,
    });
  } catch (error: unknown) {
    return await handleApiError(error, "reviews/GET", "Unable to load reviews.", 503);
  }
}

/**
 * POST /api/reviews - create or update the current user's review
 *
 * Restricted to shoppers who paid for the product: an unauthenticated or
 * never-purchased caller gets 401/403 respectively.
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

    // Purchase gate. Checked server-side on every write so a client cannot
    // review an item it never bought by crafting its own request.
    const purchased = await hasPurchasedProduct(user.id, productId);
    if (!purchased) {
      return NextResponse.json(
        {
          error:
            "You can only review items you have purchased. Your order must be paid before you can leave a review.",
          code: "not_purchased",
        },
        { status: 403 }
      );
    }

    const data = {
      rating,
      title: body.title ? sanitizeInput(String(body.title)).slice(0, 120) : null,
      body: body.body ? sanitizeInput(String(body.body)).slice(0, 2000) : null,
    };

    const model = reviewModel();
    if (!model) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    const review = await model.upsert({
      where: { productId_userId: { productId, userId: user.id } },
      update: data,
      create: { productId, userId: user.id, ...data },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error: unknown) {
    return await handleApiError(error, "reviews/POST", "Unable to save review.", 503);
  }
}
