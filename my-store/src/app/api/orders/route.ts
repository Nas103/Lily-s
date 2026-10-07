import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-middleware";
import { handleApiError } from "@/lib/errorHandler";
import { generateOrderNumber, serializeOrder } from "@/lib/orders";
import { sanitizeInput } from "@/lib/security";

type OrderItemInput = {
  id?: string;
  productId?: string;
  name: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
};

/**
 * GET /api/orders - list the current user's orders
 */
export async function GET(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await (prisma as any).order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { orderItems: true },
    });

    return NextResponse.json({ orders: orders.map(serializeOrder) });
  } catch (error: any) {
    return await handleApiError(error, "orders/GET", "Unable to load orders.", 503);
  }
}

/**
 * POST /api/orders - create a pending order (used before payment)
 */
export async function POST(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const items: OrderItemInput[] = Array.isArray(body.items) ? body.items : [];
    if (!items.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );
    const shipping = Number(body.shipping ?? 0);
    const total = subtotal + shipping;

    const order = await (prisma as any).order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: user.id,
        status: "PENDING",
        paymentStatus: "PENDING",
        subtotal,
        shipping,
        total,
        currency: body.currency || "ZAR",
        shippingName: body.shippingName || user.name || undefined,
        shippingEmail: body.shippingEmail || user.email,
        shippingPhone: body.shippingPhone ? sanitizeInput(body.shippingPhone) : undefined,
        shippingAddressLine1: body.shippingAddressLine1,
        shippingAddressLine2: body.shippingAddressLine2,
        shippingCity: body.shippingCity,
        shippingState: body.shippingState,
        shippingPostcode: body.shippingPostcode,
        shippingCountry: body.shippingCountry,
        orderItems: {
          create: items.map((item) => ({
            productId: String(item.productId || item.id || ""),
            name: sanitizeInput(String(item.name || "")),
            imageUrl: item.imageUrl,
            size: item.size,
            color: item.color,
            quantity: Number(item.quantity),
            price: Number(item.price),
          })),
        },
      },
      include: { orderItems: true },
    });

    return NextResponse.json({ order: serializeOrder(order) }, { status: 201 });
  } catch (error: any) {
    return await handleApiError(error, "orders/POST", "Unable to create order.", 503);
  }
}