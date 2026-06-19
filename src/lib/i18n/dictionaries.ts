import type { Locale } from "./config";

export type Dict = {
  brand: { name: string; tagline: string };
  nav: {
    home: string;
    gold: string;
    bars: string;
    coins: string;
    calculator: string;
    converter: string;
    charts: string;
    news: string;
    faq: string;
    about: string;
    contact: string;
    privacy: string;
    terms: string;
    admin: string;
    login: string;
    logout: string;
    profile: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    livePrices: string;
    lastUpdate: string;
    buy: string;
    sell: string;
    change: string;
    viewAll: string;
    calculatorCta: string;
    chartsCta: string;
    liveNow: string;
    dataSource: string;
  };
  gold: {
    title: string;
    subtitle: string;
    perGram: string;
    perPiece: string;
    perBar: string;
  };
  bars: { title: string; subtitle: string };
  coins: { title: string; subtitle: string };
  calculator: {
    title: string;
    subtitle: string;
    karat: string;
    weight: string;
    weightUnit: string;
    result: string;
    buyValue: string;
    sellValue: string;
    useLivePrice: string;
    pieces: string;
    totalWeight: string;
  };
  converter: {
    title: string;
    subtitle: string;
    amount: string;
    from: string;
    to: string;
    result: string;
  };
  charts: {
    title: string;
    subtitle: string;
    range24h: string;
    range7d: string;
    range30d: string;
    range1y: string;
    selectItem: string;
    compareWith: string;
  };
  news: { title: string; subtitle: string; readMore: string; noNews: string };
  faq: { title: string; subtitle: string };
  about: { title: string; subtitle: string; missionTitle: string; missionBody: string; contactTitle: string };
  contact: { title: string; subtitle: string; name: string; email: string; message: string; send: string; sent: string };
  privacy: { title: string; subtitle: string; body: string };
  terms: { title: string; subtitle: string; body: string };
  admin: {
    title: string;
    dashboard: string;
    prices: string;
    overrides: string;
    news: string;
    announcements: string;
    users: string;
    settings: string;
    audit: string;
    refresh: string;
    refreshing: string;
    addNew: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    active: string;
    inactive: string;
  };
  auth: {
    signIn: string;
    signUp: string;
    signOut: string;
    email: string;
    password: string;
    name: string;
    forgotPassword: string;
    continueWithGoogle: string;
    noAccount: string;
    haveAccount: string;
  };
  footer: {
    disclaimer: string;
    rights: string;
    madeWith: string;
    quickLinks: string;
    legal: string;
    follow: string;
  };
  common: {
    loading: string;
    error: string;
    retry: string;
    save: string;
    cancel: string;
    confirm: string;
    delete: string;
    edit: string;
    close: string;
    copy: string;
    copied: string;
    share: string;
    shareWhatsapp: string;
    shareCopy: string;
    refresh: string;
    search: string;
    filter: string;
    all: string;
    yes: string;
    no: string;
    currency: string;
    language: string;
    theme: string;
    light: string;
    dark: string;
  };
};

