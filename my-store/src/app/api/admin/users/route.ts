import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Check if request is from an authenticated admin user
async function isAdminRequest(request: Request): Promise<boolean> {
  // Method 1: Session-based auth (from auth store)
  const userId = request.headers.get("x-user-id");
  const userEmail = request.headers.get("x-user-email");

  if (userId && userEmail && prisma) {
    try {
      const user = await (prisma as any).user.findUnique({
        where: { id: userId },
        select: { email: true, role: true },
      });

      if (user && user.email === userEmail && user.role === "ADMIN") {
        return true;
      }
    } catch (error) {
      // Fall through to method 2
    }
  }

  // Method 2: Legacy header-based auth (for backwards compatibility)
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const headerEmail = request.headers.get("x-admin-email") ?? "";
  const headerPassword = request.headers.get("x-admin-password") ?? "";

  return adminEmail && adminPassword
    ? headerEmail === adminEmail && headerPassword === adminPassword
    : false;
}

export async function GET(request: Request) {
  if (!prisma) {
    return NextResponse.json(
      { error: "Database is not configured." },
      { status: 500 }
    );
  }

  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

export async function DELETE(request: Request) {
  if (!prisma) {
    return NextResponse.json(
      { error: "Database is not configured." },
      { status: 500 }
    );
  }

  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = (await request.json()) as { userId?: string };

  if (!userId) {
    return NextResponse.json(
      { error: "userId is required." },
      { status: 400 }
    );
  }

  await (prisma as any).user.delete({
    where: { id: userId },
  });

  return NextResponse.json({ ok: true });
}


