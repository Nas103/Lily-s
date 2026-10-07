import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST(_request: NextRequest) {
  const res = NextResponse.json({ ok: true });
  return clearAuthCookie(res);
}