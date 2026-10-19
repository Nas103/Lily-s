import { NextRequest, NextResponse } from "next/server";
import { getSessionToken, verifyToken } from "./auth";
import { prisma } from "./prisma";

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: "USER" | "ADMIN" | "BRAND";
  name?: string | null;
};

export async function getCurrentUser(req: NextRequest): Promise<AuthenticatedUser | null> {
  const token = getSessionToken(req);
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;
  if (!prisma) return null;
  try {
    const user = await (prisma as any).user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, name: true },
    });
    if (!user) return null;
    return user as AuthenticatedUser;
  } catch {
    return null;
  }
}

/**
 * Resolve the authenticated user id from a verified session cookie or bearer
 * token. Identity is NEVER derived from caller-supplied headers such as
 * x-user-id / x-user-email: those are unauthenticated and trivially spoofed.
 */
export async function resolveUserId(req: NextRequest): Promise<string | null> {
  const sessionUser = await getCurrentUser(req);
  return sessionUser ? sessionUser.id : null;
}

export async function requireAuth(
  req: NextRequest
): Promise<{ user: AuthenticatedUser } | NextResponse> {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return { user };
}

export async function requireAdmin(
  req: NextRequest
): Promise<{ user: AuthenticatedUser } | NextResponse> {
  const result = await requireAuth(req);
  if (result instanceof NextResponse) return result;
  if (result.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return result;
}

/**
 * Brand accounts (and admins) only. Brand-level "is this account attached to
 * an approved Brand row?" lives in brandAuth.ts (requireApprovedBrand) so this
 * helper stays a pure role gate usable at the edge-unaware route layer.
 */
export async function requireBrand(
  req: NextRequest
): Promise<{ user: AuthenticatedUser } | NextResponse> {
  const result = await requireAuth(req);
  if (result instanceof NextResponse) return result;
  if (result.user.role !== "BRAND" && result.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return result;
}