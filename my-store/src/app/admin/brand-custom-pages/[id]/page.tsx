"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, CheckCircle, XCircle, MessageSquare, Sparkles, Image as ImageIcon, Tag, Ruler, Palette } from "lucide-react";

type ReviewIssue = {
  level?: string;
  message: string;
  productId?: string | null;
};

type PageImage = { id: string };

type PageProduct = {
  id: string;
  name: string;
  price: number | string;
  category: string;
  description?: string | null;
  sizes?: string[];
  colors?: string[];
  tags?: string[];
  images?: PageImage[];
};

type Submission = {
  id: string;
  status: string;
  createdAt: string;
};

type CustomPage = {
  id: string;
  pageName: string;
  status: string;
  slug: string;
  description?: string | null;
  guidelines?: string | null;
  adminNotes?: string | null;
  aiReview?: { issues?: ReviewIssue[] } | null;
  brand?: { name?: string | null } | null;
  products?: PageProduct[];
  submissions?: Submission[];
};

export default function AdminBrandCustomPageDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [page, setPage] = useState<CustomPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [acting, setActing] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/brand-custom-pages`, { cache: "no-store" });
      const data = (await res.json()) as { pages?: CustomPage[] };
      const found = (data.pages || []).find((p) => p.id === id);
      setPage(found || null);
      if (found?.adminNotes) setAdminNotes(found.adminNotes);
    } catch {
      setPage(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function review(action: "approve" | "reject" | "changes_requested") {
    if (action === "reject" && !rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    setActing(true);
    try {
      const res = await fetch(`/api/admin/brand-custom-pages/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, adminNotes, rejectionReason }),
      });
      if (res.ok) {
        router.push("/admin/brand-custom-pages");
      }
    } finally {
      setActing(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-white" />
      </div>
    );
  }
  if (!page) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-white">Page not found</p>
        <button onClick={() => router.back()} className="mt-4 text-sm text-white/40 hover:text-white">Go back</button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/5 text-white/60 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-[0.4em] text-white/40">{page.brand?.name}</p>
              <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-white/40">{page.status}</span>
            </div>
            <h1 className="mt-1 text-2xl font-semibold text-white">{page.pageName}</h1>
            <p className="mt-1 text-sm text-white/40">Preview all inputs before making a decision</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button disabled={acting} onClick={() => review("changes_requested")} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white/5 disabled:opacity-50">
            <MessageSquare className="h-4 w-4" />
            Request Changes
          </button>
          <button disabled={acting} onClick={() => review("reject")} className="flex items-center gap-2 rounded-xl border border-red-500/30 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10 disabled:opacity-50">
            <XCircle className="h-4 w-4" />
            Reject
          </button>
          <button disabled={acting} onClick={() => review("approve")} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-sm text-white shadow-[0_0_40px_-10px_rgba(16,185,129,0.6)] transition hover:shadow-[0_0_60px_-10px_rgba(16,185,129,0.8)] disabled:opacity-50">
            <CheckCircle className="h-4 w-4" />
            Approve & Publish
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
            <div className="border-b border-white/5 px-6 py-4">
              <h2 className="text-sm font-medium text-white">Page Configuration</h2>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/40">Description</p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{page.description || "No description provided"}</p>
              </div>
              {page.guidelines ? (
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">Brand Guidelines</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{page.guidelines}</p>
                </div>
              ) : null}
              {page.aiReview ? (
                <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-fuchsia-400" />
                    <p className="text-sm font-medium text-white">AI Review Findings</p>
                  </div>
                  <div className="mt-3 space-y-2">
                    {(page.aiReview.issues || []).length === 0 ? (
                      <p className="text-xs text-emerald-400">No issues detected</p>
                    ) : (
                      (page.aiReview.issues || []).map((iss, i) => (
                        <div key={i} className={`rounded-xl px-3 py-2 text-xs ${iss.level === "error" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"}`}>
                          {iss.productId ? "• Product issue: " : "• Page issue: "}{iss.message}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
              <h2 className="text-sm font-medium text-white">Products</h2>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-white/40">{page.products?.length || 0} items</span>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-2">
              {(page.products || []).map((p) => (
                <div key={p.id} className="group overflow-hidden rounded-2xl border border-white/5 bg-white/5 transition hover:border-white/10">
                  <div className="grid grid-cols-4 gap-1">
                    {(p.images || []).slice(0, 4).map((img) => (
                      <div key={img.id} className="relative aspect-[3/4] bg-zinc-900">
                        <Image src={`/api/brand-products/images/${img.id}`} alt={p.name} fill className="object-cover" />
                      </div>
                    ))}
                    {(!p.images || p.images.length === 0) ? (
                      <div className="col-span-4 flex aspect-video items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-white/20" />
                      </div>
                    ) : null}
                  </div>
                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-white">{p.name}</p>
                        <p className="text-sm text-white/40">${Number(p.price).toFixed(2)} USD</p>
                      </div>
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-white/40">{p.category}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-white/50 line-clamp-3">{p.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-white/40">
                      {p.sizes?.length ? (
                        <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-1">
                          <Ruler className="h-3 w-3" />
                          <span>{p.sizes.join(", ")}</span>
                        </div>
                      ) : null}
                      {p.colors?.length ? (
                        <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-1">
                          <Palette className="h-3 w-3" />
                          <span>{p.colors.join(", ")}</span>
                        </div>
                      ) : null}
                      {p.tags?.length ? (
                        <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-1">
                          <Tag className="h-3 w-3" />
                          <span>{p.tags.slice(0, 2).join(", ")}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
            <div className="border-b border-white/5 px-6 py-4">
              <h2 className="text-sm font-medium text-white">Admin Decision</h2>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="text-xs uppercase tracking-widest text-white/40">Internal Notes / Feedback</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes visible to brand when requesting changes..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-white/20 focus:outline-none"
                  rows={4}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-white/40">Rejection Reason (required)</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Be specific and constructive..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-white/20 focus:outline-none"
                  rows={3}
                />
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
            <div className="border-b border-white/5 px-6 py-4">
              <h2 className="text-sm font-medium text-white">Submission History</h2>
            </div>
            <div className="p-6">
              {(page.submissions || []).length === 0 ? (
                <p className="text-xs text-white/40">No submission history</p>
              ) : (
                <div className="space-y-3">
                  {(page.submissions || []).map((s) => (
                    <div key={s.id} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm text-white">{s.status}</p>
                        <p className="text-xs text-white/40">{new Date(s.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
