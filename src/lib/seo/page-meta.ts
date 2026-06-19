import type { Metadata } from "next";

const BASE = "https://gold_elsadeq.vercel.app";

interface PageMeta {
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  path: string;
  keywords?: string[];
}

export const pageMeta: Record<string, PageMeta> = {
  gold: {
    titleAr: "أسعار الذهب اليوم في مصر",
    titleEn: "Gold Prices Today in Egypt",
    descAr: "أسعار الذهب الحية لجميع العيارات 24 و22 و21 و18 و14 بالجنيه المصري. تحديث فوري عند كل زيارة.",
    descEn: "Live gold prices for all karats 24, 22, 21, 18, 14 in EGP. Real-time updates on every visit.",
    path: "/gold",
    keywords: ["أسعار الذهب", "ذهب 21", "ذهب 24", "gold price egypt", "gold karat"],
  },
  bars: {
    titleAr: "أسعار سبائك الذهب",
    titleEn: "Gold Bars Prices",
    descAr: "أسعار سبائك الذهب عيار 24 بأوزان من 1 جرام إلى 1 كيلو جرام. تحديث فوري للأسعار.",
    descEn: "24K gold bars prices from 1g to 1kg. Live prices updated on every visit.",
    path: "/bars",
    keywords: ["سبيكة ذهب", "سبائك", "gold bar", "gold bullion"],
  },
  coins: {
    titleAr: "أسعار الجنيه والعملات الذهبية",
    titleEn: "Gold Coins & Pounds Prices",
    descAr: "أسعار الجنيه الذهب ونصف الجنيه والربع بالجنيه المصري. تحديث فوري.",
    descEn: "Gold pound, half pound and quarter pound prices in EGP. Live updates.",
    path: "/coins",
    keywords: ["جنيه الذهب", "نصف جنيه", "gold pound egypt"],
  },
  calculator: {
    titleAr: "حاسبة الذهب",
    titleEn: "Gold Calculator",
    descAr: "احسب قيمة أي وزن من الذهب بأي عيار فوراً. حاسبة ذهب دقيقة وسهلة الاستخدام.",
    descEn: "Instantly calculate the value of any gold weight at any karat. Accurate and easy gold calculator.",
    path: "/calculator",
    keywords: ["حاسبة الذهب", "حساب قيمة الذهب", "gold calculator"],
  },
  converter: {
    titleAr: "محول العملات",
    titleEn: "Currency Converter",
    descAr: "حوّل بين الجنيه المصري والريال السعودي والدرهم والدينار الكويتي والريال القطري.",
    descEn: "Convert between EGP, SAR, AED, KWD, QAR with live exchange rates.",
    path: "/converter",
    keywords: ["محول العملات", "تحويل جنيه", "currency converter egp sar"],
  },
  charts: {
    titleAr: "رسوم بيانية لأسعار الذهب",
    titleEn: "Gold Price Charts",
    descAr: "تتبع حركة أسعار الذهب عبر الزمن - 24 ساعة، 7 أيام، 30 يوم، سنة كاملة.",
    descEn: "Track gold price movement over time - 24h, 7d, 30d, 1y charts.",
    path: "/charts",
    keywords: ["رسم بياني ذهب", "gold price chart", "gold history"],
  },
  news: {
    titleAr: "أخبار الذهب والسوق",
    titleEn: "Gold Market News",
    descAr: "آخر أخبار الذهب والاقتصاد من مصادر موثوقة - الجزيرة، روسيا اليوم، Investing.",
    descEn: "Latest gold and economy news from trusted sources.",
    path: "/news",
    keywords: ["أخبار الذهب", "gold news", "economy news"],
  },
  faq: {
    titleAr: "الأسئلة الشائعة",
    titleEn: "Frequently Asked Questions",
    descAr: "إجابات للأسئلة الأكثر شيوعاً عن أسعار الذهب والسبائك والمعايير.",
    descEn: "Answers to the most common questions about gold prices, bars and standards.",
    path: "/faq",
    keywords: ["أسئلة الذهب", "gold faq"],
  },
  about: {
    titleAr: "من نحن - ELSADEQ",
    titleEn: "About ELSADEQ",
    descAr: "تعرّف على ELSADEQ - منصة أسعار الذهب والسبائك لحظة بلحظة في مصر والخليج.",
    descEn: "Learn about ELSADEQ - the live gold & bullion prices platform for Egypt and the Gulf.",
    path: "/about",
  },
  contact: {
    titleAr: "تواصل معنا",
    titleEn: "Contact Us",
    descAr: "تواصل مع فريق ELSADEQ لأي استفسارات أو اقتراحات حول أسعار الذهب.",
    descEn: "Get in touch with the ELSADEQ team for any inquiries or suggestions.",
    path: "/contact",
  },
  privacy: {
    titleAr: "سياسة الخصوصية",
    titleEn: "Privacy Policy",
    descAr: "كيف يحمي ELSADEQ بياناتك الشخصية ويحترم خصوصيتك.",
    descEn: "How ELSADEQ protects your personal data and respects your privacy.",
    path: "/privacy",
  },
  terms: {
    titleAr: "الشروط والأحكام",
    titleEn: "Terms & Conditions",
    descAr: "شروط استخدام موقع ELSADEQ لأسعار الذهب والسبائك.",
    descEn: "Terms of use for the ELSADEQ gold prices website.",
    path: "/terms",
  },
};

/**
 * Build Next.js Metadata object for a page key.
 */
export function buildPageMetadata(key: keyof typeof pageMeta): Metadata {
  const m = pageMeta[key];
  if (!m) return {};

  return {
    title: m.titleAr,
    description: m.descAr,
    alternates: {
      canonical: m.path,
    },
    keywords: m.keywords,
    openGraph: {
      title: `${m.titleAr} | ELSADEQ`,
      description: m.descAr,
      url: `${BASE}${m.path}`,
      type: "website",
      locale: "ar_EG",
      siteName: "ELSADEQ",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: m.titleAr }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${m.titleEn} | ELSADEQ`,
      description: m.descEn,
      images: ["/og-image.jpg"],
    },
  };
}
