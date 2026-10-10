"use client";

import { useEffect } from "react";
import { useAuth } from "@/stores/authStore";
import { useProfile } from "@/stores/profileStore";
import {
  getUserCurrencySync,
  convertPriceSync,
  formatPrice,
  initializeExchangeRates,
} from "@/lib/currency";

let ratesInitialized = false;

/**
 * Returns the user's country/currency from the shared profile store.
 *
 * The profile snapshot is loaded once (see `ProfileSync`) instead of being
 * fetched by every component, so all prices on a page resolve to the same
 * currency at the same time — and update automatically on login or profile
 * changes without visiting settings first.
 */
export function useCurrency() {
  const user = useAuth((state) => state.user);
  const country = useProfile((state) => state.country);
  const loading = useProfile((state) => state.loading);
  const initialized = useProfile((state) => state.initialized);
  const load = useProfile((state) => state.load);

  useEffect(() => {
    if (!ratesInitialized) {
      ratesInitialized = true;
      void initializeExchangeRates();
    }
  }, []);

  useEffect(() => {
    if (user) void load();
  }, [user, load]);

  const currency = getUserCurrencySync(country);

  return {
    country,
    currency: currency.code,
    symbol: currency.symbol,
    rate: currency.rate,
    convertPrice: (priceInUSD: number) => convertPriceSync(priceInUSD, country),
    formatPrice: (amount: number) => formatPrice(amount, currency.symbol),
    loading: Boolean(user) && loading && !initialized,
  };
}
