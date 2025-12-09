/**
 * Get user profile image URL
 * Returns custom profile image if available, otherwise falls back to Gravatar
 */

import { getGravatarUrlSync } from "./gravatar-client";

export function getProfileImageUrl(
  email: string,
  profileImageUrl: string | null | undefined,
  size: number = 100
): string {
  // Use custom profile image if available
  if (profileImageUrl && profileImageUrl.trim()) {
    return profileImageUrl;
  }
  
  // Fallback to Gravatar
  return getGravatarUrlSync(email, size);
}

