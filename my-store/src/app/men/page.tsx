import { ProductGrid } from "@/components/ProductGrid";
import { getProductsByCategory } from "@/data/products";

export const metadata = {
  title: "Men | Lily Atelier",
};

export default function MenPage() {
  const menProducts = getProductsByCategory("men").map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    category: "MEN",
    highlight: product.highlight,
    badge: product.badge,
    description: product.description,
    tags: product.tags,
    sizes: product.sizes,
    colors: product.colors,
    colorImages: product.colorImages,
  }));

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-6xl px-6 py-16">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Menswear
          </p>
          <h1 className="text-3xl font-semibold tracking-tight h1-gradient">
            High-performance essentials
          </h1>
          <p className="text-sm text-zinc-600">
            Sculpted sneakers, structured bombers, and adaptive layers for every
            hour on the calendar.
          </p>
        </header>
        <div className="mt-10">
          <ProductGrid products={menProducts} />
        </div>
      </main>
    </div>
  );
}


