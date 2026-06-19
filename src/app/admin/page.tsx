"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { useLocaleState } from "@/components/elsadeq/locale-state";
import { getDict } from "@/lib/i18n/dictionaries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Coins, Newspaper, Activity, RefreshCw, Database, Globe } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const supabase = createClient();
  const { locale } = useLocaleState();
  const t = getDict(locale);
  const [stats, setStats] = React.useState({
    users: 0,
    prices: 0,
    news: 0,
    refreshes: 0,
    lastRefresh: null as string | null,
  });
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const [usersR, pricesR, newsR, auditR] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("price_current").select("id", { count: "exact", head: true }),
        supabase.from("news_articles").select("id", { count: "exact", head: true }),
        supabase
          .from("audit_logs")
          .select("created_at")
          .eq("action", "price_refresh")
          .order("created_at", { ascending: false })
          .limit(1),
      ]);
      setStats({
        users: usersR.count || 0,
        prices: pricesR.count || 0,
        news: newsR.count || 0,
        refreshes: auditR.data?.length || 0,
        lastRefresh: auditR.data?.[0]?.created_at || null,
      });
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  React.useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const r = await fetch("/api/prices/refresh", { method: "POST" });
      if (r.ok) {
        toast.success(locale === "ar" ? "تم تحديث الأسعار" : "Prices refreshed");
        await load();
      } else {
        toast.error(t.common.error);
      }
    } catch {
      toast.error(t.common.error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gold-gradient font-display">
          {t.admin.dashboard}
        </h1>
        <Button
          onClick={onRefresh}
          disabled={refreshing}
          className="bg-gold-gradient text-black hover:opacity-90"
        >
          <RefreshCw className={"h-4 w-4 me-2 " + (refreshing ? "animate-spin" : "")} />
          {refreshing ? t.admin.refreshing : t.admin.refresh}
        </Button>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={Users}
          label={t.admin.users}
          value={stats.users}
          loading={loading}
        />
        <StatCard
          icon={Coins}
          label={t.admin.prices}
          value={stats.prices}
          loading={loading}
        />
        <StatCard
          icon={Newspaper}
          label={t.admin.news}
          value={stats.news}
          loading={loading}
        />
        <StatCard
          icon={Activity}
          label={locale === "ar" ? "عمليات التحديث" : "Refreshes"}
          value={stats.refreshes}
          loading={loading}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-3">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="h-4 w-4 text-gold" />
              {locale === "ar" ? "حالة النظام" : "System Status"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label={locale === "ar" ? "قاعدة البيانات" : "Database"} value="✓ Supabase" />
            <Row label={locale === "ar" ? "مصدر الأسعار" : "Price source"} value="✓ gold-api.com" />
            <Row label={locale === "ar" ? "مصدر العملات" : "FX source"} value="✓ open.er-api.com" />
            <Row
              label={locale === "ar" ? "آخر تحديث" : "Last refresh"}
              value={
                stats.lastRefresh
                  ? new Date(stats.lastRefresh).toLocaleString(locale === "ar" ? "ar-EG" : "en-US")
                  : "—"
              }
            />
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4 text-gold" />
              {locale === "ar" ? "روابط سريعة" : "Quick links"}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 text-sm">
            <a
              href="/admin/prices"
              className="rounded-lg px-3 py-2 bg-muted/50 hover:bg-gold/10 hover:text-gold"
            >
              {t.admin.prices}
            </a>
            <a
              href="/admin/overrides"
              className="rounded-lg px-3 py-2 bg-muted/50 hover:bg-gold/10 hover:text-gold"
            >
              {t.admin.overrides}
            </a>
            <a
              href="/admin/news"
              className="rounded-lg px-3 py-2 bg-muted/50 hover:bg-gold/10 hover:text-gold"
            >
              {t.admin.news}
            </a>
            <a
              href="/admin/announcements"
              className="rounded-lg px-3 py-2 bg-muted/50 hover:bg-gold/10 hover:text-gold"
            >
              {t.admin.announcements}
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  loading: boolean;
}) {
  return (
    <Card className="glass-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-gold tabular-nums mt-1">
              {loading ? "—" : value}
            </p>
          </div>
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}
