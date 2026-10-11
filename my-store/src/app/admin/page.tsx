import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { loadProductOverrides } from "@/lib/productOverrides";

export const dynamic = "force-dynamic";

const money = (value: number | null | undefined) =>
  `$${(value ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default async function AdminOverviewPage() {
  const db = prisma as any;
  if (!db) {
    return (
      <p className="text-sm text-zinc-600">
        Database is not configured. Add DATABASE_URL to .env.local.
      </p>
    );
  }

  const [totalUsers, totalOrders, pendingOrders, revenueAgg, overrides] =
    await Promise.all([
      db.user.count() as Promise<number>,
      db.order.count() as Promise<number>,
      db.order.count({ where: { status: "PENDING" } }) as Promise<number>,
      db.order.aggregate({
        _sum: { total: true },
        where: { status: { notIn: ["CANCELLED", "FAILED"] } },
      }) as Promise<{ _sum: { total: string | number | null } }>,
      loadProductOverrides(),
    ]);

  const recentOrders = (await db.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true } },
    },
  })) as any[];

  const revenue = Number(revenueAgg._sum.total ?? 0);

  const stats = [
    { label: "Customers", value: String(totalUsers), href: "/admin/users" },
    { label: "Orders", value: String(totalOrders), href: "/admin/orders" },
    {
      label: "Pending orders",
      value: String(pendingOrders),
      href: "/admin/orders",
    },
    {
      label: "Revenue (paid)",
      value: money(revenue),
      href: "/admin/orders",
    },
    {
      label: "Products",
      value: String(overrides.size),
      href: "/admin/products",
      sub: "with admin edits",
    },
  ];

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
          Internal tool
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Dashboard
        </h1>
        <p className="text-sm text-zinc-600">
          Manage orders, products, and customers from one place.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-900"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
              {stat.value}
            </p>
            {stat.sub ? (
              <p className="mt-1 text-xs text-zinc-500">{stat.sub}</p>
            ) : null}
          </Link>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
            Recent orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 hover:text-zinc-900"
          >
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-10 text-center text-sm text-zinc-500">
            No orders yet.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-xs uppercase tracking-[0.2em] text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-zinc-100 last:border-0"
                  >
                    <td className="px-5 py-3 font-medium text-zinc-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-5 py-3 text-zinc-600">
                      {order.user?.email ?? order.shippingEmail ?? "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium text-zinc-900">
                      {money(Number(order.total))}
                    </td>
                    <td className="px-5 py-3 text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}