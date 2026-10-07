"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";
import MoltenMetal from "./MoltenMetal";
import { BRAND } from "@/lib/brand";

const layers = [
  { z: -110, offset: 0, color: "#2a1a02", blur: 2.5, opacity: 0.45 },
  { z: -80, offset: 0, color: "#6b4200", blur: 1.5, opacity: 0.6 },
  { z: -50, offset: 0, color: "#b3760a", blur: 0.6, opacity: 0.75 },
  { z: -24, offset: 0, color: "#f5b301", blur: 0, opacity: 0.85 },
];

export function MoltenHero() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [9, -9]), {
    stiffness: 120,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-14, 14]), {
    stiffness: 120,
    damping: 22,
  });
  const glow = useTransform(
    [mx, my],
    ([x, y]: number[]) =>
      `radial-gradient(420px circle at ${x * 100}% ${y * 100}%, rgba(245,179,1,0.22), transparent 70%)`
  );

  const handleMove = (event: React.MouseEvent<HTMLElement>) => {
    if (reduceMotion || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width);
    my.set((event.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className="relative isolate w-full overflow-hidden bg-black text-white"
    >
      {/* Molten metal backdrop */}
      <div className="absolute inset-0">
        <MoltenMetal
          color1="#4a2e0a"
          color2="#f5b301"
          color3="#fff7e6"
          backgroundColor="#000000"
          speed={0.3}
          scale={4}
          detail={3}
          glow={1.5}
          coreSize={0.12}
          swirl={1}
          fold={-0.2}
          blackPoint={0.04}
          brightness={1.25}
          colorMode="molten"
          grain
          grainIntensity={0.04}
          mouseInteraction
          mouseStrength={0.35}
          opacity={0.95}
        />
      </div>

      {/* Legibility + interaction glow overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_78%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50 mix-blend-screen"
        style={{ background: glow }}
      />

      <div
        className="pointer-events-none relative mx-auto flex min-h-[620px] max-w-6xl flex-col items-center justify-center px-6 py-24 text-center"
        style={{ perspective: 1200 }}
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.55em] text-amber-200/80"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {BRAND.tagline}
        </motion.p>

        {/* 3D layered wordmark */}
        <motion.div
          className="mt-6 will-change-transform"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, rotateX: -45, y: 70 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="relative select-none"
            style={{ transformStyle: "preserve-3d" }}
            animate={
              reduceMotion ? undefined : { y: [0, -10, 0] }
            }
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {layers.map((layer) => (
              <span
                key={layer.z}
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center justify-center text-[clamp(4.5rem,16vw,13rem)] font-light tracking-[0.12em]"
                style={{
                  color: layer.color,
                  transform: `translateZ(${layer.z}px)`,
                  filter: layer.blur ? `blur(${layer.blur}px)` : undefined,
                  opacity: layer.opacity,
                }}
              >
                {BRAND.name}
              </span>
            ))}

            <h1 className="molten-title relative text-[clamp(4.5rem,16vw,13rem)] font-light leading-none tracking-[0.12em]">
              {BRAND.name}
            </h1>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-8 max-w-xl text-sm text-white/70 md:text-base"
        >
          {BRAND.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="pointer-events-auto mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/women"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-950 shadow-[0_10px_40px_-10px_rgba(245,179,1,0.7)] transition hover:scale-[1.03]"
          >
            Shop the edit
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
          <Link
            href="/assistant"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/90 backdrop-blur transition hover:border-amber-200/70 hover:text-amber-100"
          >
            Ask the stylist
          </Link>
        </motion.div>
      </div>
    </section>
  );
}