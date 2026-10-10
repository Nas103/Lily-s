import { create } from 'zustand';
import { profileAPI, preferencesAPI, deliveryAddressesAPI } from '../services/api';

export type UserProfile = {
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
  profile: UserProfile | null;
  preferences: Preferences | null;
  addresses: DeliveryAddress[];
  country: string | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  load: (options?: { force?: boolean }) => Promise<void>;
  refresh: () => Promise<void>;
  updateProfile: (patch: Partial<UserProfile>) => Promise<UserProfile>;
  updatePreferences: (patch: Partial<Preferences>) => Promise<Preferences | null>;
  setCountry: (country: string | null) => void;
  reset: () => void;
};

const initialState = {
  profile: null as UserProfile | null,
  preferences: null as Preferences | null,
  addresses: [] as DeliveryAddress[],
  country: null as string | null,
  loading: false,
  initialized: false,
  error: null as string | null,
};

export function resolveCountry(
  profile: UserProfile | null,
  addresses: DeliveryAddress[] | null | undefined
): string | null {
  if (profile?.country) return profile.country;
  const list = Array.isArray(addresses) ? addresses : [];
  const preferred = list.find((addr) => addr?.isDefault) || list[0];
  return preferred?.country || null;
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

    // Deduplicate concurrent callers (e.g. multiple screens mounting at once).
    if (inflight) {
      await inflight;
      return;
    }

    set({ loading: true, error: null });

    inflight = (async () => {
      try {
        const [profile, preferencesResponse, addresses] = await Promise.all([
          profileAPI.get().catch(() => null),
          preferencesAPI.get().catch(() => null),
          deliveryAddressesAPI.getAll().catch(() => []),
        ]);

        const addressList: DeliveryAddress[] = Array.isArray(addresses) ? addresses : [];
        const preferences: Preferences | null = preferencesResponse?.preferences ?? null;

        set({
          profile: profile ?? null,
          preferences,
          addresses: addressList,
          country: resolveCountry(profile ?? null, addressList),
          loading: false,
          initialized: true,
        });
      } catch (error: any) {
        // Leave `initialized` false so a later call can retry.
        set({
          loading: false,
          error: error?.message || 'Failed to load profile',
        });
      } finally {
        inflight = null;
      }
    })();

    await inflight;
  },

  refresh: () => get().load({ force: true }),

  updateProfile: async (patch) => {
    const updated = await profileAPI.update(patch);
    set((state) => ({
      profile: updated,
      country: resolveCountry(updated, state.addresses),
    }));
    return updated;
  },

  updatePreferences: async (patch) => {
    set((state) => ({
      preferences: state.preferences ? { ...state.preferences, ...patch } : state.preferences,
    }));
    try {
      const res = await preferencesAPI.update(patch);
      const preferences: Preferences | null = res?.preferences ?? null;
      if (preferences) set({ preferences });
      return preferences;
    } catch (error) {
      // Revert by reloading the authoritative copy on failure.
      await get().load({ force: true });
      throw error;
    }
  },

  setCountry: (country) => set({ country }),

  reset: () => set({ ...initialState }),
}));
