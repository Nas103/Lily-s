"use client";

import { useCurrency } from "@/hooks/useCurrency";

type PriceProps = {
  /** Amount in the base currency (USD). */
  amount: number;
  className?: string;
};

/**
 * Renders a price converted into the user's currency.
 *
 * Use this instead of hardcoding a symbol so every price on the site follows
 * the same store-driven currency.
 */
export function Price({ amount, className }: PriceProps) {
  const { convertPrice, loading } = useCurrency();

  if (loading) {
    return <span className={className}>${amount.toFixed(2)}</span>;
  }

  return <span className={className}>{convertPrice(amount).formatted}</span>;
}
