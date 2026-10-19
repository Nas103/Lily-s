import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminUser } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/brands/[id]/products
 * All products of one brand, for the review panel.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!prisma) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 500 });
  }
  const admin = await requireAdminUser(request);
  if (admin instanceof NextResponse) return admin;

  const { id } = await context.params;
  const products = await (prisma as any).product.findMany({
    where: { brandId: id },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      imageUrl: true,
      status: true,
      discountPercent: true,
      createdAt: true,
      category: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}

/**
 * PATCH /api/admin/brands/[id]/products
 * Moderate one product of this brand:
 *   activate – status ACTIVE (delivers on the storefront)
 *   reject   – status REJECTED (brand edits re-queue it to PENDING_REVIEW)
 *   review   – back to PENDING_REVIEW
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!prisma) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 500 });
  }
  const admin = await requireAdminUser(request);
  if (admin instanceof NextResponse) return admin;

  const { id } = await context.params;
  const body = (await request.json()) as { productId?: string; action?: string };
  if (!body.productId || !body.action) {
    return NextResponse.json({ error: "productId and action are required." }, { status: 400 });
  }
  if (!["activate", "reject", "review"].includes(body.action)) {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  const product = await (prisma as any).product.findUnique({
    where: { id: body.productId },
    select: { id: true, brandId: true },
  });
  if (!product || product.brandId !== id) {
    return NextResponse.json({ error: "Product not found for this brand." }, { status: 404 });
  }

  const status =
    body.action === "activate" ? "ACTIVE" : body.action === "reject" ? "REJECTED" : "PENDING_REVIEW";
  const updated = await (prisma as any).product.update({
    where: { id: body.productId },
    data: { status },
    select: { id: true, status: true },
  });
  return NextResponse.json({ product: updated });
}
