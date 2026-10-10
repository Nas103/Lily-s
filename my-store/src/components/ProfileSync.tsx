"use client";

import { useEffect } from "react";
import { useAuth } from "@/stores/authStore";
import { useProfile } from "@/stores/profileStore";

/**
 * Keeps the shared profile store in sync with the auth session.
 *
 * On login it loads profile/preferences/country so every price and profile
 * detail across the app updates automatically; on logout it clears them.
 */
export function ProfileSync() {
  useEffect(() => {
    const sync = (isAuthenticated: boolean) => {
      if (isAuthenticated) {
        void useProfile.getState().load({ force: true });
      } else {
        useProfile.getState().reset();
      }
    };

    sync(useAuth.getState().user != null);

    const unsubscribe = useAuth.subscribe((state, prevState) => {
      const previousId = prevState.user?.id ?? null;
      const currentId = state.user?.id ?? null;
      if (currentId && currentId !== previousId) {
        sync(true);
      } else if (!currentId && previousId) {
        sync(false);
      }
    });

    return unsubscribe;
  }, []);

  return null;
}
