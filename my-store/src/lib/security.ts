/**
 * Security utilities for input validation, sanitization, and protection
 */

/**
 * Sanitize string input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";
  
  return input
    .replace(/[<>]/g, "") // Remove < and > to prevent script tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers like onclick=
    .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

/**
 * Validate phone number (basic validation)
 * Supports international format: +27 65944319, +1 234567890, etc.
 * When country code is present, leading 0 should be removed from the number
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== "string") return false;
  
  const normalized = phone.trim();
  
  // Check if it starts with + (international format)
  if (normalized.startsWith('+')) {
    // International format: +[country code] [number]
    // Remove the + and split by space
    const withoutPlus = normalized.substring(1).trim();
    const parts = withoutPlus.split(/\s+/);
    
    if (parts.length < 1) return false;
    
    // First part is country code
    const countryCode = parts[0];
    // Rest is the phone number
    const numberPart = parts.length > 1 ? parts.slice(1).join(' ') : '';
    
    // Validate country code (1-4 digits)
    if (!/^[0-9]{1,4}$/.test(countryCode)) return false;
    
    // If no number part provided, try to extract from first part
    let phoneDigits = '';
    if (numberPart) {
      // Get digits from number part
      phoneDigits = numberPart.replace(/\D/g, '');
    } else {
      // No space: try to split country code from number
      // Assume country code is 1-3 digits, rest is number
      const allDigits = withoutPlus.replace(/\D/g, '');
      if (allDigits.length < 7) return false;
      
      // Try common lengths: 1, 2, or 3 digit country codes
      for (let len = 1; len <= 3 && len < allDigits.length - 5; len++) {
        const possibleCode = allDigits.substring(0, len);
        const possibleNumber = allDigits.substring(len);
        
        if (possibleNumber.length >= 6 && possibleNumber.length <= 15 && !possibleNumber.startsWith('0')) {
          phoneDigits = possibleNumber;
          break;
        }
      }
      
      if (!phoneDigits) {
        // Fallback: use remaining digits after country code
        phoneDigits = allDigits.substring(countryCode.length);
      }
    }
    
    // Phone number should be 6-15 digits
    if (phoneDigits.length < 6 || phoneDigits.length > 15) return false;
    
    // Should not start with 0 when country code is present (leading 0 should be removed)
    if (phoneDigits.startsWith('0')) return false;
    
    return true;
  }
  
  // Local format: just digits, allow leading 0
  const digitsOnly = normalized.replace(/\D/g, '');
  if (digitsOnly.length < 6 || digitsOnly.length > 15) return false;
  
  return true;
}

/**
 * Validate and sanitize text input with length limits
 */
export function validateText(
  text: string | null | undefined,
  maxLength: number = 500,
  required: boolean = false
): { valid: boolean; sanitized: string; error?: string } {
  if (!text) {
    if (required) {
      return { valid: false, sanitized: "", error: "This field is required" };
    }
    return { valid: true, sanitized: "" };
  }

  if (typeof text !== "string") {
    return { valid: false, sanitized: "", error: "Invalid input type" };
  }

  if (text.length > maxLength) {
    return {
      valid: false,
      sanitized: "",
      error: `Input must be less than ${maxLength} characters`,
    };
  }

  const sanitized = sanitizeInput(text);
  return { valid: true, sanitized };
}

/**
 * Validate date of birth (must be in the past and reasonable age)
 */
export function isValidDateOfBirth(dateString: string): boolean {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const now = new Date();
  const minAge = new Date(now.getFullYear() - 120, now.getMonth(), now.getDate());
  const maxAge = new Date(now.getFullYear() - 13, now.getMonth(), now.getDate());

  return date instanceof Date && !isNaN(date.getTime()) && date <= maxAge && date >= minAge;
}

/**
 * Validate country code (ISO 3166-1 alpha-2)
 */
export function isValidCountryCode(country: string): boolean {
  if (!country || typeof country !== "string") return false;
  return /^[A-Z]{2}$/.test(country) && country.length === 2;
}

/**
 * Validate postcode (basic validation for common formats)
 */
export function isValidPostcode(postcode: string): boolean {
  if (!postcode || typeof postcode !== "string") return false;
  // Allow alphanumeric with spaces and hyphens
  const postcodeRegex = /^[A-Z0-9\s\-]{3,10}$/i;
  return postcodeRegex.test(postcode) && postcode.length <= 10;
}

