"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calculator, LineChart, Sparkles, TrendingUp } from "lucide-react";
import { usePrices } from "@/hooks/use-prices";
import { useLocaleState } from "@/components/elsadeq/locale-state";
import { getDict } from "@/lib/i18n/dictionaries";
import { PriceCard } from "@/components/elsadeq/price-card";
import { PriceCardSkeleton } from "@/components/elsadeq/price-card-skeleton";
import { RefreshBar } from "@/components/elsadeq/refresh-bar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/elsadeq/logo";

export default function HomePage() {
  const { prices, rates, loading, refresh, lastUpdated, fromCache } = usePrices();
  const { locale } = useLocaleState();
  const t = getDict(locale);

  const gold21 = prices.find((p) => p.itemKey === "gold_21k");
  const gold24 = prices.find((p) => p.itemKey === "gold_24k");
  const gold18 = prices.find((p) => p.itemKey === "gold_18k");
  const pound = prices.find((p) => p.itemKey === "pound");
  const bar10g = prices.find((p) => p.itemKey === "bar_10g");
  const bar50g = prices.find((p) => p.itemKey === "bar_50g");

  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  // Build JSON-LD structured data for SEO
  const jsonLd = React.useMemo(() => {
    if (prices.length === 0) return null;
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "ELSADEQ Gold Prices",
      itemListElement: prices.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: locale === "ar" ? p.labelAr : p.labelEn,
          category: "Gold",
          offers: {
            "@type": "Offer",
            priceCurrency: "EGP",
            price: p.sellPriceEgp.toFixed(2),
            availability: "https://schema.org/InStock",
            url: `https://gold_elsadeq.vercel.app/${p.itemType === "bar" ? "bars" : p.itemType === "coin" ? "coins" : "gold"}`,
            seller: { "@type": "Organization", name: "ELSADEQ" },
          },
        },
      })),
    };
  }, [prices, locale]);

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-6 pb-24 lg:pb-12">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {/* Hero */}
      <section className="grid gap-4 lg:grid-cols-3 lg:gap-6 mb-8">
        <div className="lg:col-span-2 space-y-3">
          {loading && !gold21 ? (
            <PriceCardSkeleton variant="hero" />
          ) : gold21 ? (
            <PriceCard row={gold21} rates={rates} variant="hero" />
          ) : (
            <PriceCardSkeleton variant="hero" />
          )}
          <RefreshBar
            lastUpdated={lastUpdated}
            loading={loading}
            fromCache={fromCache}
            onRefresh={refresh}
          />
        </div>

        <aside className="rounded-3xl p-6 glass-card gold-glow flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gold mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              ELSADEQ
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gold-gradient font-display leading-tight">
              {t.home.heroTitle}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t.home.heroSubtitle}
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <Button asChild className="bg-gold-gradient text-black hover:opacity-90 font-bold">
              <Link href="/calculator" className="flex items-center justify-center gap-2">
                <Calculator className="h-4 w-4" />
                {t.home.calculatorCta}
                <Arrow className="h-4 w-4 rtl-flip" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-gold/30 text-gold hover:bg-gold/10"
            >
              <Link href="/charts" className="flex items-center justify-center gap-2">
                <LineChart className="h-4 w-4" />
                {t.home.chartsCta}
              </Link>
            </Button>
          </div>
        </aside>
      </section>

      {/* Live prices grid */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <TrendingUp className="h-5 w-5 text-gold" />
            {t.home.livePrices}
          </h2>
          <Link
            href="/gold"
            className="text-sm text-gold hover:underline flex items-center gap-1"
          >
            {t.home.viewAll}
            <Arrow className="h-3.5 w-3.5 rtl-flip" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {loading && prices.length === 0
            ? Array.from({ length: 6 }).map((_, i) => <PriceCardSkeleton key={i} />)
            : [gold24, gold21, gold18, pound, bar10g, bar50g]
                .filter(Boolean)
                .map((row) => (
                  <PriceCard key={row!.itemKey} row={row!} rates={rates} />
                ))}
        </div>
      </section>

      {/* Stats strip */}
      <section className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label={t.nav.gold} value={prices.filter((p) => p.itemType === "gold").length} suffix="K" />
        <StatCard label={t.nav.bars} value={prices.filter((p) => p.itemType === "bar").length} suffix="" />
        <StatCard label={t.nav.coins} value={prices.filter((p) => p.itemType === "coin").length} suffix="" />
        <StatCard label={t.common.currency} value={5} suffix="" />
      </section>

      {/* CTA strip */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CTACard
          href="/calculator"
          icon={Calculator}
          title={t.calculator.title}
          desc={t.calculator.subtitle}
        />
        <CTACard
          href="/converter"
          icon={TrendingUp}
          title={t.converter.title}
          desc={t.converter.subtitle}
        />
        <CTACard
          href="/charts"
          icon={LineChart}
          title={t.charts.title}
          desc={t.charts.subtitle}
        />
      </section>
    </div>
  );
}

function StatCard({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  return (
    <div className="rounded-xl p-4 glass-card text-center">
      <p className="text-2xl sm:text-3xl font-bold text-gold tabular-nums">
        {value}
        <span className="text-base">{suffix}</span>
      </p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function CTACard({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl p-5 glass-card gold-glow transition-all hover:translate-y-[-2px]"
    >
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold mb-3">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-bold mb-1 group-hover:text-gold transition-colors">
        {title}
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </Link>
  );
}
