import { NextRequest, NextResponse } from "next/server";
import {
  createPayFastPaymentData,
  getPayFastUrl,
  PAYFAST_CONFIG,
} from "@/lib/payfast";
import { getDynamicPrice } from "@/lib/aiPricing";
import { applySecurityMiddleware } from "@/lib/middleware";
import { sanitizeInput } from "@/lib/security";

type CheckoutItem = {
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
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
  const { items } = body;

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

  // Generate unique payment ID
  const mPaymentId = `ORDER-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  // Create PayFast payment data
  const paymentData = createPayFastPaymentData({
    mPaymentId,
    amount: totalAmount,
    itemName: itemNames.length > 100 ? "Order Items" : itemNames,
    itemDescription: itemNames.length > 255 ? undefined : itemNames,
    customData: {
      items: JSON.stringify(items),
    },
  });

  // Get PayFast URL
  const payfastUrl = getPayFastUrl();

  return NextResponse.json({
    paymentUrl: payfastUrl,
    paymentData,
  });
}


