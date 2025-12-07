import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Verify user authentication from headers
 */
async function verifyUser(request: Request): Promise<string | null> {
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
    console.error("[profile] Auth verification error:", error);
  }

  return null;
}

/**
 * GET /api/profile - Get user profile
 */
export async function GET(request: Request) {
  if (!prisma) {
    return NextResponse.json(
      { error: "Database is not configured." },
      { status: 500 }
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
    console.error("[profile/GET] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch profile." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/profile - Update user profile
 */
export async function PATCH(request: Request) {
  if (!prisma) {
    return NextResponse.json(
      { error: "Database is not configured." },
      { status: 500 }
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

    const body = await request.json();
    const {
      name,
      phone,
      dateOfBirth,
      country,
      city,
      postcode,
      addressLine1,
      addressLine2,
      profileVisibility,
      locationSharing,
      emailNotifications,
      smsNotifications,
      marketingEmails,
    } = body;

    // Build update object with only provided fields
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (dateOfBirth !== undefined) {
      updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    }
    if (country !== undefined) updateData.country = country;
    if (city !== undefined) updateData.city = city;
    if (postcode !== undefined) updateData.postcode = postcode;
    if (addressLine1 !== undefined) updateData.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) updateData.addressLine2 = addressLine2;
    if (profileVisibility !== undefined) updateData.profileVisibility = profileVisibility;
    if (locationSharing !== undefined) updateData.locationSharing = locationSharing;
    if (emailNotifications !== undefined) updateData.emailNotifications = emailNotifications;
    if (smsNotifications !== undefined) updateData.smsNotifications = smsNotifications;
    if (marketingEmails !== undefined) updateData.marketingEmails = marketingEmails;

    const updatedUser = await (prisma as any).user.update({
      where: { id: userId },
      data: updateData,
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

    return NextResponse.json({
      ...updatedUser,
      createdAt: updatedUser.createdAt?.toISOString(),
      updatedAt: updatedUser.updatedAt?.toISOString(),
      dateOfBirth: updatedUser.dateOfBirth?.toISOString(),
    });
  } catch (error: any) {
    console.error("[profile/PATCH] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}

