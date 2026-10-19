import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-middleware";
import { sanitizeInput } from "@/lib/security";
import { generateOrderNumber } from "@/lib/orders";
import { loadCatalog } from "@/lib/catalog";
import { createBrandOrders } from "@/lib/marketplace";
import { getSiteUrl } from "@/lib/siteUrl";

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

const STRIPE_CURRENCY = (process.env.STRIPE_CURRENCY ?? "usd").toLowerCase();
const SITE_URL = getSiteUrl();

/**
 * Stripe requires absolute image URLs. Product data uses site-relative paths
 * (e.g. "/perfumes/.../main.jpg"), so resolve them against SITE_URL and drop
 * anything that isn't a usable URL.
 */
function toAbsoluteImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return `${SITE_URL}${url}`;
  return undefined;
}

/**
 * Web checkout via Stripe-hosted Checkout. Prices are resolved from the
 * catalog server-side so a tampered client can't underpay, matching the
 * mobile Payment Sheet flow.
 */
export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY." },
      { status: 500 }
    );
  }

  // Web checkout requires a signed-in user so the order can be attached.
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;
  const { user } = auth;

  let body: { items?: CheckoutItem[]; shipping?: Record<string, string> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { items, shipping = {} } = body;

  if (!Array.isArray(items) || !items.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const catalog = await loadCatalog();

  const resolvedItems: {
    productId: string;
    name: string;
    imageUrl?: string;
    quantity: number;
    price: number;
    brandId: string | null;
  }[] = [];

  let totalAmount = 0;
  for (const item of items) {
    const productId = String(item.productId || item.id || "").trim();
    if (!productId) {
      return NextResponse.json({ error: "Missing product id" }, { status: 400 });
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

  // Persist a PENDING order first so it shows in history and the webhook has
  // something to reconcile against.
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
          shippingName:
            (shipping.fullName as string) || user.name || undefined,
          shippingEmail: (shipping.email as string) || user.email,
          shippingPhone: (shipping.phone as string) || undefined,
          shippingAddressLine1:
            (shipping.addressLine1 as string) ||
            (shipping.street as string) ||
            undefined,
          shippingAddressLine2: (shipping.addressLine2 as string) || undefined,
          shippingCity: (shipping.city as string) || undefined,
          shippingState: (shipping.state as string) || undefined,
          shippingPostcode:
            (shipping.postcode as string) ||
            (shipping.zip as string) ||
            undefined,
          shippingCountry: (shipping.country as string) || undefined,
          orderItems: {
            create: resolvedItems.map((item) => ({
              productId: item.productId,
              name: item.name,
              imageUrl: item.imageUrl,
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
    console.error("stripe checkout: failed to persist order", persistError);
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: resolvedItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: STRIPE_CURRENCY,
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: item.name,
            images: (() => {
              const img = toAbsoluteImageUrl(item.imageUrl);
              return img ? [img] : undefined;
            })(),
          },
        },
      })),
      success_url: `${SITE_URL}/checkout?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/checkout?status=cancelled`,
      customer_email: user.email,
      client_reference_id: orderNumber,
      metadata: { orderNumber, userId: user.id },
      // Copy metadata onto the underlying PaymentIntent so the existing
      // payment_intent.succeeded webhook reconciles this order.
      payment_intent_data: { metadata: { orderNumber, userId: user.id } },
    });

    if (prisma && session.id) {
      await (prisma as any).order.updateMany({
        where: { orderNumber },
        data: { paymentRef: session.id },
      });
    }

    return NextResponse.json({ orderNumber, url: session.url });
  } catch (error: any) {
    console.error("stripe checkout: failed to create session", error);
    return NextResponse.json(
      { error: error?.message || "Failed to initialise payment" },
      { status: 500 }
    );
  }
}
