import { ProductGrid } from "@/components/ProductGrid";
import { getCategoryMeta, getCatalogByCategory, toGridProduct } from "@/data/catalog";
import { applyOverrides, loadProductOverrides } from "@/lib/productOverrides";

const meta = getCategoryMeta("lifestyle")!;

export const metadata = {
  title: meta.label,
  description: meta.blurb,
};

export const dynamic = "force-dynamic";

export default async function LifestylePage() {
  const overrides = await loadProductOverrides();
  const products = applyOverrides(getCatalogByCategory("lifestyle"), overrides).map(toGridProduct);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-zinc-50 to-white">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
          Collection
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {meta.label}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-zinc-600">{meta.blurb}</p>
        <div className="mt-10">
          <ProductGrid products={products} />
        </div>
      </section>
    </div>
  );
}