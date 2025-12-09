import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateProfileUpdate } from "@/lib/security";
import { applySecurityMiddleware } from "@/lib/middleware";
import { handleApiError, getSafeErrorMessage } from "@/lib/errorHandler";

/**
 * Verify user authentication from headers
 */
async function verifyUser(request: NextRequest): Promise<string | null> {
  const userId = request.headers.get("x-user-id");
  const userEmail = request.headers.get("x-user-email");

  if (!userId || !userEmail) {
    console.warn("[profile] Missing auth headers:", { hasUserId: !!userId, hasUserEmail: !!userEmail });
    return null;
  }

  if (!prisma) {
    console.error("[profile] Prisma client not available");
    return null;
  }

  try {
    const user = await (prisma as any).user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (user && user.email === userEmail) {
      return userId;
    } else {
      console.warn("[profile] User verification failed:", { 
        found: !!user, 
        emailMatch: user?.email === userEmail 
      });
    }
  } catch (error) {
    console.error("[profile] Auth verification error:", error);
  }

  return null;
}

/**
 * GET /api/profile - Get user profile
 */
export async function GET(request: NextRequest) {
  const response = NextResponse.next();
  
  // Apply security middleware
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 30, windowMs: 60000 }, // 30 requests per minute
    csrf: false, // GET requests don't need CSRF
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

    const user = await (prisma as any).user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        dateOfBirth: true,
        country: true,
        city: true,
        postcode: true,
        addressLine1: true,
        addressLine2: true,
        profileImageUrl: true,
        profileVisibility: true,
        locationSharing: true,
        emailNotifications: true,
        smsNotifications: true,
        marketingEmails: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...user,
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
      dateOfBirth: user.dateOfBirth?.toISOString(),
    });
  } catch (error: any) {
    return await handleApiError(
      error,
      "profile/GET",
      "Unable to load profile. Please try again later.",
      503
    );
  }
}

/**
 * PATCH /api/profile - Update user profile
 */
export async function PATCH(request: NextRequest) {
  const response = NextResponse.next();
  
  // Apply security middleware
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 10, windowMs: 60000 }, // 10 updates per minute
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
    
    // Validate and sanitize all input data
    const validation = validateProfileUpdate(body);
    
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    // Build update object with validated and sanitized data
    const updateData: any = {};
    
    if (validation.sanitized.name !== undefined) updateData.name = validation.sanitized.name;
    if (validation.sanitized.phone !== undefined) updateData.phone = validation.sanitized.phone;
    if (validation.sanitized.dateOfBirth !== undefined) {
      updateData.dateOfBirth = validation.sanitized.dateOfBirth 
        ? new Date(validation.sanitized.dateOfBirth) 
        : null;
    }
    if (validation.sanitized.country !== undefined) updateData.country = validation.sanitized.country;
    if (validation.sanitized.city !== undefined) updateData.city = validation.sanitized.city;
    if (validation.sanitized.postcode !== undefined) updateData.postcode = validation.sanitized.postcode;
    if (validation.sanitized.addressLine1 !== undefined) updateData.addressLine1 = validation.sanitized.addressLine1;
    if (validation.sanitized.addressLine2 !== undefined) updateData.addressLine2 = validation.sanitized.addressLine2;
    if (validation.sanitized.profileImageUrl !== undefined) updateData.profileImageUrl = validation.sanitized.profileImageUrl;
    if (validation.sanitized.profileVisibility !== undefined) updateData.profileVisibility = validation.sanitized.profileVisibility;
    if (validation.sanitized.locationSharing !== undefined) updateData.locationSharing = validation.sanitized.locationSharing;
    if (validation.sanitized.emailNotifications !== undefined) updateData.emailNotifications = validation.sanitized.emailNotifications;
    if (validation.sanitized.smsNotifications !== undefined) updateData.smsNotifications = validation.sanitized.smsNotifications;
    if (validation.sanitized.marketingEmails !== undefined) updateData.marketingEmails = validation.sanitized.marketingEmails;

    // Remove profileImageUrl from updateData if the column doesn't exist in database
    // This prevents errors when the schema hasn't been pushed yet
    const updateDataSafe = { ...updateData };
    
    // Try to update, but handle case where profileImageUrl column doesn't exist
    let updatedUser;
    try {
      updatedUser = await (prisma as any).user.update({
        where: { id: userId },
        data: updateDataSafe,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          dateOfBirth: true,
          country: true,
          city: true,
          postcode: true,
          addressLine1: true,
          addressLine2: true,
          profileImageUrl: true,
          profileVisibility: true,
          locationSharing: true,
          emailNotifications: true,
          smsNotifications: true,
          marketingEmails: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (updateError: any) {
      // If profileImageUrl column doesn't exist, retry without it
      if (updateError?.message?.includes("Unknown argument `profileImageUrl`")) {
        delete updateDataSafe.profileImageUrl;
        updatedUser = await (prisma as any).user.update({
          where: { id: userId },
          data: updateDataSafe,
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            phone: true,
            dateOfBirth: true,
            country: true,
            city: true,
            postcode: true,
            addressLine1: true,
            addressLine2: true,
            profileVisibility: true,
            locationSharing: true,
            emailNotifications: true,
            smsNotifications: true,
            marketingEmails: true,
            createdAt: true,
            updatedAt: true,
          },
        });
        // Add null for profileImageUrl since column doesn't exist
        updatedUser.profileImageUrl = null;
      } else {
        throw updateError;
      }
    }

    return NextResponse.json({
      ...updatedUser,
      createdAt: updatedUser.createdAt?.toISOString(),
      updatedAt: updatedUser.updatedAt?.toISOString(),
      dateOfBirth: updatedUser.dateOfBirth?.toISOString(),
    });
  } catch (error: any) {
    return await handleApiError(
      error,
      "profile/PATCH",
      "Unable to update profile. Please try again later.",
      503
    );
  }
}

