import { ProductGrid } from "@/components/ProductGrid";
import { getCategoryMeta, getCatalogByCategory, toGridProduct } from "@/data/catalog";

const meta = getCategoryMeta("perfumes")!;

export const metadata = {
  title: meta.label,
  description: meta.blurb,
};

export default function PerfumesPage() {
  const products = getCatalogByCategory("perfumes").map(toGridProduct);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-zinc-50 to-white">
      <main className="mx-auto max-w-6xl px-6 py-16">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Collection
          </p>
          <h1 className="text-3xl font-semibold tracking-tight h1-gradient">
            {meta.label}
          </h1>
          <p className="text-sm text-zinc-600">{meta.blurb}</p>
        </header>
        <div className="mt-10">
          <ProductGrid products={products} />
        </div>
      </main>
    </div>
  );
}


