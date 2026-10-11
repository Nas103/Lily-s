import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdminUser } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: "Database is not configured." },
      { status: 500 }
    );
  }

  const admin = await requireAdminUser(request);
  if (admin instanceof NextResponse) return admin;

  const users = await (prisma as any).user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return NextResponse.json(users);
}

export async function DELETE(request: NextRequest) {
  if (!prisma) {
    return NextResponse.json(
      { error: "Database is not configured." },
      { status: 500 }
    );
  }

  const admin = await requireAdminUser(request);
  if (admin instanceof NextResponse) return admin;

  const { userId } = (await request.json()) as { userId?: string };

  if (!userId) {
    return NextResponse.json(
      { error: "userId is required." },
      { status: 400 }
    );
  }

  const target = await (prisma as any).user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!target) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  if (target.role === "ADMIN") {
    return NextResponse.json(
      { error: "Admin accounts cannot be removed." },
      { status: 400 }
    );
  }

  await (prisma as any).user.delete({
    where: { id: userId },
  });

  return NextResponse.json({ ok: true });
}


