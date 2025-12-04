import { ProductGrid } from "@/components/ProductGrid";
import { getProductsByCategory } from "@/data/products";

export const metadata = {
  title: "Perfumes | Lily Atelier",
};

export default function PerfumesPage() {
  const perfumes = getProductsByCategory("perfumes").map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    category: "PERFUMES",
    highlight: product.highlight,
    badge: product.badge,
    description: product.description,
    tags: product.tags,
    sizes: product.sizes,
    colors: product.colors,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-zinc-50 to-white">
      <main className="mx-auto max-w-6xl px-6 py-16">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Fragrance Lab
          </p>
          <h1 className="text-3xl font-semibold tracking-tight h1-gradient">
            Signature perfumes
          </h1>
          <p className="text-sm text-zinc-600">
            Crafted in Grasse, bottled in Dubai. Layered oud, citrus, and amber
            stories for every season.
          </p>
        </header>
        <div className="mt-10">
          <ProductGrid products={perfumes} />
        </div>
      </main>
    </div>
  );
}


