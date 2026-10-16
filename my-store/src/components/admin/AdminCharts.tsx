"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

export const CHART_COLORS = {
  ink: "#18181b",
  blue: "#2563eb",
  violet: "#7c3aed",
  emerald: "#059669",
  amber: "#d97706",
  rose: "#e11d48",
  zinc: "#a1a1aa",
} as const;

export const STATUS_COLORS: Record<string, string> = {
  PENDING: CHART_COLORS.zinc,
  PAID: CHART_COLORS.blue,
  PROCESSING: CHART_COLORS.blue,
  SHIPPED: CHART_COLORS.violet,
  DELIVERED: CHART_COLORS.emerald,
  CANCELLED: CHART_COLORS.rose,
  FAILED: CHART_COLORS.rose,
};

export function AnimatedNumber({
  value,
  format,
  duration = 700,
}: {
  value: number;
  format?: (value: number) => string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (reduce || from === to) {
      fromRef.current = to;
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      fromRef.current = to;
    };
  }, [value, duration, reduce]);

  const output = reduce ? value : display;
  return <>{format ? format(output) : Math.round(output).toLocaleString()}</>;
}

export function ProgressBar({
  value,
  max,
  color = CHART_COLORS.ink,
  label,
  valueLabel,
  delay = 0,
}: {
  value: number;
  max: number;
  color?: string;
  label?: string;
  valueLabel?: string;
  delay?: number;
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="space-y-1.5">
      {label || valueLabel ? (
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="truncate font-medium text-zinc-700">{label}</span>
          <span className="shrink-0 tabular-nums text-zinc-500">{valueLabel}</span>
        </div>
      ) : null}
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: "0%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut", delay }}
        />
      </div>
    </div>
  );
}

export function Sparkline({
  values,
  color = CHART_COLORS.ink,
  className = "",
}: {
  values: number[];
  color?: string;
  className?: string;
}) {
  const width = 100;
  const height = 32;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const step = values.length > 1 ? width / (values.length - 1) : width;
  const points = values.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / span) * (height - 4) - 2;
    return [x, y] as const;
  });
  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const gradientId = `spark-${color.replace("#", "")}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <motion.path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
    </svg>
  );
}

export type BarDatum = {
  label: string;
  value: number;
  secondary?: number;
};

export function BarChart({
  data,
  formatValue,
  color = CHART_COLORS.ink,
  height = 160,
}: {
  data: BarDatum[];
  formatValue?: (value: number) => string;
  color?: string;
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end gap-[3px]" style={{ height }}>
      {data.map((datum, index) => {
        const pct = (datum.value / max) * 100;
        return (
          <div
            key={`${datum.label}-${index}`}
            className="group relative flex h-full flex-1 items-end"
          >
            <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-2.5 py-1.5 text-[11px] leading-tight text-white shadow-lg group-hover:block">
              <div className="font-semibold">{datum.label}</div>
              <div className="tabular-nums text-zinc-300">
                {formatValue ? formatValue(datum.value) : datum.value.toLocaleString()}
              </div>
              {typeof datum.secondary === "number" ? (
                <div className="tabular-nums text-zinc-400">{datum.secondary} orders</div>
              ) : null}
            </div>
            <motion.div
              className="w-full rounded-t-[3px] transition-colors group-hover:opacity-80"
              style={{ backgroundColor: color }}
              initial={{ height: "0%" }}
              animate={{ height: `${Math.max(pct, datum.value > 0 ? 3 : 1)}%` }}
              transition={{ duration: 0.6, ease: "easeOut", delay: Math.min(index * 0.02, 0.4) }}
            />
          </div>
        );
      })}
    </div>
  );
}

export type RingSegment = {
  label: string;
  value: number;
  color: string;
};

export function RingChart({
  segments,
  size = 168,
  thickness = 16,
  centerValue,
  centerLabel,
  formatValue,
}: {
  segments: RingSegment[];
  size?: number;
  thickness?: number;
  centerValue?: number;
  centerLabel?: string;
  formatValue?: (value: number) => string;
}) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f4f4f5"
          strokeWidth={thickness}
        />
        {total > 0
          ? segments.map((segment, index) => {
              const length = (segment.value / total) * circumference;
              const circle = (
                <motion.circle
                  key={segment.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={thickness}
                  strokeLinecap="butt"
                  strokeDasharray={`${length} ${circumference - length}`}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: -offset }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.06 }}
                />
              );
              offset += length;
              return circle;
            })
          : null}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold tracking-tight text-zinc-900">
          {centerValue !== undefined ? (
            <AnimatedNumber value={centerValue} format={formatValue} />
          ) : (
            "—"
          )}
        </span>
        {centerLabel ? (
          <span className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-zinc-400">
            {centerLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  href,
  icon,
  accent = CHART_COLORS.ink,
  spark,
  delay = 0,
}: {
  label: string;
  value: string;
  sub?: string;
  href?: string;
  icon?: React.ReactNode;
  accent?: string;
  spark?: number[];
  delay?: number;
}) {
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      className="group relative h-full overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-900"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</p>
        {icon ? (
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: `${accent}14`, color: accent }}
          >
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">{value}</p>
      {sub ? <p className="mt-1 text-xs text-zinc-500">{sub}</p> : null}
      {spark && spark.length > 1 ? (
        <div className="mt-3 h-8 w-full">
          <Sparkline values={spark} color={accent} className="h-8 w-full" />
        </div>
      ) : null}
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {inner}
      </Link>
    );
  }
  return inner;
}
