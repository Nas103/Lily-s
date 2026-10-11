import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminUser } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { serializeOrder } from "@/lib/orders";
import { sendOrderStatusEmail } from "@/lib/notifications";

export const dynamic = "force-dynamic";

const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "FAILED",
];

const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ orderNumber: string }> }
) {
  const admin = await requireAdminUser(request);
  if (admin instanceof NextResponse) return admin;

  if (!prisma) {
    return NextResponse.json(
      { error: "Database is not configured." },
      { status: 500 }
    );
  }

  const { orderNumber } = await context.params;

  const body = (await request.json()) as {
    status?: string;
    paymentStatus?: string;
    trackingNumber?: string | null;
    notes?: string | null;
    notify?: boolean;
  };

  const update: Record<string, unknown> = {};
  if (body.status !== undefined) {
    if (!ORDER_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
    }
    update.status = body.status;
  }
  if (body.paymentStatus !== undefined) {
    if (!PAYMENT_STATUSES.includes(body.paymentStatus)) {
      return NextResponse.json({ error: "Invalid payment status." }, { status: 400 });
    }
    update.paymentStatus = body.paymentStatus;
  }
  if (body.trackingNumber !== undefined) {
    const tracking = (body.trackingNumber ?? "").toString().trim();
    if (tracking.length > 120) {
      return NextResponse.json(
        { error: "Tracking number is too long." },
        { status: 400 }
      );
    }
    update.trackingNumber = tracking || null;
  }
  if (body.notes !== undefined) {
    const notes = (body.notes ?? "").toString().trim();
    update.notes = notes || null;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  let order: any;
  try {
    order = await (prisma as any).order.findUnique({
      where: { orderNumber },
      include: { orderItems: true, user: true },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const statusChanged = update.status && update.status !== order.status;
    order = await (prisma as any).order.update({
      where: { orderNumber },
      data: update,
      include: { orderItems: true, user: true },
    });
    order = serializeOrder(order);

    // Notify the customer when their order status changes, but only if they
    // haven't opted out of order-update emails. The admin can force a resend
    // with { notify: true } even when nothing else changed.
    if (body.notify || statusChanged) {
      const to = order.shippingEmail || order.user?.email;
      const wantsUpdates = order.user?.orderUpdates ?? true;
      if (to && (body.notify || wantsUpdates)) {
        const result = await sendOrderStatusEmail({
          to,
          orderNumber: order.orderNumber,
          status: order.status,
          trackingNumber: order.trackingNumber,
        });
        order.notification = result.ok
          ? "sent"
          : result.reason === "logged"
            ? "logged"
            : "failed";
      }
    }
  } catch (error) {
    console.error("[admin/orders] update failed:", error);
    return NextResponse.json(
      { error: "Unable to update order." },
      { status: 500 }
    );
  }

  return NextResponse.json(order);
}