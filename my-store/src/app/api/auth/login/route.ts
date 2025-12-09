import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isValidEmail, sanitizeInput } from "@/lib/security";
import { applySecurityMiddleware } from "@/lib/middleware";
import { handleApiError, getSafeErrorMessage } from "@/lib/errorHandler";

export async function POST(request: NextRequest) {
  const response = NextResponse.next();
  
  // Apply security middleware - strict rate limiting for login
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 5, windowMs: 900000 }, // 5 attempts per 15 minutes
    csrf: true,
    securityHeaders: true,
  });
  
  if (securityResponse) {
    return securityResponse;
  }
  if (!prisma) {
    console.error("[auth/login] Prisma client is not available");
    return NextResponse.json(
      { error: "Service temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    let { email, password } = body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Validate and sanitize email
    email = sanitizeInput(email).toLowerCase();
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8 || password.length > 128) {
      return NextResponse.json(
        { error: "Password must be between 8 and 128 characters." },
        { status: 400 }
      );
    }

    // Use parameterized query (Prisma handles this, but we ensure email is sanitized)
    const user = await (prisma as any).user.findUnique({
      where: { email }, // Prisma uses parameterized queries - SQL injection protected
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(password, (user as any).passwordHash);

    if (!ok) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // For now we just return user info; sessions/tokens can be added later.
    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: (user as any).role,
        createdAt: (user as any).createdAt?.toISOString() || new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return await handleApiError(
      error,
      "auth/login",
      "Unable to sign in. Please try again later.",
      503
    );
  }
}


