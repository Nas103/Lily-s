import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireBrandAccount } from "@/lib/brandAuth";

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function toNumber(value: unknown): number {
  const n = typeof value === "number" ? value : parseFloat(String(value ?? 0));
  return Number.isFinite(n) ? n : 0;
}

function serializeLine(item: any) {
  return {
    id: item.id,
    productId: item.productId,
    name: item.name,
    imageUrl: item.imageUrl ?? null,
    size: item.size ?? null,
    color: item.color ?? null,
    quantity: item.quantity,
    price: toNumber(item.price),
  };
}

function serializeBrandOrder(row: any) {
  const order = row.order ?? {};
  const items = (order.orderItems ?? []).map(serializeLine);
  const subtotal = round2(
    items.reduce((sum: number, line: any) => sum + line.price * line.quantity, 0)
  );
  return {
    id: row.id,
    status: row.status,
    trackingNumber: row.trackingNumber ?? null,
    notes: row.notes ?? null,
    subtotal,
    createdAt: row.createdAt?.toISOString?.() ?? row.createdAt,
    updatedAt: row.updatedAt?.toISOString?.() ?? row.updatedAt,
    order: {
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      currency: order.currency,
      total: toNumber(order.total),
      createdAt: order.createdAt?.toISOString?.() ?? order.createdAt,
      customer: {
        name: order.shippingName ?? null,
        email: order.shippingEmail ?? null,
        phone: order.shippingPhone ?? null,
        addressLine1: order.shippingAddressLine1 ?? null,
        addressLine2: order.shippingAddressLine2 ?? null,
        city: order.shippingCity ?? null,
        state: order.shippingState ?? null,
        postcode: order.shippingPostcode ?? null,
        country: order.shippingCountry ?? null,
      },
      orderItems: items,
    },
  };
}

/**
 * GET /api/brand/orders — the brand's slice of paid customer orders.
 * Only PAID orders surface here (nothing to fulfil before payment lands);
 * order.status CANCELLED is still returned so the brand can see refunds.
 */
export async function GET(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
  const gate = await requireBrandAccount(request);
  if (gate instanceof NextResponse) return gate;
  if (!gate.brand) {
    return NextResponse.json(
      { error: "Brand profile not found. Complete brand signup first.", code: "NO_BRAND" },
      { status: 403 }
    );
  }

  try {
    const rows = await (prisma as any).brandOrder.findMany({
      where: { brandId: gate.brand.id, order: { paymentStatus: "PAID" } },
      orderBy: { createdAt: "desc" },
      include: {
        order: {
          include: {
            // Only this brand's lines — never leak other sellers' items.
            orderItems: { where: { brandId: gate.brand.id } },
          },
        },
      },
    });
    return NextResponse.json({ orders: rows.map(serializeBrandOrder) });
  } catch (error: any) {
    console.error("brand/orders GET:", error);
    return NextResponse.json(
      { error: "Unable to load brand orders." },
      { status: 503 }
    );
  }
}
