import { NextResponse } from "next/server";
import { generatePayFastSignature, PAYFAST_CONFIG } from "@/lib/payfast";
import { assessOrderRisk } from "@/lib/aiPricing";

/**
 * PayFast ITN (Instant Transaction Notification) handler
 * This endpoint receives payment notifications from PayFast
 */
export async function POST(request: Request) {
  try {
    // PayFast sends data as form-urlencoded
    const formData = await request.formData();
    const data: Record<string, string> = {};

    // Convert FormData to object
    for (const [key, value] of formData.entries()) {
      data[key] = String(value);
    }

    // Verify signature
    const receivedSignature = data.signature;
    const calculatedSignature = generatePayFastSignature(
      data as any
    );

    if (receivedSignature !== calculatedSignature) {
      console.error("PayFast signature mismatch", {
        received: receivedSignature,
        calculated: calculatedSignature,
      });
      return new NextResponse("Signature verification failed", { status: 400 });
    }

    // Extract payment information
    const paymentStatus = data.payment_status;
    const mPaymentId = data.m_payment_id;
    const pfPaymentId = data.pf_payment_id;
    const amount = parseFloat(data.amount_gross || "0");
    const nameFirst = data.name_first;
    const nameLast = data.name_last;
    const emailAddress = data.email_address;
    const ipAddress =
      request.headers.get("x-forwarded-for") ?? data["ip_address"] ?? undefined;

    // Log the payment notification
    console.log("PayFast ITN received:", {
      paymentStatus,
      mPaymentId,
      pfPaymentId,
      amount,
      nameFirst,
      nameLast,
      emailAddress,
      ipAddress,
    });

    // Handle payment status
    if (paymentStatus === "COMPLETE") {
      // Payment was successful
      // Evaluate fraud risk with Vertex AI before fulfilling.
      const risk = await assessOrderRisk({
        orderId: mPaymentId,
        total: amount,
        currency: "ZAR",
        ipAddress,
        countryCode: data["country"] ?? undefined,
        // TODO: Wire real attempt counters from your database.
        attemptsFromIp: undefined,
        cardLast4: data["card_last4"] ?? undefined,
      });

      console.log("Fraud assessment for order:", {
        mPaymentId,
        risk,
      });

      // TODO: Use `risk.recommendReview` / `risk.recommendBlock` to gate fulfillment.
      // TODO: Update order status in database
      // TODO: Send confirmation email
      // TODO: Fulfill order (update inventory, etc.)

      console.log(`Payment successful for order: ${mPaymentId}`);
    } else if (paymentStatus === "FAILED") {
      // Payment failed
      console.log(`Payment failed for order: ${mPaymentId}`);
    } else if (paymentStatus === "PENDING") {
      // Payment is pending
      console.log(`Payment pending for order: ${mPaymentId}`);
    }

    // Return success to PayFast (they expect specific response format)
    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("PayFast ITN error:", error);
    return new NextResponse("Error processing notification", { status: 500 });
  }
}

// PayFast also supports GET requests for some notifications
export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const data: Record<string, string> = {};

  // Convert URL params to object
  for (const [key, value] of searchParams.entries()) {
    data[key] = value;
  }

  // Similar verification and processing as POST
  try {
    const receivedSignature = data.signature;
    const calculatedSignature = generatePayFastSignature(data as any);

    if (receivedSignature !== calculatedSignature) {
      return new NextResponse("Signature verification failed", { status: 400 });
    }

    console.log("PayFast GET notification:", data);
    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("PayFast GET notification error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}

