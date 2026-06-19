"use client";

import * as React from "react";
import { Calculator as CalcIcon, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePrices } from "@/hooks/use-prices";
import { useLocaleState } from "@/components/elsadeq/locale-state";
import { getDict } from "@/lib/i18n/dictionaries";
import { formatPrice, convertFromEgp } from "@/lib/gold/prices";
import { type Currency, currencySymbols } from "@/components/elsadeq/currency-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CalculatorPage() {
  const { prices, rates, loading } = usePrices();
  const { locale, currency } = useLocaleState();
  const t = getDict(locale);

  const [karat, setKarat] = React.useState<string>("21");
  const [weight, setWeight] = React.useState<string>("10");
  const [pieces, setPieces] = React.useState<string>("1");

  // Live gram price for selected karat
  const goldRow = prices.find((p) => p.itemKey === `gold_${karat}k`);
  const gramBuy = goldRow?.buyPriceEgp || 0;
  const gramSell = goldRow?.sellPriceEgp || 0;

  const totalWeight = (parseFloat(weight) || 0) * (parseInt(pieces) || 1);
  const buyValue = totalWeight * gramBuy;
  const sellValue = totalWeight * gramSell;

  // Convert to selected currency
  const convert = (egp: number) => {
    if (currency === "EGP") return egp;
    return convertFromEgp(egp, currency as Currency, rates);
  };

  const fmt = (egp: number) => formatPrice(convert(egp), currency, locale);

  return (
    <div className="mx-auto max-w-3xl px-3 sm:px-4 lg:px-6 py-6 pb-24 lg:pb-12">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-gradient font-display">
          {t.calculator.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.calculator.subtitle}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="glass-card gold-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalcIcon className="h-4 w-4 text-gold" />
              {t.calculator.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Karat */}
            <div className="space-y-1.5">
              <Label htmlFor="karat">{t.calculator.karat}</Label>
              <Select value={karat} onValueChange={setKarat}>
                <SelectTrigger id="karat" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24K (999)</SelectItem>
                  <SelectItem value="22">22K (916)</SelectItem>
                  <SelectItem value="21">21K (875)</SelectItem>
                  <SelectItem value="18">18K (750)</SelectItem>
                  <SelectItem value="14">14K (585)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Weight */}
            <div className="space-y-1.5">
              <Label htmlFor="weight">{t.calculator.weight} ({t.calculator.weightUnit})</Label>
              <Input
                id="weight"
                type="number"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="0"
                step="0.1"
                placeholder="0"
              />
            </div>

            {/* Pieces */}
            <div className="space-y-1.5">
              <Label htmlFor="pieces">{t.calculator.pieces}</Label>
              <Input
                id="pieces"
                type="number"
                inputMode="numeric"
                value={pieces}
                onChange={(e) => setPieces(e.target.value)}
                min="1"
                step="1"
                placeholder="1"
              />
            </div>

            {/* Use live price hint */}
            <div className="rounded-lg bg-gold/5 border border-gold/15 px-3 py-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="h-3 w-3 text-gold" />
                <span className="font-medium text-gold">
                  {locale === "ar" ? "سعر الجرام الحالي" : "Current gram price"}
                </span>
              </div>
              {loading && !goldRow ? (
                <span>{t.common.loading}</span>
              ) : goldRow ? (
                <div className="flex justify-between gap-2">
                  <span>
                    {t.home.buy}:{" "}
                    <strong className="text-foreground tabular-nums">
                      {fmt(gramBuy)}
                    </strong>
                  </span>
                  <span>
                    {t.home.sell}:{" "}
                    <strong className="text-foreground tabular-nums">
                      {fmt(gramSell)}
                    </strong>
                  </span>
                </div>
              ) : (
                <span>{t.common.loading}</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        <Card className="glass-card gold-glow bg-gradient-to-br from-gold/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <RefreshCw className="h-4 w-4 text-gold" />
              {t.calculator.result}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                {t.calculator.totalWeight}
              </p>
              <p className="text-2xl font-bold text-gold-gradient tabular-nums">
                {totalWeight.toLocaleString(locale === "ar" ? "ar-EG" : "en-US", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}{" "}
                {t.calculator.weightUnit}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-black/30 border border-gold/10 p-3">
                <p className="text-xs text-muted-foreground mb-1">
                  {t.calculator.buyValue}
                </p>
                <p className="text-lg font-bold tabular-nums">{fmt(buyValue)}</p>
              </div>
              <div className="rounded-xl bg-black/30 border border-gold/10 p-3">
                <p className="text-xs text-muted-foreground mb-1">
                  {t.calculator.sellValue}
                </p>
                <p className="text-lg font-bold text-gold tabular-nums">{fmt(sellValue)}</p>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {t.footer.disclaimer}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
