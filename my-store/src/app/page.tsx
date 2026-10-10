import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import { products, getProductsByCategory, type ProductCategory } from "@/data/products";
import { CATEGORY_META } from "@/data/catalog";
import { RecommendationsRail } from "@/components/RecommendationsRail";
import { Price } from "@/components/Price";
import StarfieldButton from "@/components/StarfieldButton";
import { MoltenHero } from "@/components/MoltenHero";
import ReflectShader from "@/components/ReflectShader";
import HorizonBloom from "@/components/HorizonBloom";

const heroTiles: { label: string; href: string; category: ProductCategory }[] = [
  { label: "Shop Men's", href: "/men", category: "men" },
  { label: "Shop Women's", href: "/women", category: "women" },
  { label: "Shop Featured", href: "/featured", category: "featured" },
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
    colorImages: item.colorImages,
  }));

  const icons = products.slice(20, 28);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-zinc-50 to-white text-zinc-900">
      <MoltenHero />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-500">
              Shop by category
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Explore every edit
            </h2>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORY_META.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group rounded-2xl border border-zinc-200 bg-white px-5 py-4 transition hover:-translate-y-1 hover:border-black"
            >
              <p className="text-sm font-semibold tracking-tight">
                {category.label}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{category.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-black px-6 py-16 text-white">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <ReflectShader
            tint="#fcd34d"
            brightness={70}
            speed={40}
            style={{ position: "absolute", inset: 0 }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-end">
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
            <StarfieldButton
              label="Shop the edit"
              link="/women"
              fill="#000000"
              padding="16px 34px"
              rounded={100}
              gap={12}
              font={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                lineHeight: "1.2em",
              }}
              addIcon
              icon={{
                type: "symbol",
                symbol: "♛",
                side: "left",
                size: 14,
                color: "#FFFFFF",
                padding: 0,
                rounded: 0,
              }}
              border={{
                borderColor: "rgba(255,255,255,0.16)",
                borderStyle: "solid",
                borderWidth: 1,
              }}
              glow={{ color: "#FCD34D", size: 18, opacity: 100 }}
              stroke={{
                color: "#FCD34D",
                size: 96,
                count: 1,
                speed: 60,
                movement: "continuous",
                direction: "ccw",
                thickness: 2,
              }}
              pixel={{
                color: "#FFFFFF",
                size: 4,
                density: 35,
                brightness: 55,
              }}
            />
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
            title="Wahhid"
            subtitle="House of brands — Wahhid drops land here."
            link="/featured"
            product={getProductsByCategory("featured")[0]}
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
        <div className="relative overflow-hidden rounded-[40px] bg-[#0B0701]">
          <HorizonBloom
            className="absolute inset-0"
            style={{ position: "absolute", inset: 0, minHeight: 0 }}
            colors={["#F5B301", "#180D02"]}
            horizon={0.66}
            curvature={0.75}
            sunPosition={0.25}
            spread={0.45}
            airglow={0.45}
            clouds={0.55}
            stars={0.5}
            autoAurora
            grain={0.22}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/75" />
          <div className="relative z-10 p-7 md:p-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-amber-300/70">
                  Shop our icons
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                  Globally loved silhouettes
                </h2>
              </div>
              <div className="flex gap-2 text-xs uppercase tracking-[0.35em] text-white/55">
                <Link href="/men" className="transition hover:text-white">
                  Men
                </Link>
                <span>·</span>
                <Link href="/women" className="transition hover:text-white">
                  Women
                </Link>
              </div>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-4">
              {icons.map((icon) => (
                <div
                  key={icon.id}
                  className="rounded-3xl border border-white/10 bg-gradient-to-b from-black/70 to-black/90 p-5 text-white backdrop-blur-sm"
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
                    <Price amount={icon.price} />
                  </p>
                </div>
              ))}
            </div>
          </div>
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

