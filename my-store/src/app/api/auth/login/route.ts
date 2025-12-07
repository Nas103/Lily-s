import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!prisma) {
    console.error("[auth/login] Prisma client is not available");
    return NextResponse.json(
      { error: "Database is not configured." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { email, password } = body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await (prisma as any).user.findUnique({
      where: { email },
    });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  const ok = await bcrypt.compare(password, (user as any).passwordHash);

  if (!ok) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

    // For now we just return user info; sessions/tokens can be added later.
    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: (user as any).role,
        createdAt: (user as any).createdAt?.toISOString() || new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[auth/login] Error:", error);
    return NextResponse.json(
      { 
        error: error.message || "Database error occurred. Please check if tables exist." 
      },
      { status: 500 }
    );
  }
}


