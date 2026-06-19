"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocaleState } from "@/components/elsadeq/locale-state";
import { getDict } from "@/lib/i18n/dictionaries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Currency, CURRENCIES, currencySymbols } from "@/components/elsadeq/currency-toggle";
import { locales, type Locale } from "@/lib/i18n/config";
import { toast } from "sonner";
import { LogOut, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/elsadeq/logo";

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();
  const { locale, setLocale, currency, setCurrency } = useLocaleState();
  const t = getDict(locale);
  const [user, setUser] = React.useState<any>(null);
  const [profile, setProfile] = React.useState<any>(null);
  const [fullName, setFullName] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setUser(user);
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          setProfile(data);
          setFullName(data?.full_name || "");
          if (data?.preferred_currency) setCurrency(data.preferred_currency);
          if (data?.preferred_language) setLocale(data.preferred_language);
        });
    });
  }, [supabase, router, setCurrency, setLocale]);

  const save = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          preferred_currency: currency,
          preferred_language: locale,
        })
        .eq("id", user.id);
      if (error) throw error;
      toast.success(locale === "ar" ? "تم الحفظ" : "Saved");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (!user) return null;

  const initials = user.email ? user.email.slice(0, 2).toUpperCase() : "";

  return (
    <div className="mx-auto max-w-2xl px-3 sm:px-4 lg:px-6 py-6 pb-24 lg:pb-12">
      <header className="mb-6 flex items-center gap-3">
        <Logo size="md" />
      </header>

      <Card className="glass-card gold-glow mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserIcon className="h-4 w-4 text-gold" />
            {t.nav.profile}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16 border-2 border-gold/30">
              <AvatarFallback className="bg-gold/10 text-gold font-bold text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold">{fullName || user.email}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">{t.auth.name}</Label>
            <Input
              id="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t.auth.name}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{t.common.language}</Label>
              <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locales.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l === "ar" ? "العربية" : "English"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t.common.currency}</Label>
              <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c} ({currencySymbols[c]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={save}
              disabled={saving}
              className="flex-1 bg-gold-gradient text-black hover:opacity-90"
            >
              {saving ? t.common.loading : t.common.save}
            </Button>
            <Button
              onClick={logout}
              variant="outline"
              className="border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 me-2" />
              {t.auth.signOut}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
