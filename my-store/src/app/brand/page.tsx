"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/stores/authStore";
import {
  MAX_VERIFICATION_DOC_BYTES,
  VERIFICATION_DOC_ACCEPT,
  formatBytes,
} from "@/lib/verificationDoc";
import { MAX_BRAND_IMAGE_BYTES, ALLOWED_BRAND_IMAGE_MIMES } from "@/lib/brand-custom";

type Brand = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  contactEmail: string;
  contactPhone: string | null;
  country: string | null;
  status: "PENDING" | "APPROVED" | "SUSPENDED" | "REJECTED";
  verificationStatus: "UNSUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";
  verificationDocUrl: string | null;
  verificationDocName: string | null;
  verificationDocMimeType: string | null;
  verificationDocSize: number | null;
  verificationDocUploadedAt: string | null;
  businessName: string | null;
  rejectionReason: string | null;
  stripeAccountId: string | null;
  commissionRate: string | number;
  subscriptionTier: "FREE" | "PRO";
  createdAt: string;
};

const inputClass =
  "w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500";
const labelClass = "block text-xs font-medium uppercase tracking-widest text-zinc-500";
const primaryButton =
  "w-full rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white disabled:opacity-60";
const secondaryButton =
  "w-full rounded-full border border-zinc-200 px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] logo-gradient disabled:opacity-60";

const statusStyles: Record<Brand["status"], string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  SUSPENDED: "bg-red-50 text-red-700 border-red-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

const verificationStyles: Record<Brand["verificationStatus"], string> = {
  UNSUBMITTED: "bg-zinc-100 text-zinc-600 border-zinc-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

export default function BrandDashboardPage() {
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const setUser = useAuth((state) => state.setUser);
  const refresh = useAuth((state) => state.refresh);

  const [brand, setBrand] = useState<Brand | null | undefined>(undefined);
  const [pageError, setPageError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadBrand = useCallback(async () => {
    try {
      const res = await fetch("/api/brand/me", { cache: "no-store" });
      if (res.status === 401) {
        await refresh();
        router.replace("/login?next=/brand");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setPageError(data.error ?? "Unable to load your brand profile.");
        setBrand(null);
        return;
      }
      const data = await res.json();
      setBrand(data.brand ?? null);
    } catch {
      setPageError("Unable to reach the server. Please try again.");
      setBrand(null);
    }
  }, [refresh, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("done") === "1") {
        setNotice(
          "Payout details submitted to Stripe. Verification usually completes within a couple of business days."
        );
      } else if (params.get("refresh") === "1") {
        setNotice("Stripe onboarding link expired — start the setup again when ready.");
      }
    }
    void loadBrand();
  }, [loadBrand]);

  const handleCreated = async (created: Brand, freshUser: { id: string; email: string; name?: string | null; role: string }) => {
    setUser({
      id: freshUser.id,
      email: freshUser.email,
      name: freshUser.name ?? null,
      role: freshUser.role as "USER" | "ADMIN" | "BRAND",
    });
    setBrand(created);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Sell with us</p>
          <h1 className="text-3xl font-semibold tracking-tight h1-gradient">Brand dashboard</h1>
          <p className="text-sm text-zinc-600">
            Verified brands sell alongside our house catalogue with their own products, orders and payouts.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <a href="#custom-pages" className="rounded-full border border-zinc-200 px-5 py-2 text-xs uppercase tracking-[0.3em]">Custom Pages</a>
          </div>
        </div>

        {brand === undefined ? (
          <div className="mt-12 rounded-3xl border border-zinc-100 bg-white p-8 text-center text-sm text-zinc-500 shadow-sm">
            Loading your brand profile…
          </div>
        ) : null}

        {brand === undefined ? null : brand === null ? (
          <BrandSignupForm user={user} error={pageError} onCreated={handleCreated} />
        ) : (
          <div className="mt-12 space-y-8">
            <BrandStatusPanel
              brand={brand}
              notice={notice}
              onBrandUpdated={setBrand}
            />
            <BrandCustomPagesSection brand={brand} />
          </div>
        )}
      </main>
    </div>
  );
}

