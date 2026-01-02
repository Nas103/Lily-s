"use client";

import { ReactNode } from "react";
import Link from "next/link";

type LiquidMetalButtonProps = {
  theme?: "gold" | "silver" | "bronze";
  textured?: boolean;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  href?: string;
};

export function LiquidMetalButton({
  theme = "gold",
  textured = false,
  className = "",
  children,
  onClick,
  href,
}: LiquidMetalButtonProps) {
  const themeStyles = {
    gold: {
      gradient: "from-yellow-400 via-yellow-500 to-yellow-600",
      border: "border-yellow-400/30",
      shadow: "shadow-yellow-500/20",
      text: "text-yellow-900",
    },
    silver: {
      gradient: "from-gray-300 via-gray-400 to-gray-500",
      border: "border-gray-300/30",
      shadow: "shadow-gray-400/20",
      text: "text-gray-900",
    },
    bronze: {
      gradient: "from-orange-400 via-orange-500 to-orange-600",
      border: "border-orange-400/30",
      shadow: "shadow-orange-500/20",
      text: "text-orange-900",
    },
  };

  const currentTheme = themeStyles[theme];
  
  // Texture pattern for metallic effect
  const texturePattern = textured ? (
    <div 
      className="absolute inset-0 opacity-20 pointer-events-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '20px 20px',
      }}
    />
  ) : null;

  const baseClasses = `
    relative
    inline-flex
    items-center
    justify-center
    px-8
    py-3
    rounded-lg
    bg-gradient-to-r
    ${currentTheme.gradient}
    border
    ${currentTheme.border}
    ${currentTheme.shadow}
    shadow-lg
    backdrop-blur-sm
    transition-all
    duration-300
    hover:scale-105
    hover:shadow-xl
    active:scale-95
    overflow-hidden
    ${className}
  `.trim().replace(/\s+/g, " ");

  const content = (
    <div className={`flex items-center relative z-10 ${currentTheme.text}`}>
      {children}
    </div>
  );

  // Animated shimmer effect
  const shimmerEffect = (
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={baseClasses}
      >
        {texturePattern}
        {shimmerEffect}
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={baseClasses}
    >
      {texturePattern}
      {shimmerEffect}
      {content}
    </button>
  );
}

