import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireBrandAccount } from "@/lib/brandAuth";
import { applySecurityMiddleware } from "@/lib/middleware";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const response = NextResponse.next();
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 10, windowMs: 60000 },
    csrf: true,
    securityHeaders: true,
  });
  if (securityResponse) return securityResponse;
  if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const { id: pageId } = await params;
  const gate = await requireBrandAccount(request);
  if (gate instanceof NextResponse) return gate;
  if (!gate.brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 });

  const page = await (prisma as any).brandCustomPage.findFirst({
    where: { id: pageId, brandId: gate.brand.id },
    include: { products: { include: { images: { select: { id: true, name: true, mimeType: true, sizeBytes: true, sortOrder: true } } } } },
  });
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!page.products || page.products.length === 0) return NextResponse.json({ error: "Add at least one product before submitting" }, { status: 400 });

  // basic validation
  for (const p of page.products) {
    if (!p.name || !p.description || Number(p.price) <= 0) return NextResponse.json({ error: "All products must have name, description, and price" }, { status: 400 });
    if (!p.images || p.images.length === 0) return NextResponse.json({ error: "All products must have at least one image" }, { status: 400 });
  }

  const snapshot = {
    page: {
      id: page.id,
      pageName: page.pageName,
      slug: page.slug,
      description: page.description,
      subheadings: page.subheadings,
      allowedCategories: page.allowedCategories,
      allowedGenders: page.allowedGenders,
      guidelines: page.guidelines,
    },
    products: page.products.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: Number(p.price),
      category: p.category,
      subCategory: p.subCategory,
      gender: p.gender,
      sizes: p.sizes,
      colors: p.colors,
      tags: p.tags,
      highlights: p.highlights,
      info: p.info,
      images: p.images,
    })),
    submittedAt: new Date().toISOString(),
  };

  const issues: any[] = [];
  if (!page.description) issues.push({ level: "warn", message: "Page description missing" });
  for (const p of page.products) {
    if (p.category === "clothing" && (!p.sizes || p.sizes.length === 0)) issues.push({ level: "warn", productId: p.id, message: "Clothing item missing sizes" });
  }
  const aiFindings = { issues, checkedAt: new Date().toISOString() };

  const submission = await (prisma as any).brandPageSubmission.create({
    data: {
      pageId: page.id,
      brandId: gate.brand.id,
      snapshot,
      aiFindings,
      status: "SUBMITTED",
    },
  });

  await (prisma as any).brandCustomPage.update({ where: { id: page.id }, data: { status: "SUBMITTED", submittedAt: new Date() } });
  await (prisma as any).brandCustomProduct.updateMany({ where: { pageId: page.id }, data: { status: "PENDING_REVIEW" } });

  try {
    await (prisma as any).brandMessage.create({
      data: {
        brandId: gate.brand.id,
        fromUserId: gate.user.id,
        fromRole: "BRAND",
        body: `Custom page "${page.pageName}" submitted for admin approval.`,
      },
    });
  } catch {}

  return NextResponse.json({ submission }, { status: 201 });
}
