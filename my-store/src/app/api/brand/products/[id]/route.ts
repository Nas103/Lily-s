import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApprovedBrand } from "@/lib/brandAuth";
import { applySecurityMiddleware } from "@/lib/middleware";
import { validateBrandProduct } from "@/lib/brandProduct";
import { handleApiError } from "@/lib/errorHandler";

export const dynamic = "force-dynamic";

const LIST_SELECT = {
  id: true,
  name: true,
  slug: true,
  description: true,
  price: true,
  imageUrl: true,
  status: true,
  highlight: true,
  subCategory: true,
  gender: true,
  badge: true,
  tags: true,
  sizes: true,
  colors: true,
  colorImages: true,
  discountPercent: true,
  createdAt: true,
  updatedAt: true,
  category: { select: { id: true, name: true, slug: true } },
};

/**
 * Load a product only if it belongs to the caller's brand. Anything else is
 * a 404 so brand A can never probe brand B's product ids.
 */
async function findOwnProduct(brandId: string, id: string) {
  if (!prisma) return null;
  const product = await (prisma as any).product.findUnique({
    where: { id },
    select: { id: true, brandId: true, status: true },
  });
  if (!product || product.brandId !== brandId) return null;
  return product;
}

/**
 * PATCH /api/brand/products/[id]
 * Partial update of an own product.
 * Status rules:
 *   ACTIVE ↔ DRAFT freely while in those states.
 *   REJECTED / PENDING_REVIEW products re-queue to PENDING_REVIEW on any edit
 *   (brands cannot self-reinstate moderated products).
 * Slug is server-owned and never changes.
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const response = NextResponse.next();
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 30, windowMs: 60000 },
    csrf: true,
    securityHeaders: true,
  });
  if (securityResponse) return securityResponse;
  if (!prisma) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 500 });
  }

  const gate = await requireApprovedBrand(request);
  if (gate instanceof NextResponse) return gate;

  const { id } = await context.params;
  const existing = await findOwnProduct(gate.brand.id, id);
  if (!existing) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const validation = validateBrandProduct(body, { partial: true });
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    if (Object.keys(validation.data).length === 0) {
      return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
    }

    if (validation.data.categoryId) {
      const category = await (prisma as any).category.findUnique({
        where: { id: validation.data.categoryId as string },
        select: { id: true },
      });
      if (!category) {
        return NextResponse.json({ error: "Category not found." }, { status: 400 });
      }
    }

    const data: Record<string, unknown> = { ...validation.data };
    delete data.slug;

    if (existing.status === "REJECTED" || existing.status === "PENDING_REVIEW") {
      data.status = "PENDING_REVIEW";
    } else {
      data.status = validation.data.status ?? existing.status;
    }

    const product = await (prisma as any).product.update({
      where: { id },
      data,
      select: LIST_SELECT,
    });
    return NextResponse.json({ product });
  } catch (error: any) {
    return await handleApiError(
      error,
      "brand/products.update",
      "Unable to update the product.",
      500
    );
  }
}

/**
 * DELETE /api/brand/products/[id]
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const response = NextResponse.next();
  const securityResponse = applySecurityMiddleware(request, response, {
    rateLimit: { maxRequests: 20, windowMs: 60000 },
    csrf: true,
    securityHeaders: true,
  });
  if (securityResponse) return securityResponse;
  if (!prisma) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 500 });
  }

  const gate = await requireApprovedBrand(request);
  if (gate instanceof NextResponse) return gate;

  const { id } = await context.params;
  const existing = await findOwnProduct(gate.brand.id, id);
  if (!existing) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  try {
    await (prisma as any).product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return await handleApiError(
      error,
      "brand/products.delete",
      "Unable to delete the product.",
      500
    );
  }
}
