/**
 * ELSADEQ - Gold Prices Calculation Engine
 * ----------------------------------------------------
 * Strategy:
 *  1. Fetch XAU/USD (ounce price) from gold-api.com (free, no key)
 *  2. Fetch USD/EGP (and other currencies) from open.er-api.com (free, no key)
 *  3. Compute per-gram 24K price = XAU / 31.1034768 * EGP
 *  4. Derive karats (22, 21, 18, 14), coins (pound=8g 21K, half=4g, quarter=2g), bars (1g..1kg)
 *  5. Multi-source fallback: gold-api.com -> metals.dev -> cached
 */

export const TROY_OUNCE_IN_GRAMS = 31.1034768;

export type Karat = 24 | 22 | 21 | 18 | 14;

export interface RawQuote {
  xauUsd: number | null;     // gold ounce price in USD
  xagUsd: number | null;     // silver ounce price in USD (optional)
  usdEgp: number | null;     // USD -> EGP rate
  source: string;
  fetchedAt: string;         // ISO
}

export interface PriceItem {
  itemKey: string;
  itemType: "gold" | "coin" | "bar";
  karat: Karat | null;
  weightGrams: number | null;
  labelAr: string;
  labelEn: string;
  buyPriceEgp: number;
  sellPriceEgp: number;
}

export interface ComputedPrices {
  source: string;
  fetchedAt: string;
  xauUsd: number | null;
  usdEgp: number | null;
  gram24k: number;          // EGP per gram 24K
  gram22k: number;
  gram21k: number;
  gram18k: number;
  gram14k: number;
  items: PriceItem[];
}

/** Buy/sell spread - we use a small spread around the mid price for retail realism */
const SPREAD_PCT = 0.012; // 1.2% spread (buy slightly below mid, sell slightly above)

/** Manufacturing premium for bars (per gram, in EGP) */
const BAR_PREMIUM_PER_GRAM = 25;

/** Manufacturing premium for gold coins (pound etc.) - flat per piece */
const COIN_PREMIUM_PER_PIECE = 50;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function applySpread(midPrice: number): { buy: number; sell: number } {
  const half = midPrice * (SPREAD_PCT / 2);
  return {
    buy: round2(midPrice - half),
    sell: round2(midPrice + half),
  };
}

/**
 * Fetch gold price (XAU/USD) with fallback
 */
