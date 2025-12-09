"use client";

import { useState } from "react";
import { useAuth } from "@/stores/authStore";
import { Save, X, Loader2, CreditCard } from "lucide-react";
import {
  formatCardNumber,
  maskCardNumber,
  isValidCardNumber,
  isValidCVV,
  detectCardBrand,
} from "@/lib/paymentSecurity";

interface PaymentMethod {
  id?: string;
  type: string;
  cardLast4?: string;
  cardBrand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  holderName?: string | null;
  isDefault: boolean;
}

interface PaymentMethodFormProps {
  paymentMethod?: PaymentMethod;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentMethodForm({
  paymentMethod,
  onSuccess,
  onCancel,
}: PaymentMethodFormProps) {
  const user = useAuth((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryMonth: paymentMethod?.expiryMonth || "",
    expiryYear: paymentMethod?.expiryYear || "",
    holderName: paymentMethod?.holderName || "",
    cvv: "",
    isDefault: paymentMethod?.isDefault || false,
  });

  const [cardBrand, setCardBrand] = useState<string>("");

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length <= 19) {
      // Max 19 digits
      const formatted = formatCardNumber(value);
      setFormData({ ...formData, cardNumber: formatted });
      
      // Detect card brand
      if (value.length >= 4) {
        setCardBrand(detectCardBrand(value));
      } else {
        setCardBrand("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);

    // Validate card number
    const cardNumberDigits = formData.cardNumber.replace(/\D/g, "");
    if (!isValidCardNumber(cardNumberDigits)) {
      setError("Invalid card number. Please check and try again.");
      setLoading(false);
      return;
    }

    // Validate CVV
    if (!formData.cvv || !isValidCVV(formData.cvv, cardBrand)) {
      setError("Invalid CVV. Please enter a valid 3-4 digit CVV.");
      setLoading(false);
      return;
    }

    // Validate expiry
    const month = parseInt(String(formData.expiryMonth), 10);
    const year = parseInt(String(formData.expiryYear), 10);
    
    if (!month || month < 1 || month > 12) {
      setError("Invalid expiry month.");
      setLoading(false);
      return;
    }

    const currentYear = new Date().getFullYear();
    if (!year || year < currentYear || year > currentYear + 20) {
      setError("Invalid expiry year.");
      setLoading(false);
      return;
    }

    try {
      const url = paymentMethod?.id
        ? `/api/payment-methods/${paymentMethod.id}`
        : "/api/payment-methods";
      
      const method = paymentMethod?.id ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
          "x-user-email": user.email,
        },
        body: JSON.stringify({
          type: "CARD",
          cardNumber: cardNumberDigits, // Send digits only
          expiryMonth: month,
          expiryYear: year,
          holderName: formData.holderName || null,
          cvv: formData.cvv, // Only for validation, never stored
          isDefault: formData.isDefault,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save payment method");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save payment method");
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
          Card Number *
        </label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={20} />
          <input
            type="text"
            value={formData.cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            required
            maxLength={19}
            className="w-full rounded-lg border border-zinc-200 px-4 py-3 pl-12 text-zinc-900"
            disabled={!!paymentMethod?.id} // Can't change card number after creation
          />
        </div>
        {cardBrand && (
          <p className="mt-1 text-xs text-zinc-500">Card type: {cardBrand}</p>
        )}
        {paymentMethod?.cardLast4 && (
          <p className="mt-1 text-xs text-zinc-500">
            Current: {maskCardNumber("****" + paymentMethod.cardLast4)}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-900 mb-2">
            Expiry Month *
          </label>
          <select
            value={formData.expiryMonth}
            onChange={(e) => setFormData({ ...formData, expiryMonth: e.target.value })}
            required
            className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-zinc-900"
            disabled={!!paymentMethod?.id}
          >
            <option value="">Month</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {String(month).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-900 mb-2">
            Expiry Year *
          </label>
          <select
            value={formData.expiryYear}
            onChange={(e) => setFormData({ ...formData, expiryYear: e.target.value })}
            required
            className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-zinc-900"
            disabled={!!paymentMethod?.id}
          >
            <option value="">Year</option>
            {Array.from({ length: 20 }, (_, i) => {
              const year = new Date().getFullYear() + i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {!paymentMethod?.id && (
        <div>
          <label className="block text-sm font-medium text-zinc-900 mb-2">
            CVV *
          </label>
          <input
            type="text"
            value={formData.cvv}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 4) {
                setFormData({ ...formData, cvv: value });
              }
            }}
            placeholder="123"
            required
            maxLength={4}
            className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-zinc-900"
          />
          <p className="mt-1 text-xs text-zinc-500">
            CVV is never stored. It's only used for validation.
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-900 mb-2">
          Cardholder Name
        </label>
        <input
          type="text"
          value={formData.holderName}
          onChange={(e) => setFormData({ ...formData, holderName: e.target.value })}
          placeholder="Name on card"
          maxLength={50}
          className="w-full rounded-lg border border-zinc-200 px-4 py-3 text-zinc-900"
        />
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
          Set as default payment method
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
              {paymentMethod?.id ? "Update Payment Method" : "Add Payment Method"}
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

