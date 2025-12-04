"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type EventType = "view" | "add_to_cart" | "purchase";

export type RecommendationEvent = {
  productId: string;
  type: EventType;
  at: number;
};

type RecommendationStore = {
  recentlyViewed: string[];
  events: RecommendationEvent[];
  trackEvent: (event: RecommendationEvent) => void;
  trackView: (productId: string) => void;
  trackAddToCart: (productId: string) => void;
  trackPurchase: (productId: string) => void;
};

export const useRecommendationStore = create<RecommendationStore>()(
  persist(
    (set, get) => ({
      recentlyViewed: [],
      events: [],
      trackEvent: (event) =>
        set((state) => {
          const withoutDuplicate = state.recentlyViewed.filter(
            (id) => id !== event.productId
          );
          const nextRecentlyViewed = [
            event.productId,
            ...withoutDuplicate,
          ].slice(0, 20);

          return {
            recentlyViewed: nextRecentlyViewed,
            events: [...state.events, event].slice(-200),
          };
        }),
      trackView: (productId) =>
        get().trackEvent({ productId, type: "view", at: Date.now() }),
      trackAddToCart: (productId) =>
        get().trackEvent({ productId, type: "add_to_cart", at: Date.now() }),
      trackPurchase: (productId) =>
        get().trackEvent({ productId, type: "purchase", at: Date.now() }),
    }),
    { name: "recommendation-events" }
  )
);


