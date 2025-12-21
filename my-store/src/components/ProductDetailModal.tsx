"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { AddToCartButton } from "./AddToCartButton";
import { AddToWishlistButton } from "./AddToWishlistButton";
import { QuickBuyButton } from "./QuickBuyButton";
import type { ProductCardProps } from "./ProductCard";
import { useRecommendationStore } from "@/stores/recommendationStore";
import { useCurrency } from "@/hooks/useCurrency";

type ProductDetailModalProps = {
  product: (ProductCardProps & { description?: string; tags?: string[]; sizes?: string[]; colors?: string[]; colorImages?: Record<string, string[]> }) | null;
  onClose: () => void;
};

const DEFAULT_COLORS = ["Onyx", "Sand", "Oat", "Shadow", "Fog"];

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { formatPrice, convertPrice, loading } = useCurrency();
  
  const colors = product?.colors ?? DEFAULT_COLORS;
  
  // All hooks must be called before any early returns
  const [activeSize, setActiveSize] = useState<string | undefined>(product?.sizes?.[0]);
  const [activeColor, setActiveColor] = useState<string | undefined>(colors[0]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const trackView = useRecommendationStore((state) => state.trackView);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setActiveSize(product.sizes?.[0]);
      setActiveColor(product.colors?.[0] ?? DEFAULT_COLORS[0]);
      setSelectedImageIndex(0);
    }
  }, [product?.id]);

  // Reset selected image index when color changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [activeColor]);

  // Track deep product views for AI personalization
  useEffect(() => {
    if (product?.id) {
      trackView(product.id);
    }
  }, [product?.id, trackView]);

  // Early return after all hooks
  if (!product) return null;
  
  // Use converted price if available, otherwise use USD
  const converted = loading ? null : (convertPrice ? convertPrice(product.price) : null);
  const formattedPrice = loading 
    ? `$${product.price.toFixed(2)}` 
    : (converted ? converted.formatted : formatPrice(product.price));

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
          <div className="flex flex-1 flex-col gap-4 p-6 md:p-8 overflow-y-auto">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                {product.category ?? "Drop"}
              </p>
              {/* TODO: Finalize product naming before publishing. */}
              <h3 className="text-2xl font-semibold tracking-tight text-zinc-900">
                {product.name}
              </h3>
              <p className="text-sm text-zinc-500">{product.highlight}</p>
            </div>
            {/* TODO: Lock in final retail price. */}
            <p className="text-3xl font-semibold text-zinc-900">
              {formattedPrice}
            </p>
            <p className="text-sm leading-relaxed text-zinc-600">
              {product.description ??
                "Designed for the Lily capsule: balanced cushioning, premium fabrics, and studio-grade finishing."}
            </p>
            {product.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-zinc-200 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-zinc-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-4 flex flex-col gap-4">
              {sizes && sizes.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                    Size
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setActiveSize(size)}
                        className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] ${
                          activeSize === size
                            ? "bg-black text-white"
                            : "border border-zinc-200 text-zinc-700 hover:border-zinc-900"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
                  Color
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {colors.slice(0, 5).map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setActiveColor(color)}
                      className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] ${
                        activeColor === color
                          ? "bg-black text-white"
                          : "border border-zinc-200 text-zinc-700 hover:border-zinc-900"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 pb-2 md:pb-0">
              <div className="flex gap-2 md:flex-col">
                <AddToCartButton
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  imageUrl={mainImageUrl}
                  size={activeSize}
                  color={activeColor}
                />
                <QuickBuyButton
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  imageUrl={mainImageUrl}
                  size={activeSize}
                  color={activeColor}
                />
              </div>
              <AddToWishlistButton
                id={product.id}
                name={product.name}
                price={product.price}
                imageUrl={mainImageUrl}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

