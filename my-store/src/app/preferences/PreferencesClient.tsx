"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Store, Bell, Shield, Link2 } from "lucide-react";
import { useAuth } from "@/stores/authStore";
import { BRAND } from "@/lib/brand";
import { ProfileSettings } from "@/app/profile/settings/ProfileSettings";

const TABS = [
  { id: "shop", label: "Shop", icon: Store },
  { id: "notifications", label: "Alerts", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "links", label: "Linked", icon: Link2 },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function PreferencesClient() {
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const [active, setActive] = useState<TabId>("shop");

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-zinc-400">
          {BRAND.name}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-zinc-900">Preferences</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Curate how {BRAND.name} looks, what we share, and when we reach out.
        </p>
      </header>

      <div
        role="tablist"
        className="flex flex-wrap gap-1 rounded-full border border-zinc-200 bg-white p-1.5"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab.id)}
              className="relative flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition"
            >
              {isActive && (
                <motion.span
                  layoutId="preferences-tab"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-zinc-900"
                />
              )}
              <Icon
                size={15}
                className={`relative z-10 ${isActive ? "text-white" : "text-zinc-500"}`}
              />
              <span className={`relative z-10 ${isActive ? "text-white" : "text-zinc-600"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <ProfileSettings section={active} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}