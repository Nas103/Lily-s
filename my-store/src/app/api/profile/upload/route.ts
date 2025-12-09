import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateProfileUpdate, isValidUrl } from "@/lib/security";
import { applySecurityMiddleware } from "@/lib/middleware";

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
    console.error("[profile/upload] Auth verification error:", error);
  }

  return null;
}

/**
 * POST /api/profile/upload - Upload profile image
 * Accepts image URL (for now - can be extended to handle file uploads)
 */
export async function POST(request: NextRequest) {
  const response = NextResponse.next();
  
  // Apply security middleware
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 5, windowMs: 60000 }, // 5 uploads per minute
    csrf: true,
    securityHeaders: true,
  });
  
  if (securityResponse) {
    return securityResponse;
  }

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
    const { imageUrl } = body;

    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json(
        { error: "Image URL is required." },
        { status: 400 }
      );
    }

    // Validate URL
    if (!isValidUrl(imageUrl)) {
      return NextResponse.json(
        { error: "Invalid image URL format." },
        { status: 400 }
      );
    }

    // Update user profile image
    const updatedUser = await (prisma as any).user.update({
      where: { id: userId },
      data: { profileImageUrl: imageUrl },
      select: {
        id: true,
        email: true,
        profileImageUrl: true,
      },
    });

    return NextResponse.json({
      success: true,
      profileImageUrl: updatedUser.profileImageUrl,
    });
  } catch (error: any) {
    console.error("[profile/upload] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload profile image." },
      { status: 500 }
    );
  }
}

