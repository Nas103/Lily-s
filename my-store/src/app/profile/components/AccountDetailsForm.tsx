"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/stores/authStore";
import { Save, Loader2 } from "lucide-react";

interface ProfileData {
  name?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null;
  country?: string | null;
  city?: string | null;
  postcode?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  profileImageUrl?: string | null;
}

export function AccountDetailsForm() {
  const user = useAuth((state) => state.user);
  const setUser = useAuth((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    name: "",
    phone: "",
    dateOfBirth: "",
    country: "",
    city: "",
    postcode: "",
    addressLine1: "",
    addressLine2: "",
    profileImageUrl: "",
  });

  // Fetch profile data
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/profile", {
          headers: {
            "x-user-id": user.id,
            "x-user-email": user.email,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          dateOfBirth: data.dateOfBirth 
            ? new Date(data.dateOfBirth).toISOString().split("T")[0]
            : "",
          country: data.country || "",
          city: data.city || "",
          postcode: data.postcode || "",
          addressLine1: data.addressLine1 || "",
          addressLine2: data.addressLine2 || "",
          profileImageUrl: data.profileImageUrl || "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
          "x-user-email": user.email,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile");
      }

      const updatedData = await res.json();
      
      // Update auth store with all updated data
      setUser({
        ...user,
        name: updatedData.name,
      });

      // Reload profile data to ensure everything is synced
      const refreshRes = await fetch("/api/profile", {
        headers: {
          "x-user-id": user.id,
          "x-user-email": user.email,
        },
      });
      
      if (refreshRes.ok) {
        const refreshedData = await refreshRes.json();
        setFormData({
          name: refreshedData.name || "",
          phone: refreshedData.phone || "",
          dateOfBirth: refreshedData.dateOfBirth 
            ? new Date(refreshedData.dateOfBirth).toISOString().split("T")[0]
            : "",
          country: refreshedData.country || "",
          city: refreshedData.city || "",
          postcode: refreshedData.postcode || "",
          addressLine1: refreshedData.addressLine1 || "",
          addressLine2: refreshedData.addressLine2 || "",
          profileImageUrl: refreshedData.profileImageUrl || "",
        });
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-zinc-400" size={24} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4">
          <p className="text-sm text-green-600">Profile updated successfully!</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-900 mb-2">
          Email *
        </label>
        <input
          type="email"
          value={user?.email || ""}
          disabled
          className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-zinc-900 bg-zinc-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900 mb-2">
          Name
        </label>
        <input
          type="text"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter your name"
          className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-zinc-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Enter phone number"
          className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-zinc-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900 mb-2">
          Date of Birth *
        </label>
        <input
          type="date"
          value={formData.dateOfBirth || ""}
          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-zinc-900"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-900 mb-2">
            Country/Region *
          </label>
          <select
            value={formData.country || ""}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-zinc-900"
          >
            <option value="">Select country</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="ZA">South Africa</option>
            <option value="AU">Australia</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-900 mb-2">
            Town/City
          </label>
          <input
            type="text"
            value={formData.city || ""}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Enter city"
            className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-zinc-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-900 mb-2">
            Postcode
          </label>
          <input
            type="text"
            value={formData.postcode || ""}
            onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
            placeholder="Enter postcode"
            className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-zinc-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900 mb-2">
          Address Line 1
        </label>
        <input
          type="text"
          value={formData.addressLine1 || ""}
          onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
          placeholder="Street address"
          className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-zinc-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900 mb-2">
          Address Line 2
        </label>
        <input
          type="text"
          value={formData.addressLine2 || ""}
          onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
          placeholder="Apartment, suite, etc. (optional)"
          className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-zinc-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900 mb-2">
          Profile Image URL
        </label>
        <input
          type="url"
          value={formData.profileImageUrl || ""}
          onChange={(e) => setFormData({ ...formData, profileImageUrl: e.target.value })}
          placeholder="https://example.com/your-image.jpg"
          className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-zinc-900"
        />
        <p className="mt-1 text-xs text-zinc-500">
          Enter a URL to your profile image. Leave empty to use Gravatar.
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-200">
        <div>
          <p className="font-medium text-zinc-900">Delete Account</p>
          <p className="text-sm text-zinc-600">Permanently delete your account</p>
        </div>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
        >
          Delete
        </button>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full md:w-auto px-6 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {saving ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Saving...
          </>
        ) : (
          <>
            <Save size={18} />
            Save
          </>
        )}
      </button>
    </form>
  );
}

