import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { handleApiError, getSafeErrorMessage } from "@/lib/errorHandler";

/**
 * PATCH /api/profile/password - Update user password
 */
export async function PATCH(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: "Service temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  try {
    const userId = request.headers.get("x-user-id");
    const userEmail = request.headers.get("x-user-email");

    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    // Get user with password hash and verify email
    let user;
    try {
      user = await (prisma as any).user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          passwordHash: true,
        },
      });
    } catch (dbError: any) {
      return NextResponse.json(
        { error: getSafeErrorMessage(dbError, "Unable to update password. Please try again later.") },
        { status: 503 }
      );
    }

    if (!user || user.email !== userEmail) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    
    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 401 }
      );
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // Update password
    try {
      await (prisma as any).user.update({
        where: { id: userId },
        data: {
          passwordHash: newPasswordHash,
        },
      });
    } catch (dbError: any) {
      return NextResponse.json(
        { error: getSafeErrorMessage(dbError, "Unable to update password. Please try again later.") },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return await handleApiError(
      error,
      "profile/password/PATCH",
      "Unable to update password. Please try again later.",
      503
    );
  }
}

