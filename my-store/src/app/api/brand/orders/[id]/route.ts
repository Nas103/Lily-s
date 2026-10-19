import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireBrandAccount } from "@/lib/brandAuth";
import { ensureBrandPayout } from "@/lib/payouts";
import { validateText } from "@/lib/security";

export const dynamic = "force-dynamic";

const TRANSITIONS: Record<string, string[]> = {
  PENDING: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

/**
 * PATCH /api/brand/orders/[id] — fulfilment updates for one of the brand's
 * order slices: advance status (validated transition), set tracking/notes.
 * Marks DELIVERED -> creates the Payout row (delivery + dispute window).
 *
 * Ownership: a brandOrder belonging to another brand returns 404 (no
 * existence leak), matching the product [id] route.
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!prisma) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 500 });
  }
  const gate = await requireBrandAccount(request);
  if (gate instanceof NextResponse) return gate;
  if (!gate.brand) {
    return NextResponse.json(
      { error: "Brand profile not found. Complete brand signup first.", code: "NO_BRAND" },
      { status: 403 }
    );
  }
  if (gate.brand.status !== "APPROVED") {
    return NextResponse.json(
      { error: "Brand is not approved.", code: "NOT_APPROVED", status: gate.brand.status },
      { status: 403 }
    );
  }

  const { id } = await context.params;
  const row = await (prisma as any).brandOrder.findUnique({
    where: { id },
    include: {
      order: { include: { orderItems: { where: { brandId: gate.brand.id } } } },
    },
  });
  if (!row || row.brandId !== gate.brand.id) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  let body: { status?: string; trackingNumber?: string; notes?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};

  if (body.status !== undefined) {
    const next = String(body.status).toUpperCase();
    const allowed = TRANSITIONS[row.status];
    if (!allowed) {
      return NextResponse.json(
        { error: `Unknown current status: ${row.status}` },
        { status: 409 }
      );
    }
    if (next === row.status) {
      // Idempotent no-op: return current state.
      return NextResponse.json({ order: row });
    }
    if (!allowed.includes(next)) {
      return NextResponse.json(
        { error: `Cannot move from ${row.status} to ${next}.`, code: "INVALID_TRANSITION", allowed },
        { status: 400 }
      );
    }
    data.status = next;
  }

  if (body.trackingNumber !== undefined) {
    const check = validateText(String(body.trackingNumber), 100, true);
    if (!check.valid) {
      return NextResponse.json({ error: check.error }, { status: 400 });
    }
    data.trackingNumber = check.sanitized || null;
  }

  if (body.notes !== undefined) {
    const check = validateText(String(body.notes), 500, true);
    if (!check.valid) {
      return NextResponse.json({ error: check.error }, { status: 400 });
    }
    data.notes = check.sanitized || null;
  }

  if (!Object.keys(data).length) {
    return NextResponse.json(
      { error: "Nothing to update. Provide status, trackingNumber or notes." },
      { status: 400 }
    );
  }

  const updated = await (prisma as any).brandOrder.update({
    where: { id },
    data,
    include: {
      order: { include: { orderItems: { where: { brandId: gate.brand.id } } } },
    },
  });

  // Delivery triggers the brand's settlement (dispute window applied there).
  if (data.status === "DELIVERED") {
    await ensureBrandPayout(updated.orderId, gate.brand.id);
  }

  return NextResponse.json({ order: updated });
}
