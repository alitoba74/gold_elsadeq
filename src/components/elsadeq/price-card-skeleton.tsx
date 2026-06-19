"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function PriceCardSkeleton({ variant = "default" }: { variant?: "default" | "hero" | "compact" | "wide" }) {
  if (variant === "hero") {
    return (
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#1a1a1a] border border-gold/30">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16 bg-gold/10" />
            <Skeleton className="h-7 w-32 bg-gold/10" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full bg-gold/10" />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Skeleton className="h-20 rounded-2xl bg-gold/5" />
          <Skeleton className="h-20 rounded-2xl bg-gold/5" />
        </div>
        <div className="mt-4 flex justify-between">
          <Skeleton className="h-3 w-20 bg-gold/10" />
          <Skeleton className="h-3 w-24 bg-gold/10" />
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="rounded-xl p-3 glass-card">
        <Skeleton className="h-3 w-20 bg-gold/10 mb-2" />
        <div className="flex justify-between gap-2">
          <Skeleton className="h-8 w-16 bg-gold/5" />
          <Skeleton className="h-8 w-16 bg-gold/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5 glass-card">
      <div className="flex justify-between mb-3">
        <Skeleton className="h-4 w-24 bg-gold/10" />
        <Skeleton className="h-4 w-12 bg-gold/10" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-14 rounded-lg bg-gold/5" />
        <Skeleton className="h-14 rounded-lg bg-gold/5" />
      </div>
    </div>
  );
}
