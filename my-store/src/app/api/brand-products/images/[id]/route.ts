import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!prisma) return new NextResponse("Not found", { status: 404 });
  try {
    const img = await (prisma as any).brandProductImage.findUnique({ where: { id } });
    if (!img || !img.data) return new NextResponse("Not found", { status: 404 });
    const buffer = Buffer.from(img.data);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": img.mimeType || "image/jpeg",
        "Content-Length": String(buffer.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