function BrandSignupForm({
  user,
  error,
  onCreated,
}: {
  user: { id: string; email: string; name?: string | null; role: string } | null;
  error: string | null;
  onCreated: (
    brand: Brand,
    freshUser: { id: string; email: string; name?: string | null; role: string }
  ) => void;
}) {
  const [name, setName] = useState("");
  const [contactEmail, setContactEmail] = useState(user?.email ?? "");
  const [country, setCountry] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(error);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch("/api/brand/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contactEmail,
          country,
          businessName: businessName || undefined,
          website: website || undefined,
          description: description || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormError(data.error ?? "Unable to create the brand profile.");
        return;
      }
      onCreated(data.brand, data.user);
    } catch {
      setFormError("Unable to reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return (
      <div className="mt-12 rounded-3xl border border-zinc-100 bg-white p-8 text-center text-sm text-zinc-600 shadow-sm">
        <p>Please sign in to register your brand.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-12 space-y-4 rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm">
      <div className="space-y-1">
        <label className={labelClass} htmlFor="brand-name">Brand name *</label>
        <input id="brand-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Northwind Athletics" required maxLength={100} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className={labelClass} htmlFor="brand-email">Contact email *</label>
          <input id="brand-email" type="email" className={inputClass} value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <label className={labelClass} htmlFor="brand-country">Country (ISO-2) *</label>
          <input id="brand-country" className={inputClass} value={country} onChange={(e) => setCountry(e.target.value.toUpperCase())} placeholder="US" maxLength={2} required />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className={labelClass} htmlFor="brand-business">Legal business name</label>
          <input id="brand-business" className={inputClass} value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Optional" maxLength={200} />
        </div>
        <div className="space-y-1">
          <label className={labelClass} htmlFor="brand-website">Website</label>
          <input id="brand-website" className={inputClass} value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" maxLength={300} />
        </div>
      </div>
      <div className="space-y-1">
        <label className={labelClass} htmlFor="brand-description">About your brand</label>
        <textarea id="brand-description" className={`${inputClass} min-h-28`} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} placeholder="What you sell, where you ship from…" />
      </div>
      <p className="rounded-2xl bg-zinc-50 px-4 py-3 text-xs text-zinc-600">
        After you apply, upload your business registration or ID document in the
        Verification section — approval requires it.
      </p>
      {formError ? (
        <p className="text-xs text-red-500" role="alert">{formError}</p>
      ) : null}
      <button type="submit" disabled={submitting} className={primaryButton}>
        {submitting ? "Please wait…" : "Submit brand application"}
      </button>
    </form>
  );
}

