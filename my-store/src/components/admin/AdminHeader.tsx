"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminNav } from "@/app/admin/AdminNav";
import { AdminCommandPalette } from "@/components/admin/AdminCommandPalette";

export function AdminHeader() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    const kickoff = window.setTimeout(update, 0);
    const id = window.setInterval(update, 1000);
    return () => {
      window.clearTimeout(kickoff);
      window.clearInterval(id);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 pt-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-900">
            NaSO
          </span>
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-zinc-600">
            Admin panel
          </span>
        </div>
        <div className="flex items-center gap-3">
          <AdminCommandPalette />
          <span className="hidden text-xs tabular-nums text-zinc-500 md:inline">
            {now
              ? now.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              : "--:--:--"}
          </span>
          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 transition hover:text-zinc-900"
          >
            View store →
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 py-4">
        <AdminNav />
      </div>
    </header>
  );
}
