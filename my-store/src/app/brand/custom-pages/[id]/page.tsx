"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MAX_BRAND_IMAGE_BYTES, ALLOWED_BRAND_IMAGE_MIMES } from "@/lib/brand-custom";

const inputClass = "w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500";
const labelClass = "block text-xs font-medium uppercase tracking-widest text-zinc-500";
const primaryButton = "w-full rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white disabled:opacity-60";
const secondaryButton = "w-full rounded-full border border-zinc-200 px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] disabled:opacity-60";

export default function BrandCustomPageBuilder() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiFindings, setAiFindings] = useState<any>(null);
  const [reviewing, setReviewing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/brand/custom-pages/${id}`, { cache: "no-store" });
      const data = await res.json();
      setPage(data.page);
      if (data.page?.aiReview) setAiFindings(data.page.aiReview);
    } catch {
      setPage(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) void load();
  }, [id]);

  async function save() {
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch(`/api/brand/custom-pages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageName: page.pageName,
          description: page.description,
          guidelines: page.guidelines,
          subheadings: page.subheadings || [],
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to save");
        return;
      }
      setNotice("Saved");
      await load();
    } catch {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function runAi() {
    setReviewing(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/brand-page-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId: id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "AI review failed");
        return;
      }
      setAiFindings(data.findings);
      setNotice("AI scan complete");
    } catch {
      setError("AI review failed");
    } finally {
      setReviewing(false);
    }
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/brand/custom-pages/${id}/submit`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Submit failed");
        return;
      }
      setNotice("Submitted for approval");
      await load();
    } catch {
      setError("Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-10 text-sm text-zinc-500">Loading…</div>;
  if (!page) return <div className="p-10 text-sm text-zinc-500">Not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <main className="mx-auto max-w-5xl px-6 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-zinc-400">Brand Builder</p>
            <h1 className="text-2xl font-semibold">{page.pageName}</h1>
            <p className="text-xs text-zinc-500">Status: {page.status} • /brand-page/{page.brand?.slug || ""}/{page.slug}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={runAi} disabled={reviewing} className={secondaryButton + " w-auto px-6"}>{reviewing ? "Scanning…" : "AI scan for issues"}</button>
            <button onClick={save} disabled={saving} className={secondaryButton + " w-auto px-6"}>{saving ? "Saving…" : "Save draft"}</button>
            <button onClick={submit} disabled={submitting || page.status === "SUBMITTED" || page.status === "APPROVED"} className={primaryButton + " w-auto px-6"}>{submitting ? "Submitting…" : "Submit for approval"}</button>
          </div>
        </div>

        {notice ? <p className="text-xs text-emerald-600">{notice}</p> : null}
        {error ? <p className="text-xs text-red-500">{error}</p> : null}

        <section className="rounded-3xl border bg-white p-8 space-y-4">
          <h2 className="text-sm font-medium">Page template</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Page name</label>
              <input className={inputClass} value={page.pageName || ""} onChange={(e) => setPage({...page, pageName: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Guidelines (strict rules for your brand)</label>
              <input className={inputClass} value={page.guidelines || ""} onChange={(e) => setPage({...page, guidelines: e.target.value})} placeholder="e.g. All items must include care instructions" />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Description / Subheadings</label>
            <textarea className={inputClass + " min-h-24"} value={page.description || ""} onChange={(e) => setPage({...page, description: e.target.value})} placeholder="Tell customers about this edit/collection" />
          </div>
        </section>

        {aiFindings ? (
          <section className="rounded-3xl border bg-white p-8 space-y-3">
            <h2 className="text-sm font-medium">AI review (grammar, completeness, missing info)</h2>
            <div className="space-y-2">
              {(aiFindings.issues || []).length === 0 ? <p className="text-xs text-emerald-600">No issues found</p> : null}
              {(aiFindings.issues || []).map((iss: any, i: number) => (
                <div key={i} className={`rounded-xl px-4 py-2 text-xs ${iss.level === "error" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>
                  {iss.productId ? `[Product] ` : `[Page] `}{iss.message}
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-400">Checked: {aiFindings.checkedAt}</p>
          </section>
        ) : null}

        <ProductsSection pageId={id} products={page.products || []} onChange={load} />
      </main>
    </div>
  );
}

function ProductsSection({ pageId, products, onChange }: any) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("clothing");
  const [gender, setGender] = useState("women");
  const [sizes, setSizes] = useState("S, M, L, XL");
  const [colors, setColors] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function addProduct() {
    setError(null);
    try {
      const res = await fetch(`/api/brand/custom-pages/${pageId}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          category,
          gender,
          sizes: sizes.split(",").map(s => s.trim()).filter(Boolean),
          colors: colors.split(",").map(s => s.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed");
        return;
      }
      setAdding(false);
      setName(""); setDescription(""); setPrice(""); setColors("");
      onChange();
    } catch {
      setError("Failed");
    }
  }

  return (
    <section className="rounded-3xl border bg-white p-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium">Products (clothing / accessories)</h2>
        <button onClick={() => setAdding(!adding)} className={secondaryButton + " w-auto px-6"}>{adding ? "Cancel" : "Add product"}</button>
      </div>
      {adding ? (
        <div className="rounded-2xl border p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Name *</label>
              <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Price (USD) *</label>
              <input className={inputClass} type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Category</label>
              <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
                <option value="perfumes">Perfumes</option>
                <option value="shoes">Shoes</option>
                <option value="electronics">Electronic devices</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Gender</label>
              <select className={inputClass} value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Sizes (comma separated)</label>
              <input className={inputClass} value={sizes} onChange={(e) => setSizes(e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Colors (comma separated)</label>
              <input className={inputClass} value={colors} onChange={(e) => setColors(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Description *</label>
            <textarea className={inputClass + " min-h-24"} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          {error ? <p className="text-xs text-red-500">{error}</p> : null}
          <button onClick={addProduct} className={primaryButton + " w-auto px-6"}>Create product</button>
          <p className="text-xs text-zinc-500">After creating, upload images from your local device below (max {Math.round(MAX_BRAND_IMAGE_BYTES/1024/1024)}MB, JPG/PNG/WebP).</p>
        </div>
      ) : null}
      <div className="grid md:grid-cols-2 gap-4">
        {products.map((p: any) => (
          <ProductCard key={p.id} product={p} onChange={onChange} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product, onChange }: any) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_BRAND_IMAGE_MIMES.includes(file.type)) {
      setError("Only JPG, PNG, or WebP allowed");
      return;
    }
    if (file.size > MAX_BRAND_IMAGE_BYTES) {
      setError(`Image exceeds ${Math.round(MAX_BRAND_IMAGE_BYTES/1024/1024)}MB`);
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`/api/brand/custom-products/${product.id}/images/upload`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }
      onChange();
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{product.name}</p>
          <p className="text-xs text-zinc-500">${Number(product.price).toFixed(2)} • {product.category} • {product.gender || "-"}</p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full border">{product.status}</span>
      </div>
      <p className="text-xs text-zinc-600 line-clamp-2">{product.description}</p>
      <div className="grid grid-cols-4 gap-2">
        {(product.images || []).map((img: any) => (
          <div key={img.id} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-zinc-100">
            <img src={`/api/brand-products/images/${img.id}`} alt={product.name} className="object-cover w-full h-full" />
          </div>
        ))}
      </div>
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} className="text-xs" />
      {uploading ? <p className="text-xs text-zinc-500">Uploading…</p> : null}
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
