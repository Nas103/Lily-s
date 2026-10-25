import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ brandSlug: string; pageSlug: string; productSlug: string }> }) {
  const { brandSlug, pageSlug, productSlug } = await params;
  if (!prisma) return NextResponse.json({ product: null });
  try {
    const brand = await (prisma as any).brand.findUnique({ where: { slug: brandSlug } });
    if (!brand) return NextResponse.json({ product: null }, { status: 404 });
    const page = await (prisma as any).brandCustomPage.findFirst({ where: { brandId: brand.id, slug: pageSlug, status: "APPROVED" } });
    if (!page) return NextResponse.json({ product: null }, { status: 404 });
    const product = await (prisma as any).brandCustomProduct.findFirst({
      where: { pageId: page.id, slug: productSlug, status: "APPROVED" },
      include: { images: { orderBy: { sortOrder: "asc" } }, brand: true },
    });
    if (!product) return NextResponse.json({ product: null }, { status: 404 });
    return NextResponse.json({ product });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
