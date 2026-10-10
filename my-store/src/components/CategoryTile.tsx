"use client";

import Link from "next/link";
import type { CatalogCategory } from "@/data/catalog";

type CategoryTileProps = {
  id: CatalogCategory;
  label: string;
  href: string;
  blurb: string;
  onHover: (el: HTMLElement | null) => void;
};

export default function CategoryTile({ label, href, blurb, onHover }: CategoryTileProps) {
  return (
    <Link
      href={href}
      onMouseEnter={(e) => onHover(e.currentTarget)}
      onMouseLeave={() => onHover(null)}
      onFocus={(e) => onHover(e.currentTarget)}
      onBlur={() => onHover(null)}
      onTouchStart={(e) => onHover(e.currentTarget)}
      onTouchEnd={() => onHover(null)}
      className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white px-5 py-4 transition hover:-translate-y-1 hover:border-amber-500"
    >
      <p className="relative z-10 text-sm font-semibold tracking-tight">{label}</p>
      <p className="relative z-10 mt-1 text-xs text-zinc-500">{blurb}</p>
    </Link>
  );
}