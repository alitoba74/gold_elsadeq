import { NextResponse } from "next/server";
import { refreshPrices, getLatestRates } from "@/lib/gold/refresh";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * POST /api/prices/refresh
 * Trigger an upstream refresh + persist to DB.
 * Public (no auth) - we want every visitor to get fresh prices.
 */
export async function POST() {
  try {
    const result = await refreshPrices();
    const rates = await getLatestRates();
    return NextResponse.json({
      ok: result.ok,
      source: result.source,
      fetchedAt: result.fetchedAt,
      fromCache: result.fromCache,
      rates,
      itemsCount: result.items.length,
    });
  } catch (e: any) {
    console.error("[/api/prices/refresh] error:", e);
    return NextResponse.json(
      { ok: false, error: e.message || "Internal error" },
      { status: 500 },
    );
  }
}
