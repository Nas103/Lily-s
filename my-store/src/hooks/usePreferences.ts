"use client";

import { useCallback, useEffect, useState } from "react";

export type Preferences = {
  profileVisibility: string;
  locationSharing: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  pushNotifications: boolean;
  orderUpdates: boolean;
  productUpdates: boolean;
  preferredCategories: string[];
  preferredSizes: string[];
  preferredColors: string[];
  preferredCurrency: string;
  showEmail: boolean;
  showPhone: boolean;
  showOrderHistory: boolean;
  profileDiscoverable: boolean;
  twoFactorEnabled: boolean;
};

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/profile/preferences", {
          credentials: "same-origin",
        });
        if (!res.ok) throw new Error("Unable to load preferences");
        const data = await res.json();
        if (active) setPreferences(data.preferences);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Error");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const save = useCallback(async (patch: Partial<Preferences>) => {
    setPreferences((prev) => (prev ? { ...prev, ...patch } : prev));
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/profile/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to save");
      setPreferences(data.preferences);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save");
    } finally {
      setSaving(false);
    }
  }, []);

  return { preferences, loading, saving, error, save };
}