/**
 * Validate URL (for profile images)
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    // Only allow http, https, and data URLs
    return ["http:", "https:", "data:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Rate limiting helper (simple in-memory store)
 * In production, use Redis or a proper rate limiting service
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    // Create new record
    const resetTime = now + windowMs;
    rateLimitStore.set(identifier, { count: 1, resetTime });
    return { allowed: true, remaining: maxRequests - 1, resetTime };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  rateLimitStore.set(identifier, record);
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Clean up old rate limit records (call periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Validate profile update data
 */
export function validateProfileUpdate(data: any): {
  valid: boolean;
  sanitized: any;
  errors: string[];
} {
  const errors: string[] = [];
  const sanitized: any = {};

  if (data.name !== undefined) {
    const nameValidation = validateText(data.name, 100, false);
    if (!nameValidation.valid) {
      errors.push(nameValidation.error || "Invalid name");
    } else {
      sanitized.name = nameValidation.sanitized || null;
    }
  }

  if (data.phone !== undefined) {
    if (data.phone && !isValidPhone(data.phone)) {
      errors.push("Invalid phone number format");
    } else {
      sanitized.phone = data.phone ? sanitizeInput(data.phone) : null;
    }
  }

  if (data.dateOfBirth !== undefined) {
    if (data.dateOfBirth && !isValidDateOfBirth(data.dateOfBirth)) {
      errors.push("Invalid date of birth");
    } else {
      sanitized.dateOfBirth = data.dateOfBirth || null;
    }
  }

  if (data.country !== undefined) {
    if (data.country && !isValidCountryCode(data.country)) {
      errors.push("Invalid country code");
    } else {
      sanitized.country = data.country ? data.country.toUpperCase() : null;
    }
  }

  if (data.city !== undefined) {
    const cityValidation = validateText(data.city, 100, false);
    if (!cityValidation.valid) {
      errors.push(cityValidation.error || "Invalid city");
    } else {
      sanitized.city = cityValidation.sanitized || null;
    }
  }

  if (data.postcode !== undefined) {
    if (data.postcode && !isValidPostcode(data.postcode)) {
      errors.push("Invalid postcode format");
    } else {
      sanitized.postcode = data.postcode ? sanitizeInput(data.postcode).toUpperCase() : null;
    }
  }

  if (data.addressLine1 !== undefined) {
    const addr1Validation = validateText(data.addressLine1, 200, false);
    if (!addr1Validation.valid) {
      errors.push(addr1Validation.error || "Invalid address");
    } else {
      sanitized.addressLine1 = addr1Validation.sanitized || null;
    }
  }

  if (data.addressLine2 !== undefined) {
    const addr2Validation = validateText(data.addressLine2, 200, false);
    if (!addr2Validation.valid) {
      errors.push(addr2Validation.error || "Invalid address");
    } else {
      sanitized.addressLine2 = addr2Validation.sanitized || null;
    }
  }

  if (data.profileImageUrl !== undefined) {
    if (data.profileImageUrl && !isValidUrl(data.profileImageUrl)) {
      errors.push("Invalid profile image URL");
    } else {
      sanitized.profileImageUrl = data.profileImageUrl ? sanitizeInput(data.profileImageUrl) : null;
    }
  }

  // Validate boolean fields
  if (data.locationSharing !== undefined) {
    sanitized.locationSharing = Boolean(data.locationSharing);
  }
  if (data.emailNotifications !== undefined) {
    sanitized.emailNotifications = Boolean(data.emailNotifications);
  }
  if (data.smsNotifications !== undefined) {
    sanitized.smsNotifications = Boolean(data.smsNotifications);
  }
  if (data.marketingEmails !== undefined) {
    sanitized.marketingEmails = Boolean(data.marketingEmails);
  }

  // Validate profile visibility
  if (data.profileVisibility !== undefined) {
    const validValues = ["PRIVATE", "SOCIAL", "PUBLIC"];
    if (data.profileVisibility && !validValues.includes(data.profileVisibility)) {
      errors.push("Invalid profile visibility setting");
    } else {
      sanitized.profileVisibility = data.profileVisibility || "PRIVATE";
    }
  }

  return {
    valid: errors.length === 0,
    sanitized,
    errors,
  };
}