function BrandStatusPanel({
  brand,
  notice,
  onBrandUpdated,
}: {
  brand: Brand;
  notice: string | null;
  onBrandUpdated: (brand: Brand) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docError, setDocError] = useState<string | null>(null);
  const [savingDoc, setSavingDoc] = useState(false);
  const [startingPayouts, setStartingPayouts] = useState(false);
  const [panelError, setPanelError] = useState<string | null>(null);
  const [panelNotice, setPanelNotice] = useState<string | null>(notice);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setDocError(null);
    if (!file) {
      setDocFile(null);
      return;
    }
    if (file.size > MAX_VERIFICATION_DOC_BYTES) {
      setDocError(
        `File is too large (${formatBytes(file.size)}). Maximum is ${formatBytes(
          MAX_VERIFICATION_DOC_BYTES
        )}.`
      );
      event.target.value = "";
      setDocFile(null);
      return;
    }
    setDocFile(file);
  }

  async function submitVerification(event: React.FormEvent) {
    event.preventDefault();
    if (!docFile) {
      setDocError("Choose a document to upload.");
      return;
    }
    setSavingDoc(true);
    setPanelError(null);
    setDocError(null);
    try {
      const formData = new FormData();
      formData.append("file", docFile);
      const res = await fetch("/api/brand/verification-document", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDocError(data.error ?? "Unable to upload the document.");
        return;
      }
      onBrandUpdated(data.brand);
      setDocFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setPanelNotice("Document uploaded — our team will review it shortly.");
    } catch {
      setDocError("Unable to reach the server. Please try again.");
    } finally {
      setSavingDoc(false);
    }
  }

  async function startPayouts() {
    setStartingPayouts(true);
    setPanelError(null);
    try {
      const res = await fetch("/api/brand/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setPanelError(data.error ?? "Unable to start payouts setup.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setPanelError("Unable to reach the server. Please try again.");
    } finally {
      setStartingPayouts(false);
    }
  }

  return (
    <div className="mt-12 space-y-6">
      <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900">{brand.name}</h2>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">/{brand.slug}</p>
          </div>
          <div className="flex gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[brand.status]}`}>
              {brand.status}
            </span>
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${verificationStyles[brand.verificationStatus]}`}>
              ID: {brand.verificationStatus}
            </span>
          </div>
        </div>

        {brand.status === "PENDING" ? (
          brand.verificationStatus === "UNSUBMITTED" ? (
            <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <strong className="font-semibold">Action needed:</strong> we cannot approve your
              application until a verification document is on file. Add one in the Verification
              section below — you can connect payouts in the meantime.
            </p>
          ) : (
            <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Your application is queued for review. You can finish payouts setup now — selling
              starts once you are approved.
            </p>
          )
        ) : null}
        {brand.status === "APPROVED" ? (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Your brand is live. Products you publish appear on the storefront immediately.
          </p>
        ) : null}
        {brand.status === "SUSPENDED" ? (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
            This brand is suspended. Contact support before making changes.
          </p>
        ) : null}
        {brand.status === "REJECTED" ? (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
            Application rejected{brand.rejectionReason ? `: ${brand.rejectionReason}` : "."} Update your documents and resubmit below.
          </p>
        ) : null}
        {panelNotice ? (
          <p className="mt-4 rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-700">{panelNotice}</p>
        ) : null}
        {panelError ? (
          <p className="mt-4 text-xs text-red-500" role="alert">{panelError}</p>
        ) : null}

        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className={labelClass}>Commission</dt>
            <dd className="mt-1 text-sm text-zinc-900">{String(brand.commissionRate)}% per sale</dd>
          </div>
          <div>
            <dt className={labelClass}>Plan</dt>
            <dd className="mt-1 text-sm text-zinc-900">
              {brand.subscriptionTier === "PRO" ? "PRO (reduced commission)" : "FREE"}
            </dd>
          </div>
          <div>
            <dt className={labelClass}>Contact</dt>
            <dd className="mt-1 text-sm text-zinc-900">{brand.contactEmail}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">Verification</h3>

        {brand.verificationDocName ? (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-600">
            <span className="font-medium text-zinc-900">{brand.verificationDocName}</span>
            {brand.verificationDocSize ? <span>{formatBytes(brand.verificationDocSize)}</span> : null}
            {brand.verificationDocUploadedAt ? (
              <span>uploaded {new Date(brand.verificationDocUploadedAt).toLocaleDateString()}</span>
            ) : null}
            <a href="/api/brand/verification-document" className="text-blue-600 underline" download>
              Download
            </a>
          </div>
        ) : brand.verificationDocUrl ? (
          <p className="mt-3 text-sm text-zinc-600">
            Linked document:{" "}
            <a
              href={brand.verificationDocUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              view document
            </a>
          </p>
        ) : null}

        {brand.verificationStatus === "APPROVED" ? (
          <p className="mt-3 text-sm text-emerald-700">Identity documents verified.</p>
        ) : (
          <>
            {brand.verificationStatus === "UNSUBMITTED" ? (
              <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                No document on file yet. Approval is blocked until you upload a business
                registration or ID document.
              </p>
            ) : null}
            {brand.verificationStatus === "PENDING" ? (
              <p className="mt-3 text-sm text-zinc-600">
                Document received — our team is reviewing it. You can replace it if you uploaded the
                wrong file.
              </p>
            ) : null}
            {brand.verificationStatus === "REJECTED" ? (
              <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
                Your last document was rejected. Upload a clearer or updated document to be reviewed
                again.
              </p>
            ) : null}
            <form onSubmit={submitVerification} className="mt-4 space-y-4">
              <div className="space-y-2">
                <label className={labelClass} htmlFor="brand-doc-file">
                  {brand.verificationDocName ? "Replace document" : "Upload document"}
                </label>
                <input
                  id="brand-doc-file"
                  ref={fileInputRef}
                  type="file"
                  accept={VERIFICATION_DOC_ACCEPT}
                  onChange={handleFileChange}
                  className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 file:mr-4 file:rounded-full file:border-0 file:bg-black file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.3em] file:text-white"
                />
                <p className="text-xs text-zinc-500">
                  PDF, PNG, JPEG or WebP up to {formatBytes(MAX_VERIFICATION_DOC_BYTES)}.
                  {docFile ? ` Selected: ${docFile.name} (${formatBytes(docFile.size)}).` : ""}
                </p>
              </div>
              {docError ? (
                <p className="text-xs text-red-500" role="alert">{docError}</p>
              ) : null}
              <button type="submit" disabled={savingDoc || !docFile} className={secondaryButton}>
                {savingDoc
                  ? "Uploading…"
                  : !brand.verificationDocName
                  ? "Upload document"
                  : brand.verificationStatus === "REJECTED"
                  ? "Resubmit document"
                  : "Replace document"}
              </button>
            </form>
          </>
        )}
      </div>

      <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">Payouts</h3>
        <p className="mt-3 text-sm text-zinc-600">
          {brand.stripeAccountId
            ? "A Stripe payouts account is linked to your brand. Update your details any time."
            : "Connect a bank account through Stripe to receive payouts after the platform's commission."}
        </p>
        <button
          type="button"
          onClick={startPayouts}
          disabled={startingPayouts}
          className={`${primaryButton} mt-4`}
        >
          {startingPayouts
            ? "Please wait…"
            : brand.stripeAccountId
            ? "Update payout details"
            : "Set up payouts"}
        </button>
      </div>

      <BrandOrdersSection />
      <BrandMessagesSection />

      {brand.status === "APPROVED" ? (
        <BrandProductsSection />
      ) : (
        <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">Products</h3>
          <p className="mt-3 text-sm text-zinc-600">
            Product management unlocks once your brand is approved.
          </p>
        </div>
      )}
    </div>
  );
}

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string | number;
  imageUrl: string;
  status: "DRAFT" | "PENDING_REVIEW" | "ACTIVE" | "REJECTED";
  badge: string | null;
  subCategory: string | null;
  gender: string | null;
  sizes: string[];
  colors: string[];
  tags: string[];
  discountPercent: string | number | null;
  category: { id: string; name: string; slug: string };
  updatedAt: string;
};

type CategoryOption = { id: string; name: string; slug: string };

const productStatusStyles: Record<ProductRow["status"], string> = {
  DRAFT: "bg-zinc-100 text-zinc-600 border-zinc-200",
  PENDING_REVIEW: "bg-amber-50 text-amber-700 border-amber-200",
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

function formatMoney(value: string | number): string {
  const n = typeof value === "number" ? value : parseFloat(value);
  return Number.isFinite(n) ? `$${n.toFixed(2)}` : String(value);
}

function BrandProductsSection() {
  const [products, setProducts] = useState<ProductRow[] | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/brand/products", { cache: "no-store" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Unable to load products.");
        setProducts([]);
        return;
      }
      const data = await res.json();
      setProducts(data.products ?? []);
    } catch {
      setError("Unable to reach the server.");
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    void load();
    void (async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        setCategories(data.categories ?? []);
      } catch {
        setCategories([]);
      }
    })();
  }, [load]);

  const act = async (product: ProductRow, method: string, url: string, body?: unknown) => {
    setBusyId(product.id);
    setError(null);
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Action failed.");
        return;
      }
      await load();
    } catch {
      setError("Unable to reach the server.");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (product: ProductRow) => {
    if (!confirm(`Delete "${product.name}" permanently?`)) return;
    await act(product, "DELETE", `/api/brand/products/${product.id}`);
  };

  const toggleDraft = async (product: ProductRow) => {
    const next = product.status === "ACTIVE" ? "DRAFT" : "ACTIVE";
    await act(product, "PATCH", `/api/brand/products/${product.id}`, { status: next });
  };

  return (
    <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
          Products
        </h3>
        {!formOpen ? (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="rounded-full bg-black px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white"
          >
            New product
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="mt-4 text-xs text-red-500" role="alert">
          {error}
        </p>
      ) : null}

      {formOpen ? (
        <ProductForm
          categories={categories}
          initial={editing}
          onSaved={() => {
            setFormOpen(false);
            setEditing(null);
            void load();
          }}
          onCancel={() => {
            setFormOpen(false);
            setEditing(null);
          }}
        />
      ) : null}

      <div className="mt-6 space-y-3">
        {products === null ? (
          <p className="text-xs text-zinc-500">Loading products…</p>
        ) : null}

        {products?.map((product) => (
          <div
            key={product.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl}
                alt=""
                className="h-12 w-12 rounded-xl border border-zinc-200 object-cover"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-900">
                  {product.name}{" "}
                  <span className="ml-1 text-xs text-zinc-500">
                    {formatMoney(product.price)}
                  </span>
                </p>
                <p className="text-xs text-zinc-500">
                  {product.category.name}
                  {product.discountPercent
                    ? ` · ${String(product.discountPercent)}% off`
                    : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${productStatusStyles[product.status]}`}
              >
                {product.status.replace("_", " ")}
              </span>
              {product.status === "ACTIVE" || product.status === "DRAFT" ? (
                <button
                  type="button"
                  disabled={busyId === product.id}
                  onClick={() => void toggleDraft(product)}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-900 disabled:opacity-50"
                >
                  {product.status === "ACTIVE" ? "Unpublish" : "Publish"}
                </button>
              ) : null}
              <button
                type="button"
                disabled={busyId === product.id}
                onClick={() => {
                  setEditing(product);
                  setFormOpen(true);
                  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                }}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600 hover:text-zinc-900 disabled:opacity-50"
              >
                Edit
              </button>
              <button
                type="button"
                disabled={busyId === product.id}
                onClick={() => void remove(product)}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500 hover:text-red-700 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {products?.length === 0 ? (
          <p className="text-xs text-zinc-500">
            No products yet. Create your first one — it appears on the storefront
            as soon as you publish it.
          </p>
        ) : null}
      </div>
    </div>
  );
}

