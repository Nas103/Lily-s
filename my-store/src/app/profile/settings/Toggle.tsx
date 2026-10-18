"use client";

import { motion } from "motion/react";

export function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
        checked ? "bg-white" : "bg-zinc-700"
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="absolute top-0.5 h-5 w-5 rounded-full bg-zinc-900 shadow"
        style={{ left: checked ? 22 : 2 }}
      />
    </button>
  );
}

export function SettingRow({
  title,
  description,
  children,
  delay = 0,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="flex items-center justify-between gap-6 border-b border-zinc-800 py-4 last:border-0"
    >
      <div>
        <p className="text-sm font-medium text-zinc-100">{title}</p>
        {description && (
          <p className="mt-0.5 text-xs text-zinc-400">{description}</p>
        )}
      </div>
      {children}
    </motion.div>
  );
}