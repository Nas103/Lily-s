"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { AddToCartButton } from "./AddToCartButton";
import { AddToWishlistButton } from "./AddToWishlistButton";
import { QuickBuyButton } from "./QuickBuyButton";
import { useCurrency } from "@/hooks/useCurrency";
import { effectivePrice } from "@/lib/discount";

export type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category?: string;
  highlight?: string;
  description?: string;
  badge?: string;
  tags?: string[];
  sizes?: string[];
  colors?: string[];
  colorImages?: Record<string, string[]>;
  discountPercent?: number | null;
  soldOut?: boolean;
  soldOutSizes?: string[];
  soldOutColors?: string[];
  onPreview?: () => void;
};

export function ProductCard({
  id,
  name,
  price,
  imageUrl,
  category,
  highlight,
  badge,
  discountPercent,
  soldOut,
  soldOutSizes,
  soldOutColors,
  onPreview,
  sizes,
  colors,
}: ProductCardProps) {
  const { formatPrice, convertPrice } = useCurrency();

  const [showAddedFlash, setShowAddedFlash] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleAddedWithoutVariants = () => {
    setShowAddedFlash(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowAddedFlash(false), 900);
  };

  const hasVariants = Boolean(
    (sizes && sizes.length > 0) || (colors && colors.length > 0)
  );

  const hasDiscount = Boolean(discountPercent && discountPercent > 0);
  const saleUsd = effectivePrice(price, discountPercent);
  // Base catalog prices are USD; convert into the user's currency.
  const converted = convertPrice ? convertPrice(saleUsd) : null;
  const formattedPrice = converted ? converted.formatted : formatPrice(saleUsd);
  const originalConverted = hasDiscount ? convertPrice(price).formatted : null;
  const displayBadge = soldOut ? "Sold Out" : badge;
  return (
    <article className="group overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-lg ring-1 ring-black/5 transition hover:-translate-y-1 hover:ring-black/10">
      <div
         className={`relative aspect-[4/5] cursor-pointer overflow-hidden bg-zinc-100 ${
           !hasVariants && !soldOut ? "cursor-default" : "cursor-pointer"
         }`}
        onClick={onPreview}
        role="button"
        aria-label={`View ${name}`}
        tabIndex={0}
         onKeyDown={(e) => {
           if (!hasVariants && !soldOut) return;
           if ((e.key === "Enter" || e.key === " ") && onPreview) {
             e.preventDefault();
             onPreview();
           }
         }}
      >
        {/* TODO: Update imagery to match each product drop. */}
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(min-width: 1024px) 320px, 50vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-105"
        />
        {soldOut ? (
          <div className="absolute inset-0 bg-white/50" aria-hidden="true" />
        ) : null}
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          <div className="flex items-center justify-between">
            {soldOut ? (
              <span className="rounded-full bg-black px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white shadow-sm">
                Sold Out
              </span>
            ) : hasDiscount ? (
              <span className="rounded-full bg-rose-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white shadow-sm">
                -{Math.round(discountPercent as number)}%
              </span>
            ) : displayBadge ? (
              <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-900 shadow-sm">
                {displayBadge}
              </span>
            ) : (
              <span />
            )}
            <AddToWishlistButton id={id} name={name} price={price} imageUrl={imageUrl} />
          </div>
          <div className="flex justify-between">
            {category ? (
              <p className="inline-flex w-fit rounded-full bg-black/70 px-4 py-1 text-[11px] font-medium uppercase tracking-[0.35em] text-white backdrop-blur">
                {category}
              </p>
            ) : (
              <span />
            )}
            {onPreview ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview?.();
                }}
                className="rounded-full bg-white/80 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-900 backdrop-blur transition hover:bg-white"
              >
                View
              </button>
            ) : null}
          </div>
          <AnimatePresence>
            {showAddedFlash && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 520,
                    damping: 24,
                    delay: 0.02,
                  }}
                  className="flex h-20 w-20 items-center justify-center rounded-full border border-white/70 bg-white/95 shadow-xl shadow-black/20 backdrop-blur"
                >
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.path
                      d="M5 13l4 4L19 7"
                      stroke="#000000"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    />
                  </svg>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div
       className={`flex flex-col gap-1 px-5 pb-5 pt-4 ${
         !hasVariants && !soldOut ? "cursor-default" : "cursor-pointer"
       }`}
       onClick={() => {
         if (!hasVariants && !soldOut) return;
         onPreview?.();
       }}
       role={onPreview ? "button" : undefined}
       aria-label={onPreview ? `View ${name}` : undefined}
       tabIndex={onPreview && hasVariants && !soldOut ? 0 : undefined}
       onKeyDown={(e) => {
         if (!onPreview || (!hasVariants && !soldOut)) return;
         if (e.key === "Enter" || e.key === " ") {
           e.preventDefault();
           onPreview();
         }
       }}
      >
        {/* TODO: Replace name copy with final product title. */}
        <h3 className="text-base font-semibold tracking-tight text-zinc-900">
          {name}
        </h3>
        {highlight ? (
          <p className="text-sm text-zinc-700 line-clamp-2">{highlight}</p>
        ) : null}
        <div className="mt-3 flex items-center justify-between gap-3">
          {/* TODO: Confirm pricing before launch. */}
          <p className="flex items-baseline gap-2 text-lg font-semibold text-zinc-900">
            {formattedPrice}
            {originalConverted ? (
              <span className="text-sm font-normal text-zinc-400 line-through">
                {originalConverted}
              </span>
            ) : null}
          </p>
          <div className="flex gap-2">
            <AddToCartButton
              id={id}
              name={name}
              price={saleUsd}
              imageUrl={imageUrl}
              variant="minimal"
              disabled={soldOut}
              showToast={!hasVariants}
              onAdded={hasVariants ? undefined : handleAddedWithoutVariants}
            />
            <QuickBuyButton
              id={id}
              name={name}
              price={saleUsd}
              imageUrl={imageUrl}
              disabled={soldOut}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
