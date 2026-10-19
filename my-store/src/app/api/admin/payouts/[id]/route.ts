import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { serializePayout } from "@/lib/payouts";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/admin/payouts/[id] — release a brand settlement.
 *
 * Model: the platform collects the full charge (no destination charges), so
 * multi-brand carts work; the brand's net share is pushed out here via a
 * Stripe Transfer to the brand's connected account. Commission = amount +
 * platformFee minus the transfer. Blocked until `availableAt` (delivery +
 * dispute window). PayFast (ZAR) orders are settled outside Stripe and
 * return MANUAL_PAYOUT.
 *
 * action "release" works for PENDING and for FAILED rows (retry).
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!prisma) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 500 });
  }
  const admin = await requireAdminUser(request);
  if (admin instanceof NextResponse) return admin;

  const { id } = await context.params;
  const payout = await (prisma as any).payout.findUnique({
    where: { id },
    include: {
      brand: true,
      order: { select: { orderNumber: true, paymentMethod: true } },
    },
  });
  if (!payout) {
    return NextResponse.json({ error: "Payout not found." }, { status: 404 });
  }

  if (payout.status === "PAID") {
    return NextResponse.json(
      { error: "Payout already released.", code: "ALREADY_PAID" },
      { status: 400 }
    );
  }
  if (payout.availableAt && new Date(payout.availableAt).getTime() > Date.now()) {
    return NextResponse.json(
      {
        error: "Payout is still within the dispute window.",
        code: "TOO_EARLY",
        availableAt: payout.availableAt,
      },
      { status: 409 }
    );
  }
  if (payout.order?.paymentMethod !== "stripe") {
    return NextResponse.json(
      {
        error:
          "This order was paid via PayFast (ZAR). Settle it through PayFast, outside Stripe.",
        code: "MANUAL_PAYOUT",
      },
      { status: 400 }
    );
  }
  if (!payout.brand?.stripeAccountId) {
    return NextResponse.json(
      {
        error: "Brand has no connected Stripe account to receive the transfer.",
        code: "NO_CONNECTED_ACCOUNT",
      },
      { status: 400 }
    );
  }
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured.", code: "STRIPE_NOT_CONFIGURED" },
      { status: 503 }
    );
  }

  const amountCents = Math.round(Number(payout.amount) * 100);
  if (amountCents < 1) {
    return NextResponse.json(
      { error: "Payout amount is below the transfer minimum." },
      { status: 400 }
    );
  }

  try {
    const transfer = await stripe.transfers.create({
      amount: amountCents,
      currency: (payout.currency ?? "usd").toLowerCase(),
      destination: payout.brand.stripeAccountId,
      description: `Order ${payout.order?.orderNumber ?? payout.orderId} settlement — ${payout.brand.name}`,
      transfer_group: payout.order?.orderNumber ?? payout.orderId,
    });
    const updated = await (prisma as any).payout.update({
      where: { id },
      data: {
        status: "PAID",
        stripeTransferId: transfer.id,
        failureReason: null,
        paidAt: new Date(),
      },
    });
    return NextResponse.json({ payout: serializePayout(updated) });
  } catch (error: any) {
    const reason = String(
      error?.message || error?.error?.message || "Stripe transfer failed"
    ).slice(0, 500);
    const updated = await (prisma as any).payout.update({
      where: { id },
      data: { status: "FAILED", failureReason: reason },
    });
    console.error(`payout ${id}: transfer failed:`, reason);
    return NextResponse.json(
      {
        error: `Transfer failed: ${reason}`,
        code: "TRANSFER_FAILED",
        payout: serializePayout(updated),
      },
      { status: 502 }
    );
  }
}
