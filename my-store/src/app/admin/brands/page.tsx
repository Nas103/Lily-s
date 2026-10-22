"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/stores/authStore";
import { formatBytes } from "@/lib/verificationDoc";

type AdminBrand = {
  id: string;
  name: string;
  slug: string;
  status: "PENDING" | "APPROVED" | "SUSPENDED" | "REJECTED";
  verificationStatus: "UNSUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";
  verificationDocUrl: string | null;
  verificationDocName: string | null;
  verificationDocMimeType: string | null;
  verificationDocSize: number | null;
  verificationDocUploadedAt: string | null;
  hasVerificationDoc: boolean;
  contactEmail: string;
  country: string | null;
  businessName: string | null;
  website: string | null;
  description: string | null;
  rejectionReason: string | null;
  stripeAccountId: string | null;
  commissionRate: string | number;
  subscriptionTier: "FREE" | "PRO";
  createdAt: string;
  user: { id: string; email: string; name: string | null };
  _count: { products: number; brandOrders: number; payouts: number };
};

const statusStyles: Record<AdminBrand["status"], string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  SUSPENDED: "bg-red-50 text-red-700 border-red-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
};

type AdminPayout = {
  id: string;
  status: "PENDING" | "PAID" | "FAILED";
  amount: number;
  platformFee: number;
  currency: string;
  failureReason: string | null;
  availableAt: string | null;
  paidAt: string | null;
  createdAt: string;
  brandId: string;
  brandName: string | null;
  orderNumber: string | null;
  paymentMethod: string | null;
};

const payoutStyles: Record<AdminPayout["status"], string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FAILED: "bg-red-50 text-red-700 border-red-200",
};

