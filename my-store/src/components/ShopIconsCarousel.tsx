"use client";

import CircularCarousel, { type CircularCarouselItem } from "./CircularCarousel";
import { Price } from "./Price";

export type ShopIcon = {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
};

const CARD_WIDTH = 220;
const ASPECT = 0.74;
const CARD_RADIUS = 18;

export default function ShopIconsCarousel({ items }: { items: ShopIcon[] }) {
  const carouselItems: CircularCarouselItem[] = items.map((product) => ({
    src: product.imageUrl,
    alt: product.name,
    title: product.name,
    subtitle: product.category,
  }));

  return (
    <div className="h-full w-full">
      <CircularCarousel
        items={carouselItems}
        preset="cylinder"
        intro="rise"
        cardWidth={CARD_WIDTH}
        aspectRatio={ASPECT}
        gap={18}
        curve={1}
        tilt={-5}
        perspective={2500}
        autoplay="drift"
        speed={12}
        interval={3}
        direction="left"
        momentum={0.6}
        snap
        pauseOnHover
        focusOnClick
        draggable
        parallax={0.3}
        stretch={0.5}
        fadeColor="#0B0701"
        depthFade={0.55}
        innerShade={0.55}
        cornerRadius={CARD_RADIUS}
        captions={false}
        renderCard={(item, index, back) =>
          back ? (
            <div
              className="h-full w-full rounded-[18px] border border-white/10 bg-black/80"
              aria-hidden="true"
            />
          ) : (
            <div className="relative h-full w-full overflow-hidden rounded-[18px] border border-white/10 bg-gradient-to-b from-black/80 to-black/95 text-white shadow-xl shadow-black/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt=""
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent px-4 pb-4 pt-10">
                <p className="truncate text-[10px] uppercase tracking-[0.3em] text-white/60">
                  {item.subtitle}
                </p>
                <p className="mt-1 line-clamp-2 text-sm font-semibold leading-tight">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-white/75">
                  <Price amount={items[index]?.price ?? 0} />
                </p>
              </div>
            </div>
          )
        }
      />
    </div>
  );
}
