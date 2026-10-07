import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import { getCategoryMeta, getCatalogByCategory, toGridProduct } from "@/data/catalog";

const meta = getCategoryMeta("electronics")!;
const subCategories = meta.subCategories ?? [];

export const metadata = {
  title: meta.label,
  description: meta.blurb,
};

export default async function ElectronicsPage({
  searchParams,
}: {
  searchParams: Promise<{ sub?: string }>;
}) {
  const { sub } = await searchParams;
  const active =
    subCategories.find((item) => item.id === sub)?.id ?? subCategories[0]?.id;

  const products = getCatalogByCategory("electronics", active).map(toGridProduct);

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

        <div className="mt-8 flex flex-wrap gap-3">
          {subCategories.map((item) => {
            const isActive = item.id === active;
            return (
              <Link
                key={item.id}
                href={`/electronics?sub=${item.id}`}
                className={
                  isActive
                    ? "rounded-full bg-black px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white"
                    : "rounded-full border border-zinc-300 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-600 transition hover:border-black hover:text-black"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-10">
          <ProductGrid products={products} />
        </div>
      </section>
    </div>
  );
}