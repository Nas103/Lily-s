"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { AddToCartButton } from "./AddToCartButton";
import { AddToWishlistButton } from "./AddToWishlistButton";
import { QuickBuyButton } from "./QuickBuyButton";
import { ProductReviews } from "./ProductReviews";
import type { ProductCardProps } from "./ProductCard";
import { useRecommendationStore } from "@/stores/recommendationStore";
import { useCurrency } from "@/hooks/useCurrency";
import { BRAND } from "@/lib/brand";
import { effectivePrice } from "@/lib/discount";

type ProductDetailModalProps = {
  product: (ProductCardProps & { description?: string; tags?: string[]; sizes?: string[]; colors?: string[]; colorImages?: Record<string, string[]> }) | null;
  onClose: () => void;
};

const DEFAULT_COLORS = ["Onyx", "Sand", "Oat", "Shadow", "Fog"];

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { formatPrice, convertPrice } = useCurrency();
  
  const colors = product?.colors ?? DEFAULT_COLORS;
  
  // All hooks must be called before any early returns
  const [activeSize, setActiveSize] = useState<string | undefined>(product?.sizes?.[0]);
  const [activeColor, setActiveColor] = useState<string | undefined>(colors[0]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const trackView = useRecommendationStore((state) => state.trackView);

  // Reset state when product changes
  useEffect(() => {
    if (!product) return;

    const nextSize = product.sizes?.find((s) => !(product.soldOutSizes ?? []).includes(s)) ?? product.sizes?.[0];
    const nextColor = (product.colors ?? DEFAULT_COLORS).find(
      (c) => !(product.soldOutColors ?? []).includes(c)
    ) ?? (product.colors ?? DEFAULT_COLORS)[0];

    setTimeout(() => {
      setActiveSize(nextSize);
      setActiveColor(nextColor);
      setSelectedImageIndex(0);
    }, 0);
  }, [product?.id]);

  // Reset selected image index when color changes
  useEffect(() => {
    const t=setTimeout(()=>setSelectedImageIndex(0),0);
    return ()=>clearTimeout(t);
  }, [product?.id, activeColor]);

  // Track deep product views for AI personalization
  useEffect(() => {
    if (product?.id) {
      trackView(product.id);
    }
  }, [product?.id, trackView]);

  // Early return after all hooks
  if (!product) return null;

  const discountPercent = product.discountPercent ?? 0;
  const hasDiscount = discountPercent > 0;
  const saleUsd = effectivePrice(product.price, discountPercent);
  const soldOutSizes = product.soldOutSizes ?? [];
  const soldOutColors = product.soldOutColors ?? [];
  const productSoldOut = Boolean(product.soldOut);
  const isSizeSoldOut = (size?: string) =>
    productSoldOut || (size ? soldOutSizes.includes(size) : false);
  const isColorSoldOut = (color?: string) =>
    productSoldOut || (color ? soldOutColors.includes(color) : false);
  const variantSoldOut =
    isSizeSoldOut(activeSize) || isColorSoldOut(activeColor) || productSoldOut;

  // Convert price into the user's currency (base catalog prices are USD).
  const converted = convertPrice ? convertPrice(saleUsd) : null;
  const formattedPrice = converted ? converted.formatted : formatPrice(saleUsd);
  const originalPrice = hasDiscount
    ? convertPrice(product.price).formatted
    : null;

  const sizes = product.sizes; // Only use sizes if they exist (not for perfumes)

  // Get images for the currently selected color
  const getCurrentColorImages = (): string[] => {
    if (!activeColor || !product.colorImages) {
      // Fallback to single image if no color images available
      return [product.imageUrl];
    }
    return product.colorImages[activeColor] || [product.imageUrl];
  };

  const currentColorImages = getCurrentColorImages();
  const mainImageUrl = currentColorImages[selectedImageIndex] || currentColorImages[0] || product.imageUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 px-0 md:px-4 py-0 md:py-10 backdrop-blur-sm">
      <div className="flex h-[95vh] md:h-auto md:max-h-[90vh] w-full md:max-w-4xl flex-col overflow-hidden rounded-t-[36px] md:rounded-[36px] bg-white shadow-2xl">
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          <div className="relative flex-1 min-h-[40vh] md:min-h-0 flex flex-col">
            {/* ====================================================================
                MAIN PRODUCT IMAGE
                ====================================================================
                This displays the main large image for the selected color.
                The image changes based on:
                1. Selected color (activeColor)
                2. Selected image index (selectedImageIndex) - user clicks thumbnail
                
                Image source: mainImageUrl (from currentColorImages array)
                To update images: See products.ts generateColorImages() function
                ==================================================================== */}
            <div className="relative flex-1 min-h-[40vh] md:min-h-0">
              <Image
                src={mainImageUrl}
                alt={`${product.name} - ${activeColor || ""}`}
                width={700}
                height={900}
                priority
                className="h-full w-full object-cover"
              />
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full bg-white/80 p-2 text-zinc-900 z-10"
                aria-label="Close product details"
              >
                <X size={18} />
              </button>
            </div>
            {/* ====================================================================
                IMAGE GALLERY - 4 THUMBNAILS PER COLOR
                ====================================================================
                Displays 4 thumbnail images for the currently selected color.
                Users can click any thumbnail to view that image in the main view.
                
                Structure:
                - Image 1 (index 0): First view/angle of the product in selected color
                - Image 2 (index 1): Second view/angle of the product in selected color
                - Image 3 (index 2): Third view/angle of the product in selected color
                - Image 4 (index 3): Fourth view/angle of the product in selected color
                
                To update individual images:
                - See products.ts file, generateColorImages() function
                - Or directly modify colorImages in products.ts for specific products
                ==================================================================== */}
            {currentColorImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2 p-4 bg-white border-t border-zinc-200">
                {currentColorImages.map((imageUrl, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-black ring-2 ring-black/20"
                        : "border-zinc-200 hover:border-zinc-400"
                    }`}
                  >
                    {/* Thumbnail Image {index + 1} of 4 for {activeColor} color */}
                    <Image
                      src={imageUrl}
                      alt={`${product.name} - ${activeColor || ""} - View ${index + 1}`}
                      fill
                      sizes="(min-width: 768px) 25vw, 25vw"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-4 p-6 pr-4 md:p-8 md:pr-6 overflow-y-auto">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-700">
                {product.category ?? "Drop"}
              </p>
              {/* TODO: Finalize product naming before publishing. */}
              <h3 className="text-2xl font-semibold tracking-tight text-zinc-900">
                {product.name}
              </h3>
              <p className="text-sm text-zinc-700">{product.highlight}</p>
            </div>
            {/* TODO: Lock in final retail price. */}
            <div className="flex flex-wrap items-baseline gap-3">
              <p className="text-3xl font-semibold text-zinc-900">
                {formattedPrice}
              </p>
              {originalPrice ? (
                <>
                  <p className="text-lg text-zinc-400 line-through">
                    {originalPrice}
                  </p>
                  <span className="rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                    -{Math.round(discountPercent)}%
                  </span>
                </>
              ) : null}
            </div>
            <p className="text-sm leading-relaxed text-zinc-800">
              {product.description ??
                `Designed for the ${BRAND.name} capsule: balanced cushioning, premium fabrics, and studio-grade finishing.`}
            </p>
            {product.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-zinc-200 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-zinc-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-4 flex flex-col gap-4">
              {sizes && sizes.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-700">
                    Size
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sizes.map((size) => {
                      const unavailable = isSizeSoldOut(size);
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setActiveSize(size)}
                          disabled={unavailable}
                           title={unavailable ? "Sold out" : undefined}
                           className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] ${
                             unavailable
                               ? "cursor-not-allowed border border-zinc-200 text-zinc-400 line-through opacity-60"
                               : activeSize === size
                                 ? "bg-black text-white"
                                 : "border border-zinc-200 text-zinc-700 hover:border-zinc-900"
                           }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-700">
                  Color
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {colors.slice(0, 5).map((color) => {
                    const unavailable = isColorSoldOut(color);
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setActiveColor(color)}
                        disabled={unavailable}
                         title={unavailable ? "Sold out" : undefined}
                         className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] ${
                           unavailable
                             ? "cursor-not-allowed border border-zinc-200 text-zinc-400 line-through opacity-60"
                             : activeColor === color
                               ? "bg-black text-white"
                               : "border border-zinc-200 text-zinc-700 hover:border-zinc-900"
                         }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 pb-2 md:pb-0">
              {variantSoldOut ? (
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">
                  Sold out — {productSoldOut ? "this item" : "this selection"} is
                  unavailable
                </p>
              ) : null}
              <div className="flex gap-2 md:flex-col">
                <AddToCartButton
                  id={product.id}
                  name={product.name}
                  price={saleUsd}
                  imageUrl={mainImageUrl}
                  size={activeSize}
                  color={activeColor}
                  disabled={variantSoldOut}
                  showToast={true}
                />
                <QuickBuyButton
                  id={product.id}
                  name={product.name}
                  price={saleUsd}
                  imageUrl={mainImageUrl}
                  size={activeSize}
                  color={activeColor}
                  disabled={variantSoldOut}
                />
              </div>
              <AddToWishlistButton
                id={product.id}
                name={product.name}
                price={saleUsd}
                imageUrl={mainImageUrl}
              />
            </div>

            <ProductReviews productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

