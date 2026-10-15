import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import { AlternatingVideoBanner } from "@/components/AlternatingVideoBanner";
import { getCategoryMeta, getCatalogByCategory, toGridProduct } from "@/data/catalog";
import { applyOverrides, loadProductOverrides } from "@/lib/productOverrides";

const meta = getCategoryMeta("boxraw")!;
const subCategories = meta.subCategories ?? [];

const HEADER_CLIPS = [
  "/boxraw/thumbnail/header_thumbnail/8f95e372ef624fa690f4c27af4a222f1.HD-720p-2.1Mbps-84475284.mp4",
  "/boxraw/thumbnail/header_thumbnail/ac0c93496fcf45918f948a949e140b1a.HD-1080p-2.5Mbps-96585604.mp4",
];

const EQUIPMENT_CLIPS = [
  "/boxraw/thumbnail/equipement_thumbnail/3c4eeacbf4ec4a1eb1d824329c463085.HD-720p-1.6Mbps-65714972.mp4",
  "/boxraw/thumbnail/equipement_thumbnail/f79d09283eb94f7c97698222ab27ce4e.mp4",
];

export const metadata = {
  title: meta.label,
  description: meta.blurb,
};

export const dynamic = "force-dynamic";

export default async function BoxrawPage({
  searchParams,
}: {
  searchParams: Promise<{ sub?: string }>;
}) {
  const { sub } = await searchParams;
  const active =
    subCategories.find((item) => item.id === sub)?.id ?? subCategories[0]?.id;

  const overrides = await loadProductOverrides();
  const products = applyOverrides(getCatalogByCategory("boxraw", active), overrides).map(toGridProduct);

  const clips = active === "equipment" ? EQUIPMENT_CLIPS : HEADER_CLIPS;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-zinc-50 to-white">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-700">
          Collection
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {meta.label}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-zinc-800">{meta.blurb}</p>

        <SubCategoryTabs basePath="/boxraw" active={active} items={subCategories} />

        <div className="mt-10">
          <AlternatingVideoBanner sources={clips} />
        </div>

        <div className="mt-10">
          <ProductGrid products={products} />
        </div>
      </section>
    </div>
  );
}

function SubCategoryTabs({
  basePath,
  active,
  items,
}: {
  basePath: string;
  active?: string;
  items: { id: string; label: string }[];
}) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <Link
            key={item.id}
            href={`${basePath}?sub=${item.id}`}
            className={
              isActive
                ? "rounded-full bg-black px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white"
                : "rounded-full border border-zinc-300 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-800 transition hover:border-black hover:text-black"
            }
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}