type BrandOrderItem = {
  id: string;
  name: string;
  imageUrl: string | null;
  size: string | null;
  color: string | null;
  quantity: number;
  price: number;
};

type BrandOrderRow = {
  id: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  trackingNumber: string | null;
  notes: string | null;
  subtotal: number;
  createdAt: string;
  order: {
    orderNumber: string;
    status: string;
    currency: string;
    total: number;
    createdAt: string;
    customer: {
      name: string | null;
      email: string | null;
      phone: string | null;
      addressLine1: string | null;
      addressLine2: string | null;
      city: string | null;
      state: string | null;
      postcode: string | null;
      country: string | null;
    };
    orderItems: BrandOrderItem[];
  };
};

type PayoutRow = {
  id: string;
  status: "PENDING" | "PAID" | "FAILED";
  amount: number;
  platformFee: number;
  currency: string;
  failureReason: string | null;
  availableAt: string | null;
  paidAt: string | null;
  createdAt: string;
  orderNumber: string | null;
};

const brandOrderStatusStyles: Record<BrandOrderRow["status"], string> = {
  PENDING: "bg-zinc-100 text-zinc-600 border-zinc-200",
  PROCESSING: "bg-amber-50 text-amber-700 border-amber-200",
  SHIPPED: "bg-blue-50 text-blue-700 border-blue-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

const payoutStatusStyles: Record<PayoutRow["status"], string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FAILED: "bg-red-50 text-red-700 border-red-200",
};

