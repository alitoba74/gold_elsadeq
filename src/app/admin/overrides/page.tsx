"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { useLocaleState } from "@/components/elsadeq/locale-state";
import { getDict } from "@/lib/i18n/dictionaries";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { RefreshCw, Plus, Trash2 } from "lucide-react";

interface Override {
  id: string;
  item_key: string;
  buy_price_egp: number | null;
  sell_price_egp: number | null;
  note: string | null;
  active: boolean;
  created_at: string;
}

export default function AdminOverridesPage() {
  const supabase = createClient();
  const { locale } = useLocaleState();
  const t = getDict(locale);
  const [overrides, setOverrides] = React.useState<Override[]>([]);
  const [items, setItems] = React.useState<{ item_key: string; label_ar: string; label_en: string }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({
    item_key: "",
    buy_price_egp: "",
    sell_price_egp: "",
    note: "",
  });

  const load = async () => {
    setLoading(true);
    const [ov, it] = await Promise.all([
      supabase.from("manual_overrides").select("*").order("created_at", { ascending: false }),
      supabase.from("price_current").select("item_key, label_ar, label_en").order("item_key"),
    ]);
    setOverrides((ov.data as Override[]) || []);
    setItems((it.data as any[]) || []);
    setLoading(false);
  };

  React.useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!form.item_key) {
      toast.error(locale === "ar" ? "اختر عنصراً" : "Select an item");
      return;
    }
    const { error } = await supabase.from("manual_overrides").insert({
      item_key: form.item_key,
      buy_price_egp: form.buy_price_egp ? Number(form.buy_price_egp) : null,
      sell_price_egp: form.sell_price_egp ? Number(form.sell_price_egp) : null,
      note: form.note || null,
      active: true,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(locale === "ar" ? "تم الحفظ" : "Saved");
    setForm({ item_key: "", buy_price_egp: "", sell_price_egp: "", note: "" });
    setShowForm(false);
    load();
  };

  const toggle = async (id: string, active: boolean) => {
    await supabase.from("manual_overrides").update({ active }).eq("id", id);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("manual_overrides").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gold-gradient font-display">
          {t.admin.overrides}
        </h1>
        <Button
          onClick={() => setShowForm((v) => !v)}
          className="bg-gold-gradient text-black hover:opacity-90"
        >
          <Plus className="h-4 w-4 me-2" />
          {t.admin.addNew}
        </Button>
      </header>

      {showForm && (
        <Card className="glass-card">
          <CardContent className="p-4 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{locale === "ar" ? "العنصر" : "Item"}</Label>
                <select
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={form.item_key}
                  onChange={(e) => setForm({ ...form, item_key: e.target.value })}
                >
                  <option value="">—</option>
                  {items.map((it) => (
                    <option key={it.item_key} value={it.item_key}>
                      {locale === "ar" ? it.label_ar : it.label_en}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>{t.home.buy} (EGP)</Label>
                <Input
                  type="number"
                  value={form.buy_price_egp}
                  onChange={(e) => setForm({ ...form, buy_price_egp: e.target.value })}
                  placeholder="اتركه فارغاً لعدم التجاوز"
                />
              </div>
              <div className="space-y-1.5">
                <Label>{t.home.sell} (EGP)</Label>
                <Input
                  type="number"
                  value={form.sell_price_egp}
                  onChange={(e) => setForm({ ...form, sell_price_egp: e.target.value })}
                  placeholder="اتركه فارغاً لعدم التجاوز"
                />
              </div>
              <div className="space-y-1.5">
                <Label>{locale === "ar" ? "ملاحظة" : "Note"}</Label>
                <Input
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder={locale === "ar" ? "اختياري" : "Optional"}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={save} className="bg-gold-gradient text-black hover:opacity-90">
                {t.admin.save}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                {t.admin.cancel}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-10 text-sm text-muted-foreground">{t.common.loading}</div>
      ) : overrides.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {locale === "ar" ? "لا توجد تعديلات يدوية بعد" : "No overrides yet"}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {overrides.map((o) => (
            <Card key={o.id} className="glass-card">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold">{o.item_key}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.buy_price_egp != null && `${t.home.buy}: ${o.buy_price_egp} · `}
                    {o.sell_price_egp != null && `${t.home.sell}: ${o.sell_price_egp}`}
                    {o.note && ` · ${o.note}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={o.active}
                    onCheckedChange={(v) => toggle(o.id, v)}
                    aria-label="active"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(o.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
