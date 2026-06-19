"use client";

import * as React from "react";
import { Mail, Send, MessageCircle, Phone } from "lucide-react";
import { useLocaleState } from "@/components/elsadeq/locale-state";
import { getDict } from "@/lib/i18n/dictionaries";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ContactPage() {
  const { locale } = useLocaleState();
  const t = getDict(locale);
  const [sending, setSending] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", email: "", message: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(locale === "ar" ? "يرجى ملء جميع الحقول" : "Please fill all fields");
      return;
    }
    setSending(true);
    try {
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (resp.ok) {
        toast.success(t.contact.sent);
        setForm({ name: "", email: "", message: "" });
      } else {
        toast.error(t.common.error);
      }
    } catch {
      toast.error(t.common.error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-3 sm:px-4 lg:px-6 py-6 pb-24 lg:pb-12">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-gradient font-display">
          {t.contact.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.contact.subtitle}</p>
      </header>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-4">
        {/* Contact methods */}
        <div className="space-y-3">
          <a
            href="mailto:alielsadeq4@gmail.com"
            className="block rounded-2xl p-4 glass-card gold-glow"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold mb-2">
              <Mail className="h-5 w-5" />
            </div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm font-medium break-all">alielsadeq4@gmail.com</p>
          </a>

          <a
            href="https://wa.me/"
            target="_blank"
            rel="noreferrer"
            className="block rounded-2xl p-4 glass-card gold-glow"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-500 mb-2">
              <MessageCircle className="h-5 w-5" />
            </div>
            <p className="text-xs text-muted-foreground">WhatsApp</p>
            <p className="text-sm font-medium">+20 100 000 0000</p>
          </a>

          <a
            href="https://t.me/"
            target="_blank"
            rel="noreferrer"
            className="block rounded-2xl p-4 glass-card gold-glow"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 mb-2">
              <Send className="h-5 w-5" />
            </div>
            <p className="text-xs text-muted-foreground">Telegram</p>
            <p className="text-sm font-medium">@elsadeq</p>
          </a>
        </div>

        {/* Form */}
        <Card className="glass-card gold-glow">
          <CardContent className="p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">{t.contact.name}</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t.contact.name}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">{t.contact.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">{t.contact.message}</Label>
                <Textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder={t.contact.message}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-gold-gradient text-black hover:opacity-90 font-bold"
              >
                {sending ? t.common.loading : t.contact.send}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
