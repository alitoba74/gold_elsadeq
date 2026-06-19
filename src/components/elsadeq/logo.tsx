import * as React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  withText?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  showGlow?: boolean;
}

const sizeMap = {
  sm: { box: "h-7 w-7", text: "text-base", glyph: 18 },
  md: { box: "h-9 w-9", text: "text-xl", glyph: 22 },
  lg: { box: "h-12 w-12", text: "text-2xl", glyph: 28 },
  xl: { box: "h-20 w-20", text: "text-4xl", glyph: 48 },
};

export function Logo({ className, withText = true, size = "md", showGlow = false }: LogoProps) {
  const s = sizeMap[size];

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "relative inline-flex items-center justify-center rounded-xl",
          "bg-gradient-to-br from-[#FFE875] via-[#FFD700] to-[#B8941F]",
          "shadow-lg shadow-amber-500/30",
          s.box,
          showGlow && "gold-pulse",
        )}
      >
        {/* Inner glass disc */}
        <span className="absolute inset-[2px] rounded-[10px] bg-black/20 backdrop-blur-sm" />
        {/* Letter E - custom geometry */}
        <svg
          width={s.glyph}
          height={s.glyph}
          viewBox="0 0 24 24"
          fill="none"
          className="relative z-10"
          aria-hidden="true"
        >
          <path
            d="M5 3h12a1 1 0 0 1 1 1v2.5a1 1 0 0 1-1 1H9.5v2.5h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-6v2.5H17a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
            fill="#0a0a0a"
          />
        </svg>
      </span>
      {withText && (
        <span
          className={cn(
            "font-display font-extrabold tracking-tight text-gold-gradient",
            s.text,
          )}
        >
          ELSADEQ
        </span>
      )}
    </span>
  );
}
