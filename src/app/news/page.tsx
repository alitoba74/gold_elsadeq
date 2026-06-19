"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useLocaleState } from "@/components/elsadeq/locale-state";
import { getDict } from "@/lib/i18n/dictionaries";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Newspaper, ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Breadcrumbs } from "@/components/elsadeq/breadcrumbs";

interface NewsItem {
  id: string;
  title_ar: string | null;
  title_en: string | null;
  summary_ar: string | null;
  summary_en: string | null;
  image_url: string | null;
  source_url: string | null;
  source_name: string | null;
  published_at: string;
}

export default function NewsPage() {
  const supabase = createClient();
  const { locale } = useLocaleState();
  const t = getDict(locale);
  const [items, setItems] = React.useState<NewsItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    supabase
      .from("news_articles")
      .select("id, title_ar, title_en, summary_ar, summary_en, image_url, source_url, source_name, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setItems((data as NewsItem[]) || []);
        setLoading(false);
      });
  }, [supabase]);

  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <div className="mx-auto max-w-5xl px-3 sm:px-4 lg:px-6 py-6 pb-24 lg:pb-12">
      <Breadcrumbs items={[{ label: t.nav.home, href: "/" }, { label: t.nav.news }]} />
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-gradient font-display flex items-center gap-2">
          <Newspaper className="h-6 w-6 text-gold" />
          {t.news.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.news.subtitle}</p>
      </header>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl bg-gold/5" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="glass-card gold-glow">
          <CardContent className="py-16 px-6 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10 text-gold mb-4">
              <Newspaper className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold mb-2">
              {locale === "ar" ? "لا توجد أخبار حالياً" : "No news yet"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed mb-4">
              {locale === "ar"
                ? "يقوم النظام بجمع الأخبار تلقائياً من مصادر موثوقة كل 30 دقيقة. عُد قريباً لقراءة آخر الأخبار."
                : "Our system fetches news from trusted sources every 30 minutes. Check back soon for the latest news."}
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
              <span className="inline-block h-2 w-2 rounded-full bg-gold live-pulse" />
              {locale === "ar" ? "التحديث التلقائي مُفعّل" : "Auto-update is enabled"}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((n) => {
            const title = locale === "ar" ? n.title_ar : n.title_en || n.title_ar;
            const summary = locale === "ar" ? n.summary_ar : n.summary_en || n.summary_ar;
            return (
              <Card key={n.id} className="glass-card gold-glow overflow-hidden">
                {n.image_url && (
                  <div className="aspect-video bg-muted overflow-hidden relative">
                    <Image
                      src={n.image_url}
                      alt={title || ""}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    {n.source_name && <span className="font-medium text-gold">{n.source_name}</span>}
                    <span>·</span>
                    <span>
                      {new Date(n.published_at).toLocaleDateString(
                        locale === "ar" ? "ar-EG" : "en-US",
                        { day: "numeric", month: "short", year: "numeric" },
                      )}
                    </span>
                  </div>
                  <h3 className="text-base font-bold leading-snug line-clamp-2">
                    {title}
                  </h3>
                </CardHeader>
                <CardContent className="pt-0">
                  {summary && (
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {summary}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    {n.source_url ? (
                      <a
                        href={n.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-gold hover:underline"
                      >
                        {t.news.readMore}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span />
                    )}
                    <Link
                      href={`/news/${n.id}`}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-gold"
                    >
                      {t.news.readMore}
                      <Arrow className="h-3 w-3 rtl-flip" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
