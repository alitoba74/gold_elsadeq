import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const RANGES: Record<string, string> = {
  "24h": "24 hours",
  "7d": "7 days",
  "30d": "30 days",
  "1y": "365 days",
};

/**
 * GET /api/prices/history?item=gold_21k&range=24h
 * Returns time-series for the chart.
 */
export async function GET(req: NextRequest) {
  const item = req.nextUrl.searchParams.get("item") || "gold_21k";
  const range = (req.nextUrl.searchParams.get("range") || "24h") as keyof typeof RANGES;
  const interval = req.nextUrl.searchParams.get("interval") || "auto";

  if (!RANGES[range]) {
    return NextResponse.json({ error: "invalid range" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Determine sampling interval
  // For 24h: every record, for 7d: every 30 min, for 30d: every 4 hours, for 1y: every day
  let bucketSql = "";
  switch (range) {
    case "24h":
      bucketSql = "date_trunc('minute', recorded_at)";
      break;
    case "7d":
      bucketSql = "date_trunc('hour', recorded_at)";
      break;
    case "30d":
      bucketSql = "date_trunc('hour', recorded_at)";
      break;
    case "1y":
      bucketSql = "date_trunc('day', recorded_at)";
      break;
  }

  // Query using the bucket
  const { data, error } = await admin.rpc("exec_sql", {
    query_text: `
      SELECT
        ${bucketSql} AS bucket,
        AVG(buy_price_egp) AS avg_buy,
        AVG(sell_price_egp) AS avg_sell
      FROM public.price_history
      WHERE item_key = '${item.replace(/'/g, "''")}'
        AND recorded_at > now() - interval '${RANGES[range]}'
      GROUP BY bucket
      ORDER BY bucket ASC
      LIMIT 1000;
    `,
  }).single();

  // If RPC isn't available (no exec_sql function), fall back to direct query
  if (error) {
    // Fallback: just get raw rows
    const { data: raw, error: err2 } = await admin
      .from("price_history")
      .select("buy_price_egp, sell_price_egp, recorded_at")
      .eq("item_key", item)
      .order("recorded_at", { ascending: true })
      .limit(5000);

    if (err2) {
      return NextResponse.json({ error: err2.message }, { status: 500 });
    }

    // Sample down if too many
    const rows = raw || [];
    const sampled = sampleDown(rows, range);
    return NextResponse.json({
      data: sampled.map((r) => ({
        recordedAt: r.recorded_at,
        price: Number(r.buy_price_egp),
      })),
    });
  }

  return NextResponse.json({
    data: (data || []).map((r: any) => ({
      recordedAt: r.bucket,
      price: Number(r.avg_buy || 0),
    })),
  });
}

function sampleDown<T extends { recorded_at: string }>(rows: T[], range: string): T[] {
  if (rows.length === 0) return rows;
  const maxPoints = range === "24h" ? 60 : range === "7d" ? 84 : range === "30d" ? 120 : 365;
  if (rows.length <= maxPoints) return rows;
  const step = Math.ceil(rows.length / maxPoints);
  return rows.filter((_, i) => i % step === 0);
}