const fulfilActions: Partial<
  Record<BrandOrderRow["status"], Array<[BrandOrderRow["status"], string]>>
> = {
  PENDING: [
    ["PROCESSING", "Start processing"],
    ["CANCELLED", "Cancel"],
  ],
  PROCESSING: [
    ["SHIPPED", "Mark shipped"],
    ["CANCELLED", "Cancel"],
  ],
  SHIPPED: [
    ["DELIVERED", "Mark delivered"],
    ["CANCELLED", "Cancel"],
  ],
};

function money(amount: number, currency?: string | null): string {
  const code = (currency ?? "USD").toUpperCase();
  return `${code} ${Number(amount).toFixed(2)}`;
}

function BrandOrdersSection() {
  const [orders, setOrders] = useState<BrandOrderRow[] | null>(null);
  const [payouts, setPayouts] = useState<PayoutRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [trackingDrafts, setTrackingDrafts] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    try {
      const [ordersRes, payoutsRes] = await Promise.all([
        fetch("/api/brand/orders", { cache: "no-store" }),
        fetch("/api/brand/payouts", { cache: "no-store" }),
      ]);
      if (!ordersRes.ok) {
        const data = await ordersRes.json().catch(() => ({}));
        setError(data.error ?? "Unable to load orders.");
        setOrders([]);
      } else {
        const data = await ordersRes.json();
        setOrders(data.orders ?? []);
      }
      if (payoutsRes.ok) {
        const data = await payoutsRes.json();
        setPayouts(data.payouts ?? []);
      } else {
        setPayouts([]);
      }
    } catch {
      setError("Unable to reach the server.");
      setOrders([]);
      setPayouts([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const patch = async (row: BrandOrderRow, body: Record<string, unknown>) => {
    setBusyId(row.id);
    setError(null);
    try {
      const res = await fetch(`/api/brand/orders/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Update failed.");
        return;
      }
      await load();
    } catch {
      setError("Unable to reach the server.");
    } finally {
      setBusyId(null);
    }
  };

  const advance = (row: BrandOrderRow, next: BrandOrderRow["status"]) => {
    if (
      next === "CANCELLED" &&
      !confirm(`Cancel ${row.order.orderNumber}? The customer will be refunded.`)
    ) {
      return;
    }
    void patch(row, { status: next });
  };

  const saveTracking = (row: BrandOrderRow) => {
    void patch(row, { trackingNumber: trackingDrafts[row.id] ?? "" });
  };

  return (
    <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
          Orders
        </h3>
        <button
          type="button"
          onClick={() => void load()}
          className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 hover:text-zinc-900"
        >
          Refresh
        </button>
      </div>

      {error ? (
        <p className="mt-4 text-xs text-red-500" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-6 space-y-3">
        {orders === null ? (
          <p className="text-xs text-zinc-500">Loading orders…</p>
        ) : null}

        {orders?.map((row) => {
          const address = [row.order.customer.addressLine1, row.order.customer.city, row.order.customer.country]
            .filter(Boolean)
            .join(", ");
          return (
            <div key={row.id} className="rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    {row.order.orderNumber}{" "}
                    <span className="ml-1 text-xs font-normal text-zinc-500">
                      {new Date(row.order.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {row.order.customer.name ?? "Customer"}
                    {row.order.customer.email ? ` · ${row.order.customer.email}` : ""}
                    {address ? ` · ${address}` : ""}
                  </p>
                  {row.order.status === "CANCELLED" ? (
                    <p className="mt-1 text-xs font-medium text-red-600">
                      Customer order cancelled — do not ship, refund pending.
                    </p>
                  ) : null}
                </div>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${brandOrderStatusStyles[row.status]}`}
                >
                  {row.status}
                </span>
              </div>

              <ul className="mt-3 space-y-1">
                {row.order.orderItems.map((item) => (
                  <li key={item.id} className="flex items-center justify-between text-xs text-zinc-600">
                    <span>
                      {item.name} × {item.quantity}
                      {item.size || item.color
                        ? ` (${[item.size, item.color].filter(Boolean).join(", ")})`
                        : ""}
                    </span>
                    <span>{money(item.price * item.quantity, row.order.currency)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-3">
                <p className="text-xs text-zinc-500">
                  Your slice:{" "}
                  <span className="font-semibold text-zinc-900">
                    {money(row.subtotal, row.order.currency)}
                  </span>
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    className="w-44 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400"
                    placeholder="Tracking number"
                    maxLength={100}
                    value={trackingDrafts[row.id] ?? row.trackingNumber ?? ""}
                    onChange={(e) =>
                      setTrackingDrafts((prev) => ({ ...prev, [row.id]: e.target.value }))
                    }
                  />
                  <button
                    type="button"
                    disabled={busyId === row.id}
                    onClick={() => saveTracking(row)}
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-900 disabled:opacity-50"
                  >
                    Save tracking
                  </button>
                  {fulfilActions[row.status]?.map(([next, label]) => (
                    <button
                      key={next}
                      type="button"
                      disabled={busyId === row.id}
                      onClick={() => advance(row, next)}
                      className={`rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] disabled:opacity-50 ${
                        next === "CANCELLED"
                          ? "border border-red-200 text-red-500 hover:bg-red-50"
                          : "bg-black text-white"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {orders?.length === 0 ? (
          <p className="text-xs text-zinc-500">
            No paid orders yet. Paid customer orders show up here automatically —
            advance them through processing, shipping and delivery.
          </p>
        ) : null}
      </div>

      <div className="mt-8 border-t border-zinc-100 pt-6">
        <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
          Payouts
        </h4>
        <div className="mt-4 space-y-2">
          {payouts === null ? (
            <p className="text-xs text-zinc-500">Loading payouts…</p>
          ) : null}
          {payouts?.map((payout) => (
            <div
              key={payout.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-100 bg-white px-4 py-3"
            >
              <div>
                <p className="text-sm text-zinc-900">
                  {money(payout.amount, payout.currency)}{" "}
                  <span className="text-xs text-zinc-500">
                    (commission {money(payout.platformFee, payout.currency)})
                  </span>
                </p>
                <p className="text-xs text-zinc-500">
                  {payout.orderNumber}
                  {payout.status === "PENDING" && payout.availableAt
                    ? ` · releases after ${new Date(payout.availableAt).toLocaleDateString()}`
                    : ""}
                  {payout.status === "PAID" && payout.paidAt
                    ? ` · paid ${new Date(payout.paidAt).toLocaleDateString()}`
                    : ""}
                </p>
                {payout.status === "FAILED" && payout.failureReason ? (
                  <p className="text-xs text-red-600">{payout.failureReason}</p>
                ) : null}
              </div>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${payoutStatusStyles[payout.status]}`}
              >
                {payout.status}
              </span>
            </div>
          ))}
          {payouts?.length === 0 ? (
            <p className="text-xs text-zinc-500">
              Payouts appear once you mark an order delivered. Funds release
              after the dispute window.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

type ThreadMessage = {
  id: string;
  body: string;
  fromUserId: string;
  fromRole: string;
  orderId: string | null;
  createdAt: string;
  readAt: string | null;
  fromName: string | null;
};

type MessageThread = {
  key: string;
  orderId: string | null;
  customer: { id: string; name: string | null } | null;
  unread: number;
  messages: ThreadMessage[];
};

function BrandMessagesSection() {
  const [threads, setThreads] = useState<MessageThread[] | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/brand/messages", { cache: "no-store" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Unable to load messages.");
        setThreads([]);
        return;
      }
      const data = await res.json();
      setThreads(data.threads ?? []);
    } catch {
      setError("Unable to reach the server.");
      setThreads([]);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const selected = threads?.find((thread) => thread.key === selectedKey) ?? null;

  const send = async () => {
    const body = draft.trim();
    if (!body || sending || !selected) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/brand/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selected.orderId ?? undefined,
          toUserId: selected.orderId ? undefined : selected.customer?.id,
          body,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Unable to send.");
        return;
      }
      setDraft("");
      await load();
    } catch {
      setError("Unable to reach the server.");
    } finally {
      setSending(false);
    }
  };

  const replyLabel = (message: ThreadMessage) => {
    if (message.fromRole === "BRAND") return "You";
    if (message.fromRole === "ADMIN") return "Platform";
    return message.fromName ?? "Customer";
  };

  return (
    <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500">
          Messages
        </h3>
        {selected ? (
          <button
            type="button"
            onClick={() => {
              setSelectedKey(null);
              setDraft("");
            }}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 hover:text-zinc-900"
          >
            ← All threads
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void load()}
            className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 hover:text-zinc-900"
          >
            Refresh
          </button>
        )}
      </div>

      {error ? (
        <p className="mt-4 text-xs text-red-500" role="alert">
          {error}
        </p>
      ) : null}

      {threads === null ? (
        <p className="mt-4 text-xs text-zinc-500">Loading messages…</p>
      ) : !selected ? (
        <div className="mt-4 space-y-2">
          {threads.map((thread) => {
            const last = thread.messages[thread.messages.length - 1];
            return (
              <button
                key={thread.key}
                type="button"
                onClick={() => {
                  setSelectedKey(thread.key);
                  setDraft("");
                }}
                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-left hover:border-zinc-300"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900">
                    {thread.customer?.name ?? "Platform"}
                    {thread.orderId ? (
                      <span className="ml-2 text-xs font-normal text-zinc-500">
                        order thread
                      </span>
                    ) : null}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {last ? last.body : ""}
                  </p>
                </div>
                {thread.unread > 0 ? (
                  <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-semibold text-white">
                    {thread.unread} new
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-400">
                    {last ? new Date(last.createdAt).toLocaleDateString() : ""}
                  </span>
                )}
              </button>
            );
          })}
          {threads.length === 0 ? (
            <p className="text-xs text-zinc-500">
              No customer messages yet. When buyers ask about your products or
              orders, their threads show up here.
            </p>
          ) : null}
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-sm font-medium text-zinc-900">
            {selected.customer?.name ?? "Platform"}
            {selected.orderId ? (
              <span className="ml-2 text-xs font-normal text-zinc-500">
                order thread
              </span>
            ) : null}
          </p>
          <div className="mt-3 max-h-80 space-y-2 overflow-y-auto">
            {selected.messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  message.fromRole === "BRAND"
                    ? "ml-auto bg-black text-white"
                    : "bg-zinc-50 text-zinc-800 border border-zinc-100"
                }`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-60">
                  {replyLabel(message)}
                </p>
                <p className="mt-1 whitespace-pre-wrap break-words">{message.body}</p>
                <p className="mt-1 text-[10px] opacity-50">
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              className="flex-1 rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400"
              placeholder="Reply…"
              maxLength={1000}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
            />
            <button
              type="button"
              disabled={sending || !draft.trim()}
              onClick={() => void send()}
              className="rounded-full bg-black px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white disabled:opacity-50"
            >
              {sending ? "Sending…" : "Reply"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductForm({
  categories,
  initial,
  onSaved,
  onCancel,
}: {
  categories: CategoryOption[];
  initial: ProductRow | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(
    initial ? String(typeof initial.price === "number" ? initial.price : parseFloat(initial.price)) : ""
  );
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [categoryId, setCategoryId] = useState(initial?.category.id ?? "");
  const [badge, setBadge] = useState(initial?.badge ?? "");
  const [subCategory, setSubCategory] = useState(initial?.subCategory ?? "");
  const [sizes, setSizes] = useState((initial?.sizes ?? []).join(", "));
  const [colors, setColors] = useState((initial?.colors ?? []).join(", "));
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [discount, setDiscount] = useState(
    initial?.discountPercent != null
      ? String(
          typeof initial.discountPercent === "number"
            ? initial.discountPercent
            : parseFloat(initial.discountPercent)
        )
      : ""
  );
  const [status, setStatus] = useState<"ACTIVE" | "DRAFT">(
    initial?.status === "DRAFT" ? "DRAFT" : "ACTIVE"
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const csv = (value: string) =>
    value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        name,
        description,
        price: Number(price),
        imageUrl,
        categoryId,
        badge: badge || null,
        subCategory: subCategory || null,
        sizes: csv(sizes),
        colors: csv(colors),
        tags: csv(tags),
        discountPercent: discount === "" ? null : Number(discount),
        status,
      };
      const res = await fetch(
        initial ? `/api/brand/products/${initial.id}` : "/api/brand/products",
        {
          method: initial ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Unable to save the product.");
        return;
      }
      onSaved();
    } catch {
      setError("Unable to reach the server.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="mt-6 space-y-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
        {initial ? "Edit product" : "New product"}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className={labelClass} htmlFor="p-name">Name *</label>
          <input id="p-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required maxLength={200} />
        </div>
        <div className="space-y-1">
          <label className={labelClass} htmlFor="p-category">Category *</label>
          <select id="p-category" className={inputClass} value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            <option value="" disabled>
              Select…
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className={labelClass} htmlFor="p-price">Price (USD) *</label>
          <input id="p-price" type="number" step="0.01" min="0.01" className={inputClass} value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <label className={labelClass} htmlFor="p-image">Image URL *</label>
          <input id="p-image" className={inputClass} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://" required maxLength={500} />
        </div>
      </div>
      <div className="space-y-1">
        <label className={labelClass} htmlFor="p-description">Description *</label>
        <textarea id="p-description" className={`${inputClass} min-h-24`} value={description} onChange={(e) => setDescription(e.target.value)} required maxLength={5000} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1">
          <label className={labelClass} htmlFor="p-sizes">Sizes (comma-separated)</label>
          <input id="p-sizes" className={inputClass} value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="S, M, L, XL" maxLength={600} />
        </div>
        <div className="space-y-1">
          <label className={labelClass} htmlFor="p-colors">Colors (comma-separated)</label>
          <input id="p-colors" className={inputClass} value={colors} onChange={(e) => setColors(e.target.value)} placeholder="Black, Navy" maxLength={600} />
        </div>
        <div className="space-y-1">
          <label className={labelClass} htmlFor="p-tags">Tags (comma-separated)</label>
          <input id="p-tags" className={inputClass} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="summer, cotton" maxLength={600} />
        </div>
        <div className="space-y-1">
          <label className={labelClass} htmlFor="p-badge">Badge</label>
          <input id="p-badge" className={inputClass} value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="New, Sale" maxLength={80} />
        </div>
        <div className="space-y-1">
          <label className={labelClass} htmlFor="p-sub">Sub-category</label>
          <input id="p-sub" className={inputClass} value={subCategory} onChange={(e) => setSubCategory(e.target.value)} placeholder="tshirts" maxLength={80} />
        </div>
        <div className="space-y-1">
          <label className={labelClass} htmlFor="p-discount">Discount %</label>
          <input id="p-discount" type="number" step="1" min="0" max="95" className={inputClass} value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="0" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="radio"
            name="p-status"
            checked={status === "ACTIVE"}
            onChange={() => setStatus("ACTIVE")}
          />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="radio"
            name="p-status"
            checked={status === "DRAFT"}
            onChange={() => setStatus("DRAFT")}
          />
          Draft
        </label>
      </div>
      {error ? (
        <p className="text-xs text-red-500" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className={primaryButton}>
          {saving ? "Saving…" : initial ? "Save changes" : "Create product"}
        </button>
        <button type="button" onClick={onCancel} className={secondaryButton}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function BrandCustomPagesSection({ brand }: { brand: Brand }) {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [pageName, setPageName] = useState(brand.name + " Edit");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/brand/custom-pages", { cache: "no-store" });
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
  }, []);

  async function createPage() {
    setCreating(true);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch("/api/brand/custom-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageName }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create");
        return;
      }
      setNotice("Page created");
      await load();
    } catch {
      setError("Failed to create");
    } finally {
      setCreating(false);
    }
  }

  return (
    <section id="custom-pages" className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Custom pages</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">Build your own product page template</h2>
          <p className="mt-1 text-sm text-zinc-600">Create a branded page, add products with sizes/prices/images from your device, submit for admin approval.</p>
        </div>
        <div className="flex items-center gap-2">
          <input className={inputClass + " w-64"} value={pageName} onChange={(e) => setPageName(e.target.value)} />
          <button onClick={createPage} disabled={creating} className={primaryButton + " w-auto px-6"}>{creating ? "Creating…" : "Create new page template"}</button>
        </div>
      </div>
      {notice ? <p className="text-xs text-emerald-600">{notice}</p> : null}
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
      {loading ? <div className="text-sm text-zinc-500">Loading…</div> : null}
      <div className="grid gap-4">
        {pages.map((p) => (
          <div key={p.id} className="rounded-2xl border border-zinc-100 p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{p.pageName}</p>
              <p className="text-xs text-zinc-500">/{p.slug} • {p.products?.length || 0} products • {p.status}</p>
            </div>
            <div className="flex gap-2">
              <a href={`/brand/custom-pages/${p.id}`} className={secondaryButton + " w-auto px-6"}>Open builder</a>
              {p.status === "APPROVED" ? <a href={`/brand-page/${brand.slug}/${p.slug}`} target="_blank" className={secondaryButton + " w-auto px-6"}>View live</a> : null}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-zinc-500">Max image size {Math.round(MAX_BRAND_IMAGE_BYTES/1024/1024)}MB. Allowed: JPG, PNG, WebP. Images stored securely and reviewed on submission.</p>
    </section>
  );
}
