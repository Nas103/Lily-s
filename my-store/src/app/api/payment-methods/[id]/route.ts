import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applySecurityMiddleware } from "@/lib/middleware";
import { handleApiError } from "@/lib/errorHandler";
import { sanitizeInput, validateText } from "@/lib/security";
import {
  isValidExpiryMonth,
  isValidExpiryYear,
  isValidCardholderName,
} from "@/lib/paymentSecurity";

/**
 * Verify user authentication
 */
async function verifyUser(request: NextRequest): Promise<string | null> {
  const userId = request.headers.get("x-user-id");
  const userEmail = request.headers.get("x-user-email");

  if (!userId || !userEmail || !prisma) {
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
 * PATCH /api/payment-methods/[id] - Update a payment method
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const response = NextResponse.next();
  
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 5, windowMs: 60000 },
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

    const { id: paymentMethodId } = await params;
    
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      return NextResponse.json(
        { error: "Invalid request body. Please check your input." },
        { status: 400 }
      );
    }

    // Verify payment method belongs to user
    const existing = await (prisma as any).paymentMethod.findUnique({
      where: { id: paymentMethodId },
      select: { userId: true },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json(
        { error: "Payment method not found." },
        { status: 404 }
      );
    }

    const updateData: any = {};

    // Update expiry
    if (body.expiryMonth !== undefined) {
      if (!isValidExpiryMonth(body.expiryMonth)) {
        return NextResponse.json(
          { error: "Invalid expiry month." },
          { status: 400 }
        );
      }
      updateData.expiryMonth = parseInt(body.expiryMonth, 10);
    }

    if (body.expiryYear !== undefined) {
      if (!isValidExpiryYear(body.expiryYear)) {
        return NextResponse.json(
          { error: "Invalid expiry year." },
          { status: 400 }
        );
      }
      updateData.expiryYear = parseInt(body.expiryYear, 10);
    }

    // Update holder name
    if (body.holderName !== undefined) {
      if (body.holderName && !isValidCardholderName(body.holderName)) {
        return NextResponse.json(
          { error: "Invalid cardholder name." },
          { status: 400 }
        );
      }
      updateData.holderName = body.holderName
        ? sanitizeInput(validateText(body.holderName, 50, false).sanitized)
        : null;
    }

    // Set as default
    if (body.isDefault === true) {
      await (prisma as any).paymentMethod.updateMany({
        where: { userId, isDefault: true, id: { not: paymentMethodId } },
        data: { isDefault: false },
      });
      updateData.isDefault = true;
    } else if (body.isDefault === false) {
      updateData.isDefault = false;
    }

    const updated = await (prisma as any).paymentMethod.update({
      where: { id: paymentMethodId },
      data: updateData,
    });

    return NextResponse.json({
      id: updated.id,
      type: updated.type,
      cardLast4: updated.cardLast4,
      cardBrand: updated.cardBrand,
      expiryMonth: updated.expiryMonth,
      expiryYear: updated.expiryYear,
      holderName: updated.holderName,
      isDefault: updated.isDefault,
      createdAt: updated.createdAt?.toISOString(),
      updatedAt: updated.updatedAt?.toISOString(),
    });
  } catch (error: any) {
    return await handleApiError(
      error,
      "payment-methods/PATCH",
      "Unable to update payment method. Please try again later.",
      503
    );
  }
}

/**
 * DELETE /api/payment-methods/[id] - Delete a payment method
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const response = NextResponse.next();
  
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 5, windowMs: 60000 },
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

    const { id: paymentMethodId } = await params;

    // Verify payment method belongs to user
    const existing = await (prisma as any).paymentMethod.findUnique({
      where: { id: paymentMethodId },
      select: { userId: true },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json(
        { error: "Payment method not found." },
        { status: 404 }
      );
    }

    await (prisma as any).paymentMethod.delete({
      where: { id: paymentMethodId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return await handleApiError(
      error,
      "payment-methods/DELETE",
      "Unable to delete payment method. Please try again later.",
      503
    );
  }
}

