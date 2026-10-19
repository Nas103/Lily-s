import { prisma } from "@/lib/prisma";

export type ThreadMessage = {
  id: string;
  body: string;
  fromUserId: string;
  fromRole: string;
  toUserId: string | null;
  orderId: string | null;
  createdAt: string;
  readAt: string | null;
  fromName: string | null;
};

export type MessageThread = {
  key: string;
  orderId: string | null;
  customer: { id: string; name: string | null } | null;
  unread: number;
  messages: ThreadMessage[];
};

function iso(value: any): string | null {
  return value ? (value.toISOString?.() ?? String(value)) : null;
}

/** Resolve display names for a set of user ids (missing ids => null). */
export async function loadUserNames(
  ids: string[]
): Promise<Map<string, { name: string | null; email: string | null }>> {
  const map = new Map<string, { name: string | null; email: string | null }>();
  const unique = [...new Set(ids.filter(Boolean))];
  if (!unique.length || !prisma) return map;
  try {
    const users = await (prisma as any).user.findMany({
      where: { id: { in: unique } },
      select: { id: true, name: true, email: true },
    });
    for (const user of users) {
      map.set(user.id, { name: user.name ?? null, email: user.email ?? null });
    }
  } catch {
    // Names are cosmetic — proceed without them.
  }
  return map;
}

export function serializeMessage(row: any, names: Map<string, { name: string | null }>): ThreadMessage {
  return {
    id: row.id,
    body: row.body,
    fromUserId: row.fromUserId,
    fromRole: row.fromRole,
    toUserId: row.toUserId ?? null,
    orderId: row.orderId ?? null,
    createdAt: iso(row.createdAt) ?? "",
    readAt: iso(row.readAt),
    fromName: names.get(row.fromUserId)?.name ?? null,
  };
}

/** The customer side of a message (null for admin-only platform notes). */
function customerOf(row: any): string | null {
  if (row.fromRole === "USER") return row.fromUserId;
  if (row.fromRole === "BRAND") return row.toUserId ?? null;
  return null;
}

/**
 * Group a brand's flat message rows into threads keyed by order (preferred)
 * or customer. Threads sort by latest activity, messages ascending.
 * `viewerId` counts unread inbound messages.
 */
export function buildThreads(
  rows: any[],
  names: Map<string, { name: string | null }>,
  viewerId: string
): MessageThread[] {
  const threads = new Map<string, MessageThread>();

  for (const row of rows) {
    const customer = customerOf(row);
    const key = row.orderId
      ? `o:${row.orderId}`
      : `u:${customer ?? row.toUserId ?? "platform"}`;

    let thread = threads.get(key);
    if (!thread) {
      thread = {
        key,
        orderId: row.orderId ?? null,
        customer: customer ? { id: customer, name: names.get(customer)?.name ?? null } : null,
        unread: 0,
        messages: [],
      };
      threads.set(key, thread);
    }
    if (row.orderId && !thread.orderId) thread.orderId = row.orderId;
    if (!thread.customer && customer) {
      thread.customer = { id: customer, name: names.get(customer)?.name ?? null };
    }
    if (!row.readAt && row.toUserId === viewerId) thread.unread += 1;
    thread.messages.push(serializeMessage(row, names));
  }

  const list = [...threads.values()];
  for (const thread of list) {
    thread.messages.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }
  list.sort((a, b) => {
    const aLast = a.messages[a.messages.length - 1]?.createdAt ?? "";
    const bLast = b.messages[b.messages.length - 1]?.createdAt ?? "";
    return bLast.localeCompare(aLast);
  });
  return list;
}
