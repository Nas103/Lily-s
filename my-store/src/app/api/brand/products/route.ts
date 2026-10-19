import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireBrandAccount, requireApprovedBrand } from "@/lib/brandAuth";
import { applySecurityMiddleware } from "@/lib/middleware";
import { validateBrandProduct, slugifyProduct } from "@/lib/brandProduct";
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
 * GET /api/brand/products
 * The caller's own products (any status), newest first.
 */
export async function GET(request: NextRequest) {
  const gate = await requireBrandAccount(request);
  if (gate instanceof NextResponse) return gate;
  if (!gate.brand) return NextResponse.json({ products: [] });
  if (!prisma) return NextResponse.json({ products: [] });
  try {
    const products = await (prisma as any).product.findMany({
      where: { brandId: gate.brand.id },
      select: LIST_SELECT,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ products });
  } catch (error: any) {
    return await handleApiError(
      error,
      "brand/products.list",
      "Unable to load products.",
      500
    );
  }
}

/**
 * POST /api/brand/products
 * Create a product. Only APPROVED brands may publish. brandId always comes
 * from the session user's brand row; slug is server-generated and unique.
 */
export async function POST(request: NextRequest) {
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

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const validation = validateBrandProduct(body, { partial: false });
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const category = await (prisma as any).category.findUnique({
      where: { id: validation.data.categoryId as string },
      select: { id: true },
    });
    if (!category) {
      return NextResponse.json({ error: "Category not found." }, { status: 400 });
    }

    const baseSlug = slugifyProduct(validation.data.name as string);
    let slug = baseSlug;
    for (let i = 2; i <= 100; i++) {
      const clash = await (prisma as any).product.findUnique({
        where: { slug },
        select: { id: true },
      });
      if (!clash) break;
      slug = `${baseSlug}-${i}`;
    }

    const product = await (prisma as any).product.create({
      data: {
        ...(validation.data as Record<string, unknown>),
        slug,
        brandId: gate.brand.id,
        status: validation.data.status ?? "ACTIVE",
      },
      select: LIST_SELECT,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "A product with this slug already exists." },
        { status: 409 }
      );
    }
    return await handleApiError(
      error,
      "brand/products.create",
      "Unable to create the product.",
      500
    );
  }
}
