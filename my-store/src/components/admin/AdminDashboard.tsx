"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  BadgeDollarSign,
  Boxes,
  Package,
  RefreshCw,
  ShoppingCart,
  Star,
  Users,
} from "lucide-react";
import {
  ADMIN_RANGES,
  type AdminRange,
  type AdminStats,
  type NamedCount,
} from "@/lib/adminStats";
import {
  AnimatedNumber,
  BarChart,
  CHART_COLORS,
  ProgressBar,
  RingChart,
  Sparkline,
  StatCard,
  STATUS_COLORS,
} from "./AdminCharts";

const money = (value: number) =>
  `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const compact = (value: number) =>
  value.toLocaleString(undefined, { notation: "compact", maximumFractionDigits: 1 });

const REFRESH_MS = 12_000;

export function AdminDashboard({ initial }: { initial: AdminStats | null }) {
  const [stats, setStats] = useState<AdminStats | null>(initial);
  const [range, setRange] = useState<AdminRange>(initial?.range ?? 30);
  const [live, setLive] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<number | null>(initial ? Date.now() : null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const rangeRef = useRef(range);
  rangeRef.current = range;

  const refresh = useCallback(
    async (nextRange?: AdminRange, silent = false) => {
      const activeRange = nextRange ?? rangeRef.current;
      if (!silent) setRefreshing(true);
      try {
        const res = await fetch(`/api/admin/stats?range=${activeRange}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error ?? "Unable to load analytics.");
        }
        const data = (await res.json()) as AdminStats;
        setStats(data);
        setUpdatedAt(Date.now());
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load analytics.");
      } finally {
        if (!silent) setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") void refresh(undefined, true);
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, [live, refresh]);

  useEffect(() => {
    if (!updatedAt) return;
    const id = setInterval(() => setSecondsAgo(Math.round((Date.now() - updatedAt) / 1000)), 1000);
    setSecondsAgo(Math.round((Date.now() - updatedAt) / 1000));
    return () => clearInterval(id);
  }, [updatedAt]);

  const selectRange = (next: AdminRange) => {
    setRange(next);
    void refresh(next);
  };

  if (!stats) {
    return (
      <div className="space-y-6">
        <DashboardHeading />
        <p className="rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-10 text-center text-sm text-zinc-500">
          {error ?? "Analytics are unavailable. Check the database connection."}
        </p>
        <button
          type="button"
          onClick={() => void refresh()}
          className="rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-80"
        >
          Retry
        </button>
      </div>
    );
  }

  const { totals, revenueSeries, usersSeries, ordersByStatus, topProducts, ratingDistribution } =
    stats;

  const maxProductRevenue = Math.max(...topProducts.map((product) => product.revenue), 1);
  const maxRating = Math.max(...ratingDistribution.map((bucket) => bucket.count), 1);
  const statusSegments = ordersByStatus
    .filter((status) => status.count > 0)
    .map((status) => ({
      label: status.label,
      value: status.count,
      color: STATUS_COLORS[status.key] ?? CHART_COLORS.zinc,
    }));
  const revenueSpark = revenueSeries.map((point) => point.revenue);
  const userSpark = usersSeries.map((point) => point.users);

  return (
    <div className="space-y-8">
      <DashboardHeading />

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white p-1">
          {ADMIN_RANGES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => selectRange(option)}
              className={
                option === range
                  ? "rounded-full bg-black px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white"
                  : "rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500 transition hover:text-zinc-900"
              }
            >
              {option}d
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setLive((value) => !value)}
          className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-600 transition hover:border-zinc-900 hover:text-zinc-900"
          aria-pressed={live}
        >
          <span className="relative flex h-2 w-2">
            {live ? (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            ) : null}
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${live ? "bg-emerald-500" : "bg-zinc-300"}`}
            />
          </span>
          {live ? "Live" : "Paused"}
        </button>

        <button
          type="button"
          onClick={() => void refresh()}
          className="flex items-center gap-2 rounded-full border border-zinc-300 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-600 transition hover:border-zinc-900 hover:text-zinc-900 disabled:opacity-50"
          disabled={refreshing}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>

        <span className="ml-auto text-xs text-zinc-500">
          {error ? (
            <span className="text-red-600">{error}</span>
          ) : (
            <>
              Synced {secondsAgo <= 1 ? "just now" : `${secondsAgo}s ago`} ·{" "}
              <span className="tabular-nums">
                {new Date(stats.generatedAt).toLocaleTimeString()}
              </span>
            </>
          )}
        </span>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Revenue (paid)"
          value={money(totals.revenue)}
          sub={`${totals.paidOrders} paid orders`}
          href="/admin/orders"
          icon={<BadgeDollarSign className="h-4 w-4" />}
          accent={CHART_COLORS.emerald}
          spark={revenueSpark}
          delay={0}
        />
        <StatCard
          label={`Revenue · ${range}d`}
          value={money(totals.rangeRevenue)}
          sub={`${totals.rangeOrders} orders`}
          href="/admin/orders"
          icon={<Activity className="h-4 w-4" />}
          accent={CHART_COLORS.blue}
          delay={0.05}
        />
        <StatCard
          label="Orders"
          value={compact(totals.orders)}
          sub={`${totals.pending} pending`}
          href="/admin/orders"
          icon={<ShoppingCart className="h-4 w-4" />}
          accent={CHART_COLORS.violet}
          delay={0.1}
        />
        <StatCard
          label="Customers"
          value={compact(totals.users)}
          sub={`+${totals.newUsers} new · ${range}d`}
          href="/admin/users"
          icon={<Users className="h-4 w-4" />}
          accent={CHART_COLORS.amber}
          spark={userSpark}
          delay={0.15}
        />
        <StatCard
          label="Avg order value"
          value={money(totals.avgOrderValue)}
          sub={`${(totals.conversionRate * 100).toFixed(1)}% conversion`}
          href="/admin/orders"
          icon={<Package className="h-4 w-4" />}
          accent={CHART_COLORS.ink}
          delay={0.2}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-zinc-900">
                Revenue flow
              </h2>
              <p className="text-xs text-zinc-500">Last {range} days</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold tracking-tight text-zinc-900">
                <AnimatedNumber value={totals.rangeRevenue} format={money} />
              </p>
              <p className="text-xs text-zinc-500">{totals.rangeOrders} orders</p>
            </div>
          </div>
          <div className="mt-5">
            <BarChart
              data={revenueSeries.map((point) => ({
                label: point.label,
                value: point.revenue,
                secondary: point.orders,
              }))}
              formatValue={money}
              color={CHART_COLORS.blue}
              height={180}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900">Order pipeline</h2>
          <p className="text-xs text-zinc-500">All-time status mix</p>
          <div className="mt-4 flex flex-col items-center gap-5">
            <RingChart
              segments={statusSegments}
              centerValue={totals.orders}
              centerLabel="Orders"
              formatValue={compact}
            />
            <div className="grid w-full grid-cols-2 gap-x-4 gap-y-2">
              {ordersByStatus.map((status) => (
                <LegendRow key={status.key} status={status} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-900">
              Top products
            </h2>
            <Link
              href="/admin/products"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-900"
            >
              Manage →
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {topProducts.length === 0 ? (
              <p className="text-sm text-zinc-500">No sales yet.</p>
            ) : (
              topProducts.map((product, index) => (
                <ProgressBar
                  key={product.productId}
                  label={product.name}
                  valueLabel={`${product.quantity} sold · ${money(product.revenue)}`}
                  value={product.revenue}
                  max={maxProductRevenue}
                  color={index === 0 ? CHART_COLORS.emerald : CHART_COLORS.blue}
                  delay={index * 0.05}
                />
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-semibold tracking-tight text-zinc-900">
              Ratings
            </h2>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            <span className="font-semibold text-zinc-900">
              <AnimatedNumber value={totals.avgRating} format={(v) => v.toFixed(2)} />
            </span>{" "}
            avg · {totals.reviews} reviews
          </p>
          <div className="mt-5 space-y-3">
            {ratingDistribution.map((bucket, index) => (
              <ProgressBar
                key={bucket.key}
                label={bucket.label}
                valueLabel={String(bucket.count)}
                value={bucket.count}
                max={maxRating}
                color={CHART_COLORS.amber}
                delay={index * 0.05}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-900">
              Recent orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-900"
            >
              View all →
            </Link>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-zinc-100">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-100 text-xs uppercase tracking-[0.15em] text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-zinc-50 last:border-0">
                    <td className="px-4 py-3 font-medium text-zinc-900">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-zinc-600">{order.userEmail ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-white"
                        style={{ backgroundColor: STATUS_COLORS[order.status] ?? CHART_COLORS.zinc }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-900">{money(order.total)}</td>
                    <td className="px-4 py-3 text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {stats.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-zinc-500">
                      No orders yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <Boxes className="h-4 w-4 text-zinc-500" />
            <h2 className="text-sm font-semibold tracking-tight text-zinc-900">
              Catalog health
            </h2>
          </div>
          <div className="mt-4 space-y-4">
            <MiniStat label="Products with edits" value={compact(totals.editedProducts)} />
            <MiniStat label={`New customers · ${range}d`} value={compact(totals.newUsers)} />
            <MiniStat label="Pending orders" value={compact(totals.pending)} />
            <div className="pt-1">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                New customers · {range}d
              </p>
              <div className="mt-2 h-10 w-full">
                <Sparkline values={userSpark} color={CHART_COLORS.amber} className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DashboardHeading() {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">Live analytics</p>
      <h1 className="text-3xl font-semibold tracking-tight text-white">Dashboard</h1>
      <p className="text-sm text-zinc-300">
        Revenue, orders, and customers streaming in from your store in real time.
      </p>
    </div>
  );
}

function LegendRow({ status }: { status: NamedCount }) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="flex items-center gap-2 text-zinc-600">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: STATUS_COLORS[status.key] ?? CHART_COLORS.zinc }}
        />
        {status.label}
      </span>
      <span className="tabular-nums font-medium text-zinc-900">{status.count}</span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-zinc-100 pb-3 last:border-0">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-sm font-semibold tracking-tight text-zinc-900">{value}</span>
    </div>
  );
}
