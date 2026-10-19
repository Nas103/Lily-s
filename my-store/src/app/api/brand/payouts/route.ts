import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireBrandAccount } from "@/lib/brandAuth";
import { serializePayout } from "@/lib/payouts";

/**
 * GET /api/brand/payouts — settlement history for the brand's completed
 * deliveries (PENDING until released by the platform after the dispute
 * window, then PAID/FAILED with transfer reference).
 */
export async function GET(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
  const gate = await requireBrandAccount(request);
  if (gate instanceof NextResponse) return gate;
  if (!gate.brand) {
    return NextResponse.json(
      { error: "Brand profile not found. Complete brand signup first.", code: "NO_BRAND" },
      { status: 403 }
    );
  }

  try {
    const rows = await (prisma as any).payout.findMany({
      where: { brandId: gate.brand.id },
      orderBy: { createdAt: "desc" },
      include: { order: { select: { orderNumber: true } } },
    });
    return NextResponse.json({ payouts: rows.map(serializePayout) });
  } catch (error: any) {
    console.error("brand/payouts GET:", error);
    return NextResponse.json(
      { error: "Unable to load payouts." },
      { status: 503 }
    );
  }
}
