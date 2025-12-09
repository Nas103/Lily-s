/**
 * Payment security utilities
 * PCI DSS Compliance: Never store full card numbers or CVV
 */

/**
 * Mask card number - show only last 4 digits
 * Example: "1234567890123456" -> "**** **** **** 3456"
 */
export function maskCardNumber(cardNumber: string): string {
  if (!cardNumber || cardNumber.length < 4) {
    return "****";
  }
  
  const last4 = cardNumber.slice(-4);
  const masked = "*".repeat(Math.max(0, cardNumber.length - 4));
  
  // Format as XXXX XXXX XXXX XXXX
  if (cardNumber.length === 16) {
    return `**** **** **** ${last4}`;
  }
  
  return `${masked}${last4}`;
}

/**
 * Extract last 4 digits from card number
 */
export function getLast4Digits(cardNumber: string): string {
  if (!cardNumber || cardNumber.length < 4) {
    return "";
  }
  return cardNumber.slice(-4);
}

/**
 * Validate card number using Luhn algorithm
 */
export function isValidCardNumber(cardNumber: string): boolean {
  // Remove spaces and non-digits
  const cleaned = cardNumber.replace(/\D/g, "");
  
  // Check length (13-19 digits)
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

/**
 * Detect card brand from number
 */
export function detectCardBrand(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\D/g, "");
  
  if (/^4/.test(cleaned)) {
    return "Visa";
  } else if (/^5[1-5]/.test(cleaned)) {
    return "Mastercard";
  } else if (/^3[47]/.test(cleaned)) {
    return "American Express";
  } else if (/^6(?:011|5)/.test(cleaned)) {
    return "Discover";
  } else if (/^3[0689]/.test(cleaned)) {
    return "Diners Club";
  } else if (/^35/.test(cleaned)) {
    return "JCB";
  }
  
  return "Unknown";
}

/**
 * Validate expiry month (1-12)
 */
export function isValidExpiryMonth(month: number): boolean {
  return Number.isInteger(month) && month >= 1 && month <= 12;
}

/**
 * Validate expiry year (current year or future)
 */
export function isValidExpiryYear(year: number): boolean {
  const currentYear = new Date().getFullYear();
  return Number.isInteger(year) && year >= currentYear && year <= currentYear + 20;
}

/**
 * Validate CVV (3-4 digits)
 * Note: We never store CVV, only validate it
 */
export function isValidCVV(cvv: string, cardBrand?: string): boolean {
  if (!cvv) return false;
  
  const cleaned = cvv.replace(/\D/g, "");
  
  // American Express uses 4 digits, others use 3
  if (cardBrand === "American Express") {
    return cleaned.length === 4 && /^\d{4}$/.test(cleaned);
  }
  
  return cleaned.length === 3 && /^\d{3}$/.test(cleaned);
}

/**
 * Sanitize card number input (remove spaces, dashes)
 */
export function sanitizeCardNumber(cardNumber: string): string {
  return cardNumber.replace(/\D/g, "");
}

/**
 * Format card number with spaces (XXXX XXXX XXXX XXXX)
 */
export function formatCardNumber(cardNumber: string): string {
  const cleaned = sanitizeCardNumber(cardNumber);
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(" ") : cleaned;
}

/**
 * Validate cardholder name
 */
export function isValidCardholderName(name: string): boolean {
  if (!name || name.trim().length < 2) {
    return false;
  }
  
  // Allow letters, spaces, hyphens, apostrophes
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  return nameRegex.test(name) && name.length <= 50;
}

