"use client";

import * as React from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/elsadeq/breadcrumbs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLocaleState } from "@/components/elsadeq/locale-state";
import { getDict } from "@/lib/i18n/dictionaries";

const FAQS = {
  ar: [
    {
      q: "ما هو ELSADEQ؟",
      a: "ELSADEQ منصة لمتابعة أسعار الذهب والسبائك والعملات الذهبية في مصر والخليج. نعرض أسعار العيارات 24 و22 و21 و18 و14، والسبائك بأوزان من 1 جرام إلى 1 كيلو، والجنيه الذهب ونصفه وربه. نعتمد على مصادر بيانات موثوقة وحسابات دقيقة لكل عنصر.",
    },
    {
      q: "من أين تحصلون على الأسعار؟",
      a: "نجلب سعر الأونصة الدولارية (XAU/USD) من موقع gold-api.com، وسعر صرف الدولار مقابل الجنيه المصري من open.er-api.com. ثم نحسب سعر الجرام لكل عيار، والسبيكة، والجنيه الذهب بناءً على وزنه وعياره. كل ذلك يتم عند كل زيارة للموقع.",
    },
    {
      q: "كم مرة يتم تحديث الأسعار؟",
      a: "تتحدث الأسعار تلقائياً عند كل زيارة للموقع، لذا تحصل دائماً على أحدث الأسعار المتاحة من المصادر. كما يمكن النقر على زر التحديث في أي وقت لإعادة جلب الأسعار فوراً.",
    },
    {
      q: "هل الأسعار المعروضة دقيقة 100%؟",
      a: "الأسعار المعروضة استرشادية تعتمد على السعر العالمي للأونصة وسعر الصرف الحالي. قد تختلف الأسعار الفعلية في السوق المصري بين تجار الذهب بسبب هامش الربح والصناعة، لذا ننصح دائماً بالتأكد من السعر عند التاجر قبل الشراء أو البيع.",
    },
    {
      q: "ما الفرق بين العيارات؟",
      a: "العيار يشير إلى نسبة الذهب الخالص في السبيكة. عيار 24 يعني ذهب خالص 99.9%، عيار 21 يحتوي على 87.5% ذهب، عيار 18 يحتوي على 75%. كلما زاد العيار زادت قيمة الجرام وزاد لون الذهب اصفراراً.",
    },
    {
      q: "كيف أحسب قيمة ذهبي؟",
      a: "استخدم صفحة حاسبة الذهب: اختر العيار، أدخل الوزن بالجرام، وعدد القطع، فتحصل على القيمة التقديرية للشراء والبيع تلقائياً. تستطيع أيضاً تحويل القيمة إلى عملات أخرى عبر صفحة محول العملات.",
    },
    {
      q: "هل أحتاج إلى إنشاء حساب؟",
      a: "لا، يمكنك تصفح جميع الأسعار والاستفادة من كل الأدوات دون حساب. حساب المستخدم اختياري ويمنحك ميزات إضافية مثل حفظ العملة واللغة المفضلة عبر الأجهزة.",
    },
    {
      q: "هل تستخدمون ملفات تعريف الارتباط (Cookies)؟",
      a: "نعم، نستخدمها لتحسين تجربتك وتذكر تفضيلاتك مثل العملة واللغة والمظهر. لا نشارك أي بيانات مع أطراف ثالثة، ويمكنك الاطلاع على سياسة الخصوصية للتفاصيل الكاملة.",
    },
  ],
  en: [
    {
      q: "What is ELSADEQ?",
      a: "ELSADEQ is a platform for tracking gold, bullion and gold coin prices across Egypt and the Gulf. We display 24K, 22K, 21K, 18K and 14K prices, bars from 1g to 1kg, and the gold pound and its fractions. We rely on trusted data sources and precise calculations for every item.",
    },
    {
      q: "Where do you get the prices from?",
      a: "We fetch the XAU/USD ounce price from gold-api.com and the USD/EGP exchange rate from open.er-api.com. We then compute per-gram prices for each karat, the bar price, and the gold pound based on its weight and karat. All of this happens on every visit.",
    },
    {
      q: "How often are prices updated?",
      a: "Prices refresh automatically on every visit, so you always get the latest numbers. You can also tap the refresh button at any time to fetch prices again.",
    },
    {
      q: "Are the displayed prices 100% accurate?",
      a: "Prices are indicative and based on the international ounce price and current exchange rate. Actual market prices in Egypt may differ between gold dealers due to markup and fabrication fees, so always confirm with the dealer before buying or selling.",
    },
    {
      q: "What is the difference between karats?",
      a: "Karat indicates the purity of gold. 24K is 99.9% pure, 21K is 87.5% pure, 18K is 75% pure. The higher the karat, the higher the per-gram value and the more yellow the gold appears.",
    },
    {
      q: "How do I value my gold?",
      a: "Use the Gold Calculator page: pick the karat, enter the weight in grams, and the number of pieces, and you'll instantly see the estimated buy and sell value. You can also convert the value to other currencies on the Converter page.",
    },
    {
      q: "Do I need an account?",
      a: "No, you can browse all prices and use all tools without an account. A user account is optional and unlocks extras like syncing your preferred currency and language across devices.",
    },
    {
      q: "Do you use cookies?",
      a: "Yes, we use cookies to improve your experience and remember preferences like currency, language and theme. We don't share data with third parties - see our Privacy Policy for full details.",
    },
  ],
};

export default function FAQPage() {
  const { locale } = useLocaleState();
  const t = getDict(locale);
  const faqs = FAQS[locale];

  // Build FAQ JSON-LD for Rich Snippets
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl px-3 sm:px-4 lg:px-6 py-6 pb-24 lg:pb-12">
      <Breadcrumbs items={[{ label: t.nav.home, href: "/" }, { label: t.nav.faq }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-gradient font-display flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-gold" />
          {t.faq.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.faq.subtitle}</p>
      </header>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((f, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="glass-card gold-glow rounded-xl px-4 border-none"
          >
            <AccordionTrigger className="text-start hover:no-underline py-4">
              <span className="font-semibold text-base">{f.q}</span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
