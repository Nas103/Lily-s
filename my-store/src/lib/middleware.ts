/**
 * Security middleware for API routes
 */

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, cleanupRateLimitStore } from "./security";

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
  const ip = getClientIp(request);
  const userId = request.headers.get("x-user-id") || ip;
  
  // Clean up old records periodically
  if (Math.random() < 0.1) {
    cleanupRateLimitStore();
  }
  
  const rateLimit = checkRateLimit(userId, maxRequests, windowMs);
  
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
 * CSRF protection middleware
 * For API routes, we verify the origin header
 */
export function csrfMiddleware(request: NextRequest): NextResponse | null {
  // Skip for GET requests
  if (request.method === "GET" || request.method === "HEAD") {
    return null;
  }
  
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");
  
  // In production, verify origin matches your domain
  if (process.env.NODE_ENV === "production") {
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_SITE_URL,
      `https://${host}`,
      `http://${host}`,
    ].filter(Boolean);
    
    if (origin && !allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      return NextResponse.json(
        { error: "Invalid origin" },
        { status: 403 }
      );
    }
  }
  
  return null; // Continue
}

/**
 * Security headers middleware
 */
export function securityHeadersMiddleware(response: NextResponse): NextResponse {
  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
  );
  
  // XSS Protection
  response.headers.set("X-XSS-Protection", "1; mode=block");
  
  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");
  
  // Frame options (prevent clickjacking)
  response.headers.set("X-Frame-Options", "DENY");
  
  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Permissions policy
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );
  
  return response;
}

/**
 * Combined security middleware
 */
export function applySecurityMiddleware(
  request: NextRequest,
  response: NextResponse,
  options: {
    rateLimit?: { maxRequests?: number; windowMs?: number };
    csrf?: boolean;
    securityHeaders?: boolean;
  } = {}
): NextResponse | null {
  // Rate limiting
  if (options.rateLimit !== false) {
    const rateLimitResponse = rateLimitMiddleware(
      request,
      options.rateLimit?.maxRequests,
      options.rateLimit?.windowMs
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

