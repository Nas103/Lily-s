/**
 * Currency conversion utilities
 * Base currency: USD (US Dollar)
 * Converts prices from USD to user's country currency only when country is set
 * Uses real-time exchange rates from forex API
 */

// Fallback exchange rates (base: USD - US Dollar)
// These are used if the API is unavailable
// Format: 1 USD = X target currency
const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0, // US Dollar (base)
  ZAR: 18.5, // 1 USD = 18.5 ZAR
  GBP: 0.79, // 1 USD = 0.79 GBP
  EUR: 0.92, // 1 USD = 0.92 EUR
  CAD: 1.36, // 1 USD = 1.36 CAD
  AUD: 1.52, // 1 USD = 1.52 AUD
  NGN: 1500.0, // 1 USD = 1500 NGN
  KES: 130.0, // 1 USD = 130 KES
  GHS: 13.5, // 1 USD = 13.5 GHS
  AED: 3.67, // 1 USD = 3.67 AED (UAE Dirham)
  KWD: 0.31, // 1 USD = 0.31 KWD (Kuwaiti Dinar)
  XAF: 600.0, // 1 USD = 600 XAF (Central African CFA Franc - Cameroon)
  SAR: 3.75, // 1 USD = 3.75 SAR (Saudi Riyal)
  INR: 83.0, // 1 USD = 83 INR (Indian Rupee)
  CNY: 7.2, // 1 USD = 7.2 CNY (Chinese Yuan)
  JPY: 150.0, // 1 USD = 150 JPY (Japanese Yen)
};

// Cache for exchange rates
let exchangeRatesCache: {
  rates: Record<string, number>;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 3600 * 1000; // 1 hour

// Country to Currency Code mapping (ISO 3166-1 alpha-2 to ISO 4217)
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  // Americas
  US: "USD",
  CA: "CAD",
  MX: "MXN",
  BR: "BRL",
  AR: "ARS",
  
  // Europe
  GB: "GBP",
  FR: "EUR",
  DE: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
  BE: "EUR",
  PT: "EUR",
  IE: "EUR",
  AT: "EUR",
  GR: "EUR",
  FI: "EUR",
  PL: "PLN",
  SE: "SEK",
  NO: "NOK",
  DK: "DKK",
  CH: "CHF",
  
  // Middle East
  AE: "AED", // UAE
  SA: "SAR", // Saudi Arabia
  KW: "KWD", // Kuwait
  QA: "QAR", // Qatar
  BH: "BHD", // Bahrain
  OM: "OMR", // Oman
  JO: "JOD", // Jordan
  IL: "ILS", // Israel
  TR: "TRY", // Turkey
  
  // Africa
  ZA: "ZAR", // South Africa
  NG: "NGN", // Nigeria
  KE: "KES", // Kenya
  GH: "GHS", // Ghana
  EG: "EGP", // Egypt
  MA: "MAD", // Morocco
  CM: "XAF", // Cameroon
  SN: "XOF", // Senegal
  CI: "XOF", // Côte d'Ivoire
  TZ: "TZS", // Tanzania
  UG: "UGX", // Uganda
  ET: "ETB", // Ethiopia
  
  // Asia
  IN: "INR", // India
  CN: "CNY", // China
  JP: "JPY", // Japan
  KR: "KRW", // South Korea
  SG: "SGD", // Singapore
  MY: "MYR", // Malaysia
  TH: "THB", // Thailand
  ID: "IDR", // Indonesia
  PH: "PHP", // Philippines
  VN: "VND", // Vietnam
  PK: "PKR", // Pakistan
  BD: "BDT", // Bangladesh
  
  // Oceania
  AU: "AUD", // Australia
  NZ: "NZD", // New Zealand
};

