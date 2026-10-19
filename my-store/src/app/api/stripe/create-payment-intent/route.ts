import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-middleware";
import { sanitizeInput } from "@/lib/security";
import { generateOrderNumber } from "@/lib/orders";
import { loadCatalog } from "@/lib/catalog";
import { createBrandOrders } from "@/lib/marketplace";

type CheckoutItem = {
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
 * Charge currency for Stripe. Stripe settles in the account's settlement
 * currency, so we charge in a single supported currency (configured via env)
 * even though the app displays the shopper's local currency.
 */
const STRIPE_CURRENCY = (process.env.STRIPE_CURRENCY ?? "usd").toLowerCase();

export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY." },
      { status: 500 }
    );
  }

  // Authenticated checkout only — we need a user to attach the order to.
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { user } = auth;

  let body: { items?: CheckoutItem[]; deliveryAddressId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { items, deliveryAddressId } = body;

  if (!Array.isArray(items) || !items.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  // Validate items and resolve authoritative prices from the catalog so a
  // tampered client can't underpay. The client-supplied price is ignored;
  // products that aren't in the catalog are rejected.
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

  let totalAmount = 0;
  for (const item of items) {
    const productId = String(item.productId || item.id || "").trim();
    if (!productId) {
      return NextResponse.json(
        { error: "Missing product id" },
        { status: 400 }
      );
    }
    if (
      typeof item.quantity !== "number" ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 100
    ) {
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
    resolvedItems.push({
      productId,
      name: sanitizeInput(entry.name || item.name || ""),
      imageUrl: item.imageUrl,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price,
      brandId: entry.brandId ?? null,
    });
    totalAmount += price * item.quantity;
  }
  totalAmount = Math.round(totalAmount * 100) / 100;

  const amountCents = Math.round(totalAmount * 100);
  if (amountCents < 50) {
    return NextResponse.json(
      { error: "Order total is below the minimum charge amount" },
      { status: 400 }
    );
  }

  const orderNumber = generateOrderNumber();

  // Load the delivery address (optional) so the order carries a shipping
  // snapshot and the PaymentIntent can use a billing email.
  let address: Record<string, unknown> | null = null;
  if (deliveryAddressId && prisma) {
    try {
      address = await (prisma as any).deliveryAddress.findFirst({
        where: { id: deliveryAddressId, userId: user.id },
      });
    } catch {
      address = null;
    }
  }

  // Persist a PENDING order first, so it appears in history and the webhook
  // has something to reconcile against.
  try {
    if (prisma) {
      const order = await (prisma as any).order.create({
        data: {
          orderNumber,
          userId: user.id,
          status: "PENDING",
          paymentStatus: "PENDING",
          subtotal: totalAmount,
          shipping: 0,
          total: totalAmount,
          currency: STRIPE_CURRENCY.toUpperCase(),
          paymentMethod: "stripe",
          shippingName: (address?.fullName as string) || user.name || undefined,
          shippingEmail: (address?.email as string) || user.email,
          shippingPhone: (address?.phone as string) || undefined,
          shippingAddressLine1:
            (address?.addressLine1 as string) || undefined,
          shippingAddressLine2:
            (address?.addressLine2 as string) || undefined,
          shippingCity: (address?.city as string) || undefined,
          shippingState: (address?.state as string) || undefined,
          shippingPostcode: (address?.postcode as string) || undefined,
          shippingCountry: (address?.country as string) || undefined,
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
      });
      // Split fulfilment per owning brand (house items excluded).
      await createBrandOrders(order.id, resolvedItems);
    }
  } catch (persistError) {
    console.error("stripe: failed to persist order", persistError);
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: STRIPE_CURRENCY,
      automatic_payment_methods: { enabled: true },
      receipt_email: user.email,
      description: `Order ${orderNumber}`,
      metadata: {
        orderNumber,
        userId: user.id,
      },
    });

    if (prisma) {
      await (prisma as any).order.updateMany({
        where: { orderNumber },
        data: { paymentRef: paymentIntent.id },
      });
    }

    return NextResponse.json({
      orderNumber,
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY ?? undefined,
      currency: STRIPE_CURRENCY.toUpperCase(),
      amount: totalAmount,
    });
  } catch (error: any) {
    console.error("stripe: failed to create payment intent", error);
    return NextResponse.json(
      { error: error?.message || "Failed to initialise payment" },
      { status: 500 }
    );
  }
}
