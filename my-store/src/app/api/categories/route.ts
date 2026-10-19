import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const FALLBACK = [
  { name: "Men", slug: "men" },
  { name: "Women", slug: "women" },
  { name: "Lifestyle", slug: "lifestyle" },
  { name: "Running", slug: "running" },
  { name: "Boxraw", slug: "boxraw" },
  { name: "Electronics", slug: "electronics" },
  { name: "Perfumes", slug: "perfumes" },
  { name: "Featured", slug: "featured" },
];

/**
 * GET /api/categories
 * Public category list for storefront filters and the brand product form.
 */
export async function GET() {
  if (!prisma) {
    return NextResponse.json({ categories: FALLBACK });
  }
  try {
    const categories = await (prisma as any).category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    });
    if (!categories.length) {
      return NextResponse.json({ categories: FALLBACK });
    }
    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json({ categories: FALLBACK });
  }
}
