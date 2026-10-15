import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminUser } from "@/lib/adminAuth";
import { getCatalogProduct } from "@/data/catalog";
import {
  saveProductOverride,
  resetProductOverride,
  type SaveProductOverrideInput,
} from "@/lib/productOverrides";

const MAX_VARIANTS = 60;
const MAX_VARIANT_LENGTH = 40;

function validateVariantList(value: unknown): string[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) throw new Error("Invalid variant list.");
  if (value.length > MAX_VARIANTS) throw new Error("Too many variants.");
  const cleaned = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
  if (cleaned.some((item) => item.length > MAX_VARIANT_LENGTH)) {
    throw new Error("Variant name is too long.");
  }
  return Array.from(new Set(cleaned));
}

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
    discountPercent?: number | null;
    soldOut?: boolean;
    soldOutSizes?: string[];
    soldOutColors?: string[];
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

  if (body.discountPercent !== undefined && body.discountPercent !== null) {
    if (
      typeof body.discountPercent !== "number" ||
      !Number.isFinite(body.discountPercent) ||
      body.discountPercent < 0 ||
      body.discountPercent > 90
    ) {
      return NextResponse.json(
        { error: "Invalid discount. Must be between 0 and 90 percent." },
        { status: 400 }
      );
    }
  }

  let soldOutSizes: string[] | undefined;
  let soldOutColors: string[] | undefined;
  try {
    soldOutSizes = validateVariantList(body.soldOutSizes);
    soldOutColors = validateVariantList(body.soldOutColors);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid variants." },
      { status: 400 }
    );
  }

  const payload: SaveProductOverrideInput = {
    productId: id,
    name: body.name ?? null,
    price: body.price ?? null,
    discountPercent: body.discountPercent ?? null,
    soldOut: Boolean(body.soldOut),
    soldOutSizes,
    soldOutColors,
    updatedBy: admin.email,
  };

  try {
    const saved = await saveProductOverride(payload);
    return NextResponse.json({
      id,
      hasOverride: true,
      name: saved.name ?? product.name,
      price: saved.price ?? product.price,
      overrideName: saved.name,
      overridePrice: saved.price,
      discountPercent: saved.discountPercent,
      soldOut: saved.soldOut,
      soldOutSizes: saved.soldOutSizes,
      soldOutColors: saved.soldOutColors,
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
    discountPercent: null,
    soldOut: false,
    soldOutSizes: [],
    soldOutColors: [],
  });
}