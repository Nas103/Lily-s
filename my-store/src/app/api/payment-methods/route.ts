import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applySecurityMiddleware } from "@/lib/middleware";
import { handleApiError } from "@/lib/errorHandler";
import { sanitizeInput, validateText } from "@/lib/security";
import {
  isValidCardNumber,
  getLast4Digits,
  detectCardBrand,
  isValidExpiryMonth,
  isValidExpiryYear,
  isValidCVV,
  isValidCardholderName,
  sanitizeCardNumber,
} from "@/lib/paymentSecurity";

/**
 * Verify user authentication
 */
async function verifyUser(request: NextRequest): Promise<string | null> {
  const userId = request.headers.get("x-user-id");
  const userEmail = request.headers.get("x-user-email");

  if (!userId || !userEmail) {
    console.warn("[payment-methods] Missing auth headers");
    return null;
  }

  if (!prisma) {
    console.error("[payment-methods] Prisma client not available");
    return null;
  }

  try {
    const user = await (prisma as any).user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (user && user.email === userEmail) {
      return userId;
    }
  } catch (error) {
    console.error("[payment-methods] Auth verification error:", error);
  }

  return null;
}

/**
 * GET /api/payment-methods - Get all payment methods for user
 */
export async function GET(request: NextRequest) {
  const response = NextResponse.next();
  
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 30, windowMs: 60000 },
    csrf: false,
    securityHeaders: true,
  });
  
  if (securityResponse) {
    return securityResponse;
  }

  if (!prisma) {
    return NextResponse.json(
      { error: "Service temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  try {
    const userId = await verifyUser(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const paymentMethods = await (prisma as any).paymentMethod.findMany({
      where: { userId },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" },
      ],
    });

    // Return safe data (never expose full card numbers or tokens)
    return NextResponse.json(
      paymentMethods.map((pm: any) => ({
        id: pm.id,
        type: pm.type,
        cardLast4: pm.cardLast4,
        cardBrand: pm.cardBrand,
        expiryMonth: pm.expiryMonth,
        expiryYear: pm.expiryYear,
        holderName: pm.holderName,
        isDefault: pm.isDefault,
        createdAt: pm.createdAt?.toISOString(),
        updatedAt: pm.updatedAt?.toISOString(),
        // Never return processorToken to client
      }))
    );
  } catch (error: any) {
    return await handleApiError(
      error,
      "payment-methods/GET",
      "Unable to fetch payment methods. Please try again later.",
      503
    );
  }
}

/**
 * POST /api/payment-methods - Add a new payment method
 * Security: Only stores last 4 digits, never full card number or CVV
 */
export async function POST(request: NextRequest) {
  const response = NextResponse.next();
  
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 5, windowMs: 60000 }, // Strict limit for payment methods
    csrf: true,
    securityHeaders: true,
  });
  
  if (securityResponse) {
    return securityResponse;
  }

  if (!prisma) {
    return NextResponse.json(
      { error: "Service temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  try {
    const userId = await verifyUser(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      return NextResponse.json(
        { error: "Invalid request body. Please check your input." },
        { status: 400 }
      );
    }

    const {
      type,
      cardNumber,
      expiryMonth,
      expiryYear,
      holderName,
      cvv, // Only for validation, never stored
      isDefault,
      processorToken, // Optional: token from payment processor
    } = body;

    // Validate required fields
    if (type !== "CARD") {
      return NextResponse.json(
        { error: "Only card payments are currently supported." },
        { status: 400 }
      );
    }

    if (!cardNumber) {
      return NextResponse.json(
        { error: "Card number is required." },
        { status: 400 }
      );
    }

    // Validate card number
    const sanitizedCardNumber = sanitizeCardNumber(cardNumber);
    if (!isValidCardNumber(sanitizedCardNumber)) {
      return NextResponse.json(
        { error: "Invalid card number." },
        { status: 400 }
      );
    }

    // Extract and store only last 4 digits
    const cardLast4 = getLast4Digits(sanitizedCardNumber);
    const cardBrand = detectCardBrand(sanitizedCardNumber);

    // Validate expiry
    if (!expiryMonth || !expiryYear) {
      return NextResponse.json(
        { error: "Expiry month and year are required." },
        { status: 400 }
      );
    }

    if (!isValidExpiryMonth(expiryMonth)) {
      return NextResponse.json(
        { error: "Invalid expiry month." },
        { status: 400 }
      );
    }

    if (!isValidExpiryYear(expiryYear)) {
      return NextResponse.json(
        { error: "Invalid expiry year." },
        { status: 400 }
      );
    }

    // Validate CVV (but never store it)
    if (cvv && !isValidCVV(cvv, cardBrand)) {
      return NextResponse.json(
        { error: "Invalid CVV." },
        { status: 400 }
      );
    }

    // Validate cardholder name
    if (holderName && !isValidCardholderName(holderName)) {
      return NextResponse.json(
        { error: "Invalid cardholder name." },
        { status: 400 }
      );
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await (prisma as any).paymentMethod.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Create payment method - only store safe data
    const paymentMethod = await (prisma as any).paymentMethod.create({
      data: {
        userId,
        type: "CARD",
        cardLast4, // Only last 4 digits
        cardBrand,
        expiryMonth: parseInt(expiryMonth, 10),
        expiryYear: parseInt(expiryYear, 10),
        holderName: holderName ? sanitizeInput(validateText(holderName, 50, false).sanitized) : null,
        isDefault: Boolean(isDefault),
        processorToken: processorToken ? sanitizeInput(processorToken) : null, // Optional processor token
        // Never store: full card number, CVV
      },
    });

    // Return safe data only
    return NextResponse.json(
      {
        id: paymentMethod.id,
        type: paymentMethod.type,
        cardLast4: paymentMethod.cardLast4,
        cardBrand: paymentMethod.cardBrand,
        expiryMonth: paymentMethod.expiryMonth,
        expiryYear: paymentMethod.expiryYear,
        holderName: paymentMethod.holderName,
        isDefault: paymentMethod.isDefault,
        createdAt: paymentMethod.createdAt?.toISOString(),
        updatedAt: paymentMethod.updatedAt?.toISOString(),
      },
      { status: 201 }
    );
  } catch (error: any) {
    return await handleApiError(
      error,
      "payment-methods/POST",
      "Unable to add payment method. Please try again later.",
      503
    );
  }
}

