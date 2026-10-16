"use client";

import { useRef } from "react";
import Link from "next/link";
import Vortex from "./Vortex";
import ShopIconsCarousel, { type ShopIcon } from "./ShopIconsCarousel";
import LaserFlow from "./LaserFlow";
import SplitFlapText from "./SplitFlapText";

export default function ShopIconsLaser({
  items,
  brands = [],
}: {
  items: ShopIcon[];
  brands?: string[];
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const brandWords = brands.filter((brand) => brand.trim().length > 0);
  const padTo = brandWords.reduce((max, word) => Math.max(max, word.length), 1);

  return (
    <div className="relative overflow-hidden px-6 py-24 md:py-36">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_60%_-10%,rgba(249,115,26,0.18),transparent_65%)]"
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <LaserFlow
          surfaceRef={cardRef}
          beamPosition={0.6}
          color="#F9731A"
          intensity={1.8}
          beamWidth={1.5}
          flare={1.5}
          spread={1.5}
          spill={1}
          fog={0.2}
          dust={1.6}
          streaks={1.5}
          dots={1}
          pulse={1.5}
          speed={1.5}
          seed={3}
          mouseInteraction
          intro
          introInterval={60}
        />
      </div>

      <div
        ref={cardRef}
        className="relative mx-auto h-[314px] max-w-6xl overflow-hidden rounded-[40px] border border-white/5 bg-[#0B0701] sm:h-[381px] md:h-[437px]"
      >
        <div className="absolute inset-0" aria-hidden="true">
          <Vortex background="#0B0701" style={{ position: "absolute", inset: 0 }} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-black/70" />

        <div className="relative z-20 flex items-center justify-between px-7 pb-7 pt-14 md:px-12 md:pb-10 md:pt-20">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-amber-300/70">
              Shop our icons
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Globally loved silhouettes
            </h2>
          </div>
          <div className="flex gap-2 text-xs uppercase tracking-[0.35em] text-white/55">
            <Link href="/men" className="transition hover:text-white">
              Men
            </Link>
            <span>·</span>
            <Link href="/women" className="transition hover:text-white">
              Women
            </Link>
          </div>
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 pb-6 pt-16 md:pt-20">
          <ShopIconsCarousel items={items} />
        </div>
      </div>

      {brandWords.length > 0 && (
        <div className="relative mt-12 flex justify-center">
          <SplitFlapText
            words={brandWords}
            flipDuration={0.12}
            stagger={0.06}
            cycleDelay={2400}
            charset="alphanumeric"
            flipsPerChar={8}
            order="left"
            align="left"
            tileStyle="minimal"
            tileColor="transparent"
            textColor="#f8fafc"
            glare={0}
            depth={0.5}
            tileRadius={8}
            gap={6}
            fontSize="clamp(24px, 5vw, 52px)"
            loop
            padTo={padTo}
            intro
          />
        </div>
      )}
    </div>
  );
}
