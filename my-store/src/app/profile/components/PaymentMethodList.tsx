"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/stores/authStore";
import { Plus, Edit, Trash2, CreditCard, Loader2, Shield } from "lucide-react";
import { PaymentMethodForm } from "./PaymentMethodForm";
import { maskCardNumber } from "@/lib/paymentSecurity";

// PaymentMethodList component for managing user payment methods

interface PaymentMethod {
  id: string;
  type: string;
  cardLast4: string;
  cardBrand: string;
  expiryMonth: number;
  expiryYear: number;
  holderName: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export function PaymentMethodList() {
  const user = useAuth((state) => state.user);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);

  const fetchPaymentMethods = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/payment-methods", {
        headers: {
          "x-user-id": user.id,
          "x-user-email": user.email,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch payment methods");
      }

      const data = await res.json();
      setPaymentMethods(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load payment methods";
      console.error("[PaymentMethodList] Error fetching payment methods:", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user || !confirm("Are you sure you want to delete this payment method?")) return;

    try {
      const res = await fetch(`/api/payment-methods/${id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": user.id,
          "x-user-email": user.email,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete payment method");
      }

      await fetchPaymentMethods();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete payment method");
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;

    try {
      const res = await fetch(`/api/payment-methods/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
          "x-user-email": user.email,
        },
        body: JSON.stringify({ isDefault: true }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to set default payment method");
      }

      await fetchPaymentMethods();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to set default payment method");
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingMethod(null);
    fetchPaymentMethods();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingMethod(null);
  };

  const handleEdit = (method: PaymentMethod) => {
    // Convert to form-compatible format
    setEditingMethod({
      ...method,
      type: method.type as "CARD",
    });
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingMethod(null);
    setShowForm(true);
  };

  const formatExpiry = (month: number, year: number) => {
    return `${String(month).padStart(2, "0")}/${String(year).slice(-2)}`;
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
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Payment Methods</h2>
          <p className="text-zinc-600">
            Securely manage your payment methods. Card numbers are never fully stored.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="px-6 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition flex items-center gap-2"
          >
            <Plus size={18} />
            Add Payment Method
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
          <PaymentMethodForm
            paymentMethod={editingMethod || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      ) : (
        <>
          {paymentMethods.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center">
              <CreditCard className="mx-auto text-zinc-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                No payment methods
              </h3>
              <p className="text-zinc-600 mb-6">
                Add a payment method for faster checkout.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 mb-6">
                <Shield size={14} />
                <span>Your payment information is encrypted and secure</span>
              </div>
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition inline-flex items-center gap-2"
              >
                <Plus size={18} />
                Add Your First Payment Method
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`rounded-2xl border p-6 ${
                    method.isDefault
                      ? "border-zinc-900 bg-zinc-50"
                      : "border-zinc-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-zinc-100 rounded-lg">
                        <CreditCard className="text-zinc-600" size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-zinc-900">
                            {method.cardBrand}
                          </h3>
                          {method.isDefault && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-zinc-900 text-white rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-600">
                          {maskCardNumber("****" + method.cardLast4)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(method)}
                        className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition"
                        title="Edit payment method"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(method.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                        title="Delete payment method"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm text-zinc-600">
                    {method.holderName && <p>Name: {method.holderName}</p>}
                    <p>Expires: {formatExpiry(method.expiryMonth, method.expiryYear)}</p>
                  </div>

                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
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
