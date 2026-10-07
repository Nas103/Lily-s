import { NextRequest, NextResponse } from "next/server";
import { getSessionToken, verifyToken } from "./auth";
import { prisma } from "./prisma";

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
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
 * Resolve the authenticated user id from a session cookie / bearer token,
 * falling back to the legacy x-user-id + x-user-email headers used by
 * older native builds.
 */
export async function resolveUserId(req: NextRequest): Promise<string | null> {
  const sessionUser = await getCurrentUser(req);
  if (sessionUser) return sessionUser.id;

  const userId = req.headers.get("x-user-id");
  const userEmail = req.headers.get("x-user-email");
  if (!userId || !userEmail || !prisma) return null;

  try {
    const user = await (prisma as any).user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });
    if (user && user.email === userEmail) return userId;
  } catch {
    // fall through
  }
  return null;
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