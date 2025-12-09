"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/stores/authStore";
import { 
  User, Mail, Shield, CreditCard, MapPin, ShoppingBag, 
  Bell, Lock, Eye, Link as LinkIcon, Settings, Edit, 
  Calendar, Phone, Globe
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getGravatarUrlSync } from "@/lib/gravatar-client";
import { getProfileImageUrl } from "@/lib/getProfileImage";
import { AccountDetailsForm } from "./components/AccountDetailsForm";
import { DeliveryAddressList } from "./components/DeliveryAddressList";

type SettingsSection = 
  | "profile" 
  | "account" 
  | "payment" 
  | "address" 
  | "preferences" 
  | "communication" 
  | "privacy" 
  | "visibility" 
  | "linked";

const settingsMenu = [
  { id: "profile" as SettingsSection, label: "Profile", icon: User },
  { id: "account" as SettingsSection, label: "Account Details", icon: User },
  { id: "payment" as SettingsSection, label: "Payment Methods", icon: CreditCard },
  { id: "address" as SettingsSection, label: "Delivery Addresses", icon: MapPin },
  { id: "preferences" as SettingsSection, label: "Shop Preferences", icon: ShoppingBag },
  { id: "communication" as SettingsSection, label: "Communication Preferences", icon: Bell },
  { id: "privacy" as SettingsSection, label: "Privacy", icon: Lock },
  { id: "visibility" as SettingsSection, label: "Profile Visibility", icon: Eye },
  { id: "linked" as SettingsSection, label: "Linked Accounts", icon: LinkIcon },
];

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

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
  }, [user, router]);

  if (!user) {
    return null;
  }

  const profilePictureUrl = getProfileImageUrl(user.email, profileImageUrl, 200);
  const memberSince = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Settings</h1>
      </div>

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
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-600 hover:bg-zinc-100"
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
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Profile</h2>
                <p className="text-zinc-600">
                  Your Lily Atelier profile represents you across the platform.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-8">
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full overflow-hidden bg-zinc-100 flex-shrink-0">
                      <Image
                        src={profilePictureUrl}
                        alt={user.name || user.email}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        unoptimized
                      />
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition">
                      <Edit size={16} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-900">
                      {user.name || "User"}
                    </h3>
                    <p className="text-zinc-600">{user.email}</p>
                    <p className="text-sm text-zinc-500 mt-1">
                      Lily Atelier Member Since {memberSince}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-zinc-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-zinc-900">Email</p>
                      <p className="text-sm text-zinc-600">{user.email}</p>
                    </div>
                    <button className="text-sm text-zinc-600 hover:text-zinc-900">
                      Edit
                    </button>
                  </div>
                  {user.name && (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-zinc-900">Name</p>
                        <p className="text-sm text-zinc-600">{user.name}</p>
                      </div>
                      <button className="text-sm text-zinc-600 hover:text-zinc-900">
                        Edit
                      </button>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-zinc-900">Role</p>
                      <p className="text-sm text-zinc-600">{user.role}</p>
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
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Account Details</h2>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-8">
                <AccountDetailsForm />
              </div>
            </div>
          )}

          {/* Payment Methods Section */}
          {activeSection === "payment" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">Payment Methods</h2>
                <p className="text-zinc-600">Manage your payment methods</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-8">
                <p className="text-zinc-600 mb-4">No payment methods saved</p>
                <button className="px-6 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition">
                  Add Payment Method
                </button>
              </div>
            </div>
          )}

          {/* Delivery Addresses Section */}
          {activeSection === "address" && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8">
              <DeliveryAddressList />
            </div>
          )}

          {/* Other sections - placeholder */}
          {!["profile", "account", "payment", "address"].includes(activeSection) && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">
                  {settingsMenu.find(m => m.id === activeSection)?.label}
                </h2>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-8">
                <p className="text-zinc-600">This section is coming soon.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
