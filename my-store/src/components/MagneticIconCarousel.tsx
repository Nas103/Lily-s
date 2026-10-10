"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Price } from "@/components/Price";

export type IconItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
};

const CARD_WIDTH = 300;
const GAP = 24;
const STEP = CARD_WIDTH + GAP;
const AUTOPLAY_MS = 3600;
const WRAP_MS = 520;

function IconCard({ item, index }: { item: IconItem; index: number }) {
  const reduced = useReducedMotion();

  const rotateX = useSpring(0, { stiffness: 160, damping: 18 });
  const rotateY = useSpring(0, { stiffness: 160, damping: 18 });
  const tx = useSpring(0, { stiffness: 260, damping: 22 });
  const ty = useSpring(0, { stiffness: 260, damping: 22 });
  const scale = useSpring(1, { stiffness: 300, damping: 22 });

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 14);
    rotateX.set(-py * 12);
    tx.set(px * 12);
    ty.set(py * 10);
    scale.set(1.04);
  }

  function onLeave() {
    rotateX.set(0);
    rotateY.set(0);
    tx.set(0);
    ty.set(0);
    scale.set(1);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * (index % 10), duration: 0.55, ease: "easeOut" }}
      className="shrink-0"
      style={{ width: CARD_WIDTH, scrollSnapAlign: "start" }}
    >
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ x: tx, y: ty, scale, rotateX, rotateY, transformPerspective: 900 }}
        className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-black/70 to-black/90 p-5 text-white shadow-xl shadow-black/40 backdrop-blur-sm"
      >
        <p className="text-sm text-white/70">{item.category}</p>
        <p className="mt-2 line-clamp-2 text-lg font-semibold">{item.name}</p>
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={320}
          height={240}
          className="mt-6 h-48 w-full rounded-2xl object-cover"
          draggable={false}
        />
        <p className="mt-4 text-sm text-white/60">
          <Price amount={item.price} />
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function MagneticIconCarousel({ items }: { items: IconItem[] }) {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState(0);
  const [paused, setPaused] = useState(false);

  const len = items.length;
  const doubled = useMemo(() => [...items, ...items], [items]);

  const nextRef = useRef<() => void>(() => {});
  const prevRef = useRef<() => void>(() => {});
  const pausedRef = useRef(false);
  pausedRef.current = paused;

  const next = () => {
    const el = trackRef.current;
    if (!el || len === 0) return;
    const target = view + 1;
    if (target >= len) {
      el.scrollTo({ left: len * STEP, behavior: "smooth" });
      window.setTimeout(() => {
        el.scrollTo({ left: 0, behavior: "auto" });
        setView(0);
      }, WRAP_MS);
    } else {
      el.scrollTo({ left: target * STEP, behavior: "smooth" });
      setView(target);
    }
  };

  const prev = () => {
    const el = trackRef.current;
    if (!el || len === 0) return;
    const target = view - 1;
    if (target < 0) {
      el.scrollTo({ left: len * STEP, behavior: "auto" });
      el.scrollTo({ left: (len - 1) * STEP, behavior: "smooth" });
      setView(len - 1);
    } else {
      el.scrollTo({ left: target * STEP, behavior: "smooth" });
      setView(target);
    }
  };

  nextRef.current = next;
  prevRef.current = prev;

  useEffect(() => {
    if (reduced || len === 0) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current) nextRef.current();
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [reduced, len]);

  if (len === 0) return null;

  return (
    <div className="select-none">
      <div
        ref={trackRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        className="mt-8 flex gap-6 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: "x proximity" }}
      >
        {doubled.map((item, i) => (
          <IconCard key={`${item.id}-${i}`} item={item} index={i} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {items.map((item, i) => (
            <button
              key={item.id}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => {
                const el = trackRef.current;
                if (!el || i === view) return;
                el.scrollTo({ left: i * STEP, behavior: "smooth" });
                setView(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === view ? "w-6 bg-amber-300" : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="Previous"
            onClick={prevRef.current}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10 active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            aria-label="Next"
            onClick={nextRef.current}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/10 active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}