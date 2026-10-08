import type { Product } from "../../mobile-app/src/types";
import { products as staticProducts } from "./products";
import { lifestyleProducts } from "../../mobile-app/src/data/lifestyleProducts";
import { runningProducts } from "../../mobile-app/src/data/runningProducts";
import { boxrawProducts } from "../../mobile-app/src/data/boxrawProducts";
import { electronicsProducts } from "../../mobile-app/src/data/electronicsProducts";
import { perfumesProducts } from "../../mobile-app/src/data/perfumesProducts";

export type CatalogCategory =
  | "men"
  | "women"
  | "abaya"
  | "perfumes"
  | "lifestyle"
  | "running"
  | "boxraw"
  | "electronics";

export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  highlight?: string;
  category: CatalogCategory;
  subCategory?: string;
  gender?: "men" | "women" | "unisex";
  price: number;
  badge?: string;
  tags?: string[];
  imageUrl: string;
  sizes?: string[];
  colors?: string[];
  colorImages?: Record<string, string[]>;
};

export const CATEGORY_META: {
  id: CatalogCategory;
  label: string;
  href: string;
  blurb: string;
  subCategories?: { id: string; label: string }[];
}[] = [
  { id: "men", label: "Men", href: "/men", blurb: "Tempo-day layers and sculpted footwear." },
  { id: "women", label: "Women", href: "/women", blurb: "Studio-ready tailoring and statement sneakers." },
  { id: "abaya", label: "Abaya", href: "/abaya", blurb: "Architectural silhouettes and satin sheens." },
  { id: "perfumes", label: "Perfumes", href: "/perfumes", blurb: "Layered oud, citrus, and amber accords." },
  { id: "lifestyle", label: "Lifestyle", href: "/lifestyle", blurb: "Everyday essentials, elevated." },
  { id: "running", label: "Running", href: "/running", blurb: "Performance engineered for the long run." },
  {
    id: "boxraw",
    label: "BoxRaw",
    href: "/boxraw",
    blurb: "Combat-grade apparel and equipment.",
    subCategories: [
      { id: "clothing", label: "Clothing" },
      { id: "equipment", label: "Equipment" },
    ],
  },
  {
    id: "electronics",
    label: "Electronics",
    href: "/electronics",
    blurb: "Flagship devices and smart accessories.",
    subCategories: [
      { id: "apple", label: "Apple" },
      { id: "samsung", label: "Samsung" },
      { id: "flagship", label: "Flagship" },
    ],
  },
];

const normalizeColorImages = (
  images: Product["colorImages"]
): Record<string, string[]> | undefined => {
  if (!images) return undefined;
  const result: Record<string, string[]> = {};
  for (const [color, set] of Object.entries(images)) {
    if (!set) continue;
    const list = [set.front, set.back, set.side, set.top].filter(
      (url): url is string => Boolean(url)
    );
    result[color] = set.front ? Array.from(new Set([set.front, ...list])) : [set.front].filter(Boolean);
  }
  return result;
};

const normalizeMobileProduct = (product: Product): CatalogProduct => {
  const category =
    typeof product.category === "string"
      ? product.category
      : product.category?.slug || product.category?.name || "lifestyle";

  return {
    id: product.id,
    name: product.name,
    slug: product.slug || product.id,
    description: product.description,
    highlight: product.highlight,
    category: category as CatalogCategory,
    subCategory: product.subCategory,
    gender: product.gender,
    price: product.price,
    badge: product.badge,
    tags: product.tags,
    imageUrl: product.imageUrl,
    sizes: product.sizes,
    colors: product.colors,
    colorImages: normalizeColorImages(product.colorImages),
  };
};

const mobileProducts: CatalogProduct[] = [
  ...lifestyleProducts,
  ...runningProducts,
  ...boxrawProducts,
  ...electronicsProducts,
  ...perfumesProducts,
].map((product) => normalizeMobileProduct(product));

const staticCatalog: CatalogProduct[] = staticProducts.map((product) => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  description: product.description,
  highlight: product.highlight,
  category: product.category as CatalogCategory,
  price: product.price,
  badge: product.badge,
  tags: product.tags,
  imageUrl: product.imageUrl,
  sizes: product.sizes,
  colors: product.colors,
  colorImages: product.colorImages,
}));

export const catalogProducts: CatalogProduct[] = [
  ...new Map(
    [...staticCatalog, ...mobileProducts].map((product) => [product.id, product])
  ).values(),
];

export function getCatalogByCategory(
  category: CatalogCategory,
  subCategory?: string
): CatalogProduct[] {
  return catalogProducts.filter((product) => {
    if (product.category !== category) return false;
    if (subCategory && product.subCategory !== subCategory) return false;
    return true;
  });
}

export function getCatalogProduct(id: string): CatalogProduct | undefined {
  return catalogProducts.find((product) => product.id === id);
}

export function getCategoryMeta(category: CatalogCategory) {
  return CATEGORY_META.find((meta) => meta.id === category);
}

export function toGridProduct(product: CatalogProduct) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    category: product.category.toUpperCase(),
    highlight: product.highlight,
    badge: product.badge,
    description: product.description,
    tags: product.tags,
    sizes: product.sizes,
    colors: product.colors,
    colorImages: product.colorImages,
  };
}