import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 60;

/**
 * GET /api/jsonld/prices
 * Returns Schema.org JSON-LD for the homepage prices.
 * Used by search engines to display rich snippets.
 */
export async function GET() {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("price_current")
      .select("item_key, label_ar, label_en, karat, weight_grams, buy_price_egp, sell_price_egp, last_updated")
      .order("item_key");

    const items = (data || []).map((r: any) => {
      const label = r.label_en || r.label_ar;
      const url = `https://gold_elsadeq.vercel.app/${
        r.item_key.startsWith("bar_") ? "bars" : r.item_key.startsWith("gold_") ? "gold" : "coins"
      }`;
      return {
        "@type": "Product",
        name: label,
        category: "Gold",
        offers: {
          "@type": "Offer",
          priceCurrency: "EGP",
          price: Number(r.sell_price_egp).toFixed(2),
          availability: "https://schema.org/InStock",
          url,
          priceValidUntil: new Date(Date.now() + 86400000).toISOString(),
          seller: {
            "@type": "Organization",
            name: "ELSADEQ",
          },
        },
      };
    });

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "ELSADEQ Gold Prices",
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item,
      })),
    };

    return new Response(JSON.stringify(jsonLd), {
      headers: {
        "Content-Type": "application/ld+json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
