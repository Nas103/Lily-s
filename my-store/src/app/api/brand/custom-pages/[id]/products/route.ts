import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireBrandAccount } from "@/lib/brandAuth";
import { applySecurityMiddleware } from "@/lib/middleware";
import { slugify } from "@/lib/brand-custom";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const response = NextResponse.next();
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 40, windowMs: 60000 },
    csrf: true,
    securityHeaders: true,
  });
  if (securityResponse) return securityResponse;
  if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const { id: pageId } = await params;
  const gate = await requireBrandAccount(request);
  if (gate instanceof NextResponse) return gate;
  if (!gate.brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 });

  const page = await (prisma as any).brandCustomPage.findFirst({ where: { id: pageId, brandId: gate.brand.id } });
  if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });

  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
    const baseSlug = slugify(name);
    let slug = baseSlug || `product-${Date.now()}`;
    let n = 1;
    while (await (prisma as any).brandCustomProduct.findFirst({ where: { slug } })) {
      slug = `${baseSlug}-${n++}`;
      if (n > 50) break;
    }

    const price = body.price !== undefined && body.price !== null ? Number(body.price) : 0;
    const product = await (prisma as any).brandCustomProduct.create({
      data: {
        brandId: gate.brand.id,
        pageId,
        name,
        slug,
        description: String(body.description || "").trim(),
        price,
        currency: body.currency || "USD",
        category: String(body.category || "clothing"),
        subCategory: body.subCategory || null,
        gender: body.gender || null,
        tags: Array.isArray(body.tags) ? body.tags : [],
        sizes: Array.isArray(body.sizes) ? body.sizes : [],
        colors: Array.isArray(body.colors) ? body.colors : [],
        colorImages: body.colorImages || null,
        info: body.info || null,
        highlights: Array.isArray(body.highlights) ? body.highlights : [],
        status: "DRAFT",
      },
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to create product" }, { status: 500 });
  }
}
