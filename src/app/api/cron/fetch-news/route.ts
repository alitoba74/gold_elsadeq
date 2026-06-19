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
          // Try to insert each row, count successes (ignore duplicates silently)
          for (const row of rows) {
            if (!row.source_url) {
              // No URL? skip (can't dedup)
              continue;
            }
            const { error: insErr } = await admin
              .from("news_articles")
              .insert(row);
            if (!insErr) {
              inserted++;
            } else if (insErr.code !== "23505") {
              // 23505 = unique violation (duplicate), ignore
              console.warn("[news] insert failed for", row.source_url, ":", insErr.message);
            }
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
    const pubDateRaw = extract(block, "pubDate") || extract(block, "published") || extract(block, "updated");

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
        pubDate: parseDate(pubDateRaw),
      });
    }
  };

  let m: RegExpExecArray | null;
  while ((m = itemRegex.exec(xml)) !== null) processBlock(m[1]);
  while ((m = entryRegex.exec(xml)) !== null) processBlock(m[1]);

  return items;
}

/**
 * Parse dates from multiple RSS feed formats:
 *  - RFC822: "Fri, 19 Jun 2026 12:45:52 +0300" (Al Jazeera, standard RSS)
 *  - ISO 8601: "2026-06-19T12:45:52Z" (Atom feeds)
 *  - MySQL: "2026-06-19 13:07:36" (Investing.com)
 *  - Unix timestamp (seconds or ms)
 */
function parseDate(raw: string | null): string | undefined {
  if (!raw) return undefined;

  const s = raw.trim();

  // Try native Date parse first (handles RFC822 + ISO)
  const native = new Date(s);
  if (!isNaN(native.getTime())) {
    return native.toISOString();
  }

  // Try MySQL format: "2026-06-19 13:07:36" -> assume UTC
  const mysqlMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
  if (mysqlMatch) {
    const [, y, mo, d, h, mi, se] = mysqlMatch;
    const dt = new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +se));
    if (!isNaN(dt.getTime())) return dt.toISOString();
  }

  // Try Unix timestamp
  if (/^\d{10}$/.test(s) || /^\d{13}$/.test(s)) {
    const ts = Number(s);
    const dt = new Date(ts);
    if (!isNaN(dt.getTime())) return dt.toISOString();
  }

  // Fallback: now
  return new Date().toISOString();
}
