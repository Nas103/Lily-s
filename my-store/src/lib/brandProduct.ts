import { isValidUrl, validateText } from "./security";

export const PRODUCT_LIMITS = {
  name: 200,
  description: 5000,
  list: 60, // sizes/colors/tags
  listItem: 40,
  colorImages: 10,
  colorImagesPerKey: 6,
  maxPrice: 999999.99,
  maxDiscount: 95,
};

export type BrandProductInput = {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  categoryId?: string;
  highlight?: string | null;
  subCategory?: string | null;
  gender?: string | null;
  badge?: string | null;
  tags?: string[];
  sizes?: string[];
  colors?: string[];
  colorImages?: Record<string, string[]> | null;
  discountPercent?: number | null;
  status?: "DRAFT" | "ACTIVE";
};

export type ValidationResult =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; error: string };

function validateStringArray(
  value: unknown,
  label: string,
  maxItems: number,
  maxItemLength: number
): { ok: true; data: string[] } | { ok: false; error: string } {
  if (!Array.isArray(value)) {
    return { ok: false, error: `${label} must be an array.` };
  }
  if (value.length > maxItems) {
    return { ok: false, error: `${label} allows at most ${maxItems} entries.` };
  }
  const out: string[] = [];
  for (const raw of value) {
    if (typeof raw !== "string") {
      return { ok: false, error: `${label} entries must be text.` };
    }
    const item = raw.trim();
    if (!item) continue;
    if (item.length > maxItemLength) {
      return {
        ok: false,
        error: `${label} entries must be under ${maxItemLength} characters.`,
      };
    }
    out.push(item);
  }
  return { ok: true, data: Array.from(new Set(out)) };
}

function isImageSrc(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  return isValidUrl(value);
}

/**
 * Validate and normalise a brand-supplied product payload.
 * `partial: true` omits create-only requirements (name/price/image/category).
 * Never returns a slug or brandId — those are server-controlled.
 */
export function validateBrandProduct(
  body: Record<string, unknown>,
  opts: { partial: boolean }
): ValidationResult {
  const data: Record<string, unknown> = {};
  const partial = opts.partial;

  if (!partial || "name" in body) {
    const check = validateText(body.name as string, PRODUCT_LIMITS.name, true);
    if (!check.valid) return { ok: false, error: check.error || "Invalid name." };
    if (!check.sanitized.trim()) return { ok: false, error: "Name is required." };
    data.name = check.sanitized;
  }

  if (!partial || "description" in body) {
    const check = validateText(
      body.description as string,
      PRODUCT_LIMITS.description,
      true
    );
    if (!check.valid) return { ok: false, error: check.error || "Invalid description." };
    if (!check.sanitized.trim()) {
      return { ok: false, error: "Description is required." };
    }
    data.description = check.sanitized;
  }

  if (!partial || "price" in body) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price <= 0 || price > PRODUCT_LIMITS.maxPrice) {
      return {
        ok: false,
        error: `Price must be a number between 0.01 and ${PRODUCT_LIMITS.maxPrice}.`,
      };
    }
    data.price = Math.round(price * 100) / 100;
  }

  if (!partial || "imageUrl" in body) {
    const url = typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
    if (!url) {
      if (!partial) return { ok: false, error: "Product image URL is required." };
      return { ok: false, error: "Invalid image URL." };
    }
    if (!isImageSrc(url) || url.length > 500) {
      return { ok: false, error: "Invalid product image URL." };
    }
    data.imageUrl = url;
  }

  if (!partial || "categoryId" in body) {
    const categoryId = typeof body.categoryId === "string" ? body.categoryId.trim() : "";
    if (!categoryId) {
      if (!partial) return { ok: false, error: "Category is required." };
      return { ok: false, error: "Invalid category." };
    }
    data.categoryId = categoryId;
  }

  for (const field of ["highlight", "subCategory", "gender", "badge"] as const) {
    if (field in body) {
      const value = body[field];
      if (value === null || value === undefined || value === "") {
        data[field] = null;
      } else {
        const check = validateText(String(value), 80, false);
        if (!check.valid) return { ok: false, error: check.error! };
        data[field] = check.sanitized || null;
      }
    }
  }

  for (const field of ["tags", "sizes", "colors"] as const) {
    if (field in body) {
      const result = validateStringArray(
        body[field],
        field,
        PRODUCT_LIMITS.list,
        PRODUCT_LIMITS.listItem
      );
      if (!result.ok) return result;
      data[field] = result.data;
    }
  }

  if ("colorImages" in body) {
    const value = body.colorImages;
    if (value === null || value === undefined) {
      data.colorImages = null;
    } else if (typeof value !== "object" || Array.isArray(value)) {
      return { ok: false, error: "colorImages must be an object of color → image URLs." };
    } else {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length > PRODUCT_LIMITS.colorImages) {
        return {
          ok: false,
          error: `colorImages allows at most ${PRODUCT_LIMITS.colorImages} colors.`,
        };
      }
      const out: Record<string, string[]> = {};
      for (const [color, imgs] of entries) {
        if (!color.trim() || color.length > PRODUCT_LIMITS.listItem) {
          return { ok: false, error: "Invalid color name in colorImages." };
        }
        if (!Array.isArray(imgs) || imgs.length > PRODUCT_LIMITS.colorImagesPerKey) {
          return {
            ok: false,
            error: `Each color allows up to ${PRODUCT_LIMITS.colorImagesPerKey} images.`,
          };
        }
        const urls: string[] = [];
        for (const img of imgs) {
          if (typeof img !== "string" || !isImageSrc(img) || img.length > 500) {
            return { ok: false, error: "Invalid image URL in colorImages." };
          }
          urls.push(img);
        }
        out[color] = urls;
      }
      data.colorImages = out;
    }
  }

  if ("discountPercent" in body) {
    const value = body.discountPercent;
    if (value === null || value === undefined || value === "") {
      data.discountPercent = null;
    } else {
      const discount = Number(value);
      if (
        !Number.isFinite(discount) ||
        discount < 0 ||
        discount > PRODUCT_LIMITS.maxDiscount
      ) {
        return {
          ok: false,
          error: `Discount must be between 0 and ${PRODUCT_LIMITS.maxDiscount}%.`,
        };
      }
      data.discountPercent = Math.round(discount * 100) / 100;
    }
  }

  if ("status" in body) {
    if (body.status !== "DRAFT" && body.status !== "ACTIVE") {
      return { ok: false, error: "Status must be DRAFT or ACTIVE." };
    }
    data.status = body.status;
  }

  return { ok: true, data };
}

export function slugifyProduct(value: string): string {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "product"
  );
}
