import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, type AuthenticatedUser } from "@/lib/auth-middleware";

/**
 * Resolve the authenticated admin from a verified session cookie or bearer
 * token only. Identity-bearing headers (x-user-id / x-user-email) and shared
 * env credentials (x-admin-email / x-admin-password) are deliberately NOT
 * trusted: they are caller-controlled and would allow trivial privilege
 * escalation to the admin surface.
 */
export async function isAdminUser(req: NextRequest): Promise<AuthenticatedUser | null> {
  const sessionUser = await getCurrentUser(req);
  return sessionUser?.role === "ADMIN" ? sessionUser : null;
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