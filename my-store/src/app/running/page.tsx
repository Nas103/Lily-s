import { ProductGrid } from "@/components/ProductGrid";
import { getCategoryMeta, getCatalogByCategory, toGridProduct } from "@/data/catalog";

const meta = getCategoryMeta("running")!;

export const metadata = {
  title: meta.label,
  description: meta.blurb,
};

export default function RunningPage() {
  const products = getCatalogByCategory("running");
  const men = products.filter((p) => p.gender === "men").map(toGridProduct);
  const women = products.filter((p) => p.gender === "women").map(toGridProduct);
  const other = products
    .filter((p) => p.gender !== "men" && p.gender !== "women")
    .map(toGridProduct);

  const sections = [
    { title: "Men", items: men },
    { title: "Women", items: women },
    { title: "Unisex", items: other },
  ].filter((section) => section.items.length > 0);

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

        <div className="mt-10 space-y-16">
          {sections.map((section) => (
            <div key={section.title}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold uppercase tracking-[0.35em] text-zinc-800">
                  {section.title}
                </h2>
                <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                  {section.items.length} pieces
                </span>
              </div>
              <div className="mt-6">
                <ProductGrid products={section.items} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}