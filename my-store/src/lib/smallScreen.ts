export const SMALL_SCREEN_QUERY = "(max-width: 440px)";

export function isSmallScreen(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(SMALL_SCREEN_QUERY).matches;
}