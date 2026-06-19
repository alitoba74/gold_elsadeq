import { createAdminClient } from "@/lib/supabase/admin";
import {
  fetchGoldPrice,
  fetchExchangeRates,
  computePrices,
  type ComputedPrices,
  type PriceItem,
} from "./prices";

/**
 * Refresh prices from upstream + persist to Supabase.
 * Called from /api/cron/refresh (server-side, scheduled or on-demand).
 *
 * Flow:
 *   1. Fetch XAU/USD + exchange rates
 *   2. If success: compute full price list, persist to price_current + price_history
 *   3. If failure: leave price_current untouched (cached values stay)
 *   4. Return the computed snapshot (or last known from DB if fetch failed)
 */
export async function refreshPrices(): Promise<{
  ok: boolean;
  source: string;
  fetchedAt: string;
  items: PriceItem[];
  fromCache: boolean;
}> {
  const admin = createAdminClient();

  // 1. Fetch upstream
  const [gold, fx] = await Promise.all([fetchGoldPrice(), fetchExchangeRates()]);

  const fetchedAt = new Date().toISOString();

  if (gold.xauUsd && fx.rates.EGP) {
    const computed = computePrices(gold.xauUsd, fx.rates.EGP, gold.source, fetchedAt);

    // 2. Persist - upsert price_current with previous values
    // First fetch current values to set as prev_*
    const { data: existing } = await admin
      .from("price_current")
      .select("item_key, buy_price_egp, sell_price_egp");

    const prevMap = new Map<string, { buy: number; sell: number }>();
    (existing || []).forEach((r: any) => {
      prevMap.set(r.item_key, { buy: Number(r.buy_price_egp), sell: Number(r.sell_price_egp) });
    });

    // Build upsert rows
    const upsertRows = computed.items.map((it) => {
      const prev = prevMap.get(it.itemKey);
      const prevBuy = prev?.buy ?? 0;
      const prevSell = prev?.sell ?? 0;
      const change = prevBuy > 0 ? ((it.buyPriceEgp - prevBuy) / prevBuy) * 100 : 0;
      return {
        item_key: it.itemKey,
        item_type: it.itemType,
        karat: it.karat,
        weight_grams: it.weightGrams,
        label_ar: it.labelAr,
        label_en: it.labelEn,
        buy_price_egp: it.buyPriceEgp,
        sell_price_egp: it.sellPriceEgp,
        prev_buy_price_egp: prevBuy,
        prev_sell_price_egp: prevSell,
        change_pct: Math.round(change * 100) / 100,
        source: computed.source,
        last_updated: fetchedAt,
      };
    });

    // Upsert
    const { error: upErr } = await admin
      .from("price_current")
      .upsert(upsertRows, { onConflict: "item_key" });
    if (upErr) {
      console.error("[refresh] upsert price_current failed:", upErr.message);
    }

    // Insert history rows
    const histRows = computed.items.map((it) => ({
      item_key: it.itemKey,
      item_type: it.itemType,
      karat: it.karat,
      weight_grams: it.weightGrams,
      buy_price_egp: it.buyPriceEgp,
      sell_price_egp: it.sellPriceEgp,
      source: computed.source,
      recorded_at: fetchedAt,
    }));
    const { error: hErr } = await admin.from("price_history").insert(histRows);
    if (hErr) {
      console.error("[refresh] insert price_history failed:", hErr.message);
    }

    // Apply any active manual overrides
    await applyManualOverrides(admin, fetchedAt);

    // Update exchange rates cache (stored in site_settings? we use a dedicated table?)
    // For now, store fx rates in audit_logs as json for retrieval
    await admin.from("audit_logs").insert({
      action: "price_refresh",
      entity: "prices",
      details: {
        source: computed.source,
        xau_usd: computed.xauUsd,
        usd_egp: computed.usdEgp,
        rates: fx.rates,
        items_count: computed.items.length,
      },
    });

    return {
      ok: true,
      source: computed.source,
      fetchedAt,
      items: computed.items,
      fromCache: false,
    };
  }

  // 3. Fallback - return cached values from DB
  const { data: cached } = await admin
    .from("price_current")
    .select("*")
    .order("item_key", { ascending: true });

  const items: PriceItem[] = (cached || []).map((r: any) => ({
    itemKey: r.item_key,
    itemType: r.item_type,
    karat: r.karat,
    weightGrams: r.weight_grams ? Number(r.weight_grams) : null,
    labelAr: r.label_ar,
    labelEn: r.label_en,
    buyPriceEgp: Number(r.buy_price_egp),
    sellPriceEgp: Number(r.sell_price_egp),
  }));

  return {
    ok: false,
    source: "cache",
    fetchedAt: cached?.[0]?.last_updated || fetchedAt,
    items,
    fromCache: true,
  };
}

/**
 * Get the latest cached rates (EGP, SAR, AED, KWD, QAR) from the most recent audit log.
 */
export async function getLatestRates(): Promise<Record<string, number>> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("audit_logs")
    .select("details, created_at")
    .eq("action", "price_refresh")
    .order("created_at", { ascending: false })
    .limit(1);
  if (data && data.length > 0) {
    const r = (data[0].details as any)?.rates;
    if (r && r.EGP) return r;
  }
  // Fallback static rates (last known)
  return {
    EGP: 48.5,
    SAR: 3.75,
    AED: 3.67,
    KWD: 0.31,
    QAR: 3.64,
  };
}

/**
 * Apply active manual overrides (admin can set fixed prices for an item).
 */
async function applyManualOverrides(admin: ReturnType<typeof createAdminClient>, fetchedAt: string) {
  const { data: overrides } = await admin
    .from("manual_overrides")
    .select("*")
    .eq("active", true)
    .or(`expires_at.is.null,expires_at.gt.${fetchedAt}`);

  if (!overrides || overrides.length === 0) return;

  for (const o of overrides) {
    const update: any = { source: "manual_override", last_updated: fetchedAt };
    if (o.buy_price_egp != null) update.buy_price_egp = Number(o.buy_price_egp);
    if (o.sell_price_egp != null) update.sell_price_egp = Number(o.sell_price_egp);
    await admin
      .from("price_current")
      .update(update)
      .eq("item_key", o.item_key);
  }
}
