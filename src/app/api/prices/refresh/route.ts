import { NextRequest, NextResponse } from "next/server";
import { refreshPrices, getLatestRates } from "@/lib/gold/refresh";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * POST /api/prices/refresh
 * Trigger an upstream refresh + persist to DB.
 * Public (no auth) - we want every visitor to get fresh prices.
 * Rate limited to 30 requests/minute per IP to prevent abuse.
 */
export async function POST(req: NextRequest) {
  // Rate limit
  const limited = rateLimit(req, 30);
  if (limited) return limited;

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
