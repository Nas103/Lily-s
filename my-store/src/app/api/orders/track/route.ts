import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/errorHandler";
import { serializeOrder } from "@/lib/orders";
import { applySecurityMiddleware } from "@/lib/middleware";

/**
 * POST /api/orders/track - public tracking by order number + email
 */
export async function POST(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const response = NextResponse.next();
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 15, windowMs: 60000 },
    securityHeaders: true,
  });
  if (securityResponse) {
    return securityResponse;
  }

  try {
    const body = await request.json();
    const orderNumber = String(body.orderNumber || "").trim();
    const email = String(body.email || "").trim().toLowerCase();

    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: "Order number and email are required" },
        { status: 400 }
      );
    }

    const order = await (prisma as any).order.findUnique({
      where: { orderNumber },
      include: { orderItems: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const orderEmail = String(order.shippingEmail || "").toLowerCase();
    if (orderEmail !== email) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order: serializeOrder(order) });
  } catch (error: any) {
    return await handleApiError(error, "orders/track", "Unable to track order.", 503);
  }
}