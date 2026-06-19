"use client";

import * as React from "react";
import { useLocaleState } from "@/components/elsadeq/locale-state";
import { Breadcrumbs } from "@/components/elsadeq/breadcrumbs";
import { getDict } from "@/lib/i18n/dictionaries";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
  const { locale } = useLocaleState();
  const t = getDict(locale);

  const sections = locale === "ar" ? [
    {
      h: "مقدمة",
      p: "نحترم في ELSADEQ خصوصية مستخدمينا. توضح هذه السياسة كيفية جمع بياناتك واستخدامها وحمايتها عند استخدام موقعنا.",
    },
    {
      h: "البيانات التي نجمعها",
      p: "نجمع الحد الأدنى من البيانات اللازمة لتشغيل الموقع. عند إنشاء حساب، نخزن بريدك الإلكتروني واسمك (اختياري) وتفضيلاتك مثل العملة واللغة. عند تسجيل الدخول عبر جوجل، نحصل على بريدك الإلكتروني واسمك وصورة حسابك فقط.",
    },
    {
      h: "ملفات تعريف الارتباط (Cookies)",
      p: "نستخدم ملفات تعريف الارتباط لتذكر تفضيلاتك (العملة، اللغة، المظهر) والحفاظ على تسجيل دخولك. يمكن للمستخدم تعطيل ملفات تعريف الارتباط في المتصفح، لكن قد تتأثر بعض الميزات.",
    },
    {
      h: "مشاركة البيانات",
      p: "لا نشارك أي بيانات شخصية مع أطراف ثالثة. نستخدم خدمات خارجية مثل Supabase لتخزين البيانات وVercel للاستضافة، وهي خدمات تلتزم بمعايير الخصوصية العالمية.",
    },
    {
      h: "أمن البيانات",
      p: "نطبق إجراءات أمنية مناسبة لحماية بياناتك، بما في ذلك التشفير في النقل والتخزين. لا يمكن الوصول إلى بياناتك إلا من قبل أنت ومن لديه صلاحيات إدارية محدودة.",
    },
    {
      h: "حقوقك",
      p: "يمكنك في أي وقت طلب الاطلاع على بياناتك أو تصحيحها أو حذفها. للقيام بذلك، تواصل معنا على alielsadeq4@gmail.com. سيتم الرد على طلبك خلال 72 ساعة.",
    },
    {
      h: "تحديثات السياسة",
      p: "قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سننشر أي تغييرات على هذه الصفحة مع تحديث تاريخ آخر مراجعة في الأسفل.",
    },
    {
      h: "التواصل",
      p: "لأي استفسارات حول سياسة الخصوصية، تواصل معنا على alielsadeq4@gmail.com.",
    },
  ] : [
    {
      h: "Introduction",
      p: "At ELSADEQ we respect our users' privacy. This policy explains how we collect, use and protect your data when you use our site.",
    },
    {
      h: "Data We Collect",
      p: "We collect the minimum data needed to operate the site. When you create an account, we store your email, name (optional), and preferences such as currency and language. When you sign in with Google, we only access your email, name and profile picture.",
    },
    {
      h: "Cookies",
      p: "We use cookies to remember your preferences (currency, language, theme) and keep you logged in. Users can disable cookies in their browser, though some features may be affected.",
    },
    {
      h: "Data Sharing",
      p: "We do not share any personal data with third parties. We use external services like Supabase for storage and Vercel for hosting, which comply with global privacy standards.",
    },
    {
      h: "Data Security",
      p: "We apply appropriate security measures to protect your data, including encryption in transit and at rest. Your data is only accessible to you and to limited administrative roles.",
    },
    {
      h: "Your Rights",
      p: "You can request to view, correct or delete your data at any time. To do so, contact us at alielsadeq4@gmail.com. We respond to requests within 72 hours.",
    },
    {
      h: "Policy Updates",
      p: "We may update this privacy policy from time to time. We will post any changes on this page along with the last revision date below.",
    },
    {
      h: "Contact",
      p: "For any questions about this privacy policy, contact us at alielsadeq4@gmail.com.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-3 sm:px-4 lg:px-6 py-6 pb-24 lg:pb-12">
      <Breadcrumbs items={[{ label: t.nav.home, href: "/" }, { label: t.nav.privacy }]} />
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-gradient font-display">
          {t.privacy.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.privacy.subtitle}</p>
      </header>

      <Card className="glass-card">
        <CardContent className="p-6 space-y-5">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-base font-bold text-gold mb-1.5">{s.h}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.p}</p>
            </section>
          ))}
          <div className="pt-4 border-t border-gold/10 text-xs text-muted-foreground">
            {locale === "ar" ? "آخر تحديث: يونيو 2026" : "Last updated: June 2026"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
