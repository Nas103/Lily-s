import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
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
 * GET /api/admin/messages — recent marketplace messages across all brands,
 * with sender/recipient names for the admin inbox.
 */
export async function GET(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
  const admin = await requireAdminUser(request);
  if (admin instanceof NextResponse) return admin;

  try {
    const rows = await (prisma as any).brandMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 300,
      include: { brand: { select: { name: true, contactEmail: true } } },
    });
    const names = await loadUserNames(
      rows.flatMap((row: any) => [row.fromUserId, row.toUserId])
    );
    return NextResponse.json({
      messages: rows.map((row: any) => ({
        ...serializeMessage(row, names),
        brandId: row.brandId,
        brandName: row.brand?.name ?? null,
        toName: row.toUserId ? (names.get(row.toUserId)?.name ?? null) : null,
        toEmail: row.toUserId ? (names.get(row.toUserId)?.email ?? null) : null,
      })),
    });
  } catch (error: any) {
    console.error("admin/messages GET:", error);
    return NextResponse.json(
      { error: "Unable to load messages." },
      { status: 503 }
    );
  }
}

/**
 * POST /api/admin/messages — platform reply. Target: the order's customer
 * when orderId is given, otherwise the brand owner.
 */
export async function POST(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 500 });
  }
  const admin = await requireAdminUser(request);
  if (admin instanceof NextResponse) return admin;

  let body: { brandId?: string; orderId?: string; body?: string };
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

    let toUserId = brand.userId;
    if (orderId) {
      const order = await (prisma as any).order.findUnique({ where: { id: orderId } });
      if (!order) {
        return NextResponse.json({ error: "Order not found." }, { status: 404 });
      }
      toUserId = order.userId;
    }

    const message = await (prisma as any).brandMessage.create({
      data: {
        brandId,
        orderId,
        fromUserId: admin.id,
        fromRole: "ADMIN",
        toUserId,
        body: check.sanitized,
      },
    });

    void (async () => {
      try {
        const target = await (prisma as any).user.findUnique({
          where: { id: toUserId },
          select: { email: true },
        });
        if (!target?.email) return;
        await sendEmail({
          to: target.email,
          subject: "Message from the marketplace team",
          html: `<p>${escapeHtml(check.sanitized)}</p>`,
          text: check.sanitized,
        });
      } catch {
        // Notification failures never fail the send.
      }
    })();

    return NextResponse.json({ message }, { status: 201 });
  } catch (error: any) {
    console.error("admin/messages POST:", error);
    return NextResponse.json(
      { error: "Unable to send message." },
      { status: 503 }
    );
  }
}
