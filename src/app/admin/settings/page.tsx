"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLocaleState } from "@/components/elsadeq/locale-state";
import { getDict } from "@/lib/i18n/dictionaries";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function AdminSettingsPage() {
  const supabase = createClient();
  const { locale } = useLocaleState();
  const t = getDict(locale);
  const [settings, setSettings] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        setSettings(data);
        setLoading(false);
      });
  }, [supabase]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({
        site_name_ar: settings.site_name_ar,
        site_name_en: settings.site_name_en,
        tagline_ar: settings.tagline_ar,
        tagline_en: settings.tagline_en,
        contact_email: settings.contact_email,
        whatsapp: settings.whatsapp,
        telegram: settings.telegram,
        disclaimer_ar: settings.disclaimer_ar,
        disclaimer_en: settings.disclaimer_en,
        maintenance_mode: settings.maintenance_mode,
      })
      .eq("id", 1);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(locale === "ar" ? "تم الحفظ" : "Saved");
    }
    setSaving(false);
  };

  if (loading || !settings) {
    return <div className="text-center py-10 text-sm text-muted-foreground">{t.common.loading}</div>;
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gold-gradient font-display">
          {t.admin.settings}
        </h1>
        <Button onClick={save} disabled={saving} className="bg-gold-gradient text-black hover:opacity-90">
          <Save className="h-4 w-4 me-2" />
          {saving ? t.common.loading : t.common.save}
        </Button>
      </header>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base">Branding</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Site name (AR)</Label>
            <Input
              value={settings.site_name_ar || ""}
              onChange={(e) => setSettings({ ...settings, site_name_ar: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Site name (EN)</Label>
            <Input
              value={settings.site_name_en || ""}
              onChange={(e) => setSettings({ ...settings, site_name_en: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Tagline (AR)</Label>
            <Input
              value={settings.tagline_ar || ""}
              onChange={(e) => setSettings({ ...settings, tagline_ar: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Tagline (EN)</Label>
            <Input
              value={settings.tagline_en || ""}
              onChange={(e) => setSettings({ ...settings, tagline_en: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base">Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              value={settings.contact_email || ""}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>WhatsApp</Label>
            <Input
              value={settings.whatsapp || ""}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              placeholder="+20 100 000 0000"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Telegram</Label>
            <Input
              value={settings.telegram || ""}
              onChange={(e) => setSettings({ ...settings, telegram: e.target.value })}
              placeholder="@elsadeq"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base">Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Disclaimer (AR)</Label>
            <Textarea
              rows={3}
              value={settings.disclaimer_ar || ""}
              onChange={(e) => setSettings({ ...settings, disclaimer_ar: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Disclaimer (EN)</Label>
            <Textarea
              rows={3}
              value={settings.disclaimer_en || ""}
              onChange={(e) => setSettings({ ...settings, disclaimer_en: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
