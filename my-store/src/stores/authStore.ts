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
  isAdmin: () => boolean;
};

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
      isAdmin: () => get().user?.role === "ADMIN",
    }),
    { name: "auth-storage" }
  )
);

