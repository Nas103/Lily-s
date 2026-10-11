"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/stores/authStore";

type AdminProduct = {
  id: string;
  name: string;
  baseName: string;
  price: number;
  basePrice: number;
  imageUrl: string;
  category: string;
  subCategory: string | null;
  brand: string | null;
  hasOverride: boolean;
  overrideName: string | null;
  overridePrice: number | null;
};

const categories = [
  "",
  "men",
  "women",
  "featured",
  "perfumes",
  "lifestyle",
  "running",
  "boxraw",
  "electronics",
];

const money = (value: number) =>
  `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function AdminProductsPage() {
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const isAdmin = useAuth((state) => state.isAdmin);

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!user || !isAdmin()) {
      router.push("/");
      return;
    }
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products", {
        headers: {
          "x-user-id": user!.id,
          "x-user-email": user!.email,
        },
      });
      if (!res.ok) throw new Error("Unable to load products.");
      const data = (await res.json()) as AdminProduct[];
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter((product) => {
    const matchesCategory = category ? product.category === category : true;
    const q = query.trim().toLowerCase();
    const matchesQuery = q
      ? `${product.name} ${product.brand ?? ""} ${product.category}`
          .toLowerCase()
          .includes(q)
      : true;
    return matchesCategory && matchesQuery;
  });

  const handleSaved = (id: string, row: Partial<AdminProduct>) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === id ? { ...product, ...row } : product))
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
          Catalog
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Products
        </h1>
        <p className="text-sm text-zinc-600">
          Edit names and prices. Prices are stored in USD — shoppers automatically
          see them converted into their own currency.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products…"
          className="w-64 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category ? `${category[0].toUpperCase()}${category.slice(1)}` : "All categories"}
            </option>
          ))}
        </select>
        <span className="text-xs text-zinc-500">
          {filtered.length} of {products.length}
        </span>
      </div>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="py-16 text-center text-sm text-zinc-500">Loading products…</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((product) => (
            <ProductRow key={product.id} product={product} onSaved={handleSaved} />
          ))}
          {filtered.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-10 text-center text-sm text-zinc-500">
              No products match your search.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

function ProductRow({
  product,
  onSaved,
}: {
  product: AdminProduct;
  onSaved: (id: string, row: Partial<AdminProduct>) => void;
}) {
  const user = useAuth((state) => state.user);
  const isAdmin = useAuth((state) => state.isAdmin);

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<"saved" | "error" | null>(null);

  const save = async () => {
    if (!user || !isAdmin() || saving) return;
    const priceValue = parseFloat(price);
    if (!name.trim()) {
      setFeedback("error");
      return;
    }
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
          "x-user-email": user.email,
        },
        body: JSON.stringify({ name: name.trim(), price: priceValue }),
      });
      if (!res.ok) throw new Error("Save failed");
      const updated = (await res.json()) as AdminProduct;
      onSaved(product.id, {
        name: updated.name,
        baseName: updated.name,
        price: updated.price,
        basePrice: updated.price,
        hasOverride: true,
        overrideName: updated.overrideName,
        overridePrice: updated.overridePrice,
      });
      setFeedback("saved");
    } catch {
      setFeedback("error");
    } finally {
      setSaving(false);
    }
  };

  const revert = async () => {
    if (!user || !isAdmin() || saving) return;
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": user.id,
          "x-user-email": user.email,
        },
      });
      if (!res.ok) throw new Error("Revert failed");
      const updated = (await res.json()) as AdminProduct;
      setName(updated.name);
      setPrice(String(updated.price));
      onSaved(product.id, {
        name: updated.name,
        baseName: updated.baseName,
        price: updated.price,
        basePrice: updated.basePrice,
        hasOverride: false,
        overrideName: null,
        overridePrice: null,
      });
      setFeedback("saved");
    } catch {
      setFeedback("error");
    } finally {
      setSaving(false);
    }
  };

  const isDirty =
    name.trim() !== product.name ||
    (parseFloat(price) !== product.price && !Number.isNaN(parseFloat(price)));

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm">
      <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="44px"
          className="object-cover"
        />
      </div>

      <div className="grid min-w-0 flex-1 gap-x-4 gap-y-1 md:grid-cols-[1fr_140px_auto]">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
            {product.category}
            {product.subCategory ? ` · ${product.subCategory}` : ""}
          </p>
          <input
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setFeedback(null);
            }}
            className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm font-medium text-zinc-900 outline-none transition hover:border-zinc-200 focus:border-zinc-900"
          />
          <p className="px-2 text-[11px] text-zinc-400">
            {product.brand ? `${product.brand} · ` : ""}stores at {money(product.basePrice)}
          </p>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
            Price (USD)
          </label>
          <div className="flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1 focus-within:border-zinc-900">
            <span className="text-zinc-500">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(event) => {
                setPrice(event.target.value);
                setFeedback(null);
              }}
              className="w-full bg-transparent text-sm text-zinc-900 outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:pb-0.5">
          {product.hasOverride ? (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-amber-700">
              Edited
            </span>
          ) : null}
          {feedback === "saved" ? (
            <span className="text-[11px] font-medium text-emerald-600">Saved</span>
          ) : null}
          {feedback === "error" ? (
            <span className="text-[11px] font-medium text-red-600">Error</span>
          ) : null}
          {isDirty ? (
            <button
              type="button"
              onClick={() => void save()}
              disabled={saving}
              className="rounded-full bg-black px-4 py-1.5 text-xs font-semibold text-white transition hover:opacity-80 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          ) : null}
          {product.hasOverride ? (
            <button
              type="button"
              onClick={() => void revert()}
              disabled={saving}
              className="rounded-full border border-zinc-300 px-4 py-1.5 text-xs font-semibold text-zinc-600 transition hover:border-zinc-900 hover:text-zinc-900 disabled:opacity-50"
            >
              Revert
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}