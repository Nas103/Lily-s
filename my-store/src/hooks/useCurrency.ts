"use client";

import { useEffect } from "react";
import { useAuth } from "@/stores/authStore";
import { useProfile } from "@/stores/profileStore";
import {
  getUserCurrencySync,
  getCurrencyByCodeSync,
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
  const preferences = useProfile((state) => state.preferences);
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

  // An explicit preferred currency (set in profile settings) takes priority
  // over the currency inferred from the shipping country.
  const preferredCurrency = preferences?.preferredCurrency;
  const currency = preferredCurrency
    ? getCurrencyByCodeSync(preferredCurrency)
    : getUserCurrencySync(country);

  const convertPrice = (priceInUSD: number) => {
    const amount = priceInUSD / currency.rate;
    return {
      amount,
      currency: currency.code,
      symbol: currency.symbol,
      formatted: formatPrice(amount, currency.symbol),
    };
  };

  return {
    country,
    currency: currency.code,
    symbol: currency.symbol,
    rate: currency.rate,
    convertPrice,
    formatPrice: (amount: number) => formatPrice(amount, currency.symbol),
    loading: Boolean(user) && loading && !initialized,
  };
}
