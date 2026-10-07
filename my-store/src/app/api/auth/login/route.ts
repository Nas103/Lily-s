import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isValidEmail, sanitizeInput } from "@/lib/security";
import { applySecurityMiddleware } from "@/lib/middleware";
import { handleApiError, getSafeErrorMessage } from "@/lib/errorHandler";
import { createAuthResponse } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const response = NextResponse.next();
  
  const isDev = process.env.NODE_ENV !== "production";
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: {
      maxRequests: isDev ? 50 : 5,
      windowMs: isDev ? 60000 : 900000,
    },
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

    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;
    const isEnvAdmin =
      Boolean(adminEmail && adminPassword) &&
      email === adminEmail &&
      password === adminPassword;

    let user = await (prisma as any).user.findUnique({
      where: { email },
    });

    if (!user && isEnvAdmin) {
      const passwordHash = await bcrypt.hash(password, 12);
      user = await (prisma as any).user.create({
        data: {
          email,
          passwordHash,
          role: "ADMIN",
          name: "Admin",
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    let ok = await bcrypt.compare(password, (user as any).passwordHash);

    if (!ok && isEnvAdmin) {
      const passwordHash = await bcrypt.hash(password, 12);
      user = await (prisma as any).user.update({
        where: { id: user.id },
        data: { passwordHash, role: "ADMIN" },
      });
      ok = true;
    }

    if (!ok) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    return await createAuthResponse(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: (user as any).role,
        createdAt: (user as any).createdAt?.toISOString() || new Date().toISOString(),
      },
      {
        userId: user.id,
        email: user.email,
        role: (user as any).role,
      }
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


