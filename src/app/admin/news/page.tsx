"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { useLocaleState } from "@/components/elsadeq/locale-state";
import { getDict } from "@/lib/i18n/dictionaries";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, Pencil } from "lucide-react";

interface NewsItem {
  id: string;
  title_ar: string | null;
  title_en: string | null;
  summary_ar: string | null;
  summary_en: string | null;
  image_url: string | null;
  source_url: string | null;
  source_name: string | null;
  is_published: boolean;
  is_featured: boolean;
  published_at: string;
}

export default function AdminNewsPage() {
  const supabase = createClient();
  const { locale } = useLocaleState();
  const t = getDict(locale);
  const [items, setItems] = React.useState<NewsItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editing, setEditing] = React.useState<Partial<NewsItem> | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("news_articles")
      .select("*")
      .order("published_at", { ascending: false });
    setItems((data as NewsItem[]) || []);
    setLoading(false);
  };

  React.useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.title_ar && !editing.title_en) {
      toast.error(locale === "ar" ? "العنوان مطلوب" : "Title required");
      return;
    }
    const payload = {
      ...editing,
      published_at: editing.published_at || new Date().toISOString(),
    };
    if (editing.id) {
      const { error } = await supabase.from("news_articles").update(payload).eq("id", editing.id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("news_articles").insert(payload);
      if (error) return toast.error(error.message);
    }
    toast.success(locale === "ar" ? "تم الحفظ" : "Saved");
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("news_articles").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gold-gradient font-display">
          {t.admin.news}
        </h1>
        <Button
          onClick={() =>
            setEditing({
              title_ar: "",
              title_en: "",
              summary_ar: "",
              summary_en: "",
              image_url: "",
              source_url: "",
              source_name: "",
              is_published: true,
              is_featured: false,
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
                <Label>{locale === "ar" ? "ملخص (عربي)" : "Summary (AR)"}</Label>
                <Textarea
                  rows={2}
                  value={editing.summary_ar || ""}
                  onChange={(e) => setEditing({ ...editing, summary_ar: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{locale === "ar" ? "ملخص (إنجليزي)" : "Summary (EN)"}</Label>
                <Textarea
                  rows={2}
                  value={editing.summary_en || ""}
                  onChange={(e) => setEditing({ ...editing, summary_en: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{locale === "ar" ? "رابط الصورة" : "Image URL"}</Label>
                <Input
                  value={editing.image_url || ""}
                  onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>{locale === "ar" ? "اسم المصدر" : "Source name"}</Label>
                <Input
                  value={editing.source_name || ""}
                  onChange={(e) => setEditing({ ...editing, source_name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>{locale === "ar" ? "رابط المصدر" : "Source URL"}</Label>
                <Input
                  value={editing.source_url || ""}
                  onChange={(e) => setEditing({ ...editing, source_url: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={!!editing.is_published}
                  onCheckedChange={(v) => setEditing({ ...editing, is_published: v })}
                />
                {t.admin.active}
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={!!editing.is_featured}
                  onCheckedChange={(v) => setEditing({ ...editing, is_featured: v })}
                />
                {locale === "ar" ? "مميز" : "Featured"}
              </label>
            </div>
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
            {locale === "ar" ? "لا توجد أخبار بعد" : "No news yet"}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <Card key={n.id} className="glass-card">
              <CardContent className="p-3 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {locale === "ar" ? n.title_ar : n.title_en || n.title_ar}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {n.source_name} · {new Date(n.published_at).toLocaleDateString()}
                    {!n.is_published && ` · ${t.admin.inactive}`}
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
