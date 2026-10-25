import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireBrandAccount } from "@/lib/brandAuth";
import { applySecurityMiddleware } from "@/lib/middleware";

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

  try {
    const body = await request.json();
    const pageId = body.pageId;
    if (!pageId) return NextResponse.json({ error: "pageId required" }, { status: 400 });
    const page = await (prisma as any).brandCustomPage.findFirst({
      where: { id: pageId, brandId: gate.brand?.id },
      include: { products: { include: { images: true } } },
    });
    if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const issues: any[] = [];
    if (!page.pageName) issues.push({ level: "error", field: "pageName", message: "Page name missing" });
    if (!page.description) issues.push({ level: "warn", field: "description", message: "Add a description for your page" });
    for (const p of page.products || []) {
      if (!p.name) issues.push({ level: "error", productId: p.id, field: "name", message: "Product name missing" });
      if (!p.description || p.description.trim().length < 10) issues.push({ level: "warn", productId: p.id, field: "description", message: "Product description too short or missing" });
      if (p.price === null || p.price === undefined || Number(p.price) <= 0) issues.push({ level: "error", productId: p.id, field: "price", message: "Valid price required" });
      if (!p.images || p.images.length === 0) issues.push({ level: "error", productId: p.id, field: "images", message: "At least one image required per product" });
      if (p.category === "clothing" && (!p.sizes || p.sizes.length === 0)) issues.push({ level: "warn", productId: p.id, field: "sizes", message: "Add sizes for clothing items" });
    }

    const findings = { issues, suggestions: [], checkedAt: new Date().toISOString() };
    await (prisma as any).brandCustomPage.update({ where: { id: pageId }, data: { aiReview: findings } });
    return NextResponse.json({ findings });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Review failed" }, { status: 500 });
  }
}
