export const MAX_BRAND_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB
export const ALLOWED_BRAND_IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGES_PER_PRODUCT = 8;

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
