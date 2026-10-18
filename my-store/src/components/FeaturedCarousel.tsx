"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ProductCard, ProductCardProps } from "./ProductCard";
import { ProductDetailModal } from "./ProductDetailModal";

type Product = (ProductCardProps & {
  description?: string;
  tags?: string[];
  sizes?: string[];
  colors?: string[];
  colorImages?: Record<string, string[]>;
})[];

export function FeaturedCarousel({ products }: { products: Product }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Product[0] | null>(null);

  useEffect(() => {
    if (products.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % products.length);
    }, 30000);
    return () => clearInterval(timer);
  }, [products.length]);

  if (products.length === 0) return null;

  return (
    <>
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={products[index]?.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <ProductCard {...products[index]} onPreview={() => setSelected(products[index])} />
          </motion.div>
        </AnimatePresence>
        {products.length > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full transition ${
                  i === index ? "bg-zinc-900" : "bg-zinc-300"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <ProductDetailModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}
