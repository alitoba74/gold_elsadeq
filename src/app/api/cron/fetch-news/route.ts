import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * POST /api/cron/fetch-news
 * Fetches all active RSS feeds and inserts new articles into news_articles.
 * Called by Vercel Cron (e.g. every 30 min).
 */
export async function POST() {
  try {
    const admin = createAdminClient();
    const { data: feeds } = await admin
      .from("rss_feeds")
      .select("id, name, url, language")
      .eq("is_active", true);

    if (!feeds || feeds.length === 0) {
      return NextResponse.json({ ok: true, fetched: 0, reason: "no_feeds" });
    }

    let inserted = 0;
    let failed = 0;

    for (const feed of feeds) {
      try {
        const resp = await fetch(feed.url, {
          headers: { "User-Agent": "ELSADEQ/1.0 News Bot" },
          signal: AbortSignal.timeout(10000),
        });
        if (!resp.ok) {
          failed++;
          continue;
        }

        const xml = await resp.text();
        const items = parseRssXml(xml);

        const rows = items.slice(0, 10).map((it) => ({
          title_ar: feed.language === "ar" ? it.title : null,
          title_en: feed.language === "en" ? it.title : null,
          summary_ar: feed.language === "ar" ? it.summary : null,
          summary_en: feed.language === "en" ? it.summary : null,
          image_url: it.imageUrl,
          source_url: it.link,
          source_name: feed.name,
          rss_feed_url: feed.url,
          rss_feed_name: feed.name,
          content_html: it.content,
          is_published: true,
          published_at: it.pubDate || new Date().toISOString(),
        }));

        if (rows.length > 0) {
          const { data: insertedRows, error } = await admin
            .from("news_articles")
            .upsert(rows, { onConflict: "source_url", ignoreDuplicates: true })
            .select("id");
          if (!error && insertedRows) {
            inserted += insertedRows.length;
          }
        }

        await admin
          .from("rss_feeds")
          .update({
            last_fetched_at: new Date().toISOString(),
            last_status: "ok",
          })
          .eq("id", feed.id);
      } catch (e: any) {
        failed++;
        await admin
          .from("rss_feeds")
          .update({
            last_fetched_at: new Date().toISOString(),
            last_status: `error: ${e.message?.slice(0, 200)}`,
          })
          .eq("id", feed.id);
      }
    }

    return NextResponse.json({ ok: true, fetched: inserted, failed, total_feeds: feeds.length });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

/**
 * Simple RSS/Atom XML parser (no external deps).
 */
function parseRssXml(xml: string): {
  title: string;
  link: string;
  summary: string;
  content?: string;
  imageUrl?: string;
  pubDate?: string;
}[] {
  const items: any[] = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  const entryRegex = /<entry[^>]*>([\s\S]*?)<\/entry>/gi;

  const extract = (block: string, tag: string): string | null => {
    const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
    const m = block.match(re);
    return m ? m[1].trim() : null;
  };

  const extractAttr = (block: string, tag: string, attr: string): string | null => {
    const re = new RegExp(`<${tag}[^>]*${attr}=["']([^"']+)["'][^>]*>`, "i");
    const m = block.match(re);
    return m ? m[1] : null;
  };

  const stripTags = (s: string | null): string =>
    s ? s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, "").trim() : "";

  const processBlock = (block: string) => {
    const title = stripTags(extract(block, "title"));
    const link = stripTags(extract(block, "link")) || extractAttr(block, "link", "href") || "";
    const description = extract(block, "description");
    const content = extract(block, "content:encoded") || extract(block, "content");
    const pubDate = extract(block, "pubDate") || extract(block, "published") || extract(block, "updated");

    let imageUrl =
      extractAttr(block, "enclosure", "url") ||
      extractAttr(block, "media:content", "url") ||
      null;
    if (!imageUrl && description) {
      const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch) imageUrl = imgMatch[1];
    }

    if (title) {
      items.push({
        title,
        link,
        summary: stripTags(description).slice(0, 280),
        content: stripTags(content),
        imageUrl,
        pubDate: pubDate ? new Date(pubDate).toISOString() : undefined,
      });
    }
  };

  let m: RegExpExecArray | null;
  while ((m = itemRegex.exec(xml)) !== null) processBlock(m[1]);
  while ((m = entryRegex.exec(xml)) !== null) processBlock(m[1]);

  return items;
}
