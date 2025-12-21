import { ProductGrid } from "@/components/ProductGrid";
import { getProductsByCategory } from "@/data/products";

export const metadata = {
  title: "Women | Lily Atelier",
};

export default function WomenPage() {
  const womenProducts = getProductsByCategory("women").map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl,
    category: "WOMEN",
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
            Womenswear
          </p>
          <h1 className="text-3xl font-semibold tracking-tight h1-gradient">
            Studio to soirée
          </h1>
          <p className="text-sm text-zinc-600">
            Tailored sets, sculpted sneakers, and couture abayas designed for
            adaptive wardrobes.
          </p>
        </header>
        <div className="mt-10">
          <ProductGrid products={womenProducts} />
        </div>
      </main>
    </div>
  );
}


