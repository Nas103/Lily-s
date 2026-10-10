import { womenProducts as mobileWomenProducts } from "../../mobile-app/src/data/womenProducts";
import { menProducts as mobileMenProducts } from "../../mobile-app/src/data/menProducts";
import { featuredProducts as mobileFeaturedProducts } from "../../mobile-app/src/data/featuredProducts";

export type ProductCategory =
  | "men"
  | "women"
  | "perfumes"
  | "featured"
  | "lifestyle"
  | "running"
  | "boxraw"
  | "electronics";

export type ProductRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  highlight: string;
  category: ProductCategory;
  gender: "men" | "women" | "unisex";
  price: number;
  tags: string[];
  badge?: string;
  imageUrl: string;
  sizes?: string[];
  colors?: string[];
  colorImages?: Record<string, string[]>; // Maps color name to array of 4 image URLs
  brand?: string;
};

const adjectives = [
  "Aurora",
  "Lumen",
  "Vanta",
  "Nimbus",
  "Flux",
  "Atlas",
  "Nova",
  "Eon",
  "Kinetic",
  "Halo",
  "Solace",
  "Velvet",
];

const nouns = [
  "Run",
  "Forma",
  "Contour",
  "Pulse",
  "Studio",
  "Drift",
  "Prism",
  "Veil",
  "Horizon",
  "Serum",
  "Aura",
  "Harvest",
];

// ============================================================================
// BASE PRODUCT IMAGES - UPDATE INDIVIDUAL PRODUCT IMAGES HERE
// ============================================================================
// This is the base image for each product (used as fallback and for generating
// color variations). Each product should have a unique base image URL.
//
// TO UPDATE INDIVIDUAL PRODUCT BASE IMAGES:
// Simply replace the URL for the specific product ID below.
// Example:
//   "prod-1": "https://your-cdn.com/aurora-run-base.jpg",
//   "prod-2": "https://your-cdn.com/lumen-forma-base.jpg",
//   etc.
//
// Note: These base images are used to generate 4 color variations per color.
// For more control, see generateColorImages() function below.
// ============================================================================
const productImages: Record<string, string> = {
  // Men's Products
  "prod-1": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518", // Aurora Run - Men
  "prod-5": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518", // Structured outerwear - Men
  "prod-9": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518", // Men's product
  "prod-13": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518", // Men's product
  "prod-17": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518", // Men's product
  "prod-21": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518", // Men's product
  "prod-25": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518", // Men's product
  "prod-29": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518", // Men's product
  "prod-33": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518", // Men's product
  "prod-37": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518", // Men's product
  "prod-41": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518", // Men's product
  "prod-45": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518", // Men's product
  "prod-49": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518", // Men's product
  "prod-53": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518", // Men's product
  "prod-57": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518", // Men's product
  
  // Women's Products
  "prod-2": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2", // Lumen Forma - Women (Muslim woman, no face visible)
  "prod-6": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2", // Statement sneaker - Women
  "prod-10": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2", // Women's product
  "prod-14": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2", // Women's product
  "prod-18": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2", // Women's product
  "prod-22": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2", // Women's product
  "prod-26": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2", // Women's product
  "prod-30": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2", // Women's product
  "prod-34": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2", // Women's product
  "prod-38": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2", // Women's product
  "prod-42": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2", // Women's product
  "prod-46": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2", // Women's product
  "prod-50": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2", // Women's product
  "prod-54": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2", // Women's product
  "prod-58": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2", // Women's product
  
  // Perfumes
  "prod-3": "https://images.unsplash.com/photo-1509057199576-632a47484ece", // Nimbus Contour - Perfumes
  "prod-7": "https://images.unsplash.com/photo-1509057199576-632a47484ece", // Perfume product
  "prod-11": "https://images.unsplash.com/photo-1509057199576-632a47484ece", // Perfume product
  "prod-15": "https://images.unsplash.com/photo-1509057199576-632a47484ece", // Perfume product
  "prod-19": "https://images.unsplash.com/photo-1509057199576-632a47484ece", // Perfume product
  "prod-23": "https://images.unsplash.com/photo-1509057199576-632a47484ece", // Perfume product
  "prod-27": "https://images.unsplash.com/photo-1509057199576-632a47484ece", // Perfume product
  "prod-31": "https://images.unsplash.com/photo-1509057199576-632a47484ece", // Perfume product
  "prod-35": "https://images.unsplash.com/photo-1509057199576-632a47484ece", // Perfume product
  "prod-39": "https://images.unsplash.com/photo-1509057199576-632a47484ece", // Perfume product
  "prod-43": "https://images.unsplash.com/photo-1509057199576-632a47484ece", // Perfume product
  "prod-47": "https://images.unsplash.com/photo-1509057199576-632a47484ece", // Perfume product
  "prod-51": "https://images.unsplash.com/photo-1509057199576-632a47484ece", // Perfume product
  "prod-55": "https://images.unsplash.com/photo-1509057199576-632a47484ece", // Perfume product
  "prod-59": "https://images.unsplash.com/photo-1509057199576-632a47484ece", // Perfume product
  
  // Abaya
  "prod-4": "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb", // Flux Pulse - Abaya
  "prod-8": "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb", // Abaya product
  "prod-12": "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb", // Abaya product
  "prod-16": "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb", // Abaya product
  "prod-20": "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb", // Abaya product
  "prod-24": "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb", // Abaya product
  "prod-28": "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb", // Abaya product
  "prod-32": "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb", // Abaya product
  "prod-36": "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb", // Abaya product
  "prod-40": "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb", // Abaya product
  "prod-44": "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb", // Abaya product
  "prod-48": "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb", // Abaya product
  "prod-52": "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb", // Abaya product
  "prod-56": "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb", // Abaya product
  "prod-60": "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb", // Abaya product
};

