import { NextRequest, NextResponse } from "next/server";
import { getSessionToken, verifyToken } from "@/lib/auth";

const PROTECTED_PREFIXES = ["/profile", "/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  if (!isProtected) {
    return NextResponse.next();
  }

  const token = getSessionToken(req);
  if (token) {
    const payload = await verifyToken(token);
    if (payload) {
      if (pathname === "/admin" || pathname.startsWith("/admin/")) {
        if (payload.role !== "ADMIN") {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }
      return NextResponse.next();
    }
  }

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/profile/:path*", "/admin/:path*"],
};