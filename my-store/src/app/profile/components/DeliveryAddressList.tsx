"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/stores/authStore";
import { Plus, Edit, Trash2, MapPin, Loader2 } from "lucide-react";
import { DeliveryAddressForm } from "./DeliveryAddressForm";

interface DeliveryAddress {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}

export function DeliveryAddressList() {
  const user = useAuth((state) => state.user);
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null);

  const fetchAddresses = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/delivery-addresses", {
        headers: {
          "x-user-id": user.id,
          "x-user-email": user.email,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch addresses");
      }

      const data = await res.json();
      setAddresses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user || !confirm("Are you sure you want to delete this address?")) return;

    try {
      const res = await fetch(`/api/delivery-addresses/${id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": user.id,
          "x-user-email": user.email,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete address");
      }

      await fetchAddresses();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete address");
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;

    try {
      const res = await fetch(`/api/delivery-addresses/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
          "x-user-email": user.email,
        },
        body: JSON.stringify({ isDefault: true }),
      });

      if (!res.ok) {
        throw new Error("Failed to set default address");
      }

      await fetchAddresses();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to set default address");
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingAddress(null);
    fetchAddresses();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleEdit = (address: DeliveryAddress) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-zinc-400" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Delivery Addresses</h2>
          <p className="text-zinc-600">
            Manage your delivery addresses for faster checkout.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="px-6 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition flex items-center gap-2"
          >
            <Plus size={18} />
            Add Address
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {showForm ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-8">
          <DeliveryAddressForm
            address={editingAddress || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      ) : (
        <>
          {addresses.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
              <MapPin className="mx-auto text-zinc-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                No delivery addresses
              </h3>
              <p className="text-zinc-600 mb-6">
                Add your first delivery address to get started.
              </p>
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Add Your First Address
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`rounded-2xl border p-6 ${
                    address.isDefault
                      ? "border-zinc-900 bg-zinc-50"
                      : "border-zinc-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-zinc-900">{address.label}</h3>
                        {address.isDefault && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-zinc-900 text-white rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-600">{address.fullName}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(address)}
                        className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition"
                        title="Edit address"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                        title="Delete address"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-zinc-600">
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>
                      {address.city}
                      {address.state && `, ${address.state}`}
                      {` ${address.postcode}`}
                    </p>
                    <p>{address.country}</p>
                    {address.phone && <p className="mt-2">Phone: {address.phone}</p>}
                  </div>

                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="mt-4 text-sm text-zinc-600 hover:text-zinc-900 underline"
                    >
                      Set as default
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