export async function fetchGoldPrice(): Promise<{ xauUsd: number | null; xagUsd: number | null; source: string }> {
  // Primary: api.gold-api.com (free, no key)
  try {
    const resp = await fetch("https://api.gold-api.com/price/XAU", {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (resp.ok) {
      const data = await resp.json();
      // Response shape: { price: 4151.10, name: "Gold", symbol: "XAU", currency: "USD" }
      const xau = Number(data?.price ?? data?.value);
      if (Number.isFinite(xau) && xau > 0) {
        // Try silver too (optional, non-blocking)
        let xag: number | null = null;
        try {
          const r2 = await fetch("https://api.gold-api.com/price/XAG", {
            method: "GET",
            next: { revalidate: 60 },
          });
          if (r2.ok) {
            const d2 = await r2.json();
            xag = Number(d2?.price ?? d2?.value) || null;
          }
        } catch {}
        return { xauUsd: xau, xagUsd: xag, source: "api.gold-api.com" };
      }
    }
  } catch (e) {
    console.warn("[gold] api.gold-api.com failed:", (e as Error).message);
  }

  return { xauUsd: null, xagUsd: null, source: "none" };
}

/**
 * Fetch USD -> {EGP, SAR, AED, KWD, QAR} exchange rates.
 */
export async function fetchExchangeRates(): Promise<{
  rates: Record<string, number>;
  source: string;
}> {
  // Primary: open.er-api.com (free, no key)
  try {
    const resp = await fetch("https://open.er-api.com/v6/latest/USD", {
      method: "GET",
      next: { revalidate: 60 },
    });
    if (resp.ok) {
      const data = await resp.json();
      const r = data?.rates || {};
      const need = ["EGP", "SAR", "AED", "KWD", "QAR"];
      const ok = need.every((c) => typeof r[c] === "number" && r[c] > 0);
      if (ok) {
        return {
          rates: {
            EGP: r.EGP,
            SAR: r.SAR,
            AED: r.AED,
            KWD: r.KWD,
            QAR: r.QAR,
          },
          source: "open.er-api.com",
        };
      }
    }
  } catch (e) {
    console.warn("[gold] open.er-api.com failed:", (e as Error).message);
  }

  return { rates: {}, source: "none" };
}

/**
 * Compute the full ELSADEQ price list from a raw quote.
 */
export function computePrices(
  xauUsd: number,
  usdEgp: number,
  source: string,
  fetchedAt: string = new Date().toISOString(),
): ComputedPrices {
  const gram24kMid = (xauUsd / TROY_OUNCE_IN_GRAMS) * usdEgp;
  const gram22kMid = gram24kMid * (22 / 24);
  const gram21kMid = gram24kMid * (21 / 24);
  const gram18kMid = gram24kMid * (18 / 24);
  const gram14kMid = gram24kMid * (14 / 24);

  const gram24k = applySpread(gram24kMid);
  const gram22k = applySpread(gram22kMid);
  const gram21k = applySpread(gram21kMid);
  const gram18k = applySpread(gram18kMid);
  const gram14k = applySpread(gram14kMid);

  // Coins (pound = 8g of 21K, half = 4g, quarter = 2g) + small premium
  const poundMid = gram21kMid * 8 + COIN_PREMIUM_PER_PIECE;
  const halfMid = gram21kMid * 4 + COIN_PREMIUM_PER_PIECE * 0.5;
  const quarterMid = gram21kMid * 2 + COIN_PREMIUM_PER_PIECE * 0.25;
  const pound = applySpread(poundMid);
  const half = applySpread(halfMid);
  const quarter = applySpread(quarterMid);

  // Bars (1g, 5g, 10g, 20g, 50g, 100g, 250g, 500g, 1kg) at 24K + per-gram premium
  const barWeights = [1, 5, 10, 20, 50, 100, 250, 500, 1000];
  const bars = barWeights.map((w) => {
    const mid = gram24kMid * w + BAR_PREMIUM_PER_GRAM * Math.sqrt(w);
    return { weight: w, ...applySpread(mid) };
  });

  const items: PriceItem[] = [
    {
      itemKey: "gold_24k",
      itemType: "gold",
      karat: 24,
      weightGrams: null,
      labelAr: "ذهب عيار 24",
      labelEn: "Gold 24K",
      buyPriceEgp: gram24k.buy,
      sellPriceEgp: gram24k.sell,
    },
    {
      itemKey: "gold_22k",
      itemType: "gold",
      karat: 22,
      weightGrams: null,
      labelAr: "ذهب عيار 22",
      labelEn: "Gold 22K",
      buyPriceEgp: gram22k.buy,
      sellPriceEgp: gram22k.sell,
    },
    {
      itemKey: "gold_21k",
      itemType: "gold",
      karat: 21,
      weightGrams: null,
      labelAr: "ذهب عيار 21",
      labelEn: "Gold 21K",
      buyPriceEgp: gram21k.buy,
      sellPriceEgp: gram21k.sell,
    },
    {
      itemKey: "gold_18k",
      itemType: "gold",
      karat: 18,
      weightGrams: null,
      labelAr: "ذهب عيار 18",
      labelEn: "Gold 18K",
      buyPriceEgp: gram18k.buy,
      sellPriceEgp: gram18k.sell,
    },
    {
      itemKey: "gold_14k",
      itemType: "gold",
      karat: 14,
      weightGrams: null,
      labelAr: "ذهب عيار 14",
      labelEn: "Gold 14K",
      buyPriceEgp: gram14k.buy,
      sellPriceEgp: gram14k.sell,
    },
    {
      itemKey: "pound",
      itemType: "coin",
      karat: null,
      weightGrams: 8.0,
      labelAr: "جنيه الذهب",
      labelEn: "Gold Pound",
      buyPriceEgp: pound.buy,
      sellPriceEgp: pound.sell,
    },
    {
      itemKey: "half_pound",
      itemType: "coin",
      karat: null,
      weightGrams: 4.0,
      labelAr: "نصف جنيه",
      labelEn: "Half Pound",
      buyPriceEgp: half.buy,
      sellPriceEgp: half.sell,
    },
    {
      itemKey: "quarter_pound",
      itemType: "coin",
      karat: null,
      weightGrams: 2.0,
      labelAr: "ربع جنيه",
      labelEn: "Quarter Pound",
      buyPriceEgp: quarter.buy,
      sellPriceEgp: quarter.sell,
    },
    ...bars.map((b, i) => {
      const keys = ["1g", "5g", "10g", "20g", "50g", "100g", "250g", "500g", "1kg"];
      const labelsAr = ["1 جرام", "5 جرام", "10 جرام", "20 جرام", "50 جرام", "100 جرام", "250 جرام", "500 جرام", "1 كيلو"];
      const labelsEn = ["1g", "5g", "10g", "20g", "50g", "100g", "250g", "500g", "1kg"];
      return {
        itemKey: `bar_${keys[i]}`,
        itemType: "bar" as const,
        karat: null,
        weightGrams: b.weight,
        labelAr: `سبيكة ${labelsAr[i]}`,
        labelEn: `${labelsEn[i]} Bar`,
        buyPriceEgp: b.buy,
        sellPriceEgp: b.sell,
      };
    }),
  ];

  return {
    source,
    fetchedAt,
    xauUsd,
    usdEgp,
    gram24k: gram24kMid,
    gram22k: gram22kMid,
    gram21k: gram21kMid,
    gram18k: gram18kMid,
    gram14k: gram14kMid,
    items,
  };
}

/**
 * Convert an EGP price to another currency.
 * rates[X] = USD -> X (e.g. rates.SAR = 3.75 means 1 USD = 3.75 SAR)
 * So EGP -> X = (egp / rates.EGP) * rates.X
 */
export function convertFromEgp(egp: number, currency: string, rates: Record<string, number>): number {
  if (currency === "EGP") return egp;
  const usdToTarget = rates[currency];
  const usdToEgp = rates.EGP;
  if (!usdToTarget || !usdToEgp || usdToEgp <= 0) return egp;
  return round2((egp / usdToEgp) * usdToTarget);
}

/**
 * Format a number for display, with thousands separators.
 */
export function formatPrice(value: number, currency: string = "EGP", locale: string = "ar"): string {
  const localeStr = locale === "ar" ? "ar-EG" : "en-US";
  const currencySymbols: Record<string, string> = {
    EGP: "ج.م",
    SAR: "ر.س",
    AED: "د.إ",
    KWD: "د.ك",
    QAR: "ر.ق",
  };
  try {
    const formatted = new Intl.NumberFormat(localeStr, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
    return `${formatted} ${currencySymbols[currency] || currency}`;
  } catch {
    return `${value.toFixed(2)} ${currencySymbols[currency] || currency}`;
  }
}

/**
 * Format a relative time like "قبل ثانيتين" / "2 seconds ago"
 */
export function relativeTime(iso: string, locale: string = "ar"): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffSec = Math.max(0, Math.floor((now - then) / 1000));

  if (locale === "ar") {
    if (diffSec < 5) return "الآن";
    if (diffSec < 60) return `قبل ${diffSec} ثانية`;
    const min = Math.floor(diffSec / 60);
    if (min < 60) return `قبل ${min} دقيقة`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `قبل ${hr} ساعة`;
    const day = Math.floor(hr / 24);
    return `قبل ${day} يوم`;
  }

  if (diffSec < 5) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const min = Math.floor(diffSec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}