// Currency symbols
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  ZAR: "R",
  GBP: "£",
  EUR: "€",
  CAD: "C$",
  AUD: "A$",
  NGN: "₦",
  KES: "KSh",
  GHS: "GH₵",
  AED: "د.إ",
  KWD: "د.ك",
  XAF: "FCFA",
  SAR: "﷼",
  INR: "₹",
  CNY: "¥",
  JPY: "¥",
  MXN: "$",
  BRL: "R$",
  ARS: "$",
  PLN: "zł",
  SEK: "kr",
  NOK: "kr",
  DKK: "kr",
  CHF: "CHF",
  QAR: "﷼",
  BHD: ".د.ب",
  OMR: "﷼",
  JOD: "د.ا",
  ILS: "₪",
  TRY: "₺",
  EGP: "£",
  MAD: "د.م.",
  XOF: "CFA",
  TZS: "TSh",
  UGX: "USh",
  ETB: "Br",
  KRW: "₩",
  SGD: "S$",
  MYR: "RM",
  THB: "฿",
  IDR: "Rp",
  PHP: "₱",
  VND: "₫",
  PKR: "₨",
  BDT: "৳",
  NZD: "NZ$",
};

/**
 * Get currency code from country code
 */
function getCurrencyCode(countryCode: string): string {
  return COUNTRY_TO_CURRENCY[countryCode.toUpperCase()] || "USD";
}

/**
 * Fetch exchange rates from API
 */
async function fetchExchangeRates(): Promise<Record<string, number>> {
  // Check cache first
  if (exchangeRatesCache && Date.now() - exchangeRatesCache.timestamp < CACHE_DURATION) {
    return exchangeRatesCache.rates;
  }

  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const currencyUrl = `${baseUrl}/api/currency`;
    
    const response = await fetch(currencyUrl, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (response.ok) {
      const data = await response.json();
      const rates = data.rates || {};

      // Cache the rates
      exchangeRatesCache = {
        rates,
        timestamp: Date.now(),
      };

      return rates;
    }
  } catch (error) {
    console.warn("[currency] Failed to fetch exchange rates, using fallback:", error);
  }

  // Return fallback rates
  return FALLBACK_RATES;
}

/**
 * Get exchange rate for a currency code
 * Returns: 1 target currency = X USD
 */
async function getExchangeRate(currencyCode: string): Promise<number> {
  const rates = await fetchExchangeRates();
  
  // If currency is USD, return 1.0
  if (currencyCode === "USD") {
    return 1.0;
  }

  // API returns: 1 USD = X target currency (e.g., 1 USD = 18.5 ZAR)
  // We need: 1 target currency = 1/X USD
  const rateFromUSD = rates[currencyCode];
  
  if (!rateFromUSD || rateFromUSD === 0) {
    // If rate not found, try fallback
    const fallbackRate = FALLBACK_RATES[currencyCode];
    if (fallbackRate && fallbackRate !== 0) {
      // Fallback rates are also: 1 USD = X target currency
      return 1 / fallbackRate;
    }
    return 1.0; // Default to 1:1 if unknown
  }

  // API returns: 1 USD = X target currency
  // We need: 1 target currency = 1/X USD
  return 1 / rateFromUSD;
}

/**
 * Get user's currency based on their country
 * Returns USD if no country is set
 */
export async function getUserCurrency(country?: string | null): Promise<{
  code: string;
  symbol: string;
  rate: number;
}> {
  // If no country, default to USD
  if (!country) {
    return {
      code: "USD",
      symbol: "$",
      rate: 1.0,
    };
  }

  const countryCode = country.toUpperCase();
  const currencyCode = getCurrencyCode(countryCode);
  const rate = await getExchangeRate(currencyCode);
  
  return {
    code: currencyCode,
    symbol: CURRENCY_SYMBOLS[currencyCode] || "$",
    rate,
  };
}

/**
 * Get user's currency synchronously (uses cached rates or fallback)
 * Returns USD if no country is set
 */
