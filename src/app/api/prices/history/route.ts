import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const RANGES: Record<string, { interval: string; maxPoints: number }> = {
  "24h": { interval: "5 minutes", maxPoints: 60 },
  "7d": { interval: "1 hour", maxPoints: 84 },
  "30d": { interval: "6 hours", maxPoints: 120 },
  "1y": { interval: "1 day", maxPoints: 365 },
};

/**
 * GET /api/prices/history?item=gold_21k&range=24h
 * Returns time-series for the chart, with proper sampling.
 * Uses direct Supabase query (no RPC needed) then samples client-side.
 * Rate limited to 60 requests/minute per IP.
 */
export async function GET(req: NextRequest) {
  // Rate limit
  const limited = rateLimit(req, 60);
  if (limited) return limited;

  const item = req.nextUrl.searchParams.get("item") || "gold_21k";
  const range = (req.nextUrl.searchParams.get("range") || "24h") as keyof typeof RANGES;

  if (!RANGES[range]) {
    return NextResponse.json({ error: "invalid range" }, { status: 400 });
  }

  const cfg = RANGES[range];
  const admin = createAdminClient();

  // Calculate time window
  const now = new Date();
  const since = new Date(now.getTime());
  switch (range) {
    case "24h":
      since.setHours(since.getHours() - 24);
      break;
    case "7d":
      since.setDate(since.getDate() - 7);
      break;
    case "30d":
      since.setDate(since.getDate() - 30);
      break;
    case "1y":
      since.setFullYear(since.getFullYear() - 1);
      break;
  }

  // Query raw rows (limited)
  const { data, error } = await admin
    .from("price_history")
    .select("buy_price_egp, sell_price_egp, recorded_at")
    .eq("item_key", item)
    .gte("recorded_at", since.toISOString())
    .order("recorded_at", { ascending: true })
    .limit(5000);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = data || [];

  // Sample down to maxPoints using bucket averaging
  const sampled = sampleDown(rows, cfg.maxPoints);

  return NextResponse.json({
    data: sampled.map((r) => ({
      recordedAt: r.recorded_at,
      price: Number(r.buy_price_egp),
    })),
    count: sampled.length,
    range,
    item,
  });
}

interface RawRow {
  buy_price_egp: number | string;
  sell_price_egp: number | string;
  recorded_at: string;
}

/**
 * Sample down rows to maxPoints using time-bucket averaging.
 */
function sampleDown(rows: RawRow[], maxPoints: number): RawRow[] {
  if (rows.length === 0) return [];
  if (rows.length <= maxPoints) return rows;

  const step = Math.ceil(rows.length / maxPoints);
  const buckets: RawRow[][] = [];

  for (let i = 0; i < rows.length; i += step) {
    buckets.push(rows.slice(i, i + step));
  }

  return buckets.map((bucket) => {
    if (bucket.length === 1) return bucket[0];
    const avgBuy =
      bucket.reduce((sum, r) => sum + Number(r.buy_price_egp), 0) / bucket.length;
    const avgSell =
      bucket.reduce((sum, r) => sum + Number(r.sell_price_egp), 0) / bucket.length;
    return {
      buy_price_egp: avgBuy,
      sell_price_egp: avgSell,
      recorded_at: bucket[Math.floor(bucket.length / 2)].recorded_at,
    };
  });
}
