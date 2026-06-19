"use client";

import * as React from "react";
import { useLocaleState } from "@/components/elsadeq/locale-state";
import { Breadcrumbs } from "@/components/elsadeq/breadcrumbs";
import { getDict } from "@/lib/i18n/dictionaries";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  const { locale } = useLocaleState();
  const t = getDict(locale);

  const sections = locale === "ar" ? [
    {
      h: "1. قبول الشروط",
      p: "باستخدامك لموقع ELSADEQ، فإنك توافق على هذه الشروط والأحكام. إذا كنت لا توافق على أي بند منها، يرجى عدم استخدام الموقع.",
    },
    {
      h: "2. طبيعة الخدمة",
      p: "ELSADEQ منصة معلوماتية تعرض أسعار الذهب والسبائك والعملات الذهبية. لا نبيع الذهب ولا نتوسط في صفقات البيع والشراء. الأسعار المعروضة استرشادية فقط.",
    },
    {
      h: "3. دقة المعلومات",
      p: "نحن نسعى لضمان دقة الأسعار المعروضة، لكننا لا نضمن خلوها من الأخطاء. الأسعار تعتمد على مصادر خارجية قد تتأخر أو تتوقف. لا يتحمل الموقع أي مسؤولية عن قرارات اتخذتها بناءً على هذه الأسعار.",
    },
    {
      h: "4. استخدام الحساب",
      p: "عند إنشاء حساب، أنت مسؤول عن الحفاظ على سرية كلمة المرور وعن جميع الأنشطة التي تتم باستخدام حسابك. يجب أن تكون فوق 16 عاماً لإنشاء حساب.",
    },
    {
      h: "5. المحتوى الممنوع",
      p: "يحظر استخدام الموقع لأي أنشطة غير قانونية، أو نشر محتوى مسيء، أو محاولة الوصول غير المصرح به إلى الأنظمة، أو إساءة استخدام واجهة برمجة التطبيقات.",
    },
    {
      h: "6. الملكية الفكرية",
      p: "جميع العلامات التجارية والشعارات والمحتوى المنشور على الموقع ملك لـ ELSADEQ. لا يجوز نسخ المحتوى أو إعادة استخدامه دون إذن كتابي.",
    },
    {
      h: "7. حدود المسؤولية",
      p: "الموقع يقدم الخدمة كما هي بدون أي ضمانات. لا يتحمل الموقع أي مسؤولية عن أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام الموقع أو عدم القدرة على استخدامه.",
    },
    {
      h: "8. التعديلات على الشروط",
      p: "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. الاستمرار في استخدام الموقع بعد التعديلات يعتبر موافقة على الشروط المعدلة.",
    },
    {
      h: "9. القانون المطبق",
      p: "تخضع هذه الشروط للقوانين المصرية. أي نزاعات تنشأ عن استخدام الموقع تحل عبر المحاكم المصرية المختصة.",
    },
    {
      h: "10. التواصل",
      p: "لأي استفسارات حول الشروط والأحكام، تواصل معنا على alielsadeq4@gmail.com.",
    },
  ] : [
    {
      h: "1. Acceptance of Terms",
      p: "By using ELSADEQ, you agree to these terms and conditions. If you do not agree to any provision, please do not use the site.",
    },
    {
      h: "2. Nature of Service",
      p: "ELSADEQ is an informational platform that displays gold, bullion and gold coin prices. We do not sell gold or broker deals. Displayed prices are indicative only.",
    },
    {
      h: "3. Accuracy of Information",
      p: "We strive to ensure the accuracy of displayed prices, but we do not guarantee they are error-free. Prices rely on external sources that may be delayed or unavailable. The site is not liable for decisions made based on these prices.",
    },
    {
      h: "4. Account Use",
      p: "When you create an account, you are responsible for keeping your password confidential and for all activities under your account. You must be 16+ to create an account.",
    },
    {
      h: "5. Prohibited Content",
      p: "It is prohibited to use the site for illegal activities, post abusive content, attempt unauthorized access to systems, or abuse the API.",
    },
    {
      h: "6. Intellectual Property",
      p: "All trademarks, logos and content published on the site belong to ELSADEQ. Content may not be copied or reused without written permission.",
    },
    {
      h: "7. Limitation of Liability",
      p: "The site is provided as-is without any warranties. The site is not liable for any direct or indirect damages arising from using or being unable to use the site.",
    },
    {
      h: "8. Changes to Terms",
      p: "We reserve the right to modify these terms at any time. Continued use of the site after changes constitutes acceptance of the modified terms.",
    },
    {
      h: "9. Governing Law",
      p: "These terms are governed by Egyptian law. Any disputes arising from the site's use are resolved through the competent Egyptian courts.",
    },
    {
      h: "10. Contact",
      p: "For any questions about the terms and conditions, contact us at alielsadeq4@gmail.com.",
    },
  ];

  return (
    <Breadcrumbs items={[{ label: t.nav.home, href: "/" }, { label: t.nav.terms }]} />
      <div className="mx-auto max-w-3xl px-3 sm:px-4 lg:px-6 py-6 pb-24 lg:pb-12">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-gradient font-display">
          {t.terms.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.terms.subtitle}</p>
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
