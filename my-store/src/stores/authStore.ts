"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: string;
  email: string;
  name?: string | null;
  role: "USER" | "ADMIN";
  createdAt?: string;
};

type AuthStore = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  refresh: () => Promise<void>;
  isAdmin: () => boolean;
};

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => {
        set({ user: null });
        if (typeof window !== "undefined") {
          void fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
        }
      },
      refresh: async () => {
        if (typeof window === "undefined") return;
        try {
          const res = await fetch("/api/auth/me", { cache: "no-store" });
          if (res.ok) {
            const user = (await res.json()) as User;
            set({ user });
          } else {
            set({ user: null });
          }
        } catch {
          // Network error - keep the persisted user for offline resilience
        }
      },
      isAdmin: () => get().user?.role === "ADMIN",
    }),
    { name: "auth-storage" }
  )
);

