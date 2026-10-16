import { prisma } from "@/lib/prisma";

export const ADMIN_RANGES = [7, 14, 30, 90] as const;
export type AdminRange = (typeof ADMIN_RANGES)[number];

export function normalizeRange(value: unknown): AdminRange {
  const num = Number(value);
  return (ADMIN_RANGES as readonly number[]).includes(num) ? (num as AdminRange) : 30;
}

export type SeriesPoint = {
  date: string;
  label: string;
  revenue: number;
  orders: number;
};

export type UsersPoint = {
  date: string;
  label: string;
  users: number;
};

export type NamedCount = {
  key: string;
  label: string;
  count: number;
};

export type TopProduct = {
  productId: string;
  name: string;
  quantity: number;
  revenue: number;
};

export type AdminRecentOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  currency: string;
  userEmail: string | null;
  createdAt: string;
};

export type AdminStats = {
  generatedAt: string;
  range: AdminRange;
  totals: {
    users: number;
    orders: number;
    pending: number;
    revenue: number;
    paidOrders: number;
    avgOrderValue: number;
    editedProducts: number;
    reviews: number;
    avgRating: number;
    rangeRevenue: number;
    rangeOrders: number;
    newUsers: number;
    conversionRate: number;
  };
  revenueSeries: SeriesPoint[];
  usersSeries: UsersPoint[];
  ordersByStatus: NamedCount[];
  paymentByStatus: NamedCount[];
  topProducts: TopProduct[];
  ratingDistribution: NamedCount[];
  recentOrders: AdminRecentOrder[];
};

type GroupRow = {
  _count?: { _all?: number };
  paymentStatus?: string;
  status?: string;
  rating?: number;
};

type OrderRow = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus?: string;
  total: unknown;
  currency?: string;
  createdAt: Date | string;
  shippingEmail?: string | null;
  user?: { email?: string | null } | null;
};

type AggregateResult = {
  _sum?: { total?: unknown };
  _count?: { _all?: number };
  _avg?: { rating?: unknown };
};

interface AdminDb {
  user: {
    count: (args?: unknown) => Promise<number>;
    findMany: (args?: unknown) => Promise<Array<{ createdAt: Date | string }>>;
  };
  order: {
    count: (args?: unknown) => Promise<number>;
    aggregate: (args: unknown) => Promise<AggregateResult>;
    findMany: (args?: unknown) => Promise<OrderRow[]>;
    groupBy: (args: unknown) => Promise<GroupRow[]>;
  };
  productOverride: { count: () => Promise<number> };
  review: {
    aggregate: (args: unknown) => Promise<AggregateResult>;
    groupBy: (args: unknown) => Promise<GroupRow[]>;
  };
  orderItem: {
    findMany: (args?: unknown) => Promise<
      Array<{ productId: string; name?: string; price: unknown; quantity: number }>
    >;
  };
}

const ORDER_STATUS_ORDER = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "FAILED",
];

const titleCase = (value: string) =>
  value.charAt(0) + value.slice(1).toLowerCase();

const dayLabel = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

