import { useState, useEffect } from 'react';
import { useAuth } from '../stores/authStore';
import { profileAPI, deliveryAddressesAPI } from '../services/api';

/**
 * Hook to get user's currency based on their saved address
 * Similar to web app implementation
 */
export function useCurrency() {
  const { user, isAuthenticated } = useAuth();
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCountry = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        // First try to get from user profile
        const profile = await profileAPI.get();
        if (profile?.country) {
          setUserCountry(profile.country);
          setLoading(false);
          return;
        }

        // If no country in profile, try default delivery address
        const addresses = await deliveryAddressesAPI.getAll();
        const defaultAddress = Array.isArray(addresses) 
          ? addresses.find((addr: any) => addr.isDefault)
          : null;
        
        if (defaultAddress?.country) {
          setUserCountry(defaultAddress.country);
        }
      } catch (error) {
        console.error('Failed to fetch user country:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCountry();
  }, [isAuthenticated, user]);

  return {
    country: userCountry,
    loading,
  };
}

