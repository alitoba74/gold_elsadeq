import { NextResponse } from "next/server";
import { refreshPrices } from "@/lib/gold/refresh";

export const dynamic = "force-dynamic";

/**
 * GET /api/cron/refresh
 * Vercel Cron calls this endpoint to refresh prices periodically.
 * Secured with CRON_SECRET bearer token if set.
 *
 * Add a cron entry to vercel.json pointing to this path.
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const expected = process.env.CRON_SECRET;
  if (expected) {
    if (authHeader !== `Bearer ${expected}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }
  try {
    const result = await refreshPrices();
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
