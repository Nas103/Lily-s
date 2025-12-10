import { NextRequest, NextResponse } from "next/server";
import { applySecurityMiddleware } from "@/lib/middleware";

// Cache exchange rates for 1 hour (3600 seconds)
const CACHE_DURATION = 3600 * 1000; // 1 hour in milliseconds
let cachedRates: {
  rates: Record<string, number>;
  timestamp: number;
} | null = null;

/**
 * GET /api/currency - Get exchange rates from USD to other currencies
 * Uses exchangerate-api.com (free tier, no API key required)
 */
export async function GET(request: NextRequest) {
  const response = NextResponse.next();
  
  // Apply security middleware
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 100, windowMs: 60000 },
    csrf: false,
    securityHeaders: true,
  });
  
  if (securityResponse) {
    return securityResponse;
  }

  try {
    // Check cache first
    if (cachedRates && Date.now() - cachedRates.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        base: "USD",
        rates: cachedRates.rates,
        cached: true,
      });
    }

    // Fetch from exchangerate-api.com
    // Free tier: 1,500 requests/month, no API key needed
    // Returns: { base: "USD", rates: { ZAR: 18.5, EUR: 0.92, ... } }
    // This means: 1 USD = 18.5 ZAR, 1 USD = 0.92 EUR, etc.
    const response = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD",
      {
        next: { revalidate: 3600 }, // Revalidate every hour
        headers: {
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Exchange rate API returned ${response.status}`);
    }

    const data = await response.json();

    // Cache the rates
    cachedRates = {
      rates: data.rates || {},
      timestamp: Date.now(),
    };

    return NextResponse.json({
      base: "USD",
      rates: data.rates || {},
      cached: false,
    });
  } catch (error: any) {
    console.error("[currency] Error fetching exchange rates:", error);

    // Fallback to cached rates if available, even if expired
    if (cachedRates) {
      return NextResponse.json({
        base: "USD",
        rates: cachedRates.rates,
        cached: true,
        warning: "Using cached rates due to API error",
      });
    }

    // Last resort: return fallback rates (approximate)
    const fallbackRates: Record<string, number> = {
      USD: 1.0,
      ZAR: 18.5,
      GBP: 0.79,
      EUR: 0.92,
      CAD: 1.36,
      AUD: 1.52,
      NGN: 1500.0,
      KES: 130.0,
      GHS: 13.5,
      AED: 3.67,
      KWD: 0.31,
      XAF: 600.0,
      SAR: 3.75,
      INR: 83.0,
      CNY: 7.2,
      JPY: 150.0,
    };

    return NextResponse.json({
      base: "USD",
      rates: fallbackRates,
      cached: false,
      warning: "Using fallback rates - API unavailable",
    });
  }
}
