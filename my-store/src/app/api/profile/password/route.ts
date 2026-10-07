import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { resolveUserId } from "@/lib/auth-middleware";
import { handleApiError, getSafeErrorMessage } from "@/lib/errorHandler";

const MIN_PASSWORD_LENGTH = 8;

/**
 * PATCH /api/profile/password - Update the authenticated user's password
 */
export async function PATCH(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: "Service temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  try {
    const userId = await resolveUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body ?? {};

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required." },
        { status: 400 }
      );
    }

    if (typeof newPassword !== "string" || newPassword.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters long.` },
        { status: 400 }
      );
    }

    if (newPassword === currentPassword) {
      return NextResponse.json(
        { error: "New password must be different from your current password." },
        { status: 400 }
      );
    }

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

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 401 }
      );
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);

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