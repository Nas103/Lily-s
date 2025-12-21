"use client";

import { useState } from "react";
import { ProductCard, ProductCardProps } from "./ProductCard";
import { ProductDetailModal } from "./ProductDetailModal";

type ProductGridProps = {
  products: (ProductCardProps & { description?: string; tags?: string[]; sizes?: string[]; colors?: string[]; colorImages?: Record<string, string[]> })[];
};

export function ProductGrid({ products }: ProductGridProps) {
  const [selected, setSelected] = useState<
    (ProductCardProps & { description?: string; tags?: string[]; sizes?: string[]; colors?: string[]; colorImages?: Record<string, string[]> }) | null
  >(null);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onPreview={() => setSelected(product)}
          />
        ))}
      </div>
      <ProductDetailModal
        product={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}


