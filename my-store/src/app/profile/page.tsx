"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/stores/authStore";
import { 
  User, CreditCard, MapPin, ShoppingBag, 
  Bell, Lock, Link as LinkIcon, Edit, Loader2
} from "lucide-react";
import Image from "next/image";
import { getGravatarUrlSync } from "@/lib/gravatar-client";
import { getProfileImageUrl } from "@/lib/getProfileImage";
import { AccountDetailsForm } from "./components/AccountDetailsForm";
import { DeliveryAddressList } from "./components/DeliveryAddressList";
import { PaymentMethodList } from "./components/PaymentMethodList";
import { OrderHistory } from "./components/OrderHistory";
import { ProfileSettings } from "./settings/ProfileSettings";
import { BRAND } from "@/lib/brand";
import FluxLines from "@/components/FluxLines";

type SettingsSection = 
  | "profile" 
  | "account" 
  | "orders"
  | "payment" 
  | "address" 
  | "shop" 
  | "notifications" 
  | "privacy" 
  | "links";

const settingsMenu = [
  { id: "profile" as SettingsSection, label: "Profile", icon: User },
  { id: "account" as SettingsSection, label: "Account Details", icon: User },
  { id: "orders" as SettingsSection, label: "Order History", icon: ShoppingBag },
  { id: "payment" as SettingsSection, label: "Payment Methods", icon: CreditCard },
  { id: "address" as SettingsSection, label: "Delivery Addresses", icon: MapPin },
  { id: "shop" as SettingsSection, label: "Shop Preferences", icon: ShoppingBag },
  { id: "notifications" as SettingsSection, label: "Communication", icon: Bell },
  { id: "privacy" as SettingsSection, label: "Privacy & Security", icon: Lock },
  { id: "links" as SettingsSection, label: "Linked Accounts", icon: LinkIcon },
];

export default function ProfilePage() {
  const user = useAuth((state) => state.user);
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  // The /profile server layout already gates unauthenticated visitors. If the
  // persisted store has not rehydrated yet (e.g. right after a refresh), sync
  // the user from the server session instead of bouncing them to /login.
  useEffect(() => {
    if (user) return;
    void useAuth.getState().refresh();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Fetch profile image
    const fetchProfileImage = async () => {
      try {
        const res = await fetch("/api/profile", {
          headers: {
            "x-user-id": user.id,
            "x-user-email": user.email,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setProfileImageUrl(data.profileImageUrl || null);
        }
      } catch (err) {
        console.error("Failed to fetch profile image:", err);
      }
    };

    fetchProfileImage();
  }, [user]);

  const profilePictureUrl = user?.email 
    ? getProfileImageUrl(user.email, profileImageUrl, 200)
    : "/placeholder-avatar.png";
  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <FluxLines
          colors={["#ffffff","#ffffff","#ffffff"]}
          glow={2}
          rimWidth={0.2}
          lineWidth={1}
          flowDirection="down"
          mouseInteraction
          clickSwirl
          speed={0.5}
          scale={1.6}
          turbulence={1}
          fluidity={0.1}
          sharpness={2.5}
          shimmer={1.5}
          mouseStrength={1}
          mouseRadius={0.35}
          intro
          lightMode={false}
        />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-200">Settings</h1>
      </div>

      {!user ? (
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <Loader2 size={16} className="animate-spin" />
          Loading settings…
        </div>
      ) : (
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left Sidebar - Settings Menu */}
        <aside className="w-full lg:w-64">
          <nav className="space-y-2">
            {settingsMenu.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition ${
                    isActive
                      ? "bg-white text-zinc-900"
                      : "text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {/* Profile Section */}
          {activeSection === "profile" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-zinc-200 mb-2">Profile</h2>
                <p className="text-zinc-300">
                  Your {BRAND.name} profile represents you across the platform.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-8">
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0">
                      <Image
                        src={profilePictureUrl}
                        alt={user?.name || user?.email || "Profile"}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        unoptimized
                        onError={(e) => {
                          // Fallback to Gravatar if image fails to load
                          const target = e.target as HTMLImageElement;
                          if (user?.email) {
                            target.src = getGravatarUrlSync(user.email, 200);
                          }
                        }}
                      />
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-white text-zinc-900 rounded-full hover:bg-zinc-200 transition">
                      <Edit size={16} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-100">
                      {user.name || "User"}
                    </h3>
                    <p className="text-zinc-300">{user.email}</p>
                    <p className="text-sm text-zinc-400 mt-1">
                      {BRAND.name} Member Since {memberSince}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-zinc-100">Email</p>
                      <p className="text-sm text-zinc-300">{user.email}</p>
                    </div>
                    <button className="text-sm text-zinc-300 hover:text-white">
                      Edit
                    </button>
                  </div>
                  {user.name && (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-zinc-100">Name</p>
                        <p className="text-sm text-zinc-300">{user.name}</p>
                      </div>
                      <button className="text-sm text-zinc-300 hover:text-white">
                        Edit
                      </button>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-zinc-100">Role</p>
                      <p className="text-sm text-zinc-300">{user.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Details Section */}
          {activeSection === "account" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-zinc-200 mb-2">Account Details</h2>
              </div>

              <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-8">
                <AccountDetailsForm />
              </div>
            </div>
          )}

          {/* Order History Section */}
          {activeSection === "orders" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-zinc-200">Order History</h2>
                <p className="text-zinc-300">
                  Review past orders and track their delivery status.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-8">
                <OrderHistory />
              </div>
            </div>
          )}

          {/* Payment Methods Section */}
          {activeSection === "payment" && (
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-8">
              <PaymentMethodList />
            </div>
          )}

          {/* Delivery Addresses Section */}
          {activeSection === "address" && (
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-8">
              <DeliveryAddressList />
            </div>
          )}

          {/* Preference / Privacy / Visibility / Linked sections */}
          {["shop", "notifications", "privacy", "links"].includes(
            activeSection
          ) && <ProfileSettings section={activeSection} />}
        </main>
      </div>
      )}
      </div>
    </div>
  );
}
