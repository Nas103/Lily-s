import { NextRequest, NextResponse } from "next/server";
import {
  createPayFastPaymentData,
  getPayFastUrl,
  PAYFAST_CONFIG,
} from "@/lib/payfast";
import { getDynamicPrice } from "@/lib/aiPricing";
import { applySecurityMiddleware } from "@/lib/middleware";
import { sanitizeInput } from "@/lib/security";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-middleware";
import { currencyCodeForCountry } from "@/lib/currency";
import { generateOrderNumber } from "@/lib/orders";
import { loadCatalog } from "@/lib/catalog";

type CheckoutItem = {
  id?: string;
  productId?: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
};

export async function POST(request: NextRequest) {
  const response = NextResponse.next();
  
  // Apply security middleware
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 10, windowMs: 60000 }, // 10 checkouts per minute
    csrf: true,
    securityHeaders: true,
  });
  
  if (securityResponse) {
    return securityResponse;
  }
  const body = await request.json();
  const { items, shipping = {} } = body;

  if (!Array.isArray(items) || !items.length) {
    return NextResponse.json(
      { error: "Cart is empty" },
      { status: 400 }
    );
  }

  // Validate and sanitize items. The client-supplied price is intentionally
  // ignored: authoritative prices are resolved from the catalog below.
  for (const item of items as CheckoutItem[]) {
    if (typeof item.name !== "string" || item.name.length > 200) {
      return NextResponse.json(
        { error: "Invalid item name" },
        { status: 400 }
      );
    }
    if (typeof item.quantity !== "number" || item.quantity < 1 || item.quantity > 100) {
      return NextResponse.json(
        { error: "Invalid item quantity" },
        { status: 400 }
      );
    }
    // Sanitize item name
    item.name = sanitizeInput(item.name);
  }

  // Validate PayFast configuration
  if (!PAYFAST_CONFIG.merchantId || !PAYFAST_CONFIG.merchantKey) {
    return NextResponse.json(
      { error: "PayFast configuration missing. Please set PAYFAST_MERCHANT_ID and PAYFAST_MERCHANT_KEY." },
      { status: 500 }
    );
  }

  // Calculate total amount with optional Vertex AI dynamic pricing.
  // Item prices are stored in the USD base currency; `currency` records the
  // shopper's local currency so order history can render the right symbol.
  const ipAddress = request.headers.get("x-forwarded-for") ?? undefined;

  const user = await getCurrentUser(request);
  let profileCountry: string | null = null;
  if (user && prisma) {
    try {
      const profile = await (prisma as any).user.findUnique({
        where: { id: user.id },
        select: { country: true },
      });
      profileCountry = profile?.country ?? null;
    } catch {
      profileCountry = null;
    }
  }
  const shippingCountry =
    typeof shipping?.country === "string" ? shipping.country.trim() : "";
  const resolvedCountry = shippingCountry || profileCountry || "";
  const currency = resolvedCountry
    ? currencyCodeForCountry(resolvedCountry)
    : "ZAR";

  // Resolve authoritative prices from the catalog so a tampered client can't
  // underpay. Dynamic pricing (if configured) is applied on top of the trusted
  // base price, never on a client-supplied one.
  const catalog = await loadCatalog();

  const resolvedItems: {
    productId: string;
    name: string;
    imageUrl: string;
    size?: string;
    color?: string;
    quantity: number;
    price: number;
  }[] = [];

  let totalAmount = 0;

  for (const item of items as CheckoutItem[]) {
    const productId = String(item.productId || item.id || "").trim();
    if (!productId) {
      return NextResponse.json(
        { error: "Missing product id" },
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

    const basePrice = Math.round(entry.price * 100) / 100;
    const { price } = await getDynamicPrice({
      basePrice,
      currency,
      ipAddress,
    });
    const charged = Math.round(price * 100) / 100;

    totalAmount += charged * item.quantity;

    resolvedItems.push({
      productId,
      name: sanitizeInput(entry.name || item.name || ""),
      imageUrl: item.imageUrl,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: charged,
    });
  }
  totalAmount = Math.round(totalAmount * 100) / 100;

  // Create item description from cart items
  const itemNames = resolvedItems
    .map((item) => `${item.name} (x${item.quantity})`)
    .join(", ");

  // Generate unique order number for tracking (format: ORD-YYYYMMDD-HHMMSS-XXXXX)
  const orderNumber = generateOrderNumber();

  // Persist the order when the shopper is authenticated so it appears in
  // their history and can be reconciled by the PayFast webhook.
  try {
    if (user && prisma) {
      await (prisma as any).order.create({
        data: {
          orderNumber,
          userId: user.id,
          status: "PENDING",
          paymentStatus: "PENDING",
          subtotal: totalAmount,
          shipping: 0,
          total: totalAmount,
          currency,
          paymentMethod: "payfast",
          shippingName: shipping.fullName || user.name || undefined,
          shippingEmail: shipping.email || user.email,
          shippingPhone: shipping.phone || undefined,
          shippingAddressLine1: shipping.addressLine1 || shipping.street || undefined,
          shippingAddressLine2: shipping.addressLine2 || undefined,
          shippingCity: shipping.city || undefined,
          shippingState: shipping.state || undefined,
          shippingPostcode: shipping.postcode || shipping.zip || undefined,
          shippingCountry: shipping.country || undefined,
          orderItems: {
            create: resolvedItems.map((item) => ({
              productId: item.productId,
              name: item.name,
              imageUrl: item.imageUrl,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });
    }
  } catch (persistError) {
    console.error("checkout: failed to persist order", persistError);
  }

  // Generate unique payment ID (using order number)
  const mPaymentId = orderNumber;

  // Create PayFast payment data
  const paymentData = createPayFastPaymentData({
    mPaymentId,
    amount: totalAmount,
    itemName: itemNames.length > 100 ? "Order Items" : itemNames,
    itemDescription: itemNames.length > 255 ? undefined : itemNames,
    emailAddress: shipping.email || undefined,
    nameFirst: shipping.firstName || undefined,
    nameLast: shipping.lastName || undefined,
    customData: {
      orderNumber,
    },
  });

  // Get PayFast URL
  const payfastUrl = getPayFastUrl();

  return NextResponse.json({
    orderNumber, // Unique order number for tracking
    paymentUrl: payfastUrl,
    paymentData,
  });
}


