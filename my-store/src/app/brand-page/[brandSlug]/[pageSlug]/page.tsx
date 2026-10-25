import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

async function getPage(brandSlug: string, pageSlug: string) {
  if (!prisma) return null;
  const brand = await (prisma as any).brand.findUnique({ where: { slug: brandSlug } });
  if (!brand) return null;
  const page = await (prisma as any).brandCustomPage.findFirst({
    where: { brandId: brand.id, slug: pageSlug, status: "APPROVED" },
    include: { brand: true, products: { where: { status: "APPROVED" }, include: { images: { orderBy: { sortOrder: "asc" } } }, orderBy: { createdAt: "asc" } } },
  });
  return page;
}

export default async function BrandCustomPage({ params }: { params: Promise<{ brandSlug: string; pageSlug: string }> }) {
  const { brandSlug, pageSlug } = await params;
  const page: any = await getPage(brandSlug, pageSlug);
  if (!page) return notFound();

  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-xs uppercase tracking-[0.4em] text-zinc-400">{page.brand.name}</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-light tracking-tight h1-gradient">{page.pageName}</h1>
        {page.description ? <p className="mt-4 max-w-2xl text-sm text-zinc-600">{page.description}</p> : null}
      </header>
      <main className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {(page.products || []).map((product: any) => {
            const img = product.images?.[0];
            const imgSrc = img ? `/api/brand-products/images/${img.id}` : "/placeholder-product.png";
            return (
              <Link key={product.id} href={`/brand-page/${brandSlug}/${pageSlug}/${product.slug}`} className="group">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-100">
                  <Image src={imgSrc} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="mt-4 space-y-1">
                  <h2 className="text-sm font-medium text-zinc-900">{product.name}</h2>
                  <p className="text-sm text-zinc-500">${Number(product.price).toFixed(2)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
