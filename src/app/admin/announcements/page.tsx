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
import { Plus, Trash2, Pencil } from "lucide-react";

interface Ann {
  id: string;
  title_ar: string | null;
  title_en: string | null;
  body_ar: string | null;
  body_en: string | null;
  cta_ar: string | null;
  cta_en: string | null;
  cta_url: string | null;
  bg_color: string | null;
  active: boolean;
}

export default function AdminAnnouncementsPage() {
  const supabase = createClient();
  const { locale } = useLocaleState();
  const t = getDict(locale);
  const [items, setItems] = React.useState<Ann[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editing, setEditing] = React.useState<Partial<Ann> | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as Ann[]) || []);
    setLoading(false);
  };

  React.useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing) return;
    if (editing.id) {
      const { error } = await supabase.from("announcements").update(editing).eq("id", editing.id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("announcements").insert(editing);
      if (error) return toast.error(error.message);
    }
    toast.success(locale === "ar" ? "تم الحفظ" : "Saved");
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("announcements").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gold-gradient font-display">
          {t.admin.announcements}
        </h1>
        <Button
          onClick={() =>
            setEditing({
              title_ar: "",
              title_en: "",
              body_ar: "",
              body_en: "",
              cta_ar: "",
              cta_en: "",
              cta_url: "",
              bg_color: "#D4AF37",
              active: true,
            })
          }
          className="bg-gold-gradient text-black hover:opacity-90"
        >
          <Plus className="h-4 w-4 me-2" />
          {t.admin.addNew}
        </Button>
      </header>

      {editing && (
        <Card className="glass-card">
          <CardContent className="p-4 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{locale === "ar" ? "عنوان (عربي)" : "Title (AR)"}</Label>
                <Input
                  value={editing.title_ar || ""}
                  onChange={(e) => setEditing({ ...editing, title_ar: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{locale === "ar" ? "عنوان (إنجليزي)" : "Title (EN)"}</Label>
                <Input
                  value={editing.title_en || ""}
                  onChange={(e) => setEditing({ ...editing, title_en: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{locale === "ar" ? "نص (عربي)" : "Body (AR)"}</Label>
                <Input
                  value={editing.body_ar || ""}
                  onChange={(e) => setEditing({ ...editing, body_ar: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{locale === "ar" ? "نص (إنجليزي)" : "Body (EN)"}</Label>
                <Input
                  value={editing.body_en || ""}
                  onChange={(e) => setEditing({ ...editing, body_en: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{locale === "ar" ? "زر (عربي)" : "CTA (AR)"}</Label>
                <Input
                  value={editing.cta_ar || ""}
                  onChange={(e) => setEditing({ ...editing, cta_ar: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{locale === "ar" ? "زر (إنجليزي)" : "CTA (EN)"}</Label>
                <Input
                  value={editing.cta_en || ""}
                  onChange={(e) => setEditing({ ...editing, cta_en: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>URL</Label>
                <Input
                  value={editing.cta_url || ""}
                  onChange={(e) => setEditing({ ...editing, cta_url: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>BG Color</Label>
                <Input
                  value={editing.bg_color || ""}
                  onChange={(e) => setEditing({ ...editing, bg_color: e.target.value })}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Switch
                checked={!!editing.active}
                onCheckedChange={(v) => setEditing({ ...editing, active: v })}
              />
              {t.admin.active}
            </label>
            <div className="flex gap-2">
              <Button onClick={save} className="bg-gold-gradient text-black hover:opacity-90">
                {t.admin.save}
              </Button>
              <Button variant="outline" onClick={() => setEditing(null)}>
                {t.admin.cancel}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-10 text-sm text-muted-foreground">{t.common.loading}</div>
      ) : items.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            {locale === "ar" ? "لا توجد إعلانات بعد" : "No announcements yet"}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <Card key={n.id} className="glass-card">
              <CardContent className="p-3 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full flex-shrink-0"
                      style={{ background: n.bg_color || "#D4AF37" }}
                    />
                    <p className="font-medium text-sm truncate">
                      {locale === "ar" ? n.title_ar : n.title_en || n.title_ar}
                    </p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {!n.active && `· ${t.admin.inactive}`}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditing(n)}
                    className="h-8 w-8 text-gold hover:bg-gold/10"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(n.id)}
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
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
