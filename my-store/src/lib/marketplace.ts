import { prisma } from "@/lib/prisma";

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export type ResolvableItem = {
  productId: string;
  quantity: number;
  price: number;
  brandId?: string | null;
};

/**
 * Persist one BrandOrder per owning brand for a newly created customer
 * order. Called right after `order.create` in every checkout path (web
 * Stripe, PaymentIntent, PayFast, POST /api/orders) so fulfilment is split
 * regardless of how the shopper pays.
 *
 * House items (brandId = null) are skipped — they stay platform-fulfilled.
 * Idempotent via the (orderId, brandId) unique constraint, so a retried
 * webhook/request can't duplicate rows. Failures are logged, never thrown:
 * the customer order must not be lost over the split.
 */
export async function createBrandOrders(
  orderId: string,
  items: ResolvableItem[]
): Promise<void> {
  if (!prisma || !orderId) return;

  const subtotals = new Map<string, number>();
  for (const item of items) {
    if (!item.brandId) continue;
    const line = round2(item.price * item.quantity);
    subtotals.set(item.brandId, round2((subtotals.get(item.brandId) ?? 0) + line));
  }
  if (!subtotals.size) return;

  try {
    await (prisma as any).brandOrder.createMany({
      data: [...subtotals.keys()].map((brandId) => ({
        orderId,
        brandId,
        status: "PENDING",
      })),
      skipDuplicates: true,
    });
  } catch (error) {
    console.error(`[marketplace] failed to split order ${orderId} by brand:`, error);
  }
}
