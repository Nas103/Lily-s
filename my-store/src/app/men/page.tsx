import { ProductGrid } from "@/components/ProductGrid";
import { getProductsByCategory } from "@/data/products";
import { applyOverrides, loadProductOverrides } from "@/lib/productOverrides";

export const metadata = {
  title: "Men",
};

export const dynamic = "force-dynamic";

export default async function MenPage() {
  const overrides = await loadProductOverrides();
  const menProducts = applyOverrides(getProductsByCategory("men"), overrides).map((product) => ({
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
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-700">
            Menswear
          </p>
          <h1 className="text-3xl font-semibold tracking-tight h1-gradient">
            High-performance essentials
          </h1>
          <p className="text-sm text-zinc-800">
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


