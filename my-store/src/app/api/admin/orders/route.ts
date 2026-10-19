import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminUser } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { serializeOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const admin = await requireAdminUser(request);
  if (admin instanceof NextResponse) return admin;

  if (!prisma) {
    return NextResponse.json(
      { error: "Database is not configured." },
      { status: 500 }
    );
  }

  const orders = await (prisma as any).order.findMany({
    include: {
      orderItems: true,
      user: { select: { id: true, email: true, name: true } },
      brandOrders: { include: { brand: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const list = orders.map((order: any) => {
    const serialized = serializeOrder(order);
    return {
      ...serialized,
      userEmail: order.user?.email ?? null,
      userName: order.user?.name ?? null,
    };
  });

  return NextResponse.json(list);
}