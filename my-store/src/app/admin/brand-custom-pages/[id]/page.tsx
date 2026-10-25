"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminBrandCustomPageDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [acting, setActing] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/brand-custom-pages`, { cache: "no-store" });
      const data = await res.json();
      const found = (data.pages || []).find((p: any) => p.id === id);
      setPage(found || null);
    } catch {
      setPage(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) void load();
  }, [id]);

  async function review(action: "approve" | "reject" | "changes_requested") {
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

  if (loading) return <div className="p-10 text-sm text-zinc-500">Loading…</div>;
  if (!page) return <div className="p-10 text-sm text-zinc-500">Not found</div>;

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-400">{page.brand?.name}</p>
            <h1 className="text-2xl font-semibold">{page.pageName}</h1>
            <p className="text-xs text-zinc-500">Status: {page.status} • Slug: /brand-page/{page.brand?.slug}/{page.slug}</p>
          </div>
          <div className="flex gap-2">
            <button disabled={acting} onClick={() => review("changes_requested")} className="px-4 py-2 rounded-full border bg-white text-sm">Request changes</button>
            <button disabled={acting} onClick={() => review("reject")} className="px-4 py-2 rounded-full border bg-white text-sm text-red-600">Reject</button>
            <button disabled={acting} onClick={() => review("approve")} className="px-4 py-2 rounded-full bg-black text-white text-sm">Approve</button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="rounded-2xl border bg-white p-6 space-y-3">
              <h2 className="text-sm font-medium">Page info</h2>
              <p className="text-sm text-zinc-600">{page.description || "No description"}</p>
              <p className="text-xs text-zinc-500">AI review: {JSON.stringify(page.aiReview)}</p>
            </section>
            <section className="rounded-2xl border bg-white p-6 space-y-4">
              <h2 className="text-sm font-medium">Products ({page.products?.length || 0})</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {(page.products || []).map((p: any) => (
                  <div key={p.id} className="rounded-xl border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-zinc-500">${Number(p.price).toFixed(2)} • {p.category} • {p.gender || "-"}</p>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-600 line-clamp-3">{p.description}</p>
                    <div className="grid grid-cols-4 gap-2">
                      {(p.images || []).map((img: any) => (
                        <div key={img.id} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-zinc-100">
                          <Image src={`/api/brand-products/images/${img.id}`} alt={p.name} fill className="object-cover" />
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-zinc-500">Sizes: {(p.sizes||[]).join(", ") || "-"} • Colors: {(p.colors||[]).join(", ") || "-"}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div className="space-y-4">
            <section className="rounded-2xl border bg-white p-6 space-y-3">
              <h2 className="text-sm font-medium">Admin actions</h2>
              <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Admin notes (shown to brand on changes/request)" className="w-full rounded-xl border px-3 py-2 text-sm h-24" />
              <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Rejection reason (required if rejecting)" className="w-full rounded-xl border px-3 py-2 text-sm h-20" />
            </section>
            <section className="rounded-2xl border bg-white p-6 space-y-2">
              <h2 className="text-sm font-medium">Submissions</h2>
              {(page.submissions || []).map((s: any) => (
                <div key={s.id} className="text-xs text-zinc-500 border-t pt-2">
                  <p>{s.status} • {new Date(s.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
