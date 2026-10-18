import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import { products, getProductsByCategory, type ProductCategory } from "@/data/products";
import { CATEGORY_META, catalogProducts, toGridProduct, type CatalogProduct } from "@/data/catalog";
import { STOREFRONT_BRANDS } from "@/lib/brand";
import { applyOverrides, loadProductOverrides, serializeOverrides } from "@/lib/productOverrides";
import { RecommendationsRail } from "@/components/RecommendationsRail";
import StarfieldButton from "@/components/StarfieldButton";
import { MoltenHero } from "@/components/MoltenHero";
import ReflectShader from "@/components/ReflectShader";
import ShopIconsLaser from "@/components/ShopIconsLaser";
import CategoryGrid from "@/components/CategoryGrid";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";

const heroTiles: { label: string; href: string; category: ProductCategory }[] = [
  { label: "Shop Men's", href: "/men", category: "men" },
  { label: "Shop Women's", href: "/women", category: "women" },
  { label: "Shop Featured", href: "/featured", category: "featured" },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const overrides = await loadProductOverrides();

  // Curated "Featured arrivals" — one stream per house brand (BOXRAW,
  // Wahhid, Under Armour, Nike), interleaved across the grid.
  const brandBuckets: CatalogProduct[][] = [[], [], [], []];
  for (const product of catalogProducts) {
    if (product.category === "boxraw") {
      brandBuckets[0].push(product);
    } else if (product.brand === "Wahhid") {
      brandBuckets[1].push(product);
    } else if (product.badge === "Under Armour") {
      brandBuckets[2].push(product);
    } else if (/^Nike/i.test(product.name)) {
      brandBuckets[3].push(product);
    }
  }
  const featuredPicks: CatalogProduct[] = [];
  for (let i = 0; featuredPicks.length < 6; i += 1) {
    let pickedAny = false;
    for (const bucket of brandBuckets) {
      const candidate = bucket[i];
      if (candidate && featuredPicks.length < 6) {
        featuredPicks.push(candidate);
        pickedAny = true;
      }
    }
    if (!pickedAny) break;
  }
  const featured = applyOverrides(featuredPicks.map(toGridProduct), overrides);

  const icons = applyOverrides(products.slice(20, 28), overrides);

  const brandWords = STOREFRONT_BRANDS.map((brand) => brand.toUpperCase());

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
        <CategoryGrid categories={CATEGORY_META} />
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
              const product = applyOverrides(getProductsByCategory(tile.category), overrides)[index % 5];
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
          <FeaturedCarousel products={featured} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          <CollectionTile
            title="Wahhid"
            subtitle="House of brands — Wahhid drops land here."
            link="/featured"
            product={applyOverrides(getProductsByCategory("featured"), overrides)[0]}
          />
          <CollectionTile
            title="Signature Perfumes"
            subtitle="Layered oud, citrus, and amber accords."
            link="/perfumes"
            product={applyOverrides(getProductsByCategory("perfumes"), overrides)[1]}
          />
        </div>
      </section>

      <section className="relative overflow-hidden bg-black">
        <ShopIconsLaser
          items={icons.map((icon) => ({
            id: icon.id,
            name: icon.name,
            category: String(icon.category),
            price: icon.price,
            imageUrl: icon.imageUrl,
          }))}
          brands={brandWords}
        />
      </section>

      {/* AI-ready recommendations, powered by browsing and add-to-cart events. */}
      <RecommendationsRail overrides={serializeOverrides(overrides)} />
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

