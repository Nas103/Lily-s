import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ brandSlug: string; pageSlug: string }> }) {
  const { brandSlug, pageSlug } = await params;
  if (!prisma) return NextResponse.json({ page: null });
  try {
    const brand = await (prisma as any).brand.findUnique({ where: { slug: brandSlug } });
    if (!brand) return NextResponse.json({ page: null }, { status: 404 });
    const page = await (prisma as any).brandCustomPage.findFirst({
      where: { brandId: brand.id, slug: pageSlug, status: "APPROVED" },
      include: { brand: true, products: { where: { status: "APPROVED" }, include: { images: { orderBy: { sortOrder: "asc" } } } } },
    });
    if (!page) return NextResponse.json({ page: null }, { status: 404 });
    return NextResponse.json({ page });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
