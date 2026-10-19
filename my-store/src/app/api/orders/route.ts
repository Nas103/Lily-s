import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-middleware";
import { handleApiError } from "@/lib/errorHandler";
import { generateOrderNumber, serializeOrder } from "@/lib/orders";
import { sanitizeInput } from "@/lib/security";
import { loadCatalog } from "@/lib/catalog";
import { createBrandOrders } from "@/lib/marketplace";

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
      include: {
        orderItems: true,
        brandOrders: { include: { brand: { select: { name: true } } } },
      },
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

    // Resolve authoritative prices from the catalog — the client-supplied
    // price is ignored so a tampered request can't underpay.
    const catalog = await loadCatalog();

    const resolvedItems: {
      productId: string;
      name: string;
      imageUrl?: string;
      size?: string;
      color?: string;
      quantity: number;
      price: number;
      brandId: string | null;
    }[] = [];

    let subtotal = 0;
    for (const item of items) {
      const productId = String(item.productId || item.id || "").trim();
      if (!productId) {
        return NextResponse.json({ error: "Missing product id" }, { status: 400 });
      }
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
        return NextResponse.json(
          { error: "Invalid item quantity" },
          { status: 400 }
        );
      }
      const entry = catalog.get(productId);
      if (!entry) {
        return NextResponse.json(
          { error: `Unknown product: ${productId}` },
          { status: 400 }
        );
      }
      const price = Math.round(entry.price * 100) / 100;
      subtotal += price * quantity;
      resolvedItems.push({
        productId,
        name: sanitizeInput(entry.name || item.name || ""),
        imageUrl: item.imageUrl,
        size: item.size,
        color: item.color,
        quantity,
        price,
        brandId: entry.brandId ?? null,
      });
    }
    subtotal = Math.round(subtotal * 100) / 100;

    const rawShipping = Number(body.shipping ?? 0);
    const shipping =
      Number.isFinite(rawShipping) && rawShipping > 0
        ? Math.round(rawShipping * 100) / 100
        : 0;
    const total = Math.round((subtotal + shipping) * 100) / 100;

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
          create: resolvedItems.map((item) => ({
            productId: item.productId,
            name: item.name,
            imageUrl: item.imageUrl,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: item.price,
            brandId: item.brandId,
          })),
        },
      },
      include: {
        orderItems: true,
        brandOrders: { include: { brand: { select: { name: true } } } },
      },
    });

    // Split fulfilment per owning brand (house items excluded).
    await createBrandOrders(order.id, resolvedItems);

    return NextResponse.json({ order: serializeOrder(order) }, { status: 201 });
  } catch (error: any) {
    return await handleApiError(error, "orders/POST", "Unable to create order.", 503);
  }
}