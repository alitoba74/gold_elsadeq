# ELSADEQ - أسعار الذهب والسبائك

منصة أسعار الذهب والسبائك والعملات الذهبية لحظة بلحظة - مصر والخليج.

## ✨ المميزات

- **أسعار حية**: ذهب (24/22/21/18/14)، سبائك (1g - 1kg)، جنيه ونص وربع
- **حاسبة الذهب**: قيمة أي وزن بأي عيار فوراً
- **محول العملات**: EGP, SAR, AED, KWD, QAR
- **رسوم بيانية تاريخية**: 24h / 7d / 30d / 1y
- **ثنائي اللغة**: عربي (RTL) + إنجليزي (LTR)
- **PWA**: قابل للتثبيت كموبايل آپ
- **وضع ليلي/نهاري** مع Glass-morphism فاخر
- **لوحة أدمن كاملة**: أسعار، أخبار، إعلانات، مستخدمين، إعدادات
- **مصادر مجانية**: api.gold-api.com + open.er-api.com (بدون مفاتيح)

## 🚀 التقنيات

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Supabase (Postgres + Auth + RLS)
- Recharts للرسوم البيانية
- Vercel Analytics

## 📦 التثبيت المحلي

```bash
# 1. تثبيت الـ dependencies
bun install

# 2. إعداد متغيرات البيئة
cp .env.example .env.local
# عبّي القيم في .env.local

# 3. (مرة واحدة) جهّز قاعدة بيانات Supabase
# - افتح Supabase Studio → SQL Editor
# - الصق محتوى scripts/schema.sql
# - اضغط Run

# 4. شغّل الموقع
bun run dev
```

## 🔐 متغيرات البيئة

| المتغير | الوصف |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | رابط مشروع Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | مفتاح anon (آمن للعميل) |
| `SUPABASE_SERVICE_ROLE_KEY` | مفتاح service_role (سيرفر فقط) |
| `ADMIN_EMAIL` | إيميل الأدمن (`alielsadeq4@gmail.com`) |
| `NEXT_PUBLIC_SITE_URL` | رابط الموقع |
| `CRON_SECRET` | (اختياري) مفتاح لحماية cron endpoint |

## 📊 مصادر الأسعار

1. **api.gold-api.com** — سعر الأونصة (XAU/USD) - مجاني تماماً، بدون مفتاح
2. **open.er-api.com** — سعر صرف العملات - مجاني تماماً، بدون مفتاح

### صيغة الحساب
```
جرام 24K = (أونصة / 31.1035) × سعر USD/EGP
جرام 21K = جرام 24K × (21/24)
جنيه الذهب = جرام 21K × 8 + هامش صناعة
سبيكة 50g = جرام 24K × 50 + هامش صناعة
```

## 🔧 إعداد Supabase Auth

### Email/Password
مفعّل افتراضياً.

### Google OAuth
1. اذهب لـ [Google Cloud Console](https://console.cloud.google.com)
2. أنشئ OAuth 2.0 credentials
3. أضف redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. في Supabase → Authentication → Providers → Google
5. الصق Client ID و Client Secret

## 🚀 النشر على Vercel

1. ارفع الكود لـ GitHub repo `gold_elsadeq`
2. اذهب لـ [vercel.com](https://vercel.com) → New Project → Import repo
3. أضف Environment Variables في إعدادات المشروع
4. Deploy

### تفعيل Cron Job للتحديث الدوري
أضف لـ `vercel.json`:
```json
{
  "crons": [
    { "path": "/api/cron/refresh", "schedule": "0 */5 * * * *" }
  ]
}
```

## 📱 تثبيت PWA

- افتح الموقع على الموبايل
- اضغط على زر "Add to Home Screen" في المتصفح
- سيظهر ELSADEQ كأيقونة مستقلة

## 🛠️ الصيانة

- **تحديث الأسعار**: `/api/prices/refresh` (POST) أو من زر "تحديث" في الموقع
- **تعديل أسعار يدوي**: لوحة الأدمن → الأسعار
- **إضافة خبر**: لوحة الأدمن → الأخبار → "إضافة جديد"
- **إعلان علوي**: لوحة الأدمن → الإعلانات

## 📄 الترخيص

MIT License - 2026 ELSADEQ
