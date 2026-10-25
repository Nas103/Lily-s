import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  const gate = await requireAdminUser(request);
  if (gate instanceof NextResponse) return gate;
  if (!prisma) return NextResponse.json({ pages: [] });

  const url = new URL(request.url);
  const status = url.searchParams.get("status") || undefined;

  const pages = await (prisma as any).brandCustomPage.findMany({
    where: status ? { status } : undefined,
    include: { brand: true, products: { include: { images: { select: { id: true, name: true, mimeType: true, sizeBytes: true, sortOrder: true } } } }, submissions: { orderBy: { createdAt: "desc" }, take: 5 } },
    orderBy: { submittedAt: "desc", updatedAt: "desc" },
  });
  return NextResponse.json({ pages });
}
