/**
 * Security middleware for API routes
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, cleanupRateLimitStore } from "./security";
import { AUTH_COOKIE_NAME } from "./auth";

/**
 * Get client IP address from request
 */
export function getClientIp(request: NextRequest): string {
  // Check various headers for IP (for proxies/load balancers)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  
  // Try to get IP from CF-Connecting-IP (Cloudflare) or other headers
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) {
    return cfIp;
  }
  
  return "unknown";
}

/**
 * Rate limiting middleware
 */
export function rateLimitMiddleware(
  request: NextRequest,
  maxRequests: number = 10,
  windowMs: number = 60000
): NextResponse | null {
  // Key strictly on the client IP: the previous key incorporated the
  // caller-supplied x-user-id header, which let an attacker rotate that header
  // to bypass the limiter entirely.
  const ip = getClientIp(request);
  const key = `${ip}:${request.nextUrl.pathname}`;
  
  // Clean up old records periodically
  if (Math.random() < 0.1) {
    cleanupRateLimitStore();
  }
  
  const rateLimit = checkRateLimit(key, maxRequests, windowMs);
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Too many requests. Please try again later.",
        retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
          "X-RateLimit-Limit": String(maxRequests),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
          "X-RateLimit-Reset": String(rateLimit.resetTime),
        },
      }
    );
  }
  
  return null; // Continue
}

/**
 * Extract the origin from a Referer/Referer-like URL. Returns null when the
 * value is missing or malformed.
 */
function originFromUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

/** True when the request carries the httpOnly session cookie (web auth). */
function hasSessionCookie(request: NextRequest): boolean {
  return Boolean(request.cookies.get(AUTH_COOKIE_NAME)?.value);
}

/** Origins that are trusted to make state-changing same-site requests. */
function isAllowedOrigin(origin: string, request: NextRequest): boolean {
  const allowed = new Set<string>();

  for (const candidate of [process.env.NEXT_PUBLIC_SITE_URL, process.env.APP_URL]) {
    const normalized = originFromUrl(candidate ?? null);
    if (normalized) allowed.add(normalized);
  }

  const extra = process.env.ALLOWED_ORIGINS;
  if (extra) {
    for (const entry of extra.split(",")) {
      const normalized = originFromUrl(entry.trim());
      if (normalized) allowed.add(normalized);
    }
  }

  const host = request.headers.get("host");
  if (host) {
    allowed.add(`https://${host}`);
    allowed.add(`http://${host}`);
  }

  if (allowed.has(origin)) return true;

  // Non-production convenience: allow loopback and private-LAN origins so the
  // web app can be exercised from another device / the mobile simulator.
  if (process.env.NODE_ENV !== "production") {
    const parsed = originFromUrl(origin);
    if (parsed) {
      const { hostname } = new URL(parsed);
      if (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.startsWith("192.168.") ||
        hostname.startsWith("10.") ||
        /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * CSRF protection middleware.
 *
 * CSRF is only exploitable against cookie-authenticated requests, because a
 * browser attaches the httpOnly session cookie automatically. Therefore:
 *   - Safe methods pass.
 *   - Bearer-token requests pass (native/mobile; a browser never attaches the
 *     Authorization header automatically, so these are not forgeable).
 *   - Cookie-authenticated requests MUST carry an Origin/Referer that matches
 *     this site; browsers always send it for state-changing requests.
 *   - Unauthenticated requests without an Origin (mobile login/register) pass,
 *     since there is no cookie for an attacker to ride.
 */
export function csrfMiddleware(request: NextRequest): NextResponse | null {
  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return null;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const source =
    originFromUrl(request.headers.get("origin")) ??
    originFromUrl(request.headers.get("referer"));

  const isCookieAuthenticated = hasSessionCookie(request);

  if (!source) {
    // A browser would have sent Origin for a cookie-authenticated write. A
    // missing Origin with a session cookie is treated as hostile.
    if (isCookieAuthenticated) {
      return NextResponse.json({ error: "Missing origin header" }, { status: 403 });
    }
    return null;
  }

  if (isCookieAuthenticated && !isAllowedOrigin(source, request)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  return null;
}

/**
 * Security headers middleware
 */
export function securityHeadersMiddleware(response: NextResponse): NextResponse {
  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https:; frame-src 'self' https://js.stripe.com https://checkout.stripe.com;"
  );
  
  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");
  
  // Frame options (prevent clickjacking)
  response.headers.set("X-Frame-Options", "DENY");
  
  // Force HTTPS for future requests
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  
  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Permissions policy
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=()"
  );
  
  return response;
}

/**
 * Build a trusted public origin for absolute asset URLs (image paths that must
 * be resolvable by the mobile app).
 *
 * The Host header is preferred because the dev server binds 0.0.0.0 so the
 * mobile device needs its LAN address (e.g. 192.168.x.x:3000), not localhost.
 * It is validated so a spoofed/malformed Host cannot poison generated URLs.
 * An explicitly configured PUBLIC_ASSET_ORIGIN always wins when set.
 */
const SAFE_HOST_RE = /^[A-Za-z0-9.\-]+(:\d{1,5})?$/;

export function getPublicOrigin(request: NextRequest): string {
  const configured = process.env.PUBLIC_ASSET_ORIGIN;
  if (configured) {
    const normalized = originFromUrl(configured);
    if (normalized) return normalized;
  }

  const host = request.headers.get("host");
  if (host && SAFE_HOST_RE.test(host)) {
    const forwardedProto = (request.headers.get("x-forwarded-proto") || "")
      .split(",")[0]
      .trim()
      .toLowerCase();
    const proto =
      forwardedProto === "http" || forwardedProto === "https"
        ? forwardedProto
        : request.nextUrl.protocol.replace(":", "");
    return `${proto}://${host}`;
  }

  return request.nextUrl.origin;
}

/**
 * Combined security middleware
 */
export function applySecurityMiddleware(
  request: NextRequest,
  response: NextResponse,
  options: {
    rateLimit?: { maxRequests?: number; windowMs?: number } | false;
    csrf?: boolean;
    securityHeaders?: boolean;
  } = {}
): NextResponse | null {
  // Rate limiting
  if (options.rateLimit !== false && options.rateLimit !== undefined) {
    const rateLimitConfig = options.rateLimit as { maxRequests?: number; windowMs?: number };
    const rateLimitResponse = rateLimitMiddleware(
      request,
      rateLimitConfig.maxRequests,
      rateLimitConfig.windowMs
    );
    if (rateLimitResponse) return rateLimitResponse;
  }
  
  // CSRF protection
  if (options.csrf !== false) {
    const csrfResponse = csrfMiddleware(request);
    if (csrfResponse) return csrfResponse;
  }
  
  // Security headers
  if (options.securityHeaders !== false) {
    securityHeadersMiddleware(response);
  }
  
  return null; // Continue
}

