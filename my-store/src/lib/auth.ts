import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export type AuthPayload = {
  userId: string;
  email: string;
  role?: "USER" | "ADMIN";
};

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "lily_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

function getJwtSecret(): Uint8Array {
  const secret =
    process.env.JWT_SECRET ||
    (process.env.NODE_ENV !== "production" ? "lily-dev-secret-change-me" : undefined);
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function signToken(payload: AuthPayload): Promise<string> {
  return new jose.SignJWT({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_MAX_AGE}s`)
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, getJwtSecret());
    return payload as unknown as AuthPayload;
  } catch {
    return null;
  }
}

export function getSessionToken(req: NextRequest): string | null {
  const cookieToken = req.cookies.get(COOKIE_NAME)?.value;
  if (cookieToken) return cookieToken;
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring("Bearer ".length);
  }
  return null;
}

export function setAuthCookie(res: NextResponse, token: string): NextResponse {
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}

export function clearAuthCookie(res: NextResponse): NextResponse {
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}

export async function createAuthResponse(
  data: Record<string, any>,
  payload: AuthPayload,
  status = 200
) {
  const token = await signToken(payload);
  // The token is returned in the body for native/mobile clients that cannot
  // persist httpOnly cookies, and also set as an httpOnly cookie for the web.
  const res = NextResponse.json({ ...data, token }, { status });
  return setAuthCookie(res, token);
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;