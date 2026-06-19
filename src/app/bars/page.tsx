"use client";

import * as React from "react";
import { usePrices } from "@/hooks/use-prices";
import { PriceCard } from "@/components/elsadeq/price-card";
import { PriceCardSkeleton } from "@/components/elsadeq/price-card-skeleton";
import { RefreshBar } from "@/components/elsadeq/refresh-bar";
import { useLocaleState } from "@/components/elsadeq/locale-state";
import { getDict } from "@/lib/i18n/dictionaries";

export default function BarsPage() {
  const { prices, rates, loading, refresh, lastUpdated, fromCache } = usePrices();
  const { locale } = useLocaleState();
  const t = getDict(locale);

  const bars = prices
    .filter((p) => p.itemType === "bar")
    .sort((a, b) => (a.weightGrams || 0) - (b.weightGrams || 0));

  return (
    <div className="mx-auto max-w-5xl px-3 sm:px-4 lg:px-6 py-6 pb-24 lg:pb-12">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-gradient font-display">
          {t.bars.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.bars.subtitle}</p>
      </header>

      <div className="mb-5">
        <RefreshBar
          lastUpdated={lastUpdated}
          loading={loading}
          fromCache={fromCache}
          onRefresh={refresh}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {loading && prices.length === 0
          ? Array.from({ length: 9 }).map((_, i) => <PriceCardSkeleton key={i} />)
          : bars.map((row) => (
              <PriceCard key={row.itemKey} row={row} rates={rates} variant="wide" />
            ))}
      </div>
    </div>
  );
}
