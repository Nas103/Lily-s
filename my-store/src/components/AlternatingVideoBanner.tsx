"use client";

import { useCallback, useState } from "react";

type AlternatingVideoBannerProps = {
  sources: string[];
  className?: string;
  /** Edge-to-edge full-width banner: drops rounding, border, shadow. */
  bleed?: boolean;
};

/**
 * Plays through a list of clips back-to-back, looping forever: when one clip
 * finishes, the next one starts from the beginning (and wraps around).
 */
export function AlternatingVideoBanner({
  sources,
  className,
  bleed = false,
}: AlternatingVideoBannerProps) {
  const [index, setIndex] = useState(0);

  const handleEnded = useCallback(() => {
    setIndex((current) => (current + 1) % sources.length);
  }, [sources.length]);

  if (!sources.length) return null;

  return (
    <div
      className={`aspect-video overflow-hidden bg-black ${
        bleed
          ? ""
          : "rounded-[28px] border border-zinc-200 shadow-lg ring-1 ring-black/5"
      } ${className ?? ""}`}
    >
      <video
        key={sources[index]}
        src={sources[index]}
        autoPlay
        muted
        playsInline
        preload="auto"
        loop={sources.length <= 1}
        onEnded={handleEnded}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
