import { useEffect } from 'react';
import { useAuth } from '../stores/authStore';
import { useProfile } from '../stores/profileStore';
import { getCurrencyForCountry } from '../lib/currency';

/**
 * Returns the user's country and currency from the global profile store.
 *
 * The profile/preferences snapshot is loaded once at app start (and refreshed
 * on login/logout and profile saves), so screens no longer fetch it
 * individually — currency stays in sync everywhere, instantly.
 */
export function useCurrency() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const country = useProfile((state) => state.country);
  const loading = useProfile((state) => state.loading);
  const initialized = useProfile((state) => state.initialized);
  const load = useProfile((state) => state.load);

  useEffect(() => {
    if (isAuthenticated) {
      void load();
    }
  }, [isAuthenticated, load]);

  const { code, symbol } = getCurrencyForCountry(country);

  return {
    country,
    currency: code,
    symbol,
    loading: isAuthenticated && loading && !initialized,
  };
}
