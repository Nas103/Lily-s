import { ProductGrid } from "@/components/ProductGrid";
import { getCatalogByCategory, toGridProduct } from "@/data/catalog";

export const metadata = {
  title: "Women",
};

export default function WomenPage() {
  const womenProducts = getCatalogByCategory("women").map(toGridProduct);

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-6xl px-6 py-16">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Womenswear
          </p>
          <h1 className="text-3xl font-semibold tracking-tight h1-gradient">
            Modest by design
          </h1>
          <p className="text-sm text-zinc-600">
            Couture abayas, flowing ghashwa sets, and everyday modest essentials
            from El Huyam and Black Modesty.
          </p>
        </header>
        <div className="mt-10">
          <ProductGrid products={womenProducts} />
        </div>
      </main>
    </div>
  );
}
