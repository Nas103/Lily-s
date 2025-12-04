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

const imageBase: Record<ProductCategory, string> = {
  // TODO: Swap in brand-owned menswear photography when ready.
  men: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
  // TODO: Replace with final womenswear lookbook image.
  women: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
  // TODO: Point to your own perfume product shot.
  perfumes: "https://images.unsplash.com/photo-1509057199576-632a47484ece",
  // TODO: Update this abaya image to match your collection.
  abaya: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb",
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

    return {
      id: `prod-${index + 1}`,
      name,
      slug: slugify(name),
      description: `${name} from the ${blueprint.category} atelier, built for premium comfort.`,
      highlight: blueprint.highlight,
      category: blueprint.category,
      gender: blueprint.gender,
      price,
      tags: blueprint.tags,
      badge: blueprint.badge,
      // TODO: Replace `imageUrl` with the exact product asset.
      imageUrl: `${imageBase[blueprint.category]}?auto=format&fit=crop&w=900&q=80`,
      sizes,
      colors,
    };
  }
);

export function getProductsByCategory(category: ProductCategory) {
  return products.filter((product) => product.category === category);
}


