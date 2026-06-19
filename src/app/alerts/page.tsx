"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Breadcrumbs } from "@/components/elsadeq/breadcrumbs";
import { useLocaleState } from "@/components/elsadeq/locale-state";
import { getDict } from "@/lib/i18n/dictionaries";
import { usePrices, type PriceRow } from "@/hooks/use-prices";
import { toast } from "sonner";
import { formatPrice } from "@/lib/gold/prices";

interface Alert {
  id: string;
  item_key: string;
  direction: "above" | "below";
  threshold: number;
  triggered: boolean;
  triggered_at: string | null;
  created_at: string;
}

export default function AlertsPage() {
  const supabase = createClient();
  const router = useRouter();
  const { locale } = useLocaleState();
  const t = getDict(locale);
  const { prices } = usePrices();

  const [user, setUser] = React.useState<any>(null);
  const [checked, setChecked] = React.useState(false);
  const [alerts, setAlerts] = React.useState<Alert[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [form, setForm] = React.useState({
    item_key: "gold_21k",
    direction: "above" as "above" | "below",
    threshold: "",
  });

  const loadAlerts = React.useCallback(async (userId: string) => {
    setLoading(true);
    const { data } = await supabase
      .from("user_alerts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setAlerts((data as Alert[]) || []);
    setLoading(false);
  }, [supabase]);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setChecked(true);
      if (!user) return;
      setUser(user);
      loadAlerts(user.id);
    });
  }, [supabase, loadAlerts]);

  const addAlert = async () => {
    if (!user) return;
    if (!form.threshold || Number(form.threshold) <= 0) {
      toast.error(locale === "ar" ? "أدخل سعراً صحيحاً" : "Enter a valid price");
      return;
    }
    const { error } = await supabase.from("user_alerts").insert({
      user_id: user.id,
      item_key: form.item_key,
      direction: form.direction,
      threshold: Number(form.threshold),
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(locale === "ar" ? "تم إضافة التنبيه" : "Alert added");
    setForm({ ...form, threshold: "" });
    loadAlerts(user.id);
  };

  const removeAlert = async (id: string) => {
    await supabase.from("user_alerts").delete().eq("id", id);
    if (user) loadAlerts(user.id);
  };

  const priceMap = React.useMemo(() => {
    const m = new Map<string, PriceRow>();
    prices.forEach((p) => m.set(p.itemKey, p));
    return m;
  }, [prices]);

  if (!checked) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center text-sm text-muted-foreground">
        {t.common.loading}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 pb-24 text-center">
        <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground mb-4">
          {locale === "ar" ? "سجّل الدخول لإدارة التنبيهات" : "Sign in to manage alerts"}
        </p>
        <Button
          onClick={() => router.push("/auth/login")}
          className="bg-gold-gradient text-black hover:opacity-90"
        >
          {t.nav.login}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-3 sm:px-4 lg:px-6 py-6 pb-24 lg:pb-12">
      <Breadcrumbs
        items={[{ label: t.nav.home, href: "/" }, { label: locale === "ar" ? "التنبيهات" : "Alerts" }]}
      />

      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-gradient font-display flex items-center gap-2">
          <Bell className="h-6 w-6 text-gold" />
          {locale === "ar" ? "تنبيهات الأسعار" : "Price Alerts"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {locale === "ar"
            ? "احفظ تنبيهاً وسنخبرك عندما يصل السعر للقيمة المحددة"
            : "Set an alert and we'll notify you when the price hits your target"}
        </p>
      </header>

      {/* Add alert form */}
      <Card className="glass-card gold-glow mb-5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4 text-gold" />
            {locale === "ar" ? "إضافة تنبيه جديد" : "Add new alert"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>{locale === "ar" ? "المنتج" : "Item"}</Label>
              <Select value={form.item_key} onValueChange={(v) => setForm({ ...form, item_key: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {prices.map((p) => (
                    <SelectItem key={p.itemKey} value={p.itemKey}>
                      {locale === "ar" ? p.labelAr : p.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{locale === "ar" ? "الاتجاه" : "Direction"}</Label>
              <Select
                value={form.direction}
                onValueChange={(v) => setForm({ ...form, direction: v as "above" | "below" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      {locale === "ar" ? "أعلى من" : "Above"}
                    </span>
                  </SelectItem>
                  <SelectItem value="below">
                    <span className="flex items-center gap-1">
                      <TrendingDown className="h-3 w-3 text-red-500" />
                      {locale === "ar" ? "أقل من" : "Below"}
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{locale === "ar" ? "السعر المستهدف (ج.م)" : "Target (EGP)"}</Label>
              <Input
                type="number"
                value={form.threshold}
                onChange={(e) => setForm({ ...form, threshold: e.target.value })}
                placeholder="6000"
              />
            </div>
          </div>
          <Button
            onClick={addAlert}
            className="bg-gold-gradient text-black hover:opacity-90"
          >
            <Plus className="h-4 w-4 me-2" />
            {t.admin.addNew}
          </Button>
        </CardContent>
      </Card>

      {/* Existing alerts */}
      {loading ? (
        <div className="text-center py-10 text-sm text-muted-foreground">{t.common.loading}</div>
      ) : alerts.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {locale === "ar" ? "لا توجد تنبيهات بعد" : "No alerts yet"}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {alerts.map((a) => {
            const price = priceMap.get(a.item_key);
            const label = price
              ? locale === "ar"
                ? price.labelAr
                : price.labelEn
              : a.item_key;
            const current = price?.buyPriceEgp || 0;
            const willTrigger =
              a.direction === "above" ? current >= a.threshold : current <= a.threshold;
            return (
              <Card key={a.id} className="glass-card">
                <CardContent className="p-4 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-sm">{label}</p>
                      {a.triggered && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
                          {locale === "ar" ? "تم التفعيل" : "Triggered"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {a.direction === "above" ? "↑" : "↓"}{" "}
                      {locale === "ar" ? "عند" : "at"}{" "}
                      <strong className="text-gold">
                        {formatPrice(a.threshold, "EGP", locale)}
                      </strong>
                      {current > 0 && (
                        <>
                          {" · "}
                          {locale === "ar" ? "السعر الحالي" : "Current"}:{" "}
                          {formatPrice(current, "EGP", locale)}
                          {willTrigger && !a.triggered && (
                            <span className="text-green-500 ms-1">
                              ({locale === "ar" ? "وصل للهدف!" : "hit target!"})
                            </span>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAlert(a.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
