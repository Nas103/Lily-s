import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminUser } from "@/lib/adminAuth";
import { getAdminStats, normalizeRange } from "@/lib/adminStats";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const admin = await requireAdminUser(request);
  if (admin instanceof NextResponse) return admin;

  const range = normalizeRange(request.nextUrl.searchParams.get("range"));
  const stats = await getAdminStats(range);

  if (!stats) {
    return NextResponse.json(
      { error: "Analytics are unavailable. Check the database connection." },
      { status: 503 }
    );
  }

  return NextResponse.json(stats);
}
