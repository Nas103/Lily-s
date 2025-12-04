import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import { products, getProductsByCategory, type ProductCategory } from "@/data/products";
import { RecommendationsRail } from "@/components/RecommendationsRail";

const heroTiles: { label: string; href: string; category: ProductCategory }[] = [
  { label: "Shop Men's", href: "/men", category: "men" },
  { label: "Shop Women's", href: "/women", category: "women" },
  { label: "Shop Abaya", href: "/abaya", category: "abaya" },
];

export default function Home() {
  const featured = products.slice(0, 6).map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    imageUrl: item.imageUrl,
    category: item.category.toUpperCase(),
    highlight: item.highlight,
    badge: item.badge,
    description: item.description,
    tags: item.tags,
    sizes: item.sizes,
    colors: item.colors,
  }));

  const icons = products.slice(20, 28);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-zinc-50 to-white text-zinc-900">
      <section className="relative overflow-hidden bg-black px-6 py-16 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-end">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.6em] text-white/70">
              Cyber Week Capsule
            </p>
            <div className="text-[clamp(5rem,12vw,12rem)] font-light leading-none">
              30%
            </div>
            <div>
              <p className="text-2xl font-light tracking-tight">
                Up to 30% off curated drops
              </p>
              <p className="mt-2 max-w-lg text-sm text-white/70">
                New textures, future silhouettes, and iconic perfumes. Your next
                statement fits land here first.
              </p>
            </div>
            <Link
              href="/women"
              className="inline-flex w-fit items-center justify-center rounded-full border border-white px-8 py-3 text-xs font-semibold uppercase tracking-[0.4em]"
            >
              Shop the edit
            </Link>
          </div>

          <div className="grid flex-1 gap-4 md:grid-cols-3">
            {heroTiles.map((tile, index) => {
              const product = getProductsByCategory(tile.category)[index % 5];
              return (
                <Link
                  key={tile.label}
                  href={tile.href}
                  className="relative overflow-hidden rounded-3xl bg-white/5 p-4"
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={400}
                    height={500}
                    className="h-56 w-full rounded-2xl object-cover"
                  />
                  <div className="mt-4 space-y-1">
                    <p className="text-sm uppercase tracking-[0.35em] text-white/70">
                      {tile.label}
                    </p>
                    <p className="text-lg font-semibold">{product.name}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
              Featured arrivals
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Fresh Kicks & Couture Layers
            </h2>
          </div>
          <Link
            href="/men"
            className="text-xs font-semibold uppercase tracking-[0.35em]"
          >
            View all
          </Link>
        </div>
        <div className="mt-10">
          <ProductGrid products={featured} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          <CollectionTile
            title="Modern Abaya"
            subtitle="Architectural silhouettes and satin sheens."
            link="/abaya"
            product={getProductsByCategory("abaya")[0]}
          />
          <CollectionTile
            title="Signature Perfumes"
            subtitle="Layered oud, citrus, and amber accords."
            link="/perfumes"
            product={getProductsByCategory("perfumes")[1]}
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
              Shop our icons
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Globally loved silhouettes
            </h2>
          </div>
          <div className="flex gap-2 text-xs uppercase tracking-[0.35em] text-zinc-500">
            <Link href="/men">Men</Link>
            <span>·</span>
            <Link href="/women">Women</Link>
          </div>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-4">
          {icons.map((icon) => (
            <div
              key={icon.id}
              className="rounded-3xl border border-zinc-100 bg-gradient-to-b from-zinc-900 to-black p-5 text-white"
            >
              <p className="text-sm text-white/70">{icon.category}</p>
              <p className="mt-2 text-lg font-semibold">{icon.name}</p>
              <Image
                src={icon.imageUrl}
                alt={icon.name}
                width={320}
                height={240}
                className="mt-6 h-48 w-full rounded-2xl object-cover"
              />
              <p className="mt-4 text-sm text-white/60">
                ${icon.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* AI-ready recommendations, powered by browsing and add-to-cart events. */}
      <RecommendationsRail />
    </div>
  );
}

type CollectionTileProps = {
  title: string;
  subtitle: string;
  link: string;
  product: ReturnType<typeof getProductsByCategory>[number];
};

function CollectionTile({ title, subtitle, link, product }: CollectionTileProps) {
  return (
    <Link
      href={link}
      className="relative overflow-hidden rounded-[32px] border border-zinc-100 bg-white p-6 shadow-sm transition hover:-translate-y-1"
    >
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={700}
        height={500}
        className="h-80 w-full rounded-3xl object-cover"
      />
      <div className="mt-4 space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
          {title}
        </p>
        <p className="text-2xl font-semibold tracking-tight">{product.name}</p>
        <p className="text-sm text-zinc-600">{subtitle}</p>
      </div>
    </Link>
  );
}

