import { prisma } from "@/lib/prisma";

export type KnowledgeEntryDoc = {
  id: string;
  sourceType: string;
  sourceId: string | null;
  title: string;
  content: string;
  tags: string[];
  metadata: any;
  slug: string | null;
  productId: string | null;
  category: string | null;
  brandId: string | null;
  isActive: boolean;
  version: number;
  updatedAt: Date;
};

const db = () => (prisma as any);

export async function getAllKnowledgeEntries(): Promise<KnowledgeEntryDoc[]> {
  if (!prisma) return [];
  try {
    const rows = await db().knowledgeEntry.findMany({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });
    return rows as KnowledgeEntryDoc[];
  } catch (error) {
    console.warn("[ai-knowledge] failed to load entries", error);
    return [];
  }
}

export async function searchKnowledge(query: string, limit = 50): Promise<KnowledgeEntryDoc[]> {
  if (!prisma || !query.trim()) return getAllKnowledgeEntries().then((r) => r.slice(0, limit));
  const q = query.toLowerCase().trim();
  try {
    const rows = await db().knowledgeEntry.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
          { tags: { hasSome: q.split(/\s+/).filter(Boolean) } },
        ],
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
    });
    return rows as KnowledgeEntryDoc[];
  } catch (error) {
    console.warn("[ai-knowledge] search failed", error);
    return getAllKnowledgeEntries().then((r) => r.slice(0, limit));
  }
}

export async function upsertKnowledgeEntry(data: Partial<KnowledgeEntryDoc> & { id?: string; sourceType: string; title: string; content: string }) {
  if (!prisma) return null;
  try {
    if (data.id) {
      return await db().knowledgeEntry.update({ where: { id: data.id }, data: { ...data, version: { increment: 1 }, updatedAt: new Date() } as any });
    }
    return await db().knowledgeEntry.create({ data: { ...data, version: 1 } as any });
  } catch (error) {
    console.error("[ai-knowledge] upsert failed", error);
    return null;
  }
}

export async function logSync(triggeredBy?: string, status = "success", entries = 0, details?: any) {
  if (!prisma) return null;
  try {
    return await db().knowledgeSyncLog.create({ data: { triggeredBy, status, entries, details } });
  } catch (error) {
    console.warn("[ai-knowledge] logSync failed", error);
    return null;
  }
}