type Blueprint = {
  category: ProductCategory;
  gender: "men" | "women" | "unisex";
  highlight: string;
  badge?: string;
  tags: string[];
  basePrice: number;
};

const blueprintCycle: Blueprint[] = [
  {
    category: "men",
    gender: "men",
    highlight: "Adaptive runner engineered for tempo days.",
    badge: "New Drop",
    tags: ["sneakers", "performance"],
    basePrice: 210,
  },
  {
    category: "women",
    gender: "women",
    highlight: "Studio-ready layering with sculpted tailoring.",
    badge: "Studio Edit",
    tags: ["athleisure", "capsule"],
    basePrice: 240,
  },
  {
    category: "perfumes",
    gender: "unisex",
    highlight: "Layered oud and citrus accord with 12-hour trail.",
    badge: "Signature Oil",
    tags: ["fragrance", "oil"],
    basePrice: 180,
  },
  {
    category: "men",
    gender: "men",
    highlight: "Structured outerwear mapped for desert evenings.",
    badge: "Limited",
    tags: ["outerwear", "tailored"],
    basePrice: 260,
  },
  {
    category: "women",
    gender: "women",
    highlight: "Statement sneaker with sculpted midsole.",
    badge: "Exclusive",
    tags: ["sneakers", "drops"],
    basePrice: 220,
  },
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

// ============================================================================
// IMAGE GENERATION FUNCTION - UPDATE INDIVIDUAL IMAGES HERE
// ============================================================================
// Helper function to generate 4 image variations for a color
// 
// TO UPDATE INDIVIDUAL IMAGES:
// Replace this function to return actual image URLs for each color.
// Example structure:
//   return [
//     "https://your-cdn.com/product-123-color-onyx-view1.jpg",  // Image 1
//     "https://your-cdn.com/product-123-color-onyx-view2.jpg",  // Image 2
//     "https://your-cdn.com/product-123-color-onyx-view3.jpg",  // Image 3
//     "https://your-cdn.com/product-123-color-onyx-view4.jpg",  // Image 4
//   ];
//
// Or create a mapping object like:
//   const colorImageMap: Record<string, Record<string, string[]>> = {
//     "prod-1": {
//       "Onyx": ["url1", "url2", "url3", "url4"],
//       "Sand": ["url1", "url2", "url3", "url4"],
//       ...
//     },
//     ...
//   };
// ============================================================================
const generateColorImages = (baseImageUrl: string, color: string, productId: string): string[] => {
  // Create a simple hash from productId and color to generate consistent variations
  const hash = (productId + color).split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  
  // Generate 4 unique image variations per color
  // Using different crop positions and sizes to simulate different product views
  // TODO: Replace these with actual product image URLs for each color
  const variations = [
    { w: 900, h: 1200, fit: 'crop', position: 'center' },  // Image 1 of 4
    { w: 900, h: 1200, fit: 'crop', position: 'top' },     // Image 2 of 4
    { w: 900, h: 1200, fit: 'crop', position: 'bottom' },  // Image 3 of 4
    { w: 900, h: 1200, fit: 'crop', position: 'center', sat: 10 }, // Image 4 of 4
  ];
  
  return variations.map((variation, index) => {
    const params = new URLSearchParams({
      auto: 'format',
      fit: variation.fit,
      w: variation.w.toString(),
      h: variation.h.toString(),
      q: '80',
      color: encodeURIComponent(color),
      v: (Math.abs(hash) + index).toString(),
    });
    if (variation.position) params.set('crop', variation.position);
    if (variation.sat) params.set('sat', variation.sat.toString());
    
    // TODO: Replace this line with actual image URL for this specific color and view
    // Format: productId-color-index (e.g., "prod-1-Onyx-0", "prod-1-Onyx-1", etc.)
    return `${baseImageUrl}?${params.toString()}`;
  });
};

// ============================================================================
// REAL PERFUMES - replaces the 10 generated perfume slots (prod-3, prod-9, ...)
// Each product uses local images from /public/perfumes/<slug>/ (main + 3 views).
// Extra view slots repeat the main image when a folder has fewer than 4 images.
// ============================================================================
const perfumeImages = (slug: string, extension = "jpg", available = 4) => {
  const main = `/perfumes/${slug}/main.${extension}`;
  const views = [2, 3, 4].map((n) =>
    n <= available ? `/perfumes/${slug}/${n}.${extension}` : main
  );
  return { Classic: [main, ...views] };
};

const realPerfumeProducts: ProductRecord[] = [
  {
    id: 'perfume-men-tommy-boy-forever',
    name: 'Tommy Boy Forever Eau de Toilette',
    slug: 'tommy-boy-forever-eau-de-toilette',
    description: 'Aromatic Fougere fragrance for men by Tommy Hilfiger. Top notes: Lemon, Ginger, Black Pepper. Middle: Lavender, Sage, Cinnamon. Base: Driftwood, Musk, Patchouli. Available in 30ml, 50ml and 100ml.',
    highlight: 'Aromatic Fougere for men by Tommy Hilfiger.',
    category: 'perfumes',
    gender: 'men',
    price: 41.89,
    colors: ['Classic'],
    colorImages: perfumeImages('tommy-boy-forever-eau-de-toilette', 'jpg', 2),
    tags: ['fragrance', 'aromatic-fougere', 'tommy-hilfiger'],
    badge: 'Men',
    imageUrl: '/perfumes/tommy-boy-forever-eau-de-toilette/main.jpg',
  },
  {
    id: 'perfume-men-bad-boy-cobalt-elixir',
    name: 'Carolina Herrera Bad Boy Cobalt Elixir Eau de Parfum',
    slug: 'bad-boy-cobalt-elixir-eau-de-parfum',
    description: 'Aromatic, intense interpretation of BAD BOY Cobalt. Sage, Black Truffle and Resinous Woods with Vanilla and Olibanum. Available in 50ml & 100ml.',
    highlight: 'Aromatic, intense BAD BOY Cobalt interpretation.',
    category: 'perfumes',
    gender: 'men',
    price: 121.62,
    colors: ['Classic'],
    colorImages: perfumeImages('bad-boy-cobalt-elixir-eau-de-parfum', 'jpg', 1),
    tags: ['fragrance', 'aromatic', 'woody', 'carolina-herrera'],
    badge: 'Men',
    imageUrl: '/perfumes/bad-boy-cobalt-elixir-eau-de-parfum/main.jpg',
  },
  {
    id: 'perfume-men-k-by-dolce-gabbana',
    name: 'K by Dolce&Gabbana Eau de Toilette',
    slug: 'k-by-dolce-gabbana-eau-de-toilette',
    description: 'Celebrates a new era of masculinity with citrus freshness, Sicilian lemon, blood orange, juniper berry, cedarwood, green vetiver, patchouli and pimiento essence. Available in 50ml, 100ml and 150ml.',
    highlight: 'Citrus freshness and woody depth.',
    category: 'perfumes',
    gender: 'men',
    price: 116.22,
    colors: ['Classic'],
    colorImages: perfumeImages('k-by-dolce-gabbana-eau-de-toilette', 'jpg', 2),
    tags: ['fragrance', 'citrus', 'woody', 'dolce-gabbana'],
    badge: 'Men',
    imageUrl: '/perfumes/k-by-dolce-gabbana-eau-de-toilette/main.jpg',
  },
  {
    id: 'perfume-men-hugo-man',
    name: 'Hugo Man Eau de Toilette',
    slug: 'hugo-man-eau-de-toilette',
    description: 'Green Apple, Aromatic Notes and Fir Balsam. Available in 75ml, 125ml and 200ml. HUGO Man captures a free-spirited attitude.',
    highlight: 'Green Apple, aromatic notes and Fir Balsam.',
    category: 'perfumes',
    gender: 'men',
    price: 147.03,
    colors: ['Classic'],
    colorImages: perfumeImages('hugo-man-eau-de-toilette', 'jpg', 4),
    tags: ['fragrance', 'aromatic', 'fresh', 'hugo-boss'],
    badge: 'Men',
    imageUrl: '/perfumes/hugo-man-eau-de-toilette/main.jpg',
  },
  {
    id: 'perfume-men-stronger-with-you-absolutely',
    name: 'Emporio Armani Stronger With You Absolutely Parfum',
    slug: 'emprorio-armani-stronger-with-you-absolutely-parfum',
    description: 'Refined masculine parfum with addictive rum accord, lavender, vanilla and smoky cedarwood. Available in 50ml and 100ml.',
    highlight: 'Addictive rum accord with smoky cedarwood.',
    category: 'perfumes',
    gender: 'men',
    price: 108.11,
    colors: ['Classic'],
    colorImages: perfumeImages('emprorio-armani-stronger-with-you-absolutely-parfum', 'jpg', 3),
    tags: ['fragrance', 'parfum', 'woody-amber', 'armani'],
    badge: 'Men',
    imageUrl: '/perfumes/emprorio-armani-stronger-with-you-absolutely-parfum/main.jpg',
  },
  {
    id: 'perfume-unisex-ex-nihilo-scarlet-sands',
    name: 'Ex Nihilo Scarlet Sands Eau de Parfum - Dubai Exclusive',
    slug: 'ex-nihilo-scarlet-sands-eau-de-parfum',
    description: 'Ex Nihilo Scarlet Sands Eau de Parfum, Dubai Exclusive, 100ml.',
    highlight: 'Ex Nihilo Dubai Exclusive parfum, 100ml.',
    category: 'perfumes',
    gender: 'unisex',
    price: 542.86,
    colors: ['Classic'],
    colorImages: perfumeImages('ex-nihilo-scarlet-sands-eau-de-parfum', 'jpg', 4),
    tags: ['fragrance', 'parfum', 'unisex', 'ex-nihilo'],
    badge: 'Unisex',
    imageUrl: '/perfumes/ex-nihilo-scarlet-sands-eau-de-parfum/main.jpg',
  },
  {
    id: 'perfume-unisex-heritage',
    name: 'Fragrance Du Bois Heritage Parfum',
    slug: 'fragrance-du-bois-heritage-parfum',
    description: 'Heritage Parfum from Fragrance Du Bois. Unisex/statement fragrance.',
    highlight: 'Statement unisex parfum from Fragrance Du Bois.',
    category: 'perfumes',
    gender: 'unisex',
    price: 584.24,
    colors: ['Classic'],
    colorImages: perfumeImages('fragrance-du-bois-heritage-parfum', 'jpg', 4),
    tags: ['fragrance', 'parfum', 'unisex'],
    badge: 'Unisex',
    imageUrl: '/perfumes/fragrance-du-bois-heritage-parfum/main.jpg',
  },
  {
    id: 'perfume-unisex-amouage-outlands',
    name: 'Amouage Outlands Eau de Parfum',
    slug: 'amouage-outlands-eau-de-parfum',
    description: 'Amouage Outlands EDP, 100ml.',
    highlight: 'Amouage Outlands EDP, 100ml.',
    category: 'perfumes',
    gender: 'unisex',
    price: 427.47,
    colors: ['Classic'],
    colorImages: perfumeImages('amouage-outlands-eau-de-parfum', 'jpg', 4),
    tags: ['fragrance', 'parfum', 'unisex', 'amouage'],
    badge: 'Unisex',
    imageUrl: '/perfumes/amouage-outlands-eau-de-parfum/main.jpg',
  },
  {
    id: 'perfume-unisex-roja-united-arab-emirates',
    name: 'Roja United Arab Emirates Parfum',
    slug: 'roja-united-arab-emirates-parfum',
    description: 'Roja UAE Parfum.',
    highlight: 'Roja United Arab Emirates Parfum.',
    category: 'perfumes',
    gender: 'unisex',
    price: 511.21,
    colors: ['Classic'],
    colorImages: perfumeImages('roja-united-arab-emirates-parfum', 'jpg', 4),
    tags: ['fragrance', 'parfum', 'unisex', 'roja'],
    badge: 'Unisex',
    imageUrl: '/perfumes/roja-united-arab-emirates-parfum/main.jpg',
  },
  {
    id: 'perfume-unisex-xerjoff-5-five-white',
    name: 'Xerjoff 5 Five White Eau de Parfum - UAE Exclusive',
    slug: 'xerjoff-5-five-white-eau-de-parfum-uae-exclusive',
    description: 'Xerjoff 5 Five White Eau de Parfum - UAE Exclusive Dubai Boutique Edition, 100ml.',
    highlight: 'Xerjoff 5 Five White - UAE Exclusive, 100ml.',
    category: 'perfumes',
    gender: 'unisex',
    price: 657.27,
    colors: ['Classic'],
    colorImages: perfumeImages('xerjoff-5-five-white-eau-de-parfum-uae-exclusive', 'jpg', 4),
    tags: ['fragrance', 'parfum', 'unisex', 'xerjoff'],
    badge: 'Unisex',
    imageUrl: '/perfumes/xerjoff-5-five-white-eau-de-parfum-uae-exclusive/main.jpg',
  },
];

// ============================================================================
// REAL WOMENSWEAR - replaces the generated women slots (prod-2, prod-6, ...)
// Sourced from mobile-app/src/data/womenProducts.ts (El Huyam + Black Modesty).
// The mobile colorImages use a { front, back, side, top } object; the web
// ProductRecord expects string[] per color, so we flatten them here.
// ============================================================================
const realWomenProducts: ProductRecord[] = mobileWomenProducts.map((product) => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  description: product.description,
  highlight: product.highlight ?? product.name,
  category: "women",
  gender: "women",
  price: product.price,
  tags: product.tags ?? [],
  badge: product.badge,
  imageUrl: product.imageUrl,
  sizes: product.sizes,
  colors: product.colors,
  colorImages: product.colorImages
    ? Object.fromEntries(
        Object.entries(product.colorImages).map(([color, set]) => [
          color,
          [set.front, set.back, set.side, set.top].filter(Boolean),
        ])
      )
    : undefined,
}));

