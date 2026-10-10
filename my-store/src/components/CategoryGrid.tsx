"use client";

import { useState } from "react";
import CategoryTile from "@/components/CategoryTile";
import DustOverlay from "@/components/DustOverlay";
import type { CatalogCategory } from "@/data/catalog";

type Category = {
  id: CatalogCategory;
  label: string;
  href: string;
  blurb: string;
};

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  const [activeEl, setActiveEl] = useState<HTMLElement | null>(null);

  return (
    <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {categories.map((category) => (
        <CategoryTile
          key={category.id}
          id={category.id}
          label={category.label}
          href={category.href}
          blurb={category.blurb}
          onHover={setActiveEl}
        />
      ))}
      <DustOverlay activeEl={activeEl} />
    </div>
  );
}