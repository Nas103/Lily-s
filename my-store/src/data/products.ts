export type ProductCategory = "men" | "women" | "perfumes" | "abaya";

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
    category: "abaya",
    gender: "women",
    highlight: "Satin abaya with modular belt and hidden vents.",
    badge: "Heritage",
    tags: ["abaya", "couture"],
    basePrice: 320,
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

export const products: ProductRecord[] = Array.from({ length: 60 }).map(
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
  }
);

export function getProductsByCategory(category: ProductCategory) {
  return products.filter((product) => product.category === category);
}


