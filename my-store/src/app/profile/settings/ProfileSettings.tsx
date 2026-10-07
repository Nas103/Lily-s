"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Check, Link2, Unlink, ShieldCheck } from "lucide-react";
import { usePreferences, type Preferences } from "@/hooks/usePreferences";
import { Toggle, SettingRow } from "./Toggle";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS = ["Onyx", "Sand", "Oat", "Shadow", "Fog"];
const CATEGORIES = [
  "Abayas",
  "Kaftans",
  "Hijabs",
  "Dresses",
  "Outerwear",
  "Accessories",
];
const CURRENCIES = ["ZAR", "USD", "EUR", "GBP", "NGN", "KES"];

function SectionShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-2xl border border-zinc-200 bg-white p-8"
    >
      <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
      <p className="mt-1 text-sm text-zinc-500">{description}</p>
      <div className="mt-6">{children}</div>
    </motion.div>
  );
}

function SavingBadge({ saving }: { saving: boolean }) {
  return (
    <AnimatePresence>
      {saving && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="inline-flex items-center gap-1 text-xs text-zinc-500"
        >
          <Loader2 className="h-3 w-3 animate-spin" /> Saving
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function ChangePasswordCard() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "error" | "success"; message: string } | null>(
    null
  );

  const close = () => {
    setOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setStatus(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus(null);

    if (newPassword.length < 8) {
      setStatus({ type: "error", message: "New password must be at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "New passwords do not match." });
      return;
    }
    if (newPassword === currentPassword) {
      setStatus({
        type: "error",
        message: "New password must be different from your current password.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Unable to update password.");

      setStatus({ type: "success", message: "Password updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Unable to update password.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.15 }}
      className="mt-6 rounded-2xl border border-zinc-100 bg-zinc-50 p-4"
    >
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-zinc-700" />
        <div className="flex-1">
          <p className="text-sm font-medium text-zinc-900">Password</p>
          <p className="text-xs text-zinc-500">Change your password regularly</p>
        </div>
        <button
          type="button"
          onClick={() => (open ? close() : setOpen(true))}
          className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-700 hover:border-zinc-900"
        >
          {open ? "Cancel" : "Manage"}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.form
            key="password-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3 border-t border-zinc-200 pt-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">
                  Current password
                </label>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">
                  New password
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                  required
                />
                <p className="mt-1 text-[11px] text-zinc-400">At least 8 characters</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600">
                  Confirm new password
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>

              {status && (
                <p
                  className={`text-xs ${
                    status.type === "success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {status.message}
                </p>
              )}

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white disabled:opacity-60"
                >
                  {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
                  Update password
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ProfileSettings({ section }: { section: string }) {
  const { preferences, loading, saving, error, save } = usePreferences();
  const [links, setLinks] = useState<{ googleLinked: boolean; appleLinked: boolean } | null>(null);
  const [linkBusy, setLinkBusy] = useState<string | null>(null);

  useEffect(() => {
    if (section !== "links") return;
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/profile/links", { credentials: "same-origin" });
        if (res.ok) {
          const data = await res.json();
          if (active) setLinks(data.links);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      active = false;
    };
  }, [section]);

  const toggleLink = async (provider: "google" | "apple") => {
    if (!links) return;
    const field = provider === "google" ? "googleLinked" : "appleLinked";
    const action = links[field] ? "unlink" : "link";
    setLinkBusy(provider);
    try {
      const res = await fetch("/api/profile/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ provider, action }),
      });
      if (res.ok) {
        const data = await res.json();
        setLinks(data.links);
      }
    } finally {
      setLinkBusy(null);
    }
  };

  if (loading || !preferences) {
    return (
      <div className="flex justify-center py-16 text-zinc-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const p = preferences;

  const toggleValue = (key: keyof Preferences, value: boolean) =>
    save({ [key]: value } as Partial<Preferences>);

  const toggleListItem = (
    key: "preferredSizes" | "preferredColors" | "preferredCategories",
    value: string
  ) => {
    const list = p[key];
    const next = list.includes(value)
      ? list.filter((item) => item !== value)
      : [...list, value];
    save({ [key]: next } as Partial<Preferences>);
  };

  if (section === "shop") {
    return (
      <SectionShell
        title="Shop Preferences"
        description="Personalise your storefront — we use these to curate your feed."
      >
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
              Currency
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CURRENCIES.map((currency) => (
                <button
                  key={currency}
                  type="button"
                  onClick={() => save({ preferredCurrency: currency })}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                    p.preferredCurrency === currency
                      ? "bg-zinc-900 text-white"
                      : "border border-zinc-200 text-zinc-700 hover:border-zinc-900"
                  }`}
                >
                  {currency}
                </button>
              ))}
            </div>
          </div>

          {[
            { title: "Preferred sizes", key: "preferredSizes" as const, items: SIZES },
            { title: "Preferred colours", key: "preferredColors" as const, items: COLORS },
            { title: "Favourite categories", key: "preferredCategories" as const, items: CATEGORIES },
          ].map((group) => (
            <div key={group.key}>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                {group.title}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => {
                  const active = p[group.key].includes(item);
                  return (
                    <motion.button
                      key={item}
                      type="button"
                      whileTap={{ scale: 0.94 }}
                      onClick={() => toggleListItem(group.key, item)}
                      className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                        active
                          ? "bg-zinc-900 text-white"
                          : "border border-zinc-200 text-zinc-700 hover:border-zinc-900"
                      }`}
                    >
                      {active && <Check className="h-3 w-3" />}
                      {item}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between">
            <SavingBadge saving={saving} />
            {error && <span className="text-xs text-red-600">{error}</span>}
          </div>
        </div>
      </SectionShell>
    );
  }

  if (section === "notifications") {
    return (
      <SectionShell
        title="Communication Preferences"
        description="Choose how and when Nas keeps you in the loop."
      >
        <SettingRow title="Email notifications" description="Account and order emails" delay={0}>
          <Toggle checked={p.emailNotifications} onChange={(v) => toggleValue("emailNotifications", v)} />
        </SettingRow>
        <SettingRow title="Push notifications" description="Alerts on your devices" delay={0.05}>
          <Toggle checked={p.pushNotifications} onChange={(v) => toggleValue("pushNotifications", v)} />
        </SettingRow>
        <SettingRow title="SMS notifications" description="Delivery updates by text" delay={0.1}>
          <Toggle checked={p.smsNotifications} onChange={(v) => toggleValue("smsNotifications", v)} />
        </SettingRow>
        <SettingRow title="Order updates" description="Shipping and delivery status" delay={0.15}>
          <Toggle checked={p.orderUpdates} onChange={(v) => toggleValue("orderUpdates", v)} />
        </SettingRow>
        <SettingRow title="Product updates" description="New drops and restocks" delay={0.2}>
          <Toggle checked={p.productUpdates} onChange={(v) => toggleValue("productUpdates", v)} />
        </SettingRow>
        <SettingRow title="Marketing emails" description="Offers and campaigns" delay={0.25}>
          <Toggle checked={p.marketingEmails} onChange={(v) => toggleValue("marketingEmails", v)} />
        </SettingRow>
        <div className="pt-4">
          <SavingBadge saving={saving} />
        </div>
      </SectionShell>
    );
  }

  if (section === "privacy") {
    return (
      <SectionShell
        title="Privacy & Security"
        description="Control your data and keep your account secure."
      >
        <SettingRow
          title="Two-factor authentication"
          description={p.twoFactorEnabled ? "Enabled for this account" : "Add an extra layer of security"}
          delay={0}
        >
          <Toggle checked={p.twoFactorEnabled} onChange={(v) => toggleValue("twoFactorEnabled", v)} />
        </SettingRow>
        <SettingRow title="Location sharing" description="Improve currency and delivery accuracy" delay={0.05}>
          <Toggle checked={p.locationSharing} onChange={(v) => toggleValue("locationSharing", v)} />
        </SettingRow>
        

        <ChangePasswordCard />

        <div className="pt-4">
          <SavingBadge saving={saving} />
        </div>
      </SectionShell>
    );
  }

  if (section === "links") {
    const providers = [
      { id: "google" as const, name: "Google", color: "#EA4335" },
      { id: "apple" as const, name: "Apple", color: "#111111" },
    ];
    return (
      <SectionShell
        title="Linked Accounts"
        description="Connect third-party accounts for faster, one-tap sign in."
      >
        <div className="space-y-3">
          {providers.map((provider, index) => {
            const linked = links?.[provider.id === "google" ? "googleLinked" : "appleLinked"] ?? false;
            return (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className="flex items-center justify-between rounded-2xl border border-zinc-100 p-4"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: provider.color }}
                  >
                    {provider.name[0]}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{provider.name}</p>
                    <p className="text-xs text-zinc-500">
                      {linked ? "Connected" : "Not connected"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={linkBusy !== null}
                  onClick={() => toggleLink(provider.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition disabled:opacity-50 ${
                    linked
                      ? "border border-zinc-200 text-zinc-700 hover:border-red-300 hover:text-red-600"
                      : "bg-zinc-900 text-white hover:bg-zinc-800"
                  }`}
                >
                  {linkBusy === provider.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : linked ? (
                    <Unlink className="h-3 w-3" />
                  ) : (
                    <Link2 className="h-3 w-3" />
                  )}
                  {linked ? "Disconnect" : "Connect"}
                </button>
              </motion.div>
            );
          })}
        </div>
      </SectionShell>
    );
  }

  return null;
}