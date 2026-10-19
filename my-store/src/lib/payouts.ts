import { prisma } from "@/lib/prisma";

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function toNumber(value: unknown): number {
  const n = typeof value === "number" ? value : parseFloat(String(value ?? 0));
  return Number.isFinite(n) ? n : 0;
}

/** Days between delivery and payout eligibility (dispute window). */
export function payoutDisputeDays(): number {
  const parsed = parseInt(process.env.PAYOUT_DISPUTE_DAYS ?? "14", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 14;
}

function toNumberStrict(value: unknown): number {
  const n = typeof value === "number" ? value : parseFloat(String(value ?? 0));
  return Number.isFinite(n) ? n : 0;
}

/** JSON-safe payout shape shared by the brand and admin APIs. */
export function serializePayout(row: any) {
  return {
    id: row.id,
    status: row.status,
    amount: toNumberStrict(row.amount),
    platformFee: toNumberStrict(row.platformFee),
    currency: row.currency ?? "USD",
    failureReason: row.failureReason ?? null,
    stripeTransferId: row.stripeTransferId ?? null,
    availableAt: row.availableAt?.toISOString?.() ?? null,
    paidAt: row.paidAt?.toISOString?.() ?? null,
    createdAt: row.createdAt?.toISOString?.() ?? row.createdAt,
    brandId: row.brandId ?? null,
    brandName: row.brand?.name ?? null,
    orderId: row.orderId ?? null,
    orderNumber: row.order?.orderNumber ?? null,
    paymentMethod: row.order?.paymentMethod ?? null,
  };
}

/**
 * Create (once) the settlement row for a brand's share of an order, called
 * when the brand marks its BrandOrder DELIVERED.
 *
 * amount       = brand subtotal minus platformFee
 * platformFee  = subtotal * commissionRate% (snapshotted at delivery)
 * availableAt  = delivery + dispute window — admin cannot release before it
 *
 * Idempotent through the (brandId, orderId) unique constraint. Never throws:
 * a payout bookkeeping failure must not roll back the delivery.
 */
export async function ensureBrandPayout(
  orderId: string,
  brandId: string
): Promise<any | null> {
  if (!prisma) return null;
  try {
    const existing = await (prisma as any).payout.findUnique({
      where: { brandId_orderId: { brandId, orderId } },
    });
    if (existing) return existing;

    const [order, brand] = await Promise.all([
      (prisma as any).order.findUnique({ where: { id: orderId } }),
      (prisma as any).brand.findUnique({ where: { id: brandId } }),
    ]);
    if (!order || !brand) return null;

    const items = await (prisma as any).orderItem.findMany({
      where: { orderId, brandId },
      select: { price: true, quantity: true },
    });
    const subtotal = round2(
      items.reduce(
        (sum: number, item: any) => sum + toNumber(item.price) * item.quantity,
        0
      )
    );
    if (subtotal <= 0) return null;

    const rate = toNumber(brand.commissionRate);
    const platformFee = round2((subtotal * rate) / 100);
    const availableAt = new Date(
      Date.now() + payoutDisputeDays() * 24 * 60 * 60 * 1000
    );

    return await (prisma as any).payout.create({
      data: {
        brandId,
        orderId,
        amount: round2(subtotal - platformFee),
        platformFee,
        currency: (order.currency as string) || "USD",
        status: "PENDING",
        availableAt,
      },
    });
  } catch (error) {
    console.error(
      `[payouts] failed to create payout for order ${orderId} / brand ${brandId}:`,
      error
    );
    return null;
  }
}
