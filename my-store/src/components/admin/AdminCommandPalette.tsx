"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  Command,
  FileSearch,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  Store,
  Users,
} from "lucide-react";

type ResultKind = "page" | "order" | "product" | "user";

type Result = {
  id: string;
  kind: ResultKind;
  title: string;
  subtitle?: string;
  href: string;
  icon: React.ReactNode;
};

const KIND_LABEL: Record<ResultKind, string> = {
  page: "Page",
  order: "Order",
  product: "Product",
  user: "User",
};

const KIND_STYLE: Record<ResultKind, string> = {
  page: "bg-zinc-100 text-zinc-600",
  order: "bg-blue-100 text-blue-700",
  product: "bg-violet-100 text-violet-700",
  user: "bg-emerald-100 text-emerald-700",
};

type RecordKind = {
  id?: string;
  orderNumber?: string;
  status?: string;
  userEmail?: string | null;
  shippingEmail?: string | null;
  name?: string | null;
  email?: string;
  category?: string;
  brand?: string | null;
  role?: string;
};

const PAGES: Result[] = [
  { id: "page-overview", kind: "page", title: "Overview", subtitle: "Live analytics", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "page-orders", kind: "page", title: "Orders", subtitle: "Fulfillment", href: "/admin/orders", icon: <ShoppingCart className="h-4 w-4" /> },
  { id: "page-products", kind: "page", title: "Products", subtitle: "Catalog editor", href: "/admin/products", icon: <Package className="h-4 w-4" /> },
  { id: "page-users", kind: "page", title: "Users", subtitle: "Customers & roles", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
  { id: "page-risk", kind: "page", title: "Risk review", subtitle: "AI fraud sweep", href: "/admin/risk-review", icon: <Star className="h-4 w-4" /> },
  { id: "page-store", kind: "page", title: "View storefront", subtitle: "Open the shop", href: "/", icon: <Store className="h-4 w-4" /> },
];

export function AdminCommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [records, setRecords] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const loadedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadRecords = useCallback(async () => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    setLoading(true);
    try {
      const [orders, products, users] = await Promise.all([
        fetch("/api/admin/orders").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/admin/products").then((r) => (r.ok ? r.json() : [])).catch(() => []),
        fetch("/api/admin/users").then((r) => (r.ok ? r.json() : [])).catch(() => []),
      ]);
      const mapped: Result[] = [];
      for (const order of (orders as RecordKind[]) ?? []) {
        mapped.push({
          id: `order-${order.id ?? order.orderNumber}`,
          kind: "order",
          title: order.orderNumber ?? "Order",
          subtitle: `${order.status} · ${order.userEmail ?? order.shippingEmail ?? "guest"}`,
          href: "/admin/orders",
          icon: <ShoppingCart className="h-4 w-4" />,
        });
      }
      for (const product of (products as RecordKind[]) ?? []) {
        mapped.push({
          id: `product-${product.id}`,
          kind: "product",
          title: product.name ?? "Product",
          subtitle: `${product.category}${product.brand ? ` · ${product.brand}` : ""}`,
          href: "/admin/products",
          icon: <Package className="h-4 w-4" />,
        });
      }
      for (const user of (users as RecordKind[]) ?? []) {
        mapped.push({
          id: `user-${user.id}`,
          kind: "user",
          title: user.name || user.email || "Customer",
          subtitle: `${user.email} · ${user.role}`,
          href: "/admin/users",
          icon: <Users className="h-4 w-4" />,
        });
      }
      setRecords(mapped);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      void loadRecords();
      const id = window.setTimeout(() => inputRef.current?.focus(), 20);
      return () => window.clearTimeout(id);
    }
    setQuery("");
    setActive(0);
  }, [open, loadRecords]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = [...PAGES, ...records];
    if (!q) return PAGES;
    return pool
      .filter((item) => `${item.title} ${item.subtitle ?? ""}`.toLowerCase().includes(q))
      .slice(0, 24);
  }, [query, records]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const go = (result: Result | undefined) => {
    if (!result) return;
    setOpen(false);
    router.push(result.href);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((value) => Math.min(value + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((value) => Math.max(value - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(results[active]);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-500 transition hover:border-zinc-900 hover:text-zinc-900"
      >
        <Command className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Search…</span>
        <kbd className="hidden rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 sm:inline">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 border-b border-zinc-100 px-4">
                <FileSearch className="h-4 w-4 text-zinc-400" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={onInputKeyDown}
                  placeholder="Search pages, orders, products, customers…"
                  className="h-12 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                />
                <kbd className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
                  Esc
                </kbd>
              </div>

              <div className="max-h-[52vh] overflow-y-auto p-2">
                {loading && results.length === 0 ? (
                  <p className="px-3 py-6 text-center text-sm text-zinc-500">Loading…</p>
                ) : results.length === 0 ? (
                  <p className="px-3 py-6 text-center text-sm text-zinc-500">No matches.</p>
                ) : (
                  results.map((result, index) => (
                    <button
                      key={result.id}
                      type="button"
                      onMouseEnter={() => setActive(index)}
                      onClick={() => go(result)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                        index === active ? "bg-zinc-100" : "hover:bg-zinc-50"
                      }`}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
                        {result.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-zinc-900">
                          {result.title}
                        </span>
                        {result.subtitle ? (
                          <span className="block truncate text-xs text-zinc-500">
                            {result.subtitle}
                          </span>
                        ) : null}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] ${KIND_STYLE[result.kind]}`}
                      >
                        {KIND_LABEL[result.kind]}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
