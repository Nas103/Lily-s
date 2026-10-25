import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export const dynamic = "force-dynamic";

async function getProduct(brandSlug: string, pageSlug: string, productSlug: string) {
  if (!prisma) return null;
  const brand = await (prisma as any).brand.findUnique({ where: { slug: brandSlug } });
  if (!brand) return null;
  const page = await (prisma as any).brandCustomPage.findFirst({ where: { brandId: brand.id, slug: pageSlug, status: "APPROVED" } });
  if (!page) return null;
  const product = await (prisma as any).brandCustomProduct.findFirst({
    where: { pageId: page.id, slug: productSlug, status: "APPROVED" },
    include: { images: { orderBy: { sortOrder: "asc" } }, brand: true, page: true },
  });
  return product;
}

export default async function BrandCustomProductPage({ params }: { params: Promise<{ brandSlug: string; pageSlug: string; productSlug: string }> }) {
  const { brandSlug, pageSlug, productSlug } = await params;
  const product: any = await getProduct(brandSlug, pageSlug, productSlug);
  if (!product) return notFound();

  const images = product.images || [];
  const mainImg = images[0];
  const mainSrc = mainImg ? `/api/brand-products/images/${mainImg.id}` : "/placeholder-product.png";

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-6 py-10 grid lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-zinc-100">
            <Image src={mainSrc} alt={product.name} fill className="object-cover" />
          </div>
          {images.length > 1 ? (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(1).map((img: any) => (
                <div key={img.id} className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-100">
                  <Image src={`/api/brand-products/images/${img.id}`} alt={product.name} fill className="object-cover" />
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-400">{product.brand?.name}</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-light tracking-tight">{product.name}</h1>
            <p className="mt-3 text-lg text-zinc-900">${Number(product.price).toFixed(2)}</p>
          </div>
          <div className="prose prose-sm max-w-none text-zinc-600">
            <p>{product.description}</p>
          </div>
          {product.sizes && product.sizes.length > 0 ? (
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((s: string) => (
                  <span key={s} className="px-4 py-2 rounded-full border border-zinc-200 text-sm">{s}</span>
                ))}
              </div>
            </div>
          ) : null}
          {product.colors && product.colors.length > 0 ? (
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Color</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((c: string) => (
                  <span key={c} className="px-4 py-2 rounded-full border border-zinc-200 text-sm">{c}</span>
                ))}
              </div>
            </div>
          ) : null}
          {product.highlights && product.highlights.length > 0 ? (
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Highlights</p>
              <ul className="mt-2 list-disc list-inside text-sm text-zinc-600 space-y-1">
                {product.highlights.map((h: string, i: number) => <li key={i}>{h}</li>)}
              </ul>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
