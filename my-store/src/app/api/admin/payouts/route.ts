import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { serializePayout } from "@/lib/payouts";

/**
 * GET /api/admin/payouts — every brand settlement, newest first, with brand
 * and order context for the release UI.
 */
export async function GET(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 500 });
  }
  const admin = await requireAdminUser(request);
  if (admin instanceof NextResponse) return admin;

  try {
    const rows = await (prisma as any).payout.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        brand: { select: { name: true } },
        order: { select: { orderNumber: true, paymentMethod: true } },
      },
    });
    return NextResponse.json({ payouts: rows.map(serializePayout) });
  } catch (error: any) {
    console.error("admin/payouts GET:", error);
    return NextResponse.json(
      { error: "Unable to load payouts." },
      { status: 503 }
    );
  }
}
