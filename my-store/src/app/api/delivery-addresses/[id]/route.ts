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
    console.error("[delivery-addresses] Auth verification error:", error);
  }

  return null;
}

/**
 * PATCH /api/delivery-addresses/[id] - Update a delivery address
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const addressId = params.id;
    const body = await request.json();

    // Verify address belongs to user
    const existingAddress = await (prisma as any).deliveryAddress.findUnique({
      where: { id: addressId },
      select: { userId: true },
    });

    if (!existingAddress || existingAddress.userId !== userId) {
      return NextResponse.json(
        { error: "Address not found." },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: any = {};

    if (body.label !== undefined) {
      const labelValidation = validateText(body.label, 50, true);
      if (!labelValidation.valid) {
        return NextResponse.json(
          { error: labelValidation.error || "Invalid label." },
          { status: 400 }
        );
      }
      updateData.label = sanitizeInput(labelValidation.sanitized);
    }

    if (body.fullName !== undefined) {
      const nameValidation = validateText(body.fullName, 100, true);
      if (!nameValidation.valid) {
        return NextResponse.json(
          { error: nameValidation.error || "Invalid name." },
          { status: 400 }
        );
      }
      updateData.fullName = sanitizeInput(nameValidation.sanitized);
    }

    if (body.phone !== undefined) {
      if (body.phone && !isValidPhone(body.phone)) {
        return NextResponse.json(
          { error: "Invalid phone number format." },
          { status: 400 }
        );
      }
      updateData.phone = body.phone ? sanitizeInput(body.phone) : null;
    }

    if (body.addressLine1 !== undefined) {
      const addr1Validation = validateText(body.addressLine1, 200, true);
      if (!addr1Validation.valid) {
        return NextResponse.json(
          { error: addr1Validation.error || "Invalid address." },
          { status: 400 }
        );
      }
      updateData.addressLine1 = sanitizeInput(addr1Validation.sanitized);
    }

    if (body.addressLine2 !== undefined) {
      updateData.addressLine2 = body.addressLine2
        ? sanitizeInput(validateText(body.addressLine2, 200, false).sanitized)
        : null;
    }

    if (body.city !== undefined) {
      const cityValidation = validateText(body.city, 100, true);
      if (!cityValidation.valid) {
        return NextResponse.json(
          { error: cityValidation.error || "Invalid city." },
          { status: 400 }
        );
      }
      updateData.city = sanitizeInput(cityValidation.sanitized);
    }

    if (body.state !== undefined) {
      updateData.state = body.state
        ? sanitizeInput(validateText(body.state, 100, false).sanitized)
        : null;
    }

    if (body.postcode !== undefined) {
      const postcodeValidation = validateText(body.postcode, 20, true);
      if (!postcodeValidation.valid) {
        return NextResponse.json(
          { error: postcodeValidation.error || "Invalid postcode." },
          { status: 400 }
        );
      }
      updateData.postcode = sanitizeInput(postcodeValidation.sanitized);
    }

    if (body.country !== undefined) {
      updateData.country = sanitizeInput(body.country.toUpperCase());
    }

    // If setting as default, unset other defaults
    if (body.isDefault === true) {
      await (prisma as any).deliveryAddress.updateMany({
        where: { userId, isDefault: true, id: { not: addressId } },
        data: { isDefault: false },
      });
      updateData.isDefault = true;
    } else if (body.isDefault === false) {
      updateData.isDefault = false;
    }

    const updatedAddress = await (prisma as any).deliveryAddress.update({
      where: { id: addressId },
      data: updateData,
    });

    return NextResponse.json({
      ...updatedAddress,
      createdAt: updatedAddress.createdAt?.toISOString(),
      updatedAt: updatedAddress.updatedAt?.toISOString(),
    });
  } catch (error: any) {
    return await handleApiError(
      error,
      "delivery-addresses/PATCH",
      "Unable to update delivery address. Please try again later.",
      503
    );
  }
}

/**
 * DELETE /api/delivery-addresses/[id] - Delete a delivery address
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const addressId = params.id;

    // Verify address belongs to user
    const existingAddress = await (prisma as any).deliveryAddress.findUnique({
      where: { id: addressId },
      select: { userId: true },
    });

    if (!existingAddress || existingAddress.userId !== userId) {
      return NextResponse.json(
        { error: "Address not found." },
        { status: 404 }
      );
    }

    await (prisma as any).deliveryAddress.delete({
      where: { id: addressId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return await handleApiError(
      error,
      "delivery-addresses/DELETE",
      "Unable to delete delivery address. Please try again later.",
      503
    );
  }
}

