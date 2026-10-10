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
