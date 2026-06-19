"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Minus, Share2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocaleState } from "./locale-state";
import { getDict } from "@/lib/i18n/dictionaries";
import { useConvertedPrice, type PriceRow, type Rates } from "@/hooks/use-prices";
import { formatPrice, relativeTime } from "@/lib/gold/prices";
import type { Currency } from "./currency-toggle";
import { FavoriteButton } from "./favorite-button";
import { toast } from "sonner";

interface PriceCardProps {
  row: PriceRow;
  rates: Rates;
  variant?: "default" | "hero" | "compact" | "wide";
  showShare?: boolean;
}

export function PriceCard({
  row,
  rates,
  variant = "default",
  showShare = true,
}: PriceCardProps) {
  const { locale, currency } = useLocaleState();
  const t = getDict(locale);
  const [flash, setFlash] = React.useState<"up" | "down" | null>(null);
  const prevBuy = React.useRef(row.buyPriceEgp);

  React.useEffect(() => {
    if (row.buyPriceEgp > prevBuy.current) setFlash("up");
    else if (row.buyPriceEgp < prevBuy.current) setFlash("down");
    prevBuy.current = row.buyPriceEgp;
    const id = setTimeout(() => setFlash(null), 1200);
    return () => clearTimeout(id);
  }, [row.buyPriceEgp]);

  const { buy, sell, buyRaw, sellRaw } = useConvertedPrice(
    row,
    currency as Currency,
    rates,
    locale,
  );

  const change = row.changePct || 0;
  const direction = change > 0.01 ? "up" : change < -0.01 ? "down" : "flat";

  const label = locale === "ar" ? row.labelAr : row.labelEn;

  const handleShare = async () => {
    const text = `${label}: ${buy} / ${sell} - ELSADEQ`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "ELSADEQ", text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast.success(t.common.copied);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${buy} / ${sell}`);
    toast.success(t.common.copied);
  };

  const shareWhatsapp = () => {
    const text = encodeURIComponent(
      `${label}: شراء ${buy} / بيع ${sell} - ELSADEQ`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  if (variant === "hero") {
    return (
      <div
        className={cn(
          "relative rounded-3xl p-6 sm:p-8 overflow-hidden",
          "bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#1a1a1a]",
          "border border-gold/30",
          "gold-pulse",
          flash === "up" && "flash-up",
          flash === "down" && "flash-down",
        )}
      >
        {/* Decorative gold orb */}
        <div className="absolute -top-20 -end-20 h-60 w-60 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -bottom-20 -start-20 h-60 w-60 rounded-full bg-amber-700/10 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500 live-pulse" />
                <span className="text-xs font-bold text-green-400 uppercase tracking-wider">
                  {t.home.liveNow}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gold-gradient font-display">
                {label}
              </h3>
            </div>
            {showShare && (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-full hover:bg-gold/10 text-gold/70 hover:text-gold transition-colors"
                  aria-label={t.common.copy}
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full hover:bg-gold/10 text-gold/70 hover:text-gold transition-colors"
                  aria-label={t.common.share}
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-black/30 border border-gold/10 p-4">
              <p className="text-xs text-muted-foreground mb-1">{t.home.buy}</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground tabular-nums">
                {buy}
              </p>
            </div>
            <div className="rounded-2xl bg-black/30 border border-gold/10 p-4">
              <p className="text-xs text-muted-foreground mb-1">{t.home.sell}</p>
              <p className="text-xl sm:text-2xl font-bold text-gold tabular-nums">
                {sell}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {direction === "up" && <ArrowUp className="h-3.5 w-3.5 text-green-500" />}
              {direction === "down" && <ArrowDown className="h-3.5 w-3.5 text-red-500" />}
              {direction === "flat" && <Minus className="h-3.5 w-3.5 text-muted-foreground" />}
              <span
                className={cn(
                  "font-bold tabular-nums",
                  direction === "up" && "text-green-500",
                  direction === "down" && "text-red-500",
                  direction === "flat" && "text-muted-foreground",
                )}
              >
                {change > 0 ? "+" : ""}
                {change.toFixed(2)}%
              </span>
            </div>
            <span className="text-muted-foreground">
              {t.home.lastUpdate}: {relativeTime(row.lastUpdated, locale)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "rounded-xl p-3 glass-card gold-glow transition-all",
          flash === "up" && "flash-up",
          flash === "down" && "flash-down",
        )}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-muted-foreground truncate">
            {label}
          </span>
          {direction === "up" && <ArrowUp className="h-3 w-3 text-green-500" />}
          {direction === "down" && <ArrowDown className="h-3 w-3 text-red-500" />}
          {direction === "flat" && <Minus className="h-3 w-3 text-muted-foreground" />}
        </div>
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] text-muted-foreground">{t.home.sell}</p>
            <p className="text-base font-bold text-gold tabular-nums">{sell}</p>
          </div>
          <div className="text-end">
            <p className="text-[10px] text-muted-foreground">{t.home.buy}</p>
            <p className="text-base font-bold tabular-nums">{buy}</p>
          </div>
        </div>
      </div>
    );
  }

  // default / wide
  return (
    <div
      className={cn(
        "rounded-2xl p-5 glass-card gold-glow transition-all",
        flash === "up" && "flash-up",
        flash === "down" && "flash-down",
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-gold-gradient font-display">
            {label}
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {row.karat && `${row.karat}K`}
            {row.weightGrams && ` · ${row.weightGrams}g`}
            {` · ${relativeTime(row.lastUpdated, locale)}`}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {direction === "up" && <ArrowUp className="h-4 w-4 text-green-500" />}
          {direction === "down" && <ArrowDown className="h-4 w-4 text-red-500" />}
          {direction === "flat" && <Minus className="h-4 w-4 text-muted-foreground" />}
          <span
            className={cn(
              "text-xs font-bold tabular-nums",
              direction === "up" && "text-green-500",
              direction === "down" && "text-red-500",
              direction === "flat" && "text-muted-foreground",
            )}
          >
            {change > 0 ? "+" : ""}
            {change.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-black/30 border border-gold/5 px-3 py-2">
          <p className="text-[10px] text-muted-foreground">{t.home.buy}</p>
          <p className="text-lg font-bold tabular-nums">{buy}</p>
        </div>
        <div className="rounded-lg bg-black/30 border border-gold/5 px-3 py-2">
          <p className="text-[10px] text-muted-foreground">{t.home.sell}</p>
          <p className="text-lg font-bold text-gold tabular-nums">{sell}</p>
        </div>
      </div>

      {showShare && (
        <div className="mt-3 flex items-center justify-between gap-1">
          <FavoriteButton itemKey={row.itemKey} />
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="text-[11px] text-muted-foreground hover:text-gold transition-colors px-2 py-1 rounded inline-flex items-center gap-1"
              aria-label={t.common.copy}
            >
              <Copy className="h-3 w-3" />
              {t.common.copy}
            </button>
            <button
              onClick={shareWhatsapp}
              className="text-[11px] text-muted-foreground hover:text-green-500 transition-colors px-2 py-1 rounded inline-flex items-center gap-1"
              aria-label={t.common.shareWhatsapp}
            >
              <Share2 className="h-3 w-3" />
              {t.common.share}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