// ============================================================================
// REAL MENSWEAR - replaces the generated men slots (prod-1, prod-5, ...)
// Sourced from mobile-app/src/data/menProducts.ts (Under Armour). The mobile
// colorImages use a { front, back, side, top } object; the web ProductRecord
// expects string[] per color, so we flatten them here.
// ============================================================================
const realMenProducts: ProductRecord[] = mobileMenProducts.map((product) => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  description: product.description,
  highlight: product.highlight ?? product.name,
  category: "men",
  gender: "men",
  price: product.price,
  tags: product.tags ?? [],
  badge: product.badge,
  imageUrl: product.imageUrl,
  sizes: product.sizes,
  colors: product.colors,
  colorImages: product.colorImages
    ? Object.fromEntries(
        Object.entries(product.colorImages).map(([color, set]) => [
          color,
          [set.front, set.back, set.side, set.top].filter(Boolean),
        ])
      )
    : undefined,
}));

// ============================================================================
// FEATURED BRANDS - Wahhid menswear, replacing the generated abaya slots.
// Sourced from mobile-app/src/data/featuredProducts.ts. The mobile colorImages
// use a { front, back, side, top } object; the web ProductRecord expects
// string[] per color, so we flatten them here.
// ============================================================================
const realFeaturedProducts: ProductRecord[] = mobileFeaturedProducts.map((product) => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  description: product.description,
  highlight: product.highlight ?? product.name,
  category: "featured",
  gender: product.gender ?? "men",
  price: product.price,
  tags: product.tags ?? [],
  badge: product.badge,
  imageUrl: product.imageUrl,
  sizes: product.sizes,
  colors: product.colors,
  colorImages: product.colorImages
    ? Object.fromEntries(
        Object.entries(product.colorImages).map(([color, set]) => [
          color,
          [set.front, set.back, set.side, set.top].filter(Boolean),
        ])
      )
    : undefined,
  brand: product.brand,
}));

