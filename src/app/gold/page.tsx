"use client";

import * as React from "react";
import { usePrices } from "@/hooks/use-prices";
import { PriceCard } from "@/components/elsadeq/price-card";
import { PriceCardSkeleton } from "@/components/elsadeq/price-card-skeleton";
import { RefreshBar } from "@/components/elsadeq/refresh-bar";
import { Breadcrumbs } from "@/components/elsadeq/breadcrumbs";
import { useLocaleState } from "@/components/elsadeq/locale-state";
import { getDict } from "@/lib/i18n/dictionaries";
import { Button } from "@/components/ui/button";
import { Printer, GitCompare } from "lucide-react";
import { formatPrice } from "@/lib/gold/prices";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function GoldPage() {
  const { prices, rates, loading, refresh, lastUpdated, fromCache } = usePrices();
  const { locale } = useLocaleState();
  const t = getDict(locale);
  const [showCompare, setShowCompare] = React.useState(false);

  const goldPrices = prices
    .filter((p) => p.itemType === "gold")
    .sort((a, b) => (b.karat || 0) - (a.karat || 0));

  return (
    <div className="mx-auto max-w-5xl px-3 sm:px-4 lg:px-6 py-6 pb-24 lg:pb-12">
      <Breadcrumbs items={[{ label: t.nav.home, href: "/" }, { label: t.nav.gold }]} />

      <header className="mb-6 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gold-gradient font-display">
            {t.gold.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.gold.subtitle}</p>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCompare((v) => !v)}
            className="border-gold/30 text-gold hover:bg-gold/10"
          >
            <GitCompare className="h-4 w-4 me-2" />
            {locale === "ar" ? "مقارنة العيارات" : "Compare Karats"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="border-gold/30 text-gold hover:bg-gold/10"
          >
            <Printer className="h-4 w-4 me-2" />
            {locale === "ar" ? "طباعة" : "Print"}
          </Button>
        </div>
      </header>

      <div className="mb-5 print:hidden">
        <RefreshBar
          lastUpdated={lastUpdated}
          loading={loading}
          fromCache={fromCache}
          onRefresh={refresh}
        />
      </div>

      {/* Comparison Table (toggle) */}
      {showCompare && goldPrices.length > 0 && (
        <Card className="glass-card gold-glow mb-5 print:hidden">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <GitCompare className="h-4 w-4 text-gold" />
              {locale === "ar" ? "مقارنة العيارات" : "Karats Comparison"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-start p-3 font-semibold">{t.calculator.karat}</th>
                    <th className="text-end p-3 font-semibold">{t.home.buy}</th>
                    <th className="text-end p-3 font-semibold">{t.home.sell}</th>
                    <th className="text-end p-3 font-semibold">
                      {locale === "ar" ? "الفرق" : "Spread"}
                    </th>
                    <th className="text-end p-3 font-semibold">
                      {locale === "ar" ? "% من 24K" : "% of 24K"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {goldPrices.map((row) => {
                    const gold24 = goldPrices.find((p) => p.itemKey === "gold_24k");
                    const pct = gold24 && gold24.buyPriceEgp > 0
                      ? (row.buyPriceEgp / gold24.buyPriceEgp * 100).toFixed(1)
                      : "—";
                    return (
                      <tr key={row.itemKey} className="hover:bg-muted/30">
                        <td className="p-3 font-bold text-gold">
                          {row.karat}K
                        </td>
                        <td className="p-3 text-end tabular-nums">
                          {formatPrice(row.buyPriceEgp, "EGP", locale)}
                        </td>
                        <td className="p-3 text-end tabular-nums">
                          {formatPrice(row.sellPriceEgp, "EGP", locale)}
                        </td>
                        <td className="p-3 text-end tabular-nums text-muted-foreground">
                          {formatPrice(row.sellPriceEgp - row.buyPriceEgp, "EGP", locale)}
                        </td>
                        <td className="p-3 text-end tabular-nums">{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {loading && prices.length === 0
          ? Array.from({ length: 5 }).map((_, i) => <PriceCardSkeleton key={i} />)
          : goldPrices.map((row) => (
              <PriceCard key={row.itemKey} row={row} rates={rates} variant="wide" />
            ))}
      </div>
    </div>
  );
}
