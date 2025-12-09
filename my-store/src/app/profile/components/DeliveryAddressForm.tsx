"use client";

import { useState } from "react";
import { useAuth } from "@/stores/authStore";
import { Save, X, Loader2 } from "lucide-react";

interface DeliveryAddress {
  id?: string;
  label: string;
  fullName: string;
  phone?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state?: string | null;
  postcode: string;
  country: string;
  isDefault: boolean;
}

interface DeliveryAddressFormProps {
  address?: DeliveryAddress;
  onSuccess: () => void;
  onCancel: () => void;
}

export function DeliveryAddressForm({ address, onSuccess, onCancel }: DeliveryAddressFormProps) {
  const user = useAuth((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<DeliveryAddress>({
    label: address?.label || "",
    fullName: address?.fullName || "",
    phone: address?.phone || "",
    addressLine1: address?.addressLine1 || "",
    addressLine2: address?.addressLine2 || "",
    city: address?.city || "",
    state: address?.state || "",
    postcode: address?.postcode || "",
    country: address?.country || "",
    isDefault: address?.isDefault || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const url = address?.id
        ? `/api/delivery-addresses/${address.id}`
        : "/api/delivery-addresses";
      
      const method = address?.id ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
          "x-user-email": user.email,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save address");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-900 mb-2">
          Label *
        </label>
        <input
          type="text"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          placeholder="e.g., Home, Work, Office"
          required
          maxLength={50}
          className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-zinc-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          placeholder="Recipient full name"
          required
          maxLength={100}
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
          placeholder="Phone number for delivery"
          maxLength={20}
          className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-zinc-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-900 mb-2">
          Address Line 1 *
        </label>
        <input
          type="text"
          value={formData.addressLine1}
          onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
          placeholder="Street address"
          required
          maxLength={200}
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
          maxLength={200}
          className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-zinc-900"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-900 mb-2">
            City *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="City"
            required
            maxLength={100}
            className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-zinc-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-900 mb-2">
            State/Province
          </label>
          <input
            type="text"
            value={formData.state || ""}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            placeholder="State or province"
            maxLength={100}
            className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-zinc-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-900 mb-2">
            Postcode *
          </label>
          <input
            type="text"
            value={formData.postcode}
            onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
            placeholder="Postal code"
            required
            maxLength={20}
            className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-zinc-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-900 mb-2">
            Country *
          </label>
          <select
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            required
            className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-zinc-900"
          >
            <option value="">Select country</option>
            <option value="ZA">South Africa</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="NG">Nigeria</option>
            <option value="KE">Kenya</option>
            <option value="GH">Ghana</option>
          </select>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isDefault"
          checked={formData.isDefault}
          onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
          className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
        />
        <label htmlFor="isDefault" className="ml-2 text-sm text-zinc-900">
          Set as default delivery address
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              {address?.id ? "Update Address" : "Add Address"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 border border-zinc-200 text-zinc-900 rounded-lg font-medium hover:bg-zinc-50 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <X size={18} />
          Cancel
        </button>
      </div>
    </form>
  );
}

