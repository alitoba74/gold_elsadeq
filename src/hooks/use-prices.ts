"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { refreshPricesViaApi, getLatestRatesViaApi } from "@/lib/gold/client-fetch";
import type { Currency } from "@/components/elsadeq/currency-toggle";
import { convertFromEgp, formatPrice, relativeTime } from "@/lib/gold/prices";

export interface PriceRow {
  itemKey: string;
  itemType: "gold" | "coin" | "bar";
  karat: number | null;
  weightGrams: number | null;
  labelAr: string;
  labelEn: string;
  buyPriceEgp: number;
  sellPriceEgp: number;
  prevBuyPriceEgp: number;
  prevSellPriceEgp: number;
  changePct: number;
  source: string;
  lastUpdated: string;
}

export interface Rates {
  EGP: number;
  SAR: number;
  AED: number;
  KWD: number;
  QAR: number;
}

interface UsePricesResult {
  prices: PriceRow[];
  rates: Rates;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastUpdated: string | null;
  fromCache: boolean;
}

/**
 * Fetch prices + refresh on mount, then return live state.
 * Uses API routes (server-side) to refresh from upstream.
 */
export function usePrices(): UsePricesResult {
  const supabase = createClient();
  const [prices, setPrices] = React.useState<PriceRow[]>([]);
  const [rates, setRates] = React.useState<Rates>({
    EGP: 48.5,
    SAR: 3.75,
    AED: 3.67,
    KWD: 0.31,
    QAR: 3.64,
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = React.useState<string | null>(null);
  const [fromCache, setFromCache] = React.useState(false);

  const loadFromDb = React.useCallback(async () => {
    const { data, error } = await supabase
      .from("price_current")
      .select("*")
      .order("item_key", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return [];

    return data.map((r: any) => ({
      itemKey: r.item_key,
      itemType: r.item_type,
      karat: r.karat,
      weightGrams: r.weight_grams ? Number(r.weight_grams) : null,
      labelAr: r.label_ar,
      labelEn: r.label_en,
      buyPriceEgp: Number(r.buy_price_egp),
      sellPriceEgp: Number(r.sell_price_egp),
      prevBuyPriceEgp: Number(r.prev_buy_price_egp || 0),
      prevSellPriceEgp: Number(r.prev_sell_price_egp || 0),
      changePct: Number(r.change_pct || 0),
      source: r.source,
      lastUpdated: r.last_updated,
    })) as PriceRow[];
  }, [supabase]);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Refresh upstream via API (server-side)
      const refreshResult = await refreshPricesViaApi();
      setFromCache(!!refreshResult?.fromCache);
      if (refreshResult?.rates) {
        setRates(refreshResult.rates as Rates);
      }
      // 2. Load fresh data from DB (RLS allows public read)
      const rows = await loadFromDb();
      setPrices(rows);
      if (rows.length > 0) {
        setLastUpdated(rows[0].lastUpdated);
      }
    } catch (e: any) {
      console.error("[usePrices] refresh error:", e);
      setError(e.message || "Failed to load prices");
      // Try to load cached
      try {
        const rows = await loadFromDb();
        if (rows.length > 0) {
          setPrices(rows);
          setLastUpdated(rows[0].lastUpdated);
          setFromCache(true);
        }
      } catch {}
    } finally {
      setLoading(false);
    }
  }, [loadFromDb]);

  // Initial load + refresh
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      // 1. Try DB first for instant paint
      try {
        const rows = await loadFromDb();
        if (mounted && rows.length > 0) {
          setPrices(rows);
          setLastUpdated(rows[0].lastUpdated);
          setLoading(false);
        }
      } catch {}

      // 2. Fetch latest rates
      try {
        const r = await getLatestRatesViaApi();
        if (mounted && r) setRates(r as Rates);
      } catch {}

      // 3. Refresh upstream (non-blocking)
      if (mounted) await refresh();
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { prices, rates, loading, error, refresh, lastUpdated, fromCache };
}

/**
 * Convert a price row to the user's selected currency.
 */
export function useConvertedPrice(
  row: PriceRow | null,
  currency: Currency,
  rates: Rates,
  locale: string,
): { buy: string; sell: string; buyRaw: number; sellRaw: number } {
  if (!row) return { buy: "—", sell: "—", buyRaw: 0, sellRaw: 0 };
  if (currency === "EGP") {
    return {
      buy: formatPrice(row.buyPriceEgp, "EGP", locale),
      sell: formatPrice(row.sellPriceEgp, "EGP", locale),
      buyRaw: row.buyPriceEgp,
      sellRaw: row.sellPriceEgp,
    };
  }
  const buy = convertFromEgp(row.buyPriceEgp, currency, rates);
  const sell = convertFromEgp(row.sellPriceEgp, currency, rates);
  return {
    buy: formatPrice(buy, currency, locale),
    sell: formatPrice(sell, currency, locale),
    buyRaw: buy,
    sellRaw: sell,
  };
}
