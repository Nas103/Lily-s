import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireBrandAccount } from "@/lib/brandAuth";
import { validateText } from "@/lib/security";
import { buildThreads, loadUserNames } from "@/lib/messages";
import { sendEmail } from "@/lib/notifications";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * GET /api/brand/messages — the brand's inbox, grouped into threads by
 * order/customer. Fetching also marks inbound customer/admin messages read.
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
    // Load first so the response can still count unread inbound messages,
    // then clear the unread flag for everything addressed to the brand owner.
    const rows = await (prisma as any).brandMessage.findMany({
      where: { brandId: gate.brand.id },
      orderBy: { createdAt: "desc" },
      take: 300,
    });
    await (prisma as any).brandMessage.updateMany({
      where: {
        brandId: gate.brand.id,
        toUserId: gate.brand.userId,
        fromRole: { in: ["USER", "ADMIN"] },
        readAt: null,
      },
      data: { readAt: new Date() },
    });
    const names = await loadUserNames(
      rows.flatMap((row: any) => [row.fromUserId, row.toUserId])
    );
    return NextResponse.json({
      threads: buildThreads(rows, names, gate.brand.userId),
    });
  } catch (error: any) {
    console.error("brand/messages GET:", error);
    return NextResponse.json(
      { error: "Unable to load messages." },
      { status: 503 }
    );
  }
}

/**
 * POST /api/brand/messages — brand reply. With orderId the target is that
 * order's customer; without one the target must be an existing thread
 * participant (customers always write first for general enquiries).
 */
export async function POST(request: NextRequest) {
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

  let body: { orderId?: string; toUserId?: string; body?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const orderId = String(body.orderId ?? "").trim() || null;
  let toUserId = String(body.toUserId ?? "").trim() || null;
  const check = validateText(String(body.body ?? ""), 1000, false);
  if (!check.valid || !check.sanitized) {
    return NextResponse.json(
      { error: check.valid ? "Message body is required." : check.error },
      { status: 400 }
    );
  }

  try {
    if (orderId) {
      const order = await (prisma as any).order.findUnique({ where: { id: orderId } });
      if (!order) {
        return NextResponse.json({ error: "Order not found." }, { status: 404 });
      }
      const sells = await (prisma as any).orderItem.count({
        where: { orderId, brandId: gate.brand.id },
      });
      if (!sells) {
        return NextResponse.json(
          { error: "This order has no items from your brand.", code: "BRAND_NOT_IN_ORDER" },
          { status: 400 }
        );
      }
      toUserId = order.userId;
    } else {
      if (!toUserId) {
        return NextResponse.json(
          { error: "orderId or toUserId is required.", code: "TARGET_REQUIRED" },
          { status: 400 }
        );
      }
      if (toUserId === gate.brand.userId) {
        return NextResponse.json({ error: "Cannot message yourself." }, { status: 400 });
      }
      // Only reply inside threads the customer opened (or existing orders).
      const hasThread = await (prisma as any).brandMessage.findFirst({
        where: { brandId: gate.brand.id, fromUserId: toUserId },
        select: { id: true },
      });
      const hasOrder = await (prisma as any).orderItem.findFirst({
        where: { brandId: gate.brand.id, order: { userId: toUserId } },
        select: { id: true },
      });
      if (!hasThread && !hasOrder) {
        return NextResponse.json(
          { error: "No existing thread with that customer.", code: "NO_THREAD" },
          { status: 400 }
        );
      }
    }

    const message = await (prisma as any).brandMessage.create({
      data: {
        brandId: gate.brand.id,
        orderId,
        fromUserId: gate.brand.userId,
        fromRole: "BRAND",
        toUserId,
        body: check.sanitized,
      },
    });

    // Fire-and-forget customer notification (fails safe to logging).
    void (async () => {
      try {
        const target = await (prisma as any).user.findUnique({
          where: { id: toUserId },
          select: { email: true },
        });
        if (!target?.email) return;
        await sendEmail({
          to: target.email,
          subject: `${gate.brand!.name} replied about your order`,
          html: `<p>${escapeHtml(gate.brand!.name)} sent you a message:</p><p>${escapeHtml(check.sanitized)}</p>`,
          text: check.sanitized,
        });
      } catch {
        // Never fail the send on a notification error.
      }
    })();

    return NextResponse.json({ message }, { status: 201 });
  } catch (error: any) {
    console.error("brand/messages POST:", error);
    return NextResponse.json(
      { error: "Unable to send message." },
      { status: 503 }
    );
  }
}
