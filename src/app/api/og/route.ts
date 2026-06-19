import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * GET /api/og?title=...&subtitle=...
 * Generates a dynamic OG image as SVG for social media sharing.
 * Falls back to ELSADEQ brand OG if no params.
 *
 * Note: We use SVG (not ImageResponse) to avoid heavy dependencies and keep it fast.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const title = url.searchParams.get("title") || "ELSADEQ";
  const subtitle =
    url.searchParams.get("subtitle") || "أسعار الذهب والسبائك لحظة بلحظة";

  // Try to fetch live gold price for hero
  let goldPrice = "";
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("price_current")
      .select("sell_price_egp, last_updated")
      .eq("item_key", "gold_21k")
      .maybeSingle();
    if (data?.sell_price_egp) {
      const price = Number(data.sell_price_egp).toLocaleString("en-US", {
        maximumFractionDigits: 0,
      });
      goldPrice = `Gold 21K: ${price} EGP/g`;
    }
  } catch {}

  // Escape XML special characters in title/subtitle
  const esc = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  // Truncate title to fit
  const titleDisplay = title.length > 50 ? title.slice(0, 50) + "…" : title;
  const subDisplay = subtitle.length > 80 ? subtitle.slice(0, 80) + "…" : subtitle;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a0a"/>
      <stop offset="50%" stop-color="#1a1a1a"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#FFE875"/>
      <stop offset="50%" stop-color="#FFD700"/>
      <stop offset="100%" stop-color="#B8941F"/>
    </linearGradient>
    <radialGradient id="orb" cx="0.8" cy="0.5" r="0.4">
      <stop offset="0%" stop-color="#FFD700" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#FFD700" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#orb)"/>

  <!-- Logo box -->
  <rect x="80" y="80" width="80" height="80" rx="18" fill="url(#gold)"/>
  <rect x="84" y="84" width="72" height="72" rx="14" fill="rgba(0,0,0,0.2)"/>
  <text x="120" y="138" font-family="Arial, sans-serif" font-size="56" font-weight="900" fill="#0a0a0a" text-anchor="middle">E</text>

  <!-- Brand name -->
  <text x="180" y="138" font-family="Arial, sans-serif" font-size="38" font-weight="900" fill="url(#gold)">ELSADEQ</text>

  <!-- Main title -->
  <text x="80" y="280" font-family="Arial, sans-serif" font-size="72" font-weight="900" fill="#ffffff">${esc(titleDisplay)}</text>

  <!-- Subtitle -->
  <text x="80" y="340" font-family="Arial, sans-serif" font-size="32" fill="#aaaaaa">${esc(subDisplay)}</text>

  <!-- Live price (if available) -->
  ${goldPrice ? `
  <rect x="80" y="430" width="500" height="100" rx="20" fill="rgba(255,215,0,0.08)" stroke="rgba(255,215,0,0.3)" stroke-width="2"/>
  <circle cx="120" cy="480" r="8" fill="#22c55e"/>
  <text x="145" y="475" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#22c55e">LIVE</text>
  <text x="145" y="510" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="url(#gold)">${esc(goldPrice)}</text>
  ` : ""}

  <!-- Footer -->
  <text x="80" y="590" font-family="Arial, sans-serif" font-size="18" fill="#666666">gold_elsadeq.vercel.app</text>

  <!-- Decorative gold line -->
  <rect x="80" y="610" width="1040" height="2" fill="url(#gold)" opacity="0.4"/>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
