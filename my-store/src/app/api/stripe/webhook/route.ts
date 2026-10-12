import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// Stripe requires the raw request body to verify the webhook signature.
export async function POST(request: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("stripe webhook: STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error: any) {
    console.error("stripe webhook: signature verification failed", error?.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const intent = event.data.object as Stripe.PaymentIntent;
        await markOrder(intent, {
          status: "PAID",
          paymentStatus: "PAID",
        });
        break;
      }
      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        await markOrder(intent, {
          status: "FAILED",
          paymentStatus: "FAILED",
        });
        break;
      }
      case "payment_intent.canceled": {
        const intent = event.data.object as Stripe.PaymentIntent;
        await markOrder(intent, {
          status: "CANCELLED",
          paymentStatus: "FAILED",
        });
        break;
      }
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderNumber =
          (session.metadata?.orderNumber as string | undefined) ??
          session.client_reference_id ??
          undefined;
        const paymentRef =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id;
        await markOrderByNumber(orderNumber, {
          status: "PAID",
          paymentStatus: "PAID",
          paymentRef,
        });
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error("stripe webhook: handler error", error);
    // Return 500 so Stripe retries the event.
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function markOrder(
  intent: Stripe.PaymentIntent,
  data: { status: string; paymentStatus: string }
) {
  if (!prisma) return;
  const orderNumber =
    (intent.metadata?.orderNumber as string | undefined) ?? undefined;

  if (orderNumber) {
    await (prisma as any).order.updateMany({
      where: { orderNumber },
      data: {
        status: data.status,
        paymentStatus: data.paymentStatus,
        paymentRef: intent.id,
      },
    });
    return;
  }

  // Fallback: reconcile by the payment reference we stored at creation time.
  await (prisma as any).order.updateMany({
    where: { paymentRef: intent.id },
    data: {
      status: data.status,
      paymentStatus: data.paymentStatus,
    },
  });
}

async function markOrderByNumber(
  orderNumber: string | undefined,
  data: { status: string; paymentStatus: string; paymentRef?: string }
) {
  if (!prisma || !orderNumber) return;
  await (prisma as any).order.updateMany({
    where: { orderNumber },
    data: {
      status: data.status,
      paymentStatus: data.paymentStatus,
      ...(data.paymentRef ? { paymentRef: data.paymentRef } : {}),
    },
  });
}

// Stripe may send a GET when a user opens the endpoint in a browser.
export async function GET() {
  return NextResponse.json({ status: "stripe webhook endpoint" });
}
