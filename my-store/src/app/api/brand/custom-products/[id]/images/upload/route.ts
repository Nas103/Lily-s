import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireBrandAccount } from "@/lib/brandAuth";
import { applySecurityMiddleware } from "@/lib/middleware";
import { MAX_BRAND_IMAGE_BYTES, ALLOWED_BRAND_IMAGE_MIMES } from "@/lib/brand-custom";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const response = NextResponse.next();
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 60, windowMs: 60000 },
    csrf: true,
    securityHeaders: true,
  });
  if (securityResponse) return securityResponse;
  if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const { id: productId } = await params;
  const gate = await requireBrandAccount(request);
  if (gate instanceof NextResponse) return gate;
  if (!gate.brand) return NextResponse.json({ error: "Brand not found" }, { status: 404 });

  const product = await (prisma as any).brandCustomProduct.findFirst({ where: { id: productId, brandId: gate.brand.id } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    if (!ALLOWED_BRAND_IMAGE_MIMES.includes(file.type)) {
      return NextResponse.json({ error: "Only JPG, PNG, or WebP images are allowed" }, { status: 400 });
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes.length > MAX_BRAND_IMAGE_BYTES) {
      return NextResponse.json({ error: `Image exceeds max size of ${Math.round(MAX_BRAND_IMAGE_BYTES/1024/1024)}MB` }, { status: 400 });
    }

    const count = await (prisma as any).brandProductImage.count({ where: { productId } });
    const img = await (prisma as any).brandProductImage.create({
      data: {
        productId,
        name: file.name,
        mimeType: file.type,
        sizeBytes: bytes.length,
        data: bytes,
        sortOrder: count,
      },
    });
    return NextResponse.json({ image: { id: img.id, name: img.name, mimeType: img.mimeType, sizeBytes: img.sizeBytes, sortOrder: img.sortOrder } }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Upload failed" }, { status: 500 });
  }
}
