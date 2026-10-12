/**
 * Lightweight country -> currency mapping for the mobile app.
 * Mirrors the web app's `src/lib/currency.ts` so both platforms resolve
 * the same currency code/symbol for a given country.
 */

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  // Americas
  US: 'USD',
  CA: 'CAD',
  MX: 'MXN',
  BR: 'BRL',
  AR: 'ARS',
  // Europe
  GB: 'GBP',
  FR: 'EUR',
  DE: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  PT: 'EUR',
  IE: 'EUR',
  AT: 'EUR',
  GR: 'EUR',
  FI: 'EUR',
  PL: 'PLN',
  SE: 'SEK',
  NO: 'NOK',
  DK: 'DKK',
  CH: 'CHF',
  // Middle East
  AE: 'AED',
  SA: 'SAR',
  KW: 'KWD',
  QA: 'QAR',
  BH: 'BHD',
  OM: 'OMR',
  JO: 'JOD',
  IL: 'ILS',
  TR: 'TRY',
  // Africa
  ZA: 'ZAR',
  NG: 'NGN',
  KE: 'KES',
  GH: 'GHS',
  EG: 'EGP',
  MA: 'MAD',
  CM: 'XAF',
  SN: 'XOF',
  CI: 'XOF',
  TZ: 'TZS',
  UG: 'UGX',
  ET: 'ETB',
  // Asia
  IN: 'INR',
  CN: 'CNY',
  JP: 'JPY',
  KR: 'KRW',
  SG: 'SGD',
  MY: 'MYR',
  TH: 'THB',
  ID: 'IDR',
  PH: 'PHP',
  VN: 'VND',
  PK: 'PKR',
  BD: 'BDT',
  // Oceania
  AU: 'AUD',
  NZ: 'NZD',
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  ZAR: 'R',
  GBP: '£',
  EUR: '€',
  CAD: 'C$',
  AUD: 'A$',
  NGN: '₦',
  KES: 'KSh',
  GHS: 'GH₵',
  AED: 'د.إ',
  KWD: 'د.ك',
  XAF: 'FCFA',
  SAR: '﷼',
  INR: '₹',
  CNY: '¥',
  JPY: '¥',
  MXN: '$',
  BRL: 'R$',
  ARS: '$',
  PLN: 'zł',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  CHF: 'CHF',
  QAR: '﷼',
  BHD: '.د.ب',
  OMR: '﷼',
  JOD: 'د.ا',
  ILS: '₪',
  TRY: '₺',
  EGP: '£',
  MAD: 'د.م.',
  XOF: 'CFA',
  TZS: 'TSh',
  UGX: 'USh',
  ETB: 'Br',
  KRW: '₩',
  SGD: 'S$',
  MYR: 'RM',
  THB: '฿',
  IDR: 'Rp',
  PHP: '₱',
  VND: '₫',
  PKR: '₨',
  BDT: '৳',
  NZD: 'NZ$',
};

export const DEFAULT_CURRENCY = 'USD';

// Fallback exchange rates (base: USD). Format: 1 USD = X target currency.
// Used until live rates are fetched from /api/currency, or if that call fails.
export const FALLBACK_RATES: Record<string, number> = {
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
  RUB: 90.0,
  UAH: 41.0,
  KZT: 470.0,
};

// Live rates (USD base) fetched from the backend, cached in memory.
let liveRates: Record<string, number> | null = null;

/** Store the latest USD-based exchange rates (from /api/currency). */
export function setExchangeRates(rates: Record<string, number> | null): void {
  liveRates = rates && Object.keys(rates).length ? rates : null;
}

/** Resolve 1 USD = X <code>, preferring live rates then fallback. */
export function getRateFromUSD(currencyCode?: string | null): number {
  const code = (currencyCode || DEFAULT_CURRENCY).toUpperCase();
  const rate = liveRates?.[code] ?? FALLBACK_RATES[code];
  return rate && rate > 0 ? rate : 1.0;
}

/**
 * Convert a USD base amount into the target currency.
 * Prices in the store are stored in USD; this is display-only.
 */
export function convertPriceSync(
  amountUSD: number,
  currencyCode?: string | null
): number {
  if (!Number.isFinite(amountUSD)) return 0;
  return amountUSD * getRateFromUSD(currencyCode);
}

export function formatCurrency(
  amountUSD: number,
  currencyCode?: string | null
): string {
  const code = (currencyCode || DEFAULT_CURRENCY).toUpperCase();
  const symbol = getCurrencySymbol(code);
  const value = convertPriceSync(amountUSD, code);
  // Currencies with large nominal values read better without decimals.
  const noDecimals = ['JPY', 'KRW', 'NGN', 'KES', 'XAF', 'XOF', 'VND', 'IDR'];
  const formatted = noDecimals.includes(code)
    ? Math.round(value).toLocaleString()
    : value.toFixed(2);
  return `${symbol}${formatted}`;
}

export type CurrencyInfo = {
  code: string;
  symbol: string;
};

export function getCurrencyCode(countryCode?: string | null): string {
  if (!countryCode) return DEFAULT_CURRENCY;
  return COUNTRY_TO_CURRENCY[countryCode.toUpperCase()] || DEFAULT_CURRENCY;
}

export function getCurrencySymbol(currencyCode?: string | null): string {
  if (!currencyCode) return CURRENCY_SYMBOLS[DEFAULT_CURRENCY];
  return CURRENCY_SYMBOLS[currencyCode.toUpperCase()] || currencyCode;
}

export function getCurrencyForCountry(countryCode?: string | null): CurrencyInfo {
  const code = getCurrencyCode(countryCode);
  return { code, symbol: getCurrencySymbol(code) };
}
