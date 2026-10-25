import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireBrandAccount } from "@/lib/brandAuth";
import { applySecurityMiddleware } from "@/lib/middleware";
import { slugify } from "@/lib/brand-custom";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gate = await requireBrandAccount(request);
  if (gate instanceof NextResponse) return gate;
  if (!prisma) return NextResponse.json({ page: null });
  const page = await (prisma as any).brandCustomPage.findFirst({
    where: { id, brandId: gate.brand?.id },
    include: { products: { include: { images: { select: { id: true, name: true, mimeType: true, sizeBytes: true, sortOrder: true } } }, orderBy: { createdAt: "asc" } }, submissions: { orderBy: { createdAt: "desc" }, take: 10 } },
  });
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ page });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const response = NextResponse.next();
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 30, windowMs: 60000 },
    csrf: true,
    securityHeaders: true,
  });
  if (securityResponse) return securityResponse;
  if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const { id } = await params;
  const gate = await requireBrandAccount(request);
  if (gate instanceof NextResponse) return gate;
  if (!gate.brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 });

  const existing = await (prisma as any).brandCustomPage.findFirst({ where: { id, brandId: gate.brand.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await request.json();
    const data: any = {};
    if (body.pageName !== undefined) data.pageName = String(body.pageName).trim();
    if (body.slug !== undefined) data.slug = slugify(body.slug);
    if (body.subheadings !== undefined) data.subheadings = body.subheadings;
    if (body.heroImageUrl !== undefined) data.heroImageUrl = body.heroImageUrl;
    if (body.description !== undefined) data.description = body.description;
    if (body.guidelines !== undefined) data.guidelines = body.guidelines;
    if (body.styleConfig !== undefined) data.styleConfig = body.styleConfig;
    if (body.allowedCategories !== undefined) data.allowedCategories = body.allowedCategories;
    if (body.allowedGenders !== undefined) data.allowedGenders = body.allowedGenders;
    if (body.allowedSubcats !== undefined) data.allowedSubcats = body.allowedSubcats;
    if (body.status !== undefined && ["DRAFT"].includes(body.status)) data.status = body.status;

    const page = await (prisma as any).brandCustomPage.update({ where: { id }, data });
    return NextResponse.json({ page });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to update" }, { status: 500 });
  }
}
