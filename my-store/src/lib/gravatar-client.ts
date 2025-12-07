/**
 * Client-side Gravatar utility
 * Uses API route to get Gravatar URL
 */
export async function getGravatarUrl(email: string, size: number = 200): Promise<string> {
  try {
    const response = await fetch(`/api/gravatar?email=${encodeURIComponent(email)}&size=${size}`);
    const data = await response.json();
    return data.url || `https://www.gravatar.com/avatar/00000000000000000000000000000000?s=${size}&d=identicon`;
  } catch (error) {
    // Fallback to default identicon
    return `https://www.gravatar.com/avatar/00000000000000000000000000000000?s=${size}&d=identicon`;
  }
}

/**
 * Generate Gravatar URL synchronously (uses hash of email)
 * This is a fallback that creates a consistent URL per email
 */
export function getGravatarUrlSync(email: string, size: number = 200): string {
  const trimmedEmail = email.trim().toLowerCase();
  
  // Create a simple hash from email (not real MD5, but consistent)
  let hash = 0;
  for (let i = 0; i < trimmedEmail.length; i++) {
    const char = trimmedEmail.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Convert to hex string (32 chars like MD5)
  const hashStr = Math.abs(hash).toString(16).padStart(8, "0").repeat(4).substring(0, 32);
  
  // Use the hash to create a consistent Gravatar-like URL
  // Note: This won't match real Gravatar, but will be consistent per email
  return `https://www.gravatar.com/avatar/${hashStr}?s=${size}&d=identicon&r=pg`;
}