export default function AdminBrandsPage() {
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const isAdmin = useAuth((state) => state.isAdmin);
  const logout = useAuth((state) => state.logout);

  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [payouts, setPayouts] = useState<AdminPayout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [busyPayoutId, setBusyPayoutId] = useState<string | null>(null);

  useEffect(() => {
    if (user && !isAdmin()) {
      router.push("/");
    } else if (!user) {
      router.push("/login?next=/admin/brands");
    }
  }, [user, isAdmin, router]);

  const fetchBrands = async () => {
    if (!user || !isAdmin()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/brands", { cache: "no-store" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Unable to load brands.");
        setBrands([]);
        return;
      }
      setBrands((await res.json()) as AdminBrand[]);
    } catch {
      setError("Unable to load brands right now.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPayouts = async () => {
    if (!user || !isAdmin()) return;
    try {
      const res = await fetch("/api/admin/payouts", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setPayouts(data.payouts ?? []);
    } catch {
      setPayouts([]);
    }
  };

  useEffect(() => {
    if (user && isAdmin()) {
      void fetchBrands();
      void fetchPayouts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const releasePayout = async (payout: AdminPayout) => {
    if (!user || !isAdmin()) return;
    if (
      !confirm(
        `Release ${payout.currency} ${Number(payout.amount).toFixed(2)} to ${
          payout.brandName ?? "brand"
        }${payout.orderNumber ? ` (order ${payout.orderNumber})` : ""}?`
      )
    ) {
      return;
    }
    setBusyPayoutId(payout.id);
    try {
      const res = await fetch(`/api/admin/payouts/${payout.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "release" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Release failed.");
      }
      await fetchPayouts();
    } catch {
      alert("Unable to reach the server. Please try again.");
    } finally {
      setBusyPayoutId(null);
    }
  };

  const act = async (brand: AdminBrand, action: string) => {
    if (!user || !isAdmin()) return;

    if (action === "approve" && !brand.hasVerificationDoc && !brand.verificationDocUrl) {
      alert(
        "This brand has no verification document on file. Ask them to submit one before approving."
      );
      return;
    }
    let reason: string | undefined;
    if (action === "reject") {
      const input = window.prompt("Reason for rejecting this brand:");
      if (input === null) return;
      reason = input.trim();
      if (!reason) {
        alert("A rejection reason is required.");
        return;
      }
    } else if (action === "suspend") {
      const input = window.prompt("Suspension reason (optional):");
      if (input === null) return;
      reason = input.trim() || undefined;
    }

    setBusyId(brand.id);
    try {
      const res = await fetch(`/api/admin/brands/${brand.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Action failed.");
        return;
      }
      await fetchBrands();
    } catch {
      alert("Unable to reach the server. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="text-zinc-900">
      <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Internal tool</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
        Brand review
      </h1>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          Verify and control marketplace sellers. Logged in as{" "}
          <span className="font-medium text-zinc-900">{user?.email}</span>
        </p>
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-600 hover:border-zinc-900 hover:text-zinc-900"
        >
          Logout
        </button>
      </div>

      {error ? (
        <p className="mt-4 text-xs text-red-500" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-8 space-y-4">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-zinc-900">{brand.name}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {brand.contactEmail} · {brand.country ?? "—"} · owner {brand.user.email} ·{" "}
                  {brand._count.products} products · {String(brand.commissionRate)}% commission ·{" "}
                  {brand.subscriptionTier}
                </p>
                <p className="text-xs text-zinc-500">
                  ID verification: <span className="font-medium">{brand.verificationStatus}</span>
                  {brand.hasVerificationDoc ? (
                    <>
                      {" · "}
                      <a
                        href={`/api/admin/brands/${brand.id}/verification-document`}
                        className="text-blue-600 underline"
                      >
                        download {brand.verificationDocName}
                        {brand.verificationDocSize ? ` (${formatBytes(brand.verificationDocSize)})` : ""}
                      </a>
                      {brand.verificationDocUploadedAt
                        ? ` · uploaded ${new Date(brand.verificationDocUploadedAt).toLocaleDateString()}`
                        : ""}
                    </>
                  ) : brand.verificationDocUrl ? (
                    <>
                      {" · "}
                      <a
                        href={brand.verificationDocUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        view external document
                      </a>
                    </>
                  ) : (
                    " · no document"
                  )}
                </p>
                {brand.description ? (
                  <p className="mt-1 max-w-2xl text-xs text-zinc-500">{brand.description}</p>
                ) : null}
                {brand.rejectionReason ? (
                  <p className="mt-1 text-xs text-red-600">
                    Reason on file: {brand.rejectionReason}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${statusStyles[brand.status]}`}
                >
                  {brand.status}
                </span>
                {brand.status !== "APPROVED" ? (
                  <button
                    type="button"
                    disabled={busyId === brand.id}
                    onClick={() => void act(brand, "approve")}
                    className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600 hover:text-emerald-800 disabled:opacity-50"
                  >
                    Approve
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={busyId === brand.id}
                    onClick={() => void act(brand, "suspend")}
                    className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600 hover:text-amber-800 disabled:opacity-50"
                  >
                    Suspend
                  </button>
                )}
                {brand.status === "REJECTED" || brand.status === "SUSPENDED" ? (
                  <button
                    type="button"
                    disabled={busyId === brand.id}
                    onClick={() => void act(brand, "reinstate")}
                    className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-600 hover:text-zinc-900 disabled:opacity-50"
                  >
                    Reinstate
                  </button>
                ) : null}
                {brand.status !== "REJECTED" ? (
                  <button
                    type="button"
                    disabled={busyId === brand.id}
                    onClick={() => void act(brand, "reject")}
                    className="text-xs font-semibold uppercase tracking-[0.25em] text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}

        {brands.length === 0 && !loading ? (
          <p className="text-xs text-zinc-500">No brands registered yet.</p>
        ) : null}
        {loading ? <p className="text-xs text-zinc-500">Loading…</p> : null}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Payouts</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Brand settlements. Release pushes the brand&apos;s net share to their Stripe
          account once the dispute window has passed.
        </p>
        <div className="mt-4 space-y-3">
          {payouts.map((payout) => {
            const tooEarly =
              payout.status !== "PAID" &&
              payout.availableAt !== null &&
              new Date(payout.availableAt).getTime() > Date.now();
            const canRelease =
              payout.status !== "PAID" &&
              !tooEarly &&
              payout.paymentMethod === "stripe";
            return (
              <div
                key={payout.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm"
              >
                <div>
                  <p className="font-medium text-zinc-900">
                    {payout.currency} {Number(payout.amount).toFixed(2)}{" "}
                    <span className="text-xs font-normal text-zinc-500">
                      to {payout.brandName ?? payout.brandId}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {payout.orderNumber ? `Order ${payout.orderNumber}` : "—"} · fee{" "}
                    {payout.currency} {Number(payout.platformFee).toFixed(2)} ·{" "}
                    {payout.paymentMethod ?? "unknown method"} · created{" "}
                    {new Date(payout.createdAt).toLocaleDateString()}
                    {payout.status === "PENDING" && payout.availableAt
                      ? ` · available ${new Date(payout.availableAt).toLocaleDateString()}`
                      : ""}
                    {payout.paidAt
                      ? ` · paid ${new Date(payout.paidAt).toLocaleDateString()}`
                      : ""}
                  </p>
                  {payout.failureReason ? (
                    <p className="mt-1 text-xs text-red-600">{payout.failureReason}</p>
                  ) : null}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${payoutStyles[payout.status]}`}
                  >
                    {payout.status}
                  </span>
                  {canRelease ? (
                    <button
                      type="button"
                      disabled={busyPayoutId === payout.id}
                      onClick={() => void releasePayout(payout)}
                      className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600 hover:text-emerald-800 disabled:opacity-50"
                    >
                      {busyPayoutId === payout.id
                        ? "Releasing…"
                        : payout.status === "FAILED"
                        ? "Retry"
                        : "Release"}
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
          {payouts.length === 0 ? (
            <p className="text-xs text-zinc-500">
              No settlements yet — payouts are created when brands mark orders
              delivered.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
