import { prisma } from "./prisma";

// A review may only be written for an item the shopper actually paid for.
//
// - `paymentStatus` must be PAID: a PENDING order is a checkout that was only
//   started (abandoned checkouts stay PENDING forever), so it must never grant
//   review rights. REFUNDED is also a paymentStatus, so a refunded order stops
//   qualifying on its own.
// - `status` must not be CANCELLED or FAILED, which the PayFast/Stripe
//   webhooks set alongside `paymentStatus: "FAILED"`.
const PURCHASE_FILTER = {
  paymentStatus: "PAID",
  status: { notIn: ["CANCELLED", "FAILED"] },
};

export type ViewerEligibility = {
  purchased: boolean;
  reviewed: boolean;
};

// The shared Prisma client is typed loosely (the schema is optional in this
// starter), so the two models this module touches get narrow, structural
// types instead of `any`.
type FindManyArgs = {
  where?: Record<string, unknown>;
  select?: Record<string, unknown>;
  distinct?: string[];
};

type OrderItemRow = { productId: string; order?: { userId?: string } };
type ReviewRow = { productId: string };

type ReviewEligibilityDb = {
  orderItem: {
    findMany: <R extends OrderItemRow = OrderItemRow>(
      args: FindManyArgs
    ) => Promise<R[]>;
  };
  review: {
    findMany: <R extends ReviewRow = ReviewRow>(
      args: FindManyArgs
    ) => Promise<R[]>;
  };
};

function db(): ReviewEligibilityDb | null {
  return prisma ? (prisma as unknown as ReviewEligibilityDb) : null;
}

/**
 * Products from `productIds` that `userId` has purchased. Fails closed: any
 * database error resolves to an empty set, which means "not eligible".
 */
export async function getPurchasedProductIds(
  userId: string,
  productIds: string[]
): Promise<Set<string>> {
  const unique = [...new Set(productIds.filter(Boolean))];
  const client = db();
  if (!client || !userId || unique.length === 0) return new Set();

  try {
    const rows = await client.orderItem.findMany({
      where: {
        productId: { in: unique },
        order: { userId, ...PURCHASE_FILTER },
      },
      select: { productId: true },
      distinct: ["productId"],
    });
    return new Set(
      rows.map((row) => row.productId).filter(Boolean)
    );
  } catch (error) {
    console.error("reviewEligibility: unable to load purchases", error);
    return new Set();
  }
}

export async function hasPurchasedProduct(
  userId: string,
  productId: string
): Promise<boolean> {
  const purchased = await getPurchasedProductIds(userId, [productId]);
  return purchased.has(productId);
}

/**
 * Product ids that `userId` has already written a review for.
 */
export async function getReviewedProductIds(
  userId: string,
  productIds: string[]
): Promise<Set<string>> {
  const unique = [...new Set(productIds.filter(Boolean))];
  const client = db();
  if (!client || !userId || unique.length === 0) return new Set();

  try {
    const rows = await client.review.findMany({
      where: { userId, productId: { in: unique } },
      select: { productId: true },
    });
    return new Set(
      rows.map((row) => row.productId).filter(Boolean)
    );
  } catch (error) {
    console.error("reviewEligibility: unable to load reviews", error);
    return new Set();
  }
}

/**
 * Purchased + already-reviewed state for several products at once, so a page
 * can decide what to render for each item in a single pass.
 */
export async function getViewerEligibility(
  userId: string,
  productIds: string[]
): Promise<Map<string, ViewerEligibility>> {
  const unique = [...new Set(productIds.filter(Boolean))];
  const result = new Map<string, ViewerEligibility>();
  if (unique.length === 0) return result;

  const [purchased, reviewed] = await Promise.all([
    getPurchasedProductIds(userId, unique),
    getReviewedProductIds(userId, unique),
  ]);

  for (const productId of unique) {
    result.set(productId, {
      purchased: purchased.has(productId),
      reviewed: reviewed.has(productId),
    });
  }
  return result;
}

/**
 * Reviewer ids that bought `productId` — used to draw "Verified purchase"
 * badges on review cards. Only the supplied reviewers are considered, so this
 * stays a single query no matter how many reviews a product has.
 */
export async function getVerifiedReviewerIds(
  productId: string,
  userIds: string[]
): Promise<Set<string>> {
  const unique = [...new Set(userIds.filter(Boolean))];
  const client = db();
  if (!client || !productId || unique.length === 0) return new Set();

  try {
    const rows = await client.orderItem.findMany({
      where: {
        productId,
        order: { userId: { in: unique }, ...PURCHASE_FILTER },
      },
      select: { order: { select: { userId: true } } },
    });
    return new Set(
      rows
        .map((row) => row.order?.userId)
        .filter((userId): userId is string => Boolean(userId))
    );
  } catch (error) {
    console.error("reviewEligibility: unable to load verified reviewers", error);
    return new Set();
  }
}
