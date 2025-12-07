import crypto from "crypto";

/**
 * Generate Gravatar URL from email address
 * Uses MD5 hash of email (server-side only)
 * @param email - User's email address
 * @param size - Image size in pixels (default: 200)
 * @returns Gravatar URL
 */
export function getGravatarUrl(email: string, size: number = 200): string {
  // Trim and lowercase email
  const trimmedEmail = email.trim().toLowerCase();
  
  // Create MD5 hash of email
  const hash = crypto.createHash("md5").update(trimmedEmail).digest("hex");
  
  // Return Gravatar URL
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon&r=pg`;
}

/**
 * Get profile picture URL - uses Gravatar by default
 * Can be extended to support custom profile pictures later
 */
export function getProfilePictureUrl(email: string, size: number = 200): string {
  return getGravatarUrl(email, size);
}

