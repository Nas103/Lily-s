"use client";

import { create } from "zustand";

export type Toast = {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  href?: string;
  linkLabel?: string;
};

type ToastStore = {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;
};

let nextToastId = 0;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  showToast: ({ title, description, imageUrl, href, linkLabel }) => {
    const id = ++nextToastId;
    set((state) => ({
      toasts: [...state.toasts.slice(-2), { id, title, description, imageUrl, href, linkLabel }],
    }));
    setTimeout(() => {
      useToastStore.getState().dismissToast(id);
    }, 3000);
  },
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));
