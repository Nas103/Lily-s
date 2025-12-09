/**
 * Currency conversion utilities
 * Converts prices based on user's country
 */

// Exchange rates (base: ZAR - South African Rand)
// In production, fetch from a currency API like exchangerate-api.com or fixer.io
const EXCHANGE_RATES: Record<string, number> = {
  ZA: 1.0, // South African Rand (base)
  US: 0.055, // USD
  GB: 0.043, // GBP
  CA: 0.075, // CAD
  AU: 0.083, // AUD
  NG: 45.0, // NGN
  KE: 7.5, // KES
  GH: 0.75, // GHS
  EUR: 0.051, // EUR
};

// Currency symbols
const CURRENCY_SYMBOLS: Record<string, string> = {
  ZA: "R",
  US: "$",
  GB: "£",
  CA: "C$",
  AU: "A$",
  NG: "₦",
  KE: "KSh",
  GH: "GH₵",
  EUR: "€",
};

// Currency codes
const CURRENCY_CODES: Record<string, string> = {
  ZA: "ZAR",
  US: "USD",
  GB: "GBP",
  CA: "CAD",
  AU: "AUD",
  NG: "NGN",
  KE: "KES",
  GH: "GHS",
  EUR: "EUR",
};

/**
 * Get user's currency based on their country
 */
export function getUserCurrency(country?: string | null): {
  code: string;
  symbol: string;
  rate: number;
} {
  const countryCode = (country || "ZA").toUpperCase();
  
  return {
    code: CURRENCY_CODES[countryCode] || "ZAR",
    symbol: CURRENCY_SYMBOLS[countryCode] || "R",
    rate: EXCHANGE_RATES[countryCode] || 1.0,
  };
}

/**
 * Convert price from ZAR to user's currency
 */
export function convertPrice(
  priceInZAR: number,
  country?: string | null
): {
  amount: number;
  currency: string;
  symbol: string;
  formatted: string;
} {
  const currency = getUserCurrency(country);
  const convertedAmount = priceInZAR * currency.rate;

  return {
    amount: convertedAmount,
    currency: currency.code,
    symbol: currency.symbol,
    formatted: formatPrice(convertedAmount, currency.symbol),
  };
}

/**
 * Format price with currency symbol
 */
export function formatPrice(amount: number, symbol: string): string {
  // Round to 2 decimal places
  const rounded = Math.round(amount * 100) / 100;
  
  // Format based on currency
  if (symbol === "R" || symbol === "₦" || symbol === "KSh" || symbol === "GH₵") {
    // No decimal places for some currencies
    return `${symbol}${Math.round(rounded).toLocaleString()}`;
  }
  
  // Format with 2 decimal places
  return `${symbol}${rounded.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Get currency info for display
 */
export function getCurrencyInfo(country?: string | null) {
  const currency = getUserCurrency(country);
  return {
    code: currency.code,
    symbol: currency.symbol,
    rate: currency.rate,
    name: getCurrencyName(currency.code),
  };
}

/**
 * Get currency name
 */
function getCurrencyName(code: string): string {
  const names: Record<string, string> = {
    ZAR: "South African Rand",
    USD: "US Dollar",
    GBP: "British Pound",
    CAD: "Canadian Dollar",
    AUD: "Australian Dollar",
    NGN: "Nigerian Naira",
    KES: "Kenyan Shilling",
    GHS: "Ghanaian Cedi",
    EUR: "Euro",
  };
  return names[code] || "South African Rand";
}

