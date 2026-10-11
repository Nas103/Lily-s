import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminUser } from "@/lib/adminAuth";
import { catalogProducts } from "@/data/catalog";
import { loadProductOverrides } from "@/lib/productOverrides";

export async function GET(request: NextRequest) {
  const admin = await requireAdminUser(request);
  if (admin instanceof NextResponse) return admin;

  const overrides = await loadProductOverrides();

  const list = catalogProducts.map((product) => {
    const override = overrides.get(product.id);
    return {
      id: product.id,
      name: override?.name ?? product.name,
      baseName: product.name,
      price: override?.price ?? product.price,
      basePrice: product.price,
      imageUrl: product.imageUrl,
      category: product.category,
      subCategory: product.subCategory ?? null,
      brand: product.brand ?? null,
      hasOverride: Boolean(override),
      overrideName: override?.name ?? null,
      overridePrice: override?.price ?? null,
    };
  });

  list.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.name.localeCompare(b.name);
  });

  return NextResponse.json(list);
}