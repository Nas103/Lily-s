"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useToastStore } from "@/stores/toastStore";

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 right-6 z-50 flex w-[min(21rem,calc(100vw-3rem))] flex-col items-end gap-2"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="pointer-events-auto w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-900/10"
          >
            <div className="flex items-start gap-3 p-3.5">
              {toast.imageUrl ? (
                <Image
                  src={toast.imageUrl}
                  alt=""
                  width={44}
                  height={44}
                  unoptimized
                  className="h-11 w-11 shrink-0 rounded-xl border border-zinc-100 bg-zinc-50 object-cover"
                />
              ) : (
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-900">
                  <Check size={18} className="text-white" strokeWidth={2.5} />
                </span>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="mt-1 truncate text-sm font-medium text-zinc-900">
                    {toast.description}
                  </p>
                )}
                {toast.href && toast.linkLabel && (
                  <Link
                    href={toast.href}
                    className="mt-1 inline-block text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-900 underline underline-offset-4 hover:text-zinc-600"
                  >
                    {toast.linkLabel}
                  </Link>
                )}
              </div>

              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
                className="shrink-0 rounded-full p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
