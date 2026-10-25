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
  sizes: string[];
  colors: string[];
  hasOverride: boolean;
  overrideName: string | null;
  overridePrice: number | null;
  discountPercent: number | null;
  soldOut: boolean;
  soldOutSizes: string[];
  soldOutColors: string[];
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
        <p className="text-xs uppercase tracking-[0.35em] text-white/40">
          Catalog
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Products
        </h1>
        <p className="text-sm text-white/50">
          Edit names and prices, apply a percentage discount, or mark sizes and
          colors sold out. Prices are stored in USD — shoppers automatically see
          them converted into their own currency.
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
        <span className="text-xs text-white/50">
          {filtered.length} of {products.length}
        </span>
      </div>

      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="py-16 text-center text-sm text-white/40">Loading products…</p>
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

const sameSet = (a: string[], b: string[]) =>
  a.length === b.length && [...a].sort().join("|") === [...b].sort().join("|");

function VariantChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] transition ${
        active
          ? "bg-rose-600 text-white"
          : "border border-zinc-300 text-zinc-700 hover:border-zinc-900"
      }`}
      title={active ? "Marked sold out — click to restore" : "Click to mark sold out"}
    >
      {label}
    </button>
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
  const [discount, setDiscount] = useState(
    product.discountPercent != null ? String(product.discountPercent) : ""
  );
  const [soldOut, setSoldOut] = useState(product.soldOut);
  const [soldOutSizes, setSoldOutSizes] = useState<string[]>(product.soldOutSizes);
  const [soldOutColors, setSoldOutColors] = useState<string[]>(product.soldOutColors);
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<"saved" | "error" | null>(null);

  const toggle = (
    value: string,
    list: string[],
    setList: (next: string[]) => void
  ) => {
    setFeedback(null);
    setList(
      list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
    );
  };

  const save = async () => {
    if (!user || !isAdmin() || saving) return;
    const priceValue = parseFloat(price);
    const discountValue = discount.trim() === "" ? null : parseFloat(discount);
    if (!name.trim() || Number.isNaN(priceValue)) {
      setFeedback("error");
      return;
    }
    if (discountValue !== null && (Number.isNaN(discountValue) || discountValue < 0 || discountValue > 90)) {
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
        body: JSON.stringify({
          name: name.trim(),
          price: priceValue,
          discountPercent: discountValue,
          soldOut,
          soldOutSizes,
          soldOutColors,
        }),
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
        discountPercent: updated.discountPercent,
        soldOut: updated.soldOut,
        soldOutSizes: updated.soldOutSizes,
        soldOutColors: updated.soldOutColors,
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
      setDiscount("");
      setSoldOut(false);
      setSoldOutSizes([]);
      setSoldOutColors([]);
      onSaved(product.id, {
        name: updated.name,
        baseName: updated.baseName,
        price: updated.price,
        basePrice: updated.basePrice,
        hasOverride: false,
        overrideName: null,
        overridePrice: null,
        discountPercent: null,
        soldOut: false,
        soldOutSizes: [],
        soldOutColors: [],
      });
      setFeedback("saved");
    } catch {
      setFeedback("error");
    } finally {
      setSaving(false);
    }
  };

  const parsedPrice = parseFloat(price);
  const parsedDiscount = discount.trim() === "" ? null : parseFloat(discount);
  const isDirty =
    name.trim() !== product.name ||
    (parsedPrice !== product.price && !Number.isNaN(parsedPrice)) ||
    (parsedDiscount === null ? null : parsedDiscount) !== (product.discountPercent ?? null) ||
    soldOut !== product.soldOut ||
    !sameSet(soldOutSizes, product.soldOutSizes) ||
    !sameSet(soldOutColors, product.soldOutColors);

  const hasVariants = product.sizes.length > 0 || product.colors.length > 0;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm">
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>

        <div className="grid min-w-0 flex-1 gap-x-4 gap-y-1 md:grid-cols-[1fr_140px_120px_auto]">
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

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
              Discount %
            </label>
            <div className="flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-1 focus-within:border-zinc-900">
              <input
                type="number"
                min="0"
                max="90"
                step="1"
                placeholder="0"
                value={discount}
                onChange={(event) => {
                  setDiscount(event.target.value);
                  setFeedback(null);
                }}
                className="w-full bg-transparent text-sm text-zinc-900 outline-none"
              />
              <span className="text-zinc-500">%</span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:pb-0.5">
            {product.soldOut || soldOut ? (
              <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-white">
                Sold out
              </span>
            ) : null}
            {product.discountPercent || (parsedDiscount ?? 0) > 0 ? (
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-rose-700">
                Sale
              </span>
            ) : null}
            {product.hasOverride ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-amber-700">
                Edited
              </span>
            ) : null}
            {feedback === "saved" ? (
              <span className="text-[11px] font-medium text-emerald-600">Saved</span>
            ) : null}
            {feedback === "error" ? (
              <span className="text-[11px] font-medium text-red-600">
                Check fields
              </span>
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
            {hasVariants ? (
              <button
                type="button"
                onClick={() => setExpanded((value) => !value)}
                className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-600 transition hover:border-zinc-900 hover:text-zinc-900"
              >
                {expanded ? "Hide variants" : "Variants"}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {expanded ? (
        <div className="mt-3 space-y-3 border-t border-zinc-100 pt-3 pl-16">
          <label className="flex items-center gap-2 text-xs font-medium text-zinc-700">
            <input
              type="checkbox"
              checked={soldOut}
              onChange={(event) => {
                setSoldOut(event.target.checked);
                setFeedback(null);
              }}
              className="h-4 w-4 rounded border-zinc-300"
            />
            Entire product sold out
          </label>

          {product.sizes.length ? (
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Sizes sold out
              </p>
              <div className="mt-1 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <VariantChip
                    key={size}
                    label={size}
                    active={soldOutSizes.includes(size)}
                    onClick={() => toggle(size, soldOutSizes, setSoldOutSizes)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {product.colors.length ? (
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                Colors sold out
              </p>
              <div className="mt-1 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <VariantChip
                    key={color}
                    label={color}
                    active={soldOutColors.includes(color)}
                    onClick={() => toggle(color, soldOutColors, setSoldOutColors)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <p className="text-[11px] text-zinc-400">
            Click a size or color to toggle it sold out. Shoppers can no longer add
            an unavailable variant. Set a discount above to show a sale price.
          </p>
        </div>
      ) : null}
    </div>
  );
}