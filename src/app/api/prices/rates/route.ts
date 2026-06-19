import { NextResponse } from "next/server";
import { getLatestRates } from "@/lib/gold/refresh";

export const dynamic = "force-dynamic";

export async function GET() {
  const rates = await getLatestRates();
  return NextResponse.json({ rates });
}