export function getUserCurrencySync(country?: string | null): {
  code: string;
  symbol: string;
  rate: number;
} {
  // If no country, default to USD
  if (!country) {
    return {
      code: "USD",
      symbol: "$",
      rate: 1.0,
    };
  }

  const countryCode = country.toUpperCase();
  const currencyCode = getCurrencyCode(countryCode);
  
  // Use cached rates if available, otherwise fallback
  let rate = 1.0;
  if (currencyCode !== "USD") {
    if (exchangeRatesCache) {
      const rateFromUSD = exchangeRatesCache.rates[currencyCode];
      if (rateFromUSD && rateFromUSD !== 0) {
        rate = 1 / rateFromUSD;
      } else {
        const fallbackRate = FALLBACK_RATES[currencyCode];
        rate = fallbackRate ? 1 / fallbackRate : 1.0;
      }
    } else {
      const fallbackRate = FALLBACK_RATES[currencyCode];
      rate = fallbackRate ? 1 / fallbackRate : 1.0;
    }
  }
  
  return {
    code: currencyCode,
    symbol: CURRENCY_SYMBOLS[currencyCode] || "$",
    rate,
  };
}

/**
 * Convert price from USD to user's currency (async - uses real-time rates)
 * If no country is set, returns price in USD
 */
export async function convertPrice(
  priceInUSD: number,
  country?: string | null
): Promise<{
  amount: number;
  currency: string;
  symbol: string;
  formatted: string;
}> {
  const currency = await getUserCurrency(country);
  // currency.rate is: 1 target currency = X USD
  // So: priceInUSD / rate = price in target currency
  const convertedAmount = priceInUSD / currency.rate;

  return {
    amount: convertedAmount,
    currency: currency.code,
    symbol: currency.symbol,
    formatted: formatPrice(convertedAmount, currency.symbol),
  };
}

/**
 * Convert price from USD to user's currency (sync - uses cached/fallback rates)
 * If no country is set, returns price in USD
 */
export function convertPriceSync(
  priceInUSD: number,
  country?: string | null
): {
  amount: number;
  currency: string;
  symbol: string;
  formatted: string;
} {
  const currency = getUserCurrencySync(country);
  // currency.rate is: 1 target currency = X USD
  // So: priceInUSD / rate = price in target currency
  const convertedAmount = priceInUSD / currency.rate;

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
  if (symbol === "R" || symbol === "₦" || symbol === "KSh" || symbol === "GH₵" || 
      symbol === "FCFA" || symbol === "CFA" || symbol === "TSh" || symbol === "USh" ||
      symbol === "Br" || symbol === "Rp" || symbol === "₫" || symbol === "₨" || 
      symbol === "৳" || symbol === "¥" || symbol === "₩") {
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
 * Get currency info for display (async)
 */
export async function getCurrencyInfo(country?: string | null) {
  const currency = await getUserCurrency(country);
  return {
    code: currency.code,
    symbol: currency.symbol,
    rate: currency.rate,
    name: getCurrencyName(currency.code),
  };
}

/**
 * Get currency info for display (sync)
 */
export function getCurrencyInfoSync(country?: string | null) {
  const currency = getUserCurrencySync(country);
  return {
    code: currency.code,
    symbol: currency.symbol,
    rate: currency.rate,
    name: getCurrencyName(currency.code),
  };
}

/**
 * Initialize exchange rates cache (call this on app load)
 */
export async function initializeExchangeRates(): Promise<void> {
  try {
    await fetchExchangeRates();
  } catch (error) {
    console.warn("[currency] Failed to initialize exchange rates:", error);
  }
}

/**
 * Get currency name
 */
function getCurrencyName(code: string): string {
  const names: Record<string, string> = {
    USD: "US Dollar",
    ZAR: "South African Rand",
    GBP: "British Pound",
    EUR: "Euro",
    CAD: "Canadian Dollar",
    AUD: "Australian Dollar",
    NGN: "Nigerian Naira",
    KES: "Kenyan Shilling",
    GHS: "Ghanaian Cedi",
    AED: "UAE Dirham",
    KWD: "Kuwaiti Dinar",
    XAF: "Central African CFA Franc",
    SAR: "Saudi Riyal",
    INR: "Indian Rupee",
    CNY: "Chinese Yuan",
    JPY: "Japanese Yen",
  };
  return names[code] || "US Dollar";
}
