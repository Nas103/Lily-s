import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isValidEmail, sanitizeInput, validateText } from "@/lib/security";
import { applySecurityMiddleware } from "@/lib/middleware";
import { handleApiError, getSafeErrorMessage } from "@/lib/errorHandler";

export async function POST(request: NextRequest) {
  const response = NextResponse.next();
  
  // Apply security middleware - reasonable rate limiting for registration
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 5, windowMs: 3600000 }, // 5 registrations per hour (allows legitimate users)
    csrf: true,
    securityHeaders: true,
  });
  
  if (securityResponse) {
    return securityResponse;
  }
  if (!prisma) {
    console.error("[auth/register] Prisma client is not available");
    return NextResponse.json(
      { error: "Service temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    let { email, password, name } = body as {
      email?: string;
      password?: string;
      name?: string;
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

    // Validate password strength
    if (password.length < 8 || password.length > 128) {
      return NextResponse.json(
        { error: "Password must be between 8 and 128 characters." },
        { status: 400 }
      );
    }

    // Validate and sanitize name
    if (name) {
      const nameValidation = validateText(name, 100, false);
      if (!nameValidation.valid) {
        return NextResponse.json(
          { error: nameValidation.error || "Invalid name format." },
          { status: 400 }
        );
      }
      name = nameValidation.sanitized || undefined;
    }

    let existing;
    try {
      existing = await (prisma as any).user.findUnique({
        where: { email },
      });
    } catch (dbError: any) {
      // Database connection error - return user-friendly message
      return NextResponse.json(
        { error: getSafeErrorMessage(dbError, "Unable to create account. Please try again later.") },
        { status: 503 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists. Please sign in instead." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const adminEmail = process.env.ADMIN_EMAIL;

    let user;
    try {
      user = await (prisma as any).user.create({
        data: {
          email,
          name,
          passwordHash,
          role: adminEmail && email === adminEmail ? "ADMIN" : "USER",
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });
    } catch (dbError: any) {
      // Handle duplicate email error specifically
      if (dbError?.code === "P2002") {
        return NextResponse.json(
          { error: "A user with this email already exists. Please sign in instead." },
          { status: 409 }
        );
      }
      // Other database errors
      return NextResponse.json(
        { error: getSafeErrorMessage(dbError, "Unable to create account. Please try again later.") },
        { status: 503 }
      );
    }

    return NextResponse.json({
      ...user,
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
    }, { status: 201 });
  } catch (error: any) {
    return await handleApiError(
      error,
      "auth/register",
      "Unable to create account. Please try again later.",
      503
    );
  }
}


