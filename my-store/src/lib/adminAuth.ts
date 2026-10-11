import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, type AuthenticatedUser } from "@/lib/auth-middleware";
import { prisma } from "@/lib/prisma";

/**
 * Resolve the authenticated admin from any of the supported credential
 * sources, in order:
 *   1. Session cookie / bearer token (JWT `role: ADMIN` verified against DB)
 *   2. Legacy x-user-id + x-user-email headers (native builds)
 *   3. Legacy x-admin-email + x-admin-password headers matching env config
 */
export async function isAdminUser(req: NextRequest): Promise<AuthenticatedUser | null> {
  const sessionUser = await getCurrentUser(req);
  if (sessionUser?.role === "ADMIN") return sessionUser;

  const userId = req.headers.get("x-user-id");
  const userEmail = req.headers.get("x-user-email");
  if (userId && userEmail && prisma) {
    try {
      const user = await (prisma as any).user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, role: true, name: true },
      });
      if (user && user.email === userEmail && user.role === "ADMIN") {
        return user as AuthenticatedUser;
      }
    } catch {
      // fall through to legacy header auth
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const headerEmail = req.headers.get("x-admin-email");
    const headerPassword = req.headers.get("x-admin-password");
    if (headerEmail === adminEmail && headerPassword === adminPassword) {
      return { id: "admin", email: adminEmail, role: "ADMIN", name: "Admin" };
    }
  }

  return null;
}

export async function requireAdminUser(
  req: NextRequest
): Promise<AuthenticatedUser | NextResponse> {
  const admin = await isAdminUser(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return admin;
}