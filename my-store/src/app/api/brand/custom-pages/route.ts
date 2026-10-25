import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireBrandAccount } from "@/lib/brandAuth";
import { applySecurityMiddleware } from "@/lib/middleware";
import { slugify } from "@/lib/brand-custom";

export async function GET(request: NextRequest) {
  const gate = await requireBrandAccount(request);
  if (gate instanceof NextResponse) return gate;
  if (!gate.brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  if (!prisma) return NextResponse.json({ pages: [] });
  const pages = await (prisma as any).brandCustomPage.findMany({
    where: { brandId: gate.brand.id },
    include: { products: { include: { images: { select: { id: true, name: true, mimeType: true, sizeBytes: true, sortOrder: true } } } }, submissions: { orderBy: { createdAt: "desc" }, take: 5 } },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ pages });
}

export async function POST(request: NextRequest) {
  const response = NextResponse.next();
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 20, windowMs: 60000 },
    csrf: true,
    securityHeaders: true,
  });
  if (securityResponse) return securityResponse;
  if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const gate = await requireBrandAccount(request);
  if (gate instanceof NextResponse) return gate;
  if (!gate.brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 });

  try {
    const body = await request.json();
    const pageName = String(body.pageName || gate.brand.name).trim();
    const baseSlug = slugify(body.slug || pageName);
    const brandId = gate.brand!.id;
    let slug = baseSlug || `page-${Date.now()}`;
    let n = 1;
    while (true) {
      const exists = await (prisma as any).brandCustomPage.findFirst({ where: { brandId, slug } });
      if (!exists) break;
      slug = `${baseSlug}-${n++}`;
      if (n > 50) break;
    }

    const page = await (prisma as any).brandCustomPage.create({
      data: {
        brandId,
        pageName,
        slug,
        subheadings: body.subheadings || [],
        heroImageUrl: body.heroImageUrl || null,
        description: body.description || null,
        guidelines: body.guidelines || null,
        styleConfig: body.styleConfig || {},
        allowedCategories: body.allowedCategories || ["clothing", "accessories"],
        allowedGenders: body.allowedGenders || ["men", "women", "unisex"],
        allowedSubcats: body.allowedSubcats || {},
        status: "DRAFT",
      },
    });
    return NextResponse.json({ page }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to create page" }, { status: 500 });
  }
}
