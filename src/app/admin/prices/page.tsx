"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { useLocaleState } from "@/components/elsadeq/locale-state";
import { getDict } from "@/lib/i18n/dictionaries";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, RefreshCw } from "lucide-react";

interface PriceRow {
  item_key: string;
  label_ar: string;
  label_en: string;
  buy_price_egp: number;
  sell_price_egp: number;
  source: string;
  last_updated: string;
}

export default function AdminPricesPage() {
  const supabase = createClient();
  const { locale } = useLocaleState();
  const t = getDict(locale);
  const [rows, setRows] = React.useState<PriceRow[]>([]);
  const [editing, setEditing] = React.useState<Record<string, { buy: string; sell: string }>>({});
  const [loading, setLoading] = React.useState(true);
  const [savingKey, setSavingKey] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("price_current")
      .select("item_key, label_ar, label_en, buy_price_egp, sell_price_egp, source, last_updated")
      .order("item_key");
    setRows((data as PriceRow[]) || []);
    setLoading(false);
  };

  React.useEffect(() => {
    load();
  }, []);

  const onEdit = (key: string, field: "buy" | "sell", value: string) => {
    setEditing((prev) => ({
      ...prev,
      [key]: {
        buy: prev[key]?.buy ?? "",
        sell: prev[key]?.sell ?? "",
        [field]: value,
      },
    }));
  };

  const saveRow = async (row: PriceRow) => {
    const edit = editing[row.item_key];
    if (!edit) return;
    setSavingKey(row.item_key);
    try {
      const newBuy = edit.buy ? Number(edit.buy) : row.buy_price_egp;
      const newSell = edit.sell ? Number(edit.sell) : row.sell_price_egp;
      const { error } = await supabase
        .from("price_current")
        .update({
          buy_price_egp: newBuy,
          sell_price_egp: newSell,
          source: "manual_edit",
          last_updated: new Date().toISOString(),
        })
        .eq("item_key", row.item_key);
      if (error) throw error;
      toast.success(locale === "ar" ? "تم الحفظ" : "Saved");
      setEditing((prev) => {
        const c = { ...prev };
        delete c[row.item_key];
        return c;
      });
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSavingKey(null);
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    try {
      const r = await fetch("/api/prices/refresh", { method: "POST" });
      if (r.ok) {
        toast.success(locale === "ar" ? "تم تحديث الأسعار من المصدر" : "Refreshed from upstream");
        await load();
      } else {
        toast.error(t.common.error);
      }
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gold-gradient font-display">
          {t.admin.prices}
        </h1>
        <Button
          onClick={refresh}
          disabled={refreshing}
          className="bg-gold-gradient text-black hover:opacity-90"
        >
          <RefreshCw className={"h-4 w-4 me-2 " + (refreshing ? "animate-spin" : "")} />
          {refreshing ? t.admin.refreshing : t.admin.refresh}
        </Button>
      </header>

      {loading ? (
        <div className="text-center py-10 text-sm text-muted-foreground">{t.common.loading}</div>
      ) : (
        <Card className="glass-card">
          <CardContent className="p-0">
            <div className="divide-y divide-gold/10">
              {rows.map((row) => {
                const edit = editing[row.item_key];
                return (
                  <div
                    key={row.item_key}
                    className="grid grid-cols-1 sm:grid-cols-[1fr_120px_120px_80px] gap-2 p-3 items-center"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {locale === "ar" ? row.label_ar : row.label_en}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {row.item_key} · {row.source}
                      </p>
                    </div>
                    <div>
                      <Label className="text-[10px]">{t.home.buy}</Label>
                      <Input
                        type="number"
                        defaultValue={row.buy_price_egp}
                        value={edit?.buy}
                        onChange={(e) => onEdit(row.item_key, "buy", e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px]">{t.home.sell}</Label>
                      <Input
                        type="number"
                        defaultValue={row.sell_price_egp}
                        value={edit?.sell}
                        onChange={(e) => onEdit(row.item_key, "sell", e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => saveRow(row)}
                      disabled={savingKey === row.item_key || !edit}
                      className="border-gold/30 text-gold hover:bg-gold/10"
                    >
                      <Save className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
