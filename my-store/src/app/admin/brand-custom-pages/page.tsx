"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Page = any;

export default function AdminBrandCustomPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("SUBMITTED");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/brand-custom-pages?status=${status}`, { cache: "no-store" });
      const data = await res.json();
      setPages(data.pages || []);
    } catch {
      setPages([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [status]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto max-w-6xl px-6 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-400">Admin</p>
            <h1 className="text-2xl font-semibold">Brand Custom Pages</h1>
          </div>
          <div className="flex gap-2">
            {["SUBMITTED", "CHANGES_REQUESTED", "APPROVED", "REJECTED", "DRAFT"].map((s) => (
              <button key={s} onClick={() => setStatus(s)} className={`px-3 py-1 rounded-full text-xs border ${status === s ? "bg-black text-white" : "bg-white"}`}>{s}</button>
            ))}
          </div>
        </div>
        {loading ? <div className="text-sm text-zinc-500">Loading…</div> : null}
        <div className="grid gap-4">
          {pages.map((p) => (
            <Link key={p.id} href={`/admin/brand-custom-pages/${p.id}`} className="rounded-2xl border bg-white p-6 flex items-center justify-between hover:shadow-sm">
              <div>
                <p className="text-sm font-medium">{p.pageName}</p>
                <p className="text-xs text-zinc-500">{p.brand?.name} • {p.products?.length || 0} products • submitted {p.submittedAt ? new Date(p.submittedAt).toLocaleString() : "-"}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full border">{p.status}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
