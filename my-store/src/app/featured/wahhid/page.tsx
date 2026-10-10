import { ProductGrid } from "@/components/ProductGrid";
import { getCatalogByCategory, toGridProduct } from "@/data/catalog";
import { brandGroups } from "../../../../mobile-app/src/data/featuredProducts";

export const metadata = {
  title: "Wahhid",
};

export default function WahhidBrandPage() {
  const brand = brandGroups.find((group) => group.slug === "wahhid");
  const products = getCatalogByCategory("featured", "wahhid").map(toGridProduct);

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-6xl px-6 py-16">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            Featured · Brand
          </p>
          <h1 className="text-3xl font-semibold tracking-tight h1-gradient">
            Wahhid
          </h1>
          {brand && (
            <p className="max-w-2xl text-sm text-zinc-600">{brand.description}</p>
          )}
        </header>

        <div className="mt-10">
          <ProductGrid products={products} />
        </div>
      </main>
    </div>
  );
}