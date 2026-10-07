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
import { generateOrderNumber } from "@/lib/orders";

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

  // Validate and sanitize items
  for (const item of items as CheckoutItem[]) {
    if (typeof item.name !== "string" || item.name.length > 200) {
      return NextResponse.json(
        { error: "Invalid item name" },
        { status: 400 }
      );
    }
    if (typeof item.price !== "number" || item.price < 0 || item.price > 1000000) {
      return NextResponse.json(
        { error: "Invalid item price" },
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
  const currency = "ZAR";
  const ipAddress = request.headers.get("x-forwarded-for") ?? undefined;

  let totalAmount = 0;

  for (const item of items as CheckoutItem[]) {
    const { price } = await getDynamicPrice({
      basePrice: item.price,
      currency,
      ipAddress,
    });
    totalAmount += price * item.quantity;
  }

  // Create item description from cart items
  const itemNames = (items as CheckoutItem[])
    .map((item) => `${item.name} (x${item.quantity})`)
    .join(", ");

  // Generate unique order number for tracking (format: ORD-YYYYMMDD-HHMMSS-XXXXX)
  const orderNumber = generateOrderNumber();

  // Persist the order when the shopper is authenticated so it appears in
  // their history and can be reconciled by the PayFast webhook.
  try {
    const user = await getCurrentUser(request);
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
            create: (items as CheckoutItem[]).map((item) => ({
              productId: String(item.productId || item.id || ""),
              name: sanitizeInput(item.name),
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


