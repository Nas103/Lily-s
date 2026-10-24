import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/adminAuth";
import { syncKnowledgeLibrary } from "@/lib/ai-knowledge/sync";
import { getAllKnowledgeEntries } from "@/lib/ai-knowledge/store";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const admin = await requireAdminUser(request);
  if (admin instanceof NextResponse) return admin;
  const entries = await getAllKnowledgeEntries();
  const logs = prisma ? await (prisma as any).knowledgeSyncLog.findMany({ orderBy: { createdAt: "desc" }, take: 10 }) : [];
  return NextResponse.json({ entries, logs });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdminUser(request);
  if (admin instanceof NextResponse) return admin;
  try {
    const body = await request.json().catch(() => ({}));
    const triggeredBy = (admin as any).email || (admin as any).id;
    const result = await syncKnowledgeLibrary(triggeredBy);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("[ai/knowledge] sync error", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
