import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-middleware";
import { validateText } from "@/lib/security";
import { loadUserNames, serializeMessage } from "@/lib/messages";
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
 * GET /api/messages?brandId=&orderId= — a client's (or admin's) view of one
 * brand thread. Clients only ever see messages they sent or received.
 */
export async function GET(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get("brandId")?.trim();
  const orderId = searchParams.get("orderId")?.trim();
  if (!brandId) {
    return NextResponse.json({ error: "brandId is required" }, { status: 400 });
  }

  try {
    const rows = await (prisma as any).brandMessage.findMany({
      where: {
        brandId,
        ...(orderId ? { orderId } : {}),
        ...(user.role === "ADMIN"
          ? {}
          : { AND: [{ OR: [{ fromUserId: user.id }, { toUserId: user.id }] }] }),
      },
      orderBy: { createdAt: "desc" },
      take: 300,
    });
    const names = await loadUserNames(
      rows.flatMap((row: any) => [row.fromUserId, row.toUserId])
    );
    return NextResponse.json({
      messages: rows.reverse().map((row: any) => serializeMessage(row, names)),
    });
  } catch (error: any) {
    console.error("messages GET:", error);
    return NextResponse.json(
      { error: "Unable to load messages." },
      { status: 503 }
    );
  }
}

/**
 * POST /api/messages — send a message to a brand.
 *   USER  → to the brand owner (optionally about one of their orders)
 *   BRAND → to the order's customer (order threads only)
 *   ADMIN → to the customer when orderId is given, else the brand owner
 */
export async function POST(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 500 });
  }
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { brandId?: string; orderId?: string; body?: string; toUserId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const brandId = String(body.brandId ?? "").trim();
  const orderId = String(body.orderId ?? "").trim() || null;
  if (!brandId) {
    return NextResponse.json({ error: "brandId is required" }, { status: 400 });
  }
  const check = validateText(String(body.body ?? ""), 1000, false);
  if (!check.valid || !check.sanitized) {
    return NextResponse.json(
      { error: check.valid ? "Message body is required." : check.error },
      { status: 400 }
    );
  }

  try {
    const brand = await (prisma as any).brand.findUnique({ where: { id: brandId } });
    if (!brand) {
      return NextResponse.json({ error: "Brand not found." }, { status: 404 });
    }

    let order: any = null;
    if (orderId) {
      order = await (prisma as any).order.findUnique({ where: { id: orderId } });
      if (!order) {
        return NextResponse.json({ error: "Order not found." }, { status: 404 });
      }
    }

    let toUserId: string;
    if (user.role === "BRAND") {
      if (brand.userId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (!order) {
        return NextResponse.json(
          { error: "Brand replies require an order thread.", code: "ORDER_REQUIRED" },
          { status: 400 }
        );
      }
      toUserId = order.userId;
    } else if (user.role === "ADMIN") {
      // Admins name the recipient explicitly (thread-aware replies); the
      // sensible default is the order's customer, else the brand owner.
      const requested = String(body.toUserId ?? "").trim();
      if (requested.length > 64) {
        return NextResponse.json({ error: "Invalid recipient." }, { status: 400 });
      }
      toUserId = requested || (order ? order.userId : brand.userId);
    } else {
      if (order && order.userId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (order) {
        const sells = await (prisma as any).orderItem.count({
          where: { orderId, brandId },
        });
        if (!sells) {
          return NextResponse.json(
            { error: "This brand has no items in that order.", code: "BRAND_NOT_IN_ORDER" },
            { status: 400 }
          );
        }
      }
      toUserId = brand.userId;
    }

    const message = await (prisma as any).brandMessage.create({
      data: {
        brandId,
        orderId,
        fromUserId: user.id,
        fromRole: user.role,
        toUserId,
        body: check.sanitized,
      },
    });

    // Fire-and-forget: notify the recipient by email (fails safe to logging).
    void (async () => {
      try {
        const target = await (prisma as any).user.findUnique({
          where: { id: toUserId },
          select: { email: true },
        });
        const to = target?.email;
        if (!to) return;
        await sendEmail({
          to,
          subject: `New message about ${order ? `order ${order.orderNumber}` : brand.name}`,
          html: `<p>You have a new message from ${escapeHtml(user.name || user.email)}${order ? ` about order ${escapeHtml(order.orderNumber)}` : ""}:</p><p>${escapeHtml(check.sanitized)}</p>`,
          text: check.sanitized,
        });
      } catch {
        // Notification failures never fail the send.
      }
    })();

    return NextResponse.json({ message }, { status: 201 });
  } catch (error: any) {
    console.error("messages POST:", error);
    return NextResponse.json(
      { error: "Unable to send message." },
      { status: 503 }
    );
  }
}
