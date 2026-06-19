"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, Target, Sparkles, ShieldCheck, TrendingUp, Heart } from "lucide-react";
import { useLocaleState } from "@/components/elsadeq/locale-state";
import { Breadcrumbs } from "@/components/elsadeq/breadcrumbs";
import { getDict } from "@/lib/i18n/dictionaries";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/elsadeq/logo";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const { locale } = useLocaleState();
  const t = getDict(locale);

  return (
    <div className="mx-auto max-w-4xl px-3 sm:px-4 lg:px-6 py-6 pb-24 lg:pb-12">
      <Breadcrumbs items={[{ label: t.nav.home, href: "/" }, { label: t.nav.about }]} />
      <header className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <Logo size="xl" showGlow />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient font-display">
          {t.about.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.about.subtitle}</p>
      </header>

      {/* Mission */}
      <Card className="glass-card gold-glow mb-6">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <Target className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">{t.about.missionTitle}</h2>
          </div>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
            {t.about.missionBody}
          </p>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Feature
          icon={TrendingUp}
          titleAr="أسعار حية"
          titleEn="Live prices"
          descAr="تحديث فوري عند كل زيارة"
          descEn="Refreshed on every visit"
          locale={locale}
        />
        <Feature
          icon={Sparkles}
          titleAr="حسابات دقيقة"
          titleEn="Precise calculations"
          descAr="لكل عيار ووزن وسبيكة"
          descEn="For every karat, weight and bar"
          locale={locale}
        />
        <Feature
          icon={ShieldCheck}
          titleAr="مجاني بالكامل"
          titleEn="100% free"
          descAr="بدون اشتراك أو إعلانات"
          descEn="No subscription, no ads"
          locale={locale}
        />
      </div>

      {/* Contact */}
      <Card className="glass-card gold-glow">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">{t.about.contactTitle}</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {locale === "ar"
              ? "نحن نسعد بتلقي استفساراتك واقتراحاتك. تواصل معنا عبر البريد الإلكتروني أو من صفحة التواصل."
              : "We'd love to hear your questions and suggestions. Reach us by email or via the contact page."}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
              <Link href="/contact">{t.nav.contact}</Link>
            </Button>
            <Button asChild className="bg-gold-gradient text-black hover:opacity-90">
              <a href="mailto:alielsadeq4@gmail.com">
                <Mail className="h-4 w-4 ml-2 rtl:mr-2 rtl:ml-0" />
                alielsadeq4@gmail.com
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
        <span>{t.footer.madeWith}</span>
        <Heart className="h-3 w-3 text-gold fill-gold" />
        <span>EG · 2026</span>
      </div>
    </div>
  );
}

function Feature({
  icon: Icon,
  titleAr,
  titleEn,
  descAr,
  descEn,
  locale,
}: {
  icon: React.ElementType;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  locale: string;
}) {
  return (
    <div className="rounded-2xl p-5 glass-card gold-glow text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold mb-3">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-bold mb-1">{locale === "ar" ? titleAr : titleEn}</h3>
      <p className="text-xs text-muted-foreground">{locale === "ar" ? descAr : descEn}</p>
    </div>
  );
}
