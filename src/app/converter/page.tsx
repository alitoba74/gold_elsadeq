"use client";

import * as React from "react";
import { ArrowRightLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePrices } from "@/hooks/use-prices";
import { useLocaleState } from "@/components/elsadeq/locale-state";
import { getDict } from "@/lib/i18n/dictionaries";
import { formatPrice } from "@/lib/gold/prices";
import { type Currency, currencySymbols, CURRENCIES } from "@/components/elsadeq/currency-toggle";

export default function ConverterPage() {
  const { rates } = usePrices();
  const { locale } = useLocaleState();
  const t = getDict(locale);

  const [amount, setAmount] = React.useState<string>("1000");
  const [from, setFrom] = React.useState<Currency>("EGP");
  const [to, setTo] = React.useState<Currency>("SAR");

  // Cross-currency conversion via EGP as bridge.
  // rates.X = USD -> X. So EGP->X = X / EGP.
  const convert = (value: number, from: Currency, to: Currency): number => {
    const fRate = rates[from] || 1;
    const tRate = rates[to] || 1;
    if (!fRate || !tRate) return value;
    // value (in `from`) -> USD -> `to`
    const usd = value / fRate;
    return usd * tRate;
  };

  const amountNum = parseFloat(amount) || 0;
  const result = convert(amountNum, from, to);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="mx-auto max-w-2xl px-3 sm:px-4 lg:px-6 py-6 pb-24 lg:pb-12">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-gradient font-display">
          {t.converter.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.converter.subtitle}</p>
      </header>

      <Card className="glass-card gold-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ArrowRightLeft className="h-4 w-4 text-gold" />
            {t.converter.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="amount">{t.converter.amount}</Label>
            <Input
              id="amount"
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end">
            <div className="space-y-1.5">
              <Label>{t.converter.from}</Label>
              <Select value={from} onValueChange={(v) => setFrom(v as Currency)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c} ({currencySymbols[c]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <button
              onClick={swap}
              className="mb-1 inline-flex items-center justify-center h-10 w-10 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold transition-colors rtl-flip"
              aria-label="swap"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>

            <div className="space-y-1.5">
              <Label>{t.converter.to}</Label>
              <Select value={to} onValueChange={(v) => setTo(v as Currency)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c} ({currencySymbols[c]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Result */}
          <div className="rounded-2xl bg-gradient-to-br from-gold/5 to-transparent border border-gold/15 p-5">
            <p className="text-xs text-muted-foreground mb-2">{t.converter.result}</p>
            <p className="text-3xl sm:text-4xl font-bold text-gold-gradient tabular-nums">
              {formatPrice(result, to, locale)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              1 {from} = {(convert(1, from, to)).toFixed(4)} {to}
            </p>
          </div>

          {/* Rate table */}
          <div className="rounded-lg bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground mb-2">
              {locale === "ar" ? "أسعار صرف اليوم" : "Today's rates"}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {CURRENCIES.filter((c) => c !== "EGP").map((c) => (
                <div key={c} className="flex justify-between">
                  <span className="text-muted-foreground">1 {c}</span>
                  <span className="font-medium tabular-nums">
                    {formatPrice(convert(1, c, "EGP"), "EGP", locale)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
