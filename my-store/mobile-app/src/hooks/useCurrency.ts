import { useEffect, useState } from 'react';
import { useAuth } from '../stores/authStore';
import { useProfile } from '../stores/profileStore';
import {
  getCurrencyForCountry,
  setExchangeRates,
  convertPriceSync,
  formatCurrency,
} from '../lib/currency';
import { currencyAPI } from '../services/api';

let ratesRequested = false;

/**
 * Returns the user's country/currency and price helpers.
 *
 * The profile/preferences snapshot is loaded once at app start (and refreshed
 * on login/logout and profile saves), so currency stays in sync everywhere.
 * Live USD exchange rates are fetched once per session and cached in the
 * currency lib, so converted prices are accurate without blocking render.
 */
export function useCurrency() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const country = useProfile((state) => state.country);
  const loading = useProfile((state) => state.loading);
  const initialized = useProfile((state) => state.initialized);
  const load = useProfile((state) => state.load);

  // Bump to re-render once live rates have been loaded.
  const [, setRatesVersion] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      void load();
    }
  }, [isAuthenticated, load]);

  useEffect(() => {
    if (ratesRequested) return;
    ratesRequested = true;
    let cancelled = false;
    currencyAPI
      .getRates('USD')
      .then((data: { rates?: Record<string, number> }) => {
        if (!cancelled && data?.rates) {
          setExchangeRates(data.rates);
          setRatesVersion((v) => v + 1);
        }
      })
      .catch(() => {
        // Keep fallback rates.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { code, symbol } = getCurrencyForCountry(country);

  return {
    country,
    currency: code,
    symbol,
    loading: isAuthenticated && loading && !initialized,
    /** Convert a USD base amount into the user's currency. */
    convertPrice: (amountUSD: number) => convertPriceSync(amountUSD, code),
    /** Format a USD base amount in the user's currency (symbol + value). */
    formatPrice: (amountUSD: number) => formatCurrency(amountUSD, code),
  };
}
