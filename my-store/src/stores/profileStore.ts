"use client";

import { create } from "zustand";
import { useAuth } from "./authStore";

export type Profile = {
  id: string;
  email: string;
  name?: string | null;
  role?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null;
  country?: string | null;
  city?: string | null;
  postcode?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  profileImageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Preferences = {
  profileVisibility: string;
  locationSharing: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  pushNotifications: boolean;
  orderUpdates: boolean;
  productUpdates: boolean;
  preferredCategories: string[];
  preferredSizes: string[];
  preferredColors: string[];
  preferredCurrency: string;
  showEmail: boolean;
  showPhone: boolean;
  showOrderHistory: boolean;
  profileDiscoverable: boolean;
  twoFactorEnabled: boolean;
};

export type DeliveryAddress = {
  id: string;
  country?: string | null;
  isDefault?: boolean;
  [key: string]: unknown;
};

type ProfileStore = {
  profile: Profile | null;
  preferences: Preferences | null;
  addresses: DeliveryAddress[];
  country: string | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  load: (options?: { force?: boolean }) => Promise<void>;
  refresh: () => Promise<void>;
  updateProfile: (patch: Partial<Profile>) => Promise<Profile>;
  updatePreferences: (patch: Partial<Preferences>) => Promise<Preferences | null>;
  setCountry: (country: string | null) => void;
  reset: () => void;
};

const initialState = {
  profile: null as Profile | null,
  preferences: null as Preferences | null,
  addresses: [] as DeliveryAddress[],
  country: null as string | null,
  loading: false,
  initialized: false,
  error: null as string | null,
};

export function resolveCountry(
  profile: Profile | null,
  addresses: DeliveryAddress[] | null | undefined
): string | null {
  if (profile?.country) return profile.country;
  const list = Array.isArray(addresses) ? addresses : [];
  const preferred = list.find((addr) => addr?.isDefault) || list[0];
  return preferred?.country || null;
}

function authHeaders(): Record<string, string> {
  const user = useAuth.getState().user;
  if (!user) return {};
  return { "x-user-id": user.id, "x-user-email": user.email };
}

let inflight: Promise<void> | null = null;

export const useProfile = create<ProfileStore>((set, get) => ({
  ...initialState,

  load: async ({ force = false } = {}) => {
    const state = get();
    if (state.loading) {
      if (inflight) await inflight;
      return;
    }
    if (state.initialized && !force) return;

    // Deduplicate concurrent callers (many components share this store).
    if (inflight) {
      await inflight;
      return;
    }

    set({ loading: true, error: null });

    inflight = (async () => {
      const headers = authHeaders();
      try {
        const [profileRes, preferencesRes, addressesRes] = await Promise.all([
          fetch("/api/profile", { headers, credentials: "same-origin" }).catch(() => null),
          fetch("/api/profile/preferences", { headers, credentials: "same-origin" }).catch(() => null),
          fetch("/api/delivery-addresses", { headers, credentials: "same-origin" }).catch(() => null),
        ]);

        const profile: Profile | null = profileRes?.ok ? await profileRes.json() : null;
        const preferences: Preferences | null = preferencesRes?.ok
          ? (await preferencesRes.json())?.preferences ?? null
          : null;
        const rawAddresses = addressesRes?.ok ? await addressesRes.json() : [];
        const addresses: DeliveryAddress[] = Array.isArray(rawAddresses) ? rawAddresses : [];

        set({
          profile,
          preferences,
          addresses,
          country: resolveCountry(profile, addresses),
          loading: false,
          initialized: true,
        });
      } catch (error) {
        set({
          loading: false,
          error: error instanceof Error ? error.message : "Failed to load profile",
        });
      } finally {
        inflight = null;
      }
    })();

    await inflight;
  },

  refresh: () => get().load({ force: true }),

  updateProfile: async (patch) => {
    const user = useAuth.getState().user;
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      credentials: "same-origin",
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || "Failed to update profile");
    }
    set((state) => ({
      profile: data,
      country: resolveCountry(data, state.addresses),
    }));
    if (user && data?.name !== undefined) {
      useAuth.getState().setUser({ ...user, name: data.name });
    }
    return data;
  },

  updatePreferences: async (patch) => {
    set((state) => ({
      preferences: state.preferences ? { ...state.preferences, ...patch } : state.preferences,
    }));
    try {
      const res = await fetch("/api/profile/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        credentials: "same-origin",
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Unable to save preferences");
      const preferences: Preferences | null = data?.preferences ?? null;
      if (preferences) set({ preferences });
      return preferences;
    } catch (error) {
      await get().load({ force: true });
      throw error;
    }
  },

  setCountry: (country) => set({ country }),

  reset: () => set({ ...initialState }),
}));
