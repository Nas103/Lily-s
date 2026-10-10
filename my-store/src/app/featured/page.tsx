import Link from "next/link";
import Image from "next/image";
import { ProductGrid } from "@/components/ProductGrid";
import { getCatalogByCategory, toGridProduct } from "@/data/catalog";
import { brandGroups } from "../../../mobile-app/src/data/featuredProducts";

export const metadata = {
  title: "Featured",
};

export default function FeaturedPage() {
  const products = getCatalogByCategory("featured").map(toGridProduct);

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-6xl px-6 py-16">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
            House of brands
          </p>
          <h1 className="text-3xl font-semibold tracking-tight h1-gradient">
            Featured
          </h1>
          <p className="text-sm text-zinc-600">
            A rotating home for exclusive labels. Wahhid opens the collection;
            more brands land soon.
          </p>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          {brandGroups.map((brand) => {
            const cover = getCatalogByCategory("featured", brand.slug)[0]
              ?.imageUrl;
            return (
              <Link
                key={brand.slug}
                href={`/featured/${brand.slug}`}
                className="group relative overflow-hidden rounded-[32px] border border-zinc-100 bg-white shadow-sm transition hover:-translate-y-1"
              >
                {cover && (
                  <Image
                    src={cover}
                    alt={brand.name}
                    width={700}
                    height={700}
                    className="h-80 w-full object-cover"
                  />
                )}
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                    {brand.productCount} styles
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                    {brand.name}
                  </h2>
                  <p className="mt-2 text-sm text-zinc-600">{brand.tagline}</p>
                </div>
              </Link>
            );
          })}
        </section>

        <div className="mt-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
                Featured arrivals
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Shop all featured
              </h2>
            </div>
          </div>
          <div className="mt-6">
            <ProductGrid products={products} />
          </div>
        </div>
      </main>
    </div>
  );
}