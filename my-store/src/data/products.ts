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

// Individual product images - Update each URL to match the specific product
// Format: Product ID - Product Name - Category
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
    };
  }
);

export function getProductsByCategory(category: ProductCategory) {
  return products.filter((product) => product.category === category);
}


