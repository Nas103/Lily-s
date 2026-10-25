"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Clock, CheckCircle, XCircle, AlertCircle, FileText, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type CustomPage = {
  id: string;
  pageName: string;
  status: string;
  submittedAt: string | null;
  brand: { name: string | null } | null;
  products: unknown[];
};

const statusConfig: Record<string, { icon: LucideIcon; color: string; bg: string; label: string }> = {
  SUBMITTED: { icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10", label: "Pending Review" },
  CHANGES_REQUESTED: { icon: AlertCircle, color: "text-orange-400", bg: "bg-orange-400/10", label: "Changes Requested" },
  APPROVED: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10", label: "Approved" },
  REJECTED: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10", label: "Rejected" },
  DRAFT: { icon: FileText, color: "text-white/40", bg: "bg-white/5", label: "Draft" },
};

export default function AdminBrandCustomPagesPage() {
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("SUBMITTED");
  const [counts, setCounts] = useState<Record<string, number>>({});

  async function load() {
    setLoading(true);
    try {
      const [res, allRes] = await Promise.all([
        fetch(`/api/admin/brand-custom-pages?status=${status}`, { cache: "no-store" }),
        fetch("/api/admin/brand-custom-pages", { cache: "no-store" }),
      ]);
      const data = (await res.json()) as { pages?: CustomPage[] };
      const allData = (await allRes.json()) as { pages?: CustomPage[] };
      setPages(data.pages || []);
      const c: Record<string, number> = {};
      (allData.pages || []).forEach((p) => {
        c[p.status] = (c[p.status] || 0) + 1;
      });
      setCounts(c);
    } catch {
      setPages([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const filters = ["SUBMITTED", "CHANGES_REQUESTED", "APPROVED", "REJECTED", "DRAFT"];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Content Management</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Brand Custom Pages</h1>
          <p className="mt-2 text-sm text-white/40">Review and moderate brand-submitted page templates with AI-assisted insights</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/5 bg-white/5 p-1">
          {filters.map((s) => {
            const cfg = statusConfig[s];
            const Icon = cfg?.icon;
            const active = status === s;
            return (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-all ${
                  active
                    ? "bg-gradient-to-r from-white/15 to-white/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
                    : "text-white/40 hover:bg-white/5 hover:text-white"
                }`}
              >
                {Icon ? <Icon className="h-4 w-4" /> : null}
                <span>{cfg?.label || s}</span>
                {counts[s] ? (
                  <span className={`rounded-full px-1.5 py-0.5 text-xs ${active ? "bg-white/10" : "bg-white/5"}`}>
                    {counts[s]}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl border border-white/5 bg-white/5" />
          ))}
        </div>
      ) : pages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent py-16 text-center">
          <div className="relative mb-4">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-fuchsia-500/20 to-cyan-400/20 blur-xl" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <FileText className="h-5 w-5 text-white/40" />
            </div>
          </div>
          <p className="text-white">No pages in this category</p>
          <p className="mt-1 text-sm text-white/40">Check other filters or wait for new submissions</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {pages.map((p) => {
            const cfg = statusConfig[p.status] || statusConfig.DRAFT;
            const Icon = cfg.icon;
            return (
              <Link
                key={p.id}
                href={`/admin/brand-custom-pages/${p.id}`}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent p-6 transition-all duration-300 hover:border-white/10 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cfg.bg}`}>
                      <Icon className={`h-5 w-5 ${cfg.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-white">{p.pageName}</h3>
                        <span className={`rounded-full px-2 py-0.5 text-xs ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-sm text-white/40">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" />
                          <span>{p.brand?.name || "Unknown"}</span>
                        </div>
                        <span>•</span>
                        <span>{p.products?.length || 0} products</span>
                        <span>•</span>
                        <span>{p.submittedAt ? new Date(p.submittedAt).toLocaleDateString() : "Not submitted"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-white/40 transition-transform group-hover:translate-x-1">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">Review</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
