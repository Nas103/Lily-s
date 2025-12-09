import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applySecurityMiddleware } from "@/lib/middleware";
import { handleApiError, getSafeErrorMessage } from "@/lib/errorHandler";
import { sanitizeInput, validateText, isValidPhone } from "@/lib/security";

/**
 * Verify user authentication
 */
async function verifyUser(request: NextRequest): Promise<string | null> {
  const userId = request.headers.get("x-user-id");
  const userEmail = request.headers.get("x-user-email");

  if (!userId || !userEmail) {
    console.warn("[delivery-addresses] Missing auth headers");
    return null;
  }

  if (!prisma) {
    console.error("[delivery-addresses] Prisma client not available");
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
    console.error("[delivery-addresses] Auth verification error:", error);
  }

  return null;
}

/**
 * GET /api/delivery-addresses - Get all delivery addresses for user
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

    const addresses = await (prisma as any).deliveryAddress.findMany({
      where: { userId },
      orderBy: [
        { isDefault: "desc" }, // Default address first
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(addresses.map((addr: any) => ({
      ...addr,
      createdAt: addr.createdAt?.toISOString(),
      updatedAt: addr.updatedAt?.toISOString(),
    })));
  } catch (error: any) {
    return await handleApiError(
      error,
      "delivery-addresses/GET",
      "Unable to fetch delivery addresses. Please try again later.",
      503
    );
  }
}

/**
 * POST /api/delivery-addresses - Create a new delivery address
 */
export async function POST(request: NextRequest) {
  const response = NextResponse.next();
  
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 10, windowMs: 60000 },
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
      label,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postcode,
      country,
      isDefault,
    } = body;

    // Validation
    if (!label || !fullName || !addressLine1 || !city || !postcode || !country) {
      return NextResponse.json(
        { error: "Label, full name, address line 1, city, postcode, and country are required." },
        { status: 400 }
      );
    }

    // Validate and sanitize
    const labelValidation = validateText(label, 50, true);
    if (!labelValidation.valid) {
      return NextResponse.json(
        { error: labelValidation.error || "Invalid label." },
        { status: 400 }
      );
    }

    const nameValidation = validateText(fullName, 100, true);
    if (!nameValidation.valid) {
      return NextResponse.json(
        { error: nameValidation.error || "Invalid name." },
        { status: 400 }
      );
    }

    if (phone && !isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number format." },
        { status: 400 }
      );
    }

    const addr1Validation = validateText(addressLine1, 200, true);
    if (!addr1Validation.valid) {
      return NextResponse.json(
        { error: addr1Validation.error || "Invalid address." },
        { status: 400 }
      );
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await (prisma as any).deliveryAddress.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await (prisma as any).deliveryAddress.create({
      data: {
        userId,
        label: sanitizeInput(labelValidation.sanitized),
        fullName: sanitizeInput(nameValidation.sanitized),
        phone: phone ? sanitizeInput(phone) : null,
        addressLine1: sanitizeInput(addr1Validation.sanitized),
        addressLine2: addressLine2 ? sanitizeInput(validateText(addressLine2, 200, false).sanitized) : null,
        city: sanitizeInput(validateText(city, 100, true).sanitized),
        state: state ? sanitizeInput(validateText(state, 100, false).sanitized) : null,
        postcode: sanitizeInput(validateText(postcode, 20, true).sanitized),
        country: sanitizeInput(country.toUpperCase()),
        isDefault: Boolean(isDefault),
      },
    });

    return NextResponse.json({
      ...address,
      createdAt: address.createdAt?.toISOString(),
      updatedAt: address.updatedAt?.toISOString(),
    }, { status: 201 });
  } catch (error: any) {
    return await handleApiError(
      error,
      "delivery-addresses/POST",
      "Unable to create delivery address. Please try again later.",
      503
    );
  }
}

