"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useAuth } from "@/stores/authStore";
import { useProfile } from "@/stores/profileStore";

type FormState = {
  fullName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

const inputClass =
  "w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-500";

function firstNonEmpty(...values: Array<unknown>): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) return value;
  }
  return "";
}

function field(source: Record<string, unknown> | null | undefined, key: string): string {
  const value = source?.[key];
  return typeof value === "string" ? value : "";
}

export function CheckoutForm() {
  const user = useAuth((state) => state.user);
  const profile = useProfile((state) => state.profile);
  const addresses = useProfile((state) => state.addresses);
  const loadProfile = useProfile((state) => state.load);

  // Only hold the shopper's own edits; untouched fields fall back to their
  // saved profile/address values (blank when nothing has been saved yet).
  const [edits, setEdits] = useState<Partial<FormState>>({});

  useEffect(() => {
    if (user) void loadProfile();
  }, [user, loadProfile]);

  const saved = useMemo<FormState>(() => {
    const defaultAddress =
      addresses.find((address) => address?.isDefault) ?? addresses[0] ?? null;
    const address = defaultAddress as Record<string, unknown> | null;

    return {
      fullName: firstNonEmpty(profile?.name, field(address, "fullName")),
      email: firstNonEmpty(profile?.email, user?.email),
      street: firstNonEmpty(profile?.addressLine1, field(address, "addressLine1")),
      city: firstNonEmpty(profile?.city, field(address, "city")),
      state: field(address, "state"),
      postalCode: firstNonEmpty(profile?.postcode, field(address, "postcode")),
      country: firstNonEmpty(profile?.country, field(address, "country")),
    };
  }, [profile, addresses, user]);

  const valueOf = (key: keyof FormState) => edits[key] ?? saved[key];

  const update =
    (key: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) =>
      setEdits((current) => ({ ...current, [key]: event.target.value }));

  return (
    <form className="space-y-4 rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
          Contact
        </p>
        <input
          type="text"
          placeholder="Full name"
          value={valueOf("fullName")}
          onChange={update("fullName")}
          className={`mt-2 ${inputClass}`}
        />
        <input
          type="email"
          placeholder="Email address"
          value={valueOf("email")}
          onChange={update("email")}
          className={`mt-2 ${inputClass}`}
        />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
          Shipping address
        </p>
        <input
          type="text"
          placeholder="Street address"
          value={valueOf("street")}
          onChange={update("street")}
          className={`mt-2 ${inputClass}`}
        />
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="City"
            value={valueOf("city")}
            onChange={update("city")}
            className={inputClass}
          />
          <input
            type="text"
            placeholder="State"
            value={valueOf("state")}
            onChange={update("state")}
            className={inputClass}
          />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Postal code"
            value={valueOf("postalCode")}
            onChange={update("postalCode")}
            className={inputClass}
          />
          <input
            type="text"
            placeholder="Country"
            value={valueOf("country")}
            onChange={update("country")}
            className={inputClass}
          />
        </div>
      </div>
    </form>
  );
}
