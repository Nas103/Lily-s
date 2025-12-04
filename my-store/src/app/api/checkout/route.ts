import { NextResponse } from "next/server";
import {
  createPayFastPaymentData,
  getPayFastUrl,
  PAYFAST_CONFIG,
} from "@/lib/payfast";

type CheckoutItem = {
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
};

export async function POST(request: Request) {
  const { items } = await request.json();

  if (!Array.isArray(items) || !items.length) {
    return NextResponse.json(
      { error: "Cart is empty" },
      { status: 400 }
    );
  }

  // Validate PayFast configuration
  if (!PAYFAST_CONFIG.merchantId || !PAYFAST_CONFIG.merchantKey) {
    return NextResponse.json(
      { error: "PayFast configuration missing. Please set PAYFAST_MERCHANT_ID and PAYFAST_MERCHANT_KEY." },
      { status: 500 }
    );
  }

  // Calculate total amount
  const totalAmount = (items as CheckoutItem[]).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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


