import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminUser } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/brands
 * Every brand with its owner, verification state and product count.
 */
export async function GET(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 500 });
  }
  const admin = await requireAdminUser(request);
  if (admin instanceof NextResponse) return admin;

  const brands = await (prisma as any).brand.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      verificationStatus: true,
      verificationDocUrl: true,
      contactEmail: true,
      contactPhone: true,
      country: true,
      businessName: true,
      website: true,
      description: true,
      rejectionReason: true,
      reviewedAt: true,
      stripeAccountId: true,
      commissionRate: true,
      subscriptionTier: true,
      createdAt: true,
      user: { select: { id: true, email: true, name: true, createdAt: true } },
      _count: { select: { products: true, brandOrders: true, payouts: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(brands);
}
