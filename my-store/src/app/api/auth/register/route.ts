import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!prisma) {
    console.error("[auth/register] Prisma client is not available");
    return NextResponse.json(
      { error: "Database is not configured." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { email, password, name } = body as {
      email?: string;
      password?: string;
      name?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const existing = await (prisma as any).user.findUnique({
      where: { email },
    });

  if (existing) {
    return NextResponse.json(
      { error: "A user with this email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const adminEmail = process.env.ADMIN_EMAIL;

  const user = await (prisma as any).user.create({
    data: {
      email,
      name,
      passwordHash,
      role: adminEmail && email === adminEmail ? "ADMIN" : "USER",
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

    return NextResponse.json({
      ...user,
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
    }, { status: 201 });
  } catch (error: any) {
    console.error("[auth/register] Error:", error);
    
    // Check for specific Prisma errors
    if (error.code === 'P2021' || error.message?.includes('does not exist')) {
      return NextResponse.json(
        { error: "Database tables do not exist. Please run: npx prisma db push" },
        { status: 500 }
      );
    }
    
    if (error.code === 'P1001' || error.message?.includes('Can\'t reach database')) {
      return NextResponse.json(
        { error: "Cannot connect to database. Please check DATABASE_URL." },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: error.message || "Database error occurred. Please check server logs." 
      },
      { status: 500 }
    );
  }
}


