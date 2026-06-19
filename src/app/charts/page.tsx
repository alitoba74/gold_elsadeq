"use client";

import * as React from "react";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { useLocaleState } from "@/components/elsadeq/locale-state";
import { getDict } from "@/lib/i18n/dictionaries";
import { getHistoryViaApi } from "@/lib/gold/client-fetch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";
import { Breadcrumbs } from "@/components/elsadeq/breadcrumbs";

const ITEMS = [
  { key: "gold_24k", labelAr: "ذهب عيار 24", labelEn: "Gold 24K" },
  { key: "gold_22k", labelAr: "ذهب عيار 22", labelEn: "Gold 22K" },
  { key: "gold_21k", labelAr: "ذهب عيار 21", labelEn: "Gold 21K" },
  { key: "gold_18k", labelAr: "ذهب عيار 18", labelEn: "Gold 18K" },
  { key: "gold_14k", labelAr: "ذهب عيار 14", labelEn: "Gold 14K" },
  { key: "pound", labelAr: "جنيه الذهب", labelEn: "Gold Pound" },
  { key: "bar_10g", labelAr: "سبيكة 10 جرام", labelEn: "10g Bar" },
  { key: "bar_50g", labelAr: "سبيكة 50 جرام", labelEn: "50g Bar" },
  { key: "bar_100g", labelAr: "سبيكة 100 جرام", labelEn: "100g Bar" },
];

const RANGES = [
  { key: "24h", labelKey: "range24h" },
  { key: "7d", labelKey: "range7d" },
  { key: "30d", labelKey: "range30d" },
  { key: "1y", labelKey: "range1y" },
] as const;

export default function ChartsPage() {
  const { locale } = useLocaleState();
  const t = getDict(locale);
  const [item, setItem] = React.useState("gold_21k");
  const [range, setRange] = React.useState<"24h" | "7d" | "30d" | "1y">("24h");
  const [data, setData] = React.useState<{ recordedAt: string; price: number }[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    getHistoryViaApi(item, range).then((d) => {
      if (!mounted) return;
      setData(d);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [item, range]);

  const chartData = data.map((d) => ({
    time: new Date(d.recordedAt).toLocaleString(locale === "ar" ? "ar-EG" : "en-US", {
      hour: range === "24h" ? "2-digit" : undefined,
      minute: range === "24h" ? "2-digit" : undefined,
      day: range !== "24h" ? "2-digit" : undefined,
      month: range !== "24h" ? "2-digit" : undefined,
    }),
    price: d.price,
  }));

  const min = chartData.length ? Math.min(...chartData.map((d) => d.price)) : 0;
  const max = chartData.length ? Math.max(...chartData.map((d) => d.price)) : 0;
  const change = chartData.length >= 2
    ? ((chartData[chartData.length - 1].price - chartData[0].price) / chartData[0].price) * 100
    : 0;

  return (
    <div className="mx-auto max-w-5xl px-3 sm:px-4 lg:px-6 py-6 pb-24 lg:pb-12">
      <Breadcrumbs items={[{ label: t.nav.home, href: "/" }, { label: t.nav.charts }]} />
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-gradient font-display">
          {t.charts.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.charts.subtitle}</p>
      </header>

      <Card className="glass-card gold-glow mb-4">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-gold" />
              {ITEMS.find((i) => i.key === item)?.[locale === "ar" ? "labelAr" : "labelEn"]}
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Select value={item} onValueChange={setItem}>
                <SelectTrigger className="w-[140px] sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ITEMS.map((i) => (
                    <SelectItem key={i.key} value={i.key}>
                      {locale === "ar" ? i.labelAr : i.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {RANGES.map((r) => (
              <Button
                key={r.key}
                size="sm"
                variant={range === r.key ? "default" : "outline"}
                onClick={() => setRange(r.key)}
                className={
                  range === r.key
                    ? "bg-gold-gradient text-black hover:opacity-90"
                    : "border-gold/30 text-gold hover:bg-gold/10"
                }
              >
                {t.charts[r.labelKey]}
              </Button>
            ))}
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="rounded-lg bg-black/30 border border-gold/10 p-3">
              <p className="text-[10px] text-muted-foreground">
                {locale === "ar" ? "الأدنى" : "Low"}
              </p>
              <p className="text-sm font-bold tabular-nums">
                {min.toLocaleString(locale === "ar" ? "ar-EG" : "en-US", { maximumFractionDigits: 0 })} ج.م
              </p>
            </div>
            <div className="rounded-lg bg-black/30 border border-gold/10 p-3">
              <p className="text-[10px] text-muted-foreground">
                {locale === "ar" ? "الأعلى" : "High"}
              </p>
              <p className="text-sm font-bold tabular-nums">
                {max.toLocaleString(locale === "ar" ? "ar-EG" : "en-US", { maximumFractionDigits: 0 })} ج.م
              </p>
            </div>
            <div className="rounded-lg bg-black/30 border border-gold/10 p-3">
              <p className="text-[10px] text-muted-foreground">
                {locale === "ar" ? "التغير" : "Change"}
              </p>
              <p
                className={
                  "text-sm font-bold tabular-nums " +
                  (change > 0 ? "text-green-500" : change < 0 ? "text-red-500" : "")
                }
              >
                {change > 0 ? "+" : ""}
                {change.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Chart */}
          {loading ? (
            <Skeleton className="h-[300px] w-full rounded-lg bg-gold/5" />
          ) : chartData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
              {locale === "ar" ? "لا توجد بيانات كافية بعد" : "Not enough data yet"}
            </div>
          ) : (
            <div className="h-[300px] sm:h-[400px]" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="gold-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFD700" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#FFD700" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,215,0,0.06)" />
                  <XAxis
                    dataKey="time"
                    stroke="rgba(255,255,255,0.4)"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.4)"
                    fontSize={11}
                    tickLine={false}
                    domain={["auto", "auto"]}
                    width={70}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10,10,10,0.95)",
                      border: "1px solid rgba(255,215,0,0.3)",
                      borderRadius: "12px",
                      color: "#FFD700",
                    }}
                    labelStyle={{ color: "rgba(255,255,255,0.7)" }}
                    formatter={(v: any) => [`${Number(v).toLocaleString()} ج.م`, t.home.sell]}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#FFD700"
                    strokeWidth={2}
                    fill="url(#gold-grad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