export const dictionaries: Record<Locale, Dict> = {
  ar: {
    brand: {
      name: "ELSADEQ",
      tagline: "أسعار الذهب والسبائك لحظة بلحظة",
    },
    nav: {
      home: "الرئيسية",
      gold: "الذهب",
      bars: "السبائك",
      coins: "الجنيه والعملات",
      calculator: "حاسبة الذهب",
      converter: "محول العملات",
      charts: "الرسوم البيانية",
      news: "الأخبار",
      faq: "الأسئلة الشائعة",
      about: "من نحن",
      contact: "تواصل معنا",
      privacy: "سياسة الخصوصية",
      terms: "الشروط والأحكام",
      admin: "لوحة التحكم",
      login: "تسجيل الدخول",
      logout: "تسجيل الخروج",
      profile: "حسابي",
    },
    home: {
      heroTitle: "أسعار الذهب والسبائك",
      heroSubtitle: "تحديث فوري لأسعار الذهب والسبائك والعملات الذهبية عند كل زيارة",
      livePrices: "الأسعار الحية",
      lastUpdate: "آخر تحديث",
      buy: "شراء",
      sell: "بيع",
      change: "التغير",
      viewAll: "عرض الكل",
      calculatorCta: "احسب قيمة ذهبك",
      chartsCta: "شاهد الرسوم البيانية",
      liveNow: "مباشر الآن",
      dataSource: "المصدر",
    },
    gold: {
      title: "أسعار الذهب",
      subtitle: "أسعار الجرام بالجنيه المصري لكل العيارات",
      perGram: "الجرام",
      perPiece: "القطعة",
      perBar: "السبيكة",
    },
    bars: {
      title: "أسعار السبائك",
      subtitle: "سبائك ذهب 24 عيار بأوزان مختلفة",
    },
    coins: {
      title: "الجنيه والعملات الذهبية",
      subtitle: "أسعار الجنيه الذهب ونص الجنيه والربع",
    },
    calculator: {
      title: "حاسبة الذهب",
      subtitle: "احسب قيمة أي وزن من الذهب بأي عيار فوراً",
      karat: "العيار",
      weight: "الوزن",
      weightUnit: "جرام",
      result: "القيمة التقديرية",
      buyValue: "سعر الشراء",
      sellValue: "سعر البيع",
      useLivePrice: "استخدم السعر الحالي",
      pieces: "عدد القطع",
      totalWeight: "إجمالي الوزن",
    },
    converter: {
      title: "محول العملات",
      subtitle: "حوّل بين الجنيه المصري والعملات الخليجية الرئيسية",
      amount: "المبلغ",
      from: "من",
      to: "إلى",
      result: "النتيجة",
    },
    charts: {
      title: "الرسوم البيانية التاريخية",
      subtitle: "تتبع حركة أسعار الذهب عبر الزمن",
      range24h: "24 ساعة",
      range7d: "7 أيام",
      range30d: "30 يوم",
      range1y: "سنة",
      selectItem: "اختر المنتج",
      compareWith: "مقارنة بـ",
    },
    news: {
      title: "أخبار السوق",
      subtitle: "آخر أخبار الذهب والاقتصاد",
      readMore: "اقرأ المزيد",
      noNews: "لا توجد أخبار حالياً",
    },
    faq: { title: "الأسئلة الشائعة", subtitle: "إجابات للأسئلة الأكثر شيوعاً" },
    about: {
      title: "من نحن",
      subtitle: "تعرّف على ELSADEQ",
      missionTitle: "رسالتنا",
      missionBody:
        "نسعى في ELSADEQ لتوفير أسعار دقيقة وشفافة للذهب والسبائك والعملات الذهبية للمستخدمين في مصر والخليج. نعتمد على مصادر بيانات موثوقة وآلية حساب واضحة لكل عيار ووزن، مع تحديث فوري عند كل زيارة لضمان الحصول على أحدث الأسعار. لا نبيع الذهب ولا نتوسط في صفقات، بل نقدم خدمة معلوماتية مجانية بالكامل.",
      contactTitle: "تواصل معنا",
    },
    contact: {
      title: "تواصل معنا",
      subtitle: "نسعد بتلقي استفساراتك واقتراحاتك",
      name: "الاسم",
      email: "البريد الإلكتروني",
      message: "الرسالة",
      send: "إرسال",
      sent: "تم إرسال رسالتك بنجاح",
    },
    privacy: {
      title: "سياسة الخصوصية",
      subtitle: "كيف نتعامل مع بياناتك",
      body:
        "نحترم خصوصيتك في ELSADEQ. لا نخزن أي بيانات شخصية حسنة إلا ما تدخله طوعاً عند إنشاء حساب. نستخدم ملفات تعريف الارتباط (cookies) لتحسين تجربتك وتذكر تفضيلاتك مثل العملة واللغة. لا نشارك بياناتك مع أي طرف ثالث. جميع الأسعار المعروضة هي للاطلاع فقط وليست لغرض التداول أو الاستثمار.",
    },
    terms: {
      title: "الشروط والأحكام",
      subtitle: "شروط استخدام الموقع",
      body:
        "باستخدامك لموقع ELSADEQ فإنك توافق على أن الأسعار المعروضة هي استرشادية للاطلاع فقط وليست لغرض التداول. لا يتحمل الموقع أي مسؤولية عن قرارات اتخذتها بناءً على هذه الأسعار. جميع العلامات التجارية والمحتوى المنشور ملك للموقع ولا يجوز نسخه أو إعادة استخدامه دون إذن.",
    },
    admin: {
      title: "لوحة التحكم",
      dashboard: "الإحصائيات",
      prices: "الأسعار",
      overrides: "التعديلات اليدوية",
      news: "الأخبار",
      announcements: "الإعلانات",
      users: "المستخدمون",
      settings: "الإعدادات",
      audit: "السجل",
      refresh: "تحديث الأسعار",
      refreshing: "جارٍ التحديث...",
      addNew: "إضافة جديد",
      save: "حفظ",
      cancel: "إلغاء",
      delete: "حذف",
      edit: "تعديل",
      active: "نشط",
      inactive: "غير نشط",
    },
    auth: {
      signIn: "تسجيل الدخول",
      signUp: "إنشاء حساب",
      signOut: "تسجيل الخروج",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      name: "الاسم",
      forgotPassword: "نسيت كلمة المرور؟",
      continueWithGoogle: "المتابعة عبر جوجل",
      noAccount: "ليس لديك حساب؟",
      haveAccount: "لديك حساب؟",
    },
    footer: {
      disclaimer: "هذه الأسعار استرشادية للاطلاع فقط وليست لغرض التداول",
      rights: "جميع الحقوق محفوظة",
      madeWith: "صُنع بشغف",
      quickLinks: "روابط سريعة",
      legal: "قانوني",
      follow: "تابعنا",
    },
    common: {
      loading: "جارٍ التحميل...",
      error: "حدث خطأ",
      retry: "إعادة المحاولة",
      save: "حفظ",
      cancel: "إلغاء",
      confirm: "تأكيد",
      delete: "حذف",
      edit: "تعديل",
      close: "إغلاق",
      copy: "نسخ",
      copied: "تم النسخ",
      share: "مشاركة",
      shareWhatsapp: "مشاركة عبر واتساب",
      shareCopy: "نسخ الرقم",
      refresh: "تحديث",
      search: "بحث",
      filter: "تصفية",
      all: "الكل",
      yes: "نعم",
      no: "لا",
      currency: "العملة",
      language: "اللغة",
      theme: "المظهر",
      light: "فاتح",
      dark: "داكن",
    },
  },
  en: {
    brand: {
      name: "ELSADEQ",
      tagline: "Live Gold & Bullion Prices",
    },
    nav: {
      home: "Home",
      gold: "Gold",
      bars: "Bars",
      coins: "Coins",
      calculator: "Calculator",
      converter: "Converter",
      charts: "Charts",
      news: "News",
      faq: "FAQ",
      about: "About",
      contact: "Contact",
      privacy: "Privacy",
      terms: "Terms",
      admin: "Dashboard",
      login: "Sign In",
      logout: "Sign Out",
      profile: "Profile",
    },
    home: {
      heroTitle: "Gold & Bullion Prices",
      heroSubtitle: "Live gold, bars and coin prices - refreshed on every visit",
      livePrices: "Live Prices",
      lastUpdate: "Last update",
      buy: "Buy",
      sell: "Sell",
      change: "Change",
      viewAll: "View all",
      calculatorCta: "Calculate your gold value",
      chartsCta: "View charts",
      liveNow: "Live now",
      dataSource: "Source",
    },
    gold: {
      title: "Gold Prices",
      subtitle: "Per-gram prices in EGP across all karats",
      perGram: "gram",
      perPiece: "piece",
      perBar: "bar",
    },
    bars: {
      title: "Gold Bars",
      subtitle: "24K gold bars in various weights",
    },
    coins: {
      title: "Gold Coins & Pounds",
      subtitle: "Gold pound, half pound and quarter pound prices",
    },
    calculator: {
      title: "Gold Calculator",
      subtitle: "Instantly value any weight of gold at any karat",
      karat: "Karat",
      weight: "Weight",
      weightUnit: "grams",
      result: "Estimated value",
      buyValue: "Buy value",
      sellValue: "Sell value",
      useLivePrice: "Use live price",
      pieces: "Pieces",
      totalWeight: "Total weight",
    },
    converter: {
      title: "Currency Converter",
      subtitle: "Convert between EGP and major Gulf currencies",
      amount: "Amount",
      from: "From",
      to: "To",
      result: "Result",
    },
    charts: {
      title: "Historical Charts",
      subtitle: "Track gold price movement over time",
      range24h: "24h",
      range7d: "7d",
      range30d: "30d",
      range1y: "1y",
      selectItem: "Select item",
      compareWith: "Compare with",
    },
    news: {
      title: "Market News",
      subtitle: "Latest gold and economy news",
      readMore: "Read more",
      noNews: "No news yet",
    },
    faq: { title: "Frequently Asked Questions", subtitle: "Answers to common questions" },
    about: {
      title: "About Us",
      subtitle: "Get to know ELSADEQ",
      missionTitle: "Our Mission",
      missionBody:
        "At ELSADEQ we provide accurate, transparent pricing for gold, bullion and gold coins across Egypt and the Gulf. We rely on trusted data sources and a clear calculation pipeline for every karat and weight, refreshed on every visit so you always see the latest numbers. We do not sell gold or broker deals - we offer a free information service.",
      contactTitle: "Contact Us",
    },
    contact: {
      title: "Contact Us",
      subtitle: "We'd love to hear your questions and suggestions",
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Send",
      sent: "Your message was sent successfully",
    },
    privacy: {
      title: "Privacy Policy",
      subtitle: "How we handle your data",
      body:
        "At ELSADEQ we respect your privacy. We do not store sensitive personal data beyond what you voluntarily provide when creating an account. We use cookies to improve your experience and remember preferences such as currency and language. We do not share your data with third parties. All displayed prices are for reference only and not for trading or investment purposes.",
    },
    terms: {
      title: "Terms & Conditions",
      subtitle: "Site usage terms",
      body:
        "By using ELSADEQ you agree that the displayed prices are indicative for reference only and not for trading. The site is not liable for any decisions made based on these prices. All trademarks and published content belong to the site and may not be copied or reused without permission.",
    },
    admin: {
      title: "Dashboard",
      dashboard: "Overview",
      prices: "Prices",
      overrides: "Manual Overrides",
      news: "News",
      announcements: "Announcements",
      users: "Users",
      settings: "Settings",
      audit: "Audit Log",
      refresh: "Refresh Prices",
      refreshing: "Refreshing...",
      addNew: "Add new",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      active: "Active",
      inactive: "Inactive",
    },
    auth: {
      signIn: "Sign In",
      signUp: "Sign Up",
      signOut: "Sign Out",
      email: "Email",
      password: "Password",
      name: "Name",
      forgotPassword: "Forgot password?",
      continueWithGoogle: "Continue with Google",
      noAccount: "No account?",
      haveAccount: "Have an account?",
    },
    footer: {
      disclaimer: "Prices are indicative for reference only and not for trading",
      rights: "All rights reserved",
      madeWith: "Made with passion",
      quickLinks: "Quick links",
      legal: "Legal",
      follow: "Follow",
    },
    common: {
      loading: "Loading...",
      error: "An error occurred",
      retry: "Retry",
      save: "Save",
      cancel: "Cancel",
      confirm: "Confirm",
      delete: "Delete",
      edit: "Edit",
      close: "Close",
      copy: "Copy",
      copied: "Copied",
      share: "Share",
      shareWhatsapp: "Share via WhatsApp",
      shareCopy: "Copy value",
      refresh: "Refresh",
      search: "Search",
      filter: "Filter",
      all: "All",
      yes: "Yes",
      no: "No",
      currency: "Currency",
      language: "Language",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
    },
  },
};

export function getDict(locale: Locale): Dict {
  return dictionaries[locale] || dictionaries.ar;
}