export async function getAdminStats(range: AdminRange = 30): Promise<AdminStats | null> {
  const db = prisma as unknown as AdminDb | undefined;
  if (!db) return null;

  const now = new Date();
  const since = new Date(now.getTime() - range * 86_400_000);

  try {
    const [
      users,
      orders,
      pending,
      revenueAgg,
      editedProducts,
      reviewAgg,
      ordersInRange,
      usersInRange,
      statusGroups,
      paymentGroups,
      orderItems,
      recentOrders,
      ratingGroups,
    ] = await Promise.all([
      db.user.count(),
      db.order.count(),
      db.order.count({ where: { status: "PENDING" } }),
      db.order.aggregate({
        _sum: { total: true },
        _count: { _all: true },
        where: { status: { notIn: ["CANCELLED", "FAILED"] } },
      }),
      db.productOverride.count().catch(() => 0),
      db.review
        .aggregate({ _avg: { rating: true }, _count: { _all: true } })
        .catch(() => ({ _avg: { rating: 0 }, _count: { _all: 0 } })),
      db.order.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true, total: true, status: true },
      }),
      db.user.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true },
      }),
      db.order
        .groupBy({ by: ["status"], _count: { _all: true } })
        .catch(() => []),
      db.order
        .groupBy({ by: ["paymentStatus"], _count: { _all: true } })
        .catch(() => []),
      db.orderItem
        .findMany({
          where: { order: { status: { notIn: ["CANCELLED", "FAILED"] } } },
          select: { productId: true, name: true, price: true, quantity: true },
        })
        .catch(() => []),
      db.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { email: true } } },
      }),
      db.review.groupBy({ by: ["rating"], _count: { _all: true } }).catch(() => []),
    ]);

    const days: { key: string; label: string }[] = [];
    for (let i = range - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 86_400_000);
      days.push({ key: date.toISOString().slice(0, 10), label: dayLabel(date) });
    }

    const revenueMap = new Map(days.map((day) => [day.key, { revenue: 0, orders: 0 }]));
    for (const order of ordersInRange) {
      const key = new Date(order.createdAt).toISOString().slice(0, 10);
      const bucket = revenueMap.get(key);
      if (!bucket) continue;
      bucket.orders += 1;
      if (order.status !== "CANCELLED" && order.status !== "FAILED") {
        bucket.revenue += Number(order.total ?? 0);
      }
    }

    const usersMap = new Map(days.map((day) => [day.key, 0]));
    for (const user of usersInRange) {
      const key = new Date(user.createdAt).toISOString().slice(0, 10);
      if (usersMap.has(key)) usersMap.set(key, (usersMap.get(key) ?? 0) + 1);
    }

    const productMap = new Map<string, TopProduct>();
    for (const item of orderItems) {
      const id = String(item.productId);
      const current =
        productMap.get(id) ??
        ({ productId: id, name: item.name || id, quantity: 0, revenue: 0 } as TopProduct);
      current.quantity += item.quantity ?? 0;
      current.revenue += Number(item.price ?? 0) * (item.quantity ?? 0);
      if (item.name) current.name = item.name;
      productMap.set(id, current);
    }

    const statusLookup = new Map<string, number>();
    for (const group of statusGroups) statusLookup.set(String(group.status), group._count?._all ?? 0);

    const ordersByStatus: NamedCount[] = ORDER_STATUS_ORDER.map((status) => ({
      key: status,
      label: titleCase(status),
      count: statusLookup.get(status) ?? 0,
    }));

    const paymentByStatus: NamedCount[] = (paymentGroups as GroupRow[]).map((group) => ({
      key: String(group.paymentStatus),
      label: titleCase(String(group.paymentStatus)),
      count: group._count?._all ?? 0,
    }));

    const ratingLookup = new Map<number, number>();
    for (const group of ratingGroups as GroupRow[]) {
      ratingLookup.set(Number(group.rating), group._count?._all ?? 0);
    }
    const ratingDistribution: NamedCount[] = [5, 4, 3, 2, 1].map((stars) => ({
      key: String(stars),
      label: `${stars}★`,
      count: ratingLookup.get(stars) ?? 0,
    }));

    const revenueSeries: SeriesPoint[] = days.map((day) => {
      const bucket = revenueMap.get(day.key)!;
      return { date: day.key, label: day.label, revenue: bucket.revenue, orders: bucket.orders };
    });

    const usersSeries: UsersPoint[] = days.map((day) => ({
      date: day.key,
      label: day.label,
      users: usersMap.get(day.key) ?? 0,
    }));

    const revenue = Number(revenueAgg?._sum?.total ?? 0);
    const paidOrders = Number(revenueAgg?._count?._all ?? 0);
    const rangeRevenue = revenueSeries.reduce((sum, point) => sum + point.revenue, 0);
    const rangeOrders = ordersInRange.length;
    const newUsers = usersInRange.length;

    return {
      generatedAt: new Date().toISOString(),
      range,
      totals: {
        users,
        orders,
        pending,
        revenue,
        paidOrders,
        avgOrderValue: paidOrders ? revenue / paidOrders : 0,
        editedProducts,
        reviews: Number(reviewAgg?._count?._all ?? 0),
        avgRating: Number(reviewAgg?._avg?.rating ?? 0),
        rangeRevenue,
        rangeOrders,
        newUsers,
        conversionRate: users ? paidOrders / users : 0,
      },
      revenueSeries,
      usersSeries,
      ordersByStatus,
      paymentByStatus,
      topProducts: [...productMap.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 6),
      ratingDistribution,
      recentOrders: (recentOrders as OrderRow[]).map((order) => ({
        id: String(order.id),
        orderNumber: String(order.orderNumber),
        status: String(order.status),
        paymentStatus: String(order.paymentStatus),
        total: Number(order.total ?? 0),
        currency: String(order.currency ?? "USD"),
        userEmail: order.user?.email ?? order.shippingEmail ?? null,
        createdAt: new Date(order.createdAt).toISOString(),
      })),
    };
  } catch (error) {
    console.error("[adminStats] failed to aggregate stats", error);
    return null;
  }
}
