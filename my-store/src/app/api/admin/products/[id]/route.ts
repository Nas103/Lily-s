import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminUser } from "@/lib/adminAuth";
import { getCatalogProduct } from "@/data/catalog";
import { saveProductOverride, resetProductOverride } from "@/lib/productOverrides";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminUser(request);
  if (admin instanceof NextResponse) return admin;

  const { id } = await context.params;
  const product = getCatalogProduct(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const body = (await request.json()) as {
    name?: string | null;
    price?: number | null;
  };

  if (typeof body.name === "string") {
    const trimmed = body.name.trim();
    if (!trimmed || trimmed.length > 200) {
      return NextResponse.json(
        { error: "Invalid name. Must be 1–200 characters." },
        { status: 400 }
      );
    }
    body.name = trimmed;
  }

  if (body.price !== undefined && body.price !== null) {
    if (
      typeof body.price !== "number" ||
      !Number.isFinite(body.price) ||
      body.price < 0 ||
      body.price > 1_000_000
    ) {
      return NextResponse.json(
        { error: "Invalid price. Must be a positive dollar amount." },
        { status: 400 }
      );
    }
  }

  try {
    const saved = await saveProductOverride({
      productId: id,
      name: body.name,
      price: body.price,
      updatedBy: admin.email,
    });
    return NextResponse.json({
      id,
      hasOverride: true,
      name: saved.name ?? product.name,
      price: saved.price ?? product.price,
      overrideName: saved.name,
      overridePrice: saved.price,
    });
  } catch (error) {
    console.error("[admin/products] update failed:", error);
    return NextResponse.json(
      { error: "Unable to save product changes." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminUser(request);
  if (admin instanceof NextResponse) return admin;

  const { id } = await context.params;
  const product = getCatalogProduct(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  await resetProductOverride(id);
  return NextResponse.json({
    id,
    hasOverride: false,
    name: product.name,
    price: product.price,
    overrideName: null,
    overridePrice: null,
  });
}