export const products: ProductRecord[] = (() => {
  const generated = Array.from({ length: 60 }).map(
    (_, index) => {
    const adjective = adjectives[index % adjectives.length];
    const noun = nouns[index % nouns.length];
    const blueprint = blueprintCycle[index % blueprintCycle.length];
    const name = `${adjective} ${noun}`;
    const price = blueprint.basePrice + (index % 5) * 15;

    const sizes =
      blueprint.category === "perfumes"
        ? undefined
        : ["XS", "S", "M", "L", "XL"];

    const colors =
      blueprint.category === "perfumes"
        ? ["Amber", "Oud", "Citrus", "Musk", "Floral"]
        : ["Onyx", "Sand", "Oat", "Shadow", "Fog"];

    const productId = `prod-${index + 1}`;
    const baseImageUrl = productImages[productId] || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2";
    
    // ========================================================================
    // COLOR-BASED IMAGES - 4 IMAGES PER COLOR
    // ========================================================================
    // This generates 4 images for each color option of the product.
    // 
    // TO UPDATE INDIVIDUAL PRODUCT COLOR IMAGES:
    // Replace the generateColorImages() function above, or directly modify
    // the colorImages object here for specific products:
    //
    // Example:
    //   const colorImages: Record<string, string[]> = {
    //     "Onyx": [
    //       "https://your-cdn.com/prod-1-onyx-1.jpg",
    //       "https://your-cdn.com/prod-1-onyx-2.jpg",
    //       "https://your-cdn.com/prod-1-onyx-3.jpg",
    //       "https://your-cdn.com/prod-1-onyx-4.jpg",
    //     ],
    //     "Sand": [
    //       "https://your-cdn.com/prod-1-sand-1.jpg",
    //       "https://your-cdn.com/prod-1-sand-2.jpg",
    //       "https://your-cdn.com/prod-1-sand-3.jpg",
    //       "https://your-cdn.com/prod-1-sand-4.jpg",
    //     ],
    //     // ... repeat for each color
    //   };
    // ========================================================================
    const colorImages: Record<string, string[]> = {};
    colors.forEach((color) => {
      // TODO: Replace generateColorImages() call with actual image URLs
      // Format: 4 images per color, e.g., ["url1", "url2", "url3", "url4"]
      colorImages[color] = generateColorImages(baseImageUrl, color, productId);
    });
    
    return {
      id: productId,
      name,
      slug: slugify(name),
      description: `${name} from the ${blueprint.category} atelier, built for premium comfort.`,
      highlight: blueprint.highlight,
      category: blueprint.category,
      gender: blueprint.gender,
      price,
      tags: blueprint.tags,
      badge: blueprint.badge,
      // Each product has its own unique image URL
      // To change a product image, update the URL in the productImages object above (around line 51)
      // Example: "prod-1": "https://your-image-url.com/image.jpg"
      imageUrl: `${baseImageUrl}?auto=format&fit=crop&w=900&q=80`,
      sizes,
      colors,
      colorImages, // 4 images per color
    };
  });

  // Replace generated perfume slots (prod-3, prod-9, ...) with real perfume data
  // and generated women slots (prod-2, prod-6, ...) with real womenswear. Any
  // leftover women placeholders are dropped until the remaining real items land.
  let perfumeIndex = 0;
  let womenIndex = 0;
  const output: ProductRecord[] = [];
  for (const product of generated) {
    if (product.category === "perfumes") {
      output.push(realPerfumeProducts[perfumeIndex++] ?? product);
    } else if (product.category === "women") {
      if (womenIndex < realWomenProducts.length) {
        output.push(realWomenProducts[womenIndex++]);
      }
    } else if (product.category === "men") {
      // Real men's products replace the generated men slots entirely
      // (22 real products vs 20 generated slots); appended below.
    } else {
      output.push(product);
    }
  }
  output.push(...realMenProducts);
  output.push(...realFeaturedProducts);
  return output;
})();

export function getProductsByCategory(category: ProductCategory) {
  return products.filter((product) => product.category === category);
}


