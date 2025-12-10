"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/stores/authStore";
import { getUserCurrencySync, convertPriceSync, formatPrice, initializeExchangeRates } from "@/lib/currency";

/**
 * Hook to get user's currency based on their saved address
 */
export function useCurrency() {
  const user = useAuth((state) => state.user);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCountry = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user profile to get country
        const res = await fetch("/api/profile", {
          headers: {
            "x-user-id": user.id,
            "x-user-email": user.email,
          },
        });

        if (res.ok) {
          const profile = await res.json();
          // Check if user has a default delivery address
          if (profile.country) {
            setUserCountry(profile.country);
          } else {
            // Try to get from default delivery address
            const addressRes = await fetch("/api/delivery-addresses", {
              headers: {
                "x-user-id": user.id,
                "x-user-email": user.email,
              },
            });

            if (addressRes.ok) {
              const addresses = await addressRes.json();
              const defaultAddress = addresses.find((addr: any) => addr.isDefault);
              if (defaultAddress) {
                setUserCountry(defaultAddress.country);
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch user country:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCountry();
  }, [user]);

  // Initialize exchange rates on mount
  useEffect(() => {
    initializeExchangeRates();
  }, []);

  const currency = getUserCurrencySync(userCountry);

  return {
    country: userCountry,
    currency: currency.code,
    symbol: currency.symbol,
    rate: currency.rate,
    convertPrice: (priceInUSD: number) => convertPriceSync(priceInUSD, userCountry),
    formatPrice: (amount: number) => formatPrice(amount, currency.symbol),
    loading,
  };
}

