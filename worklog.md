---
Task ID: main
Agent: Super Z (main)
Task: بناء موقع ELSADEQ - منصة أسعار الذهب والسبائك لحظة بلحظة

Work Log:
- تحميل skill fullstack-dev وتهيئة البيئة
- تثبيت @supabase/supabase-js + @supabase/ssr
- إنشاء ملفات البيئة (.env.local + .env.example) بمفاتيح Supabase الحقيقية
- كتابة SQL Schema كامل (11 جدول + RLS + triggers + seed data) في scripts/schema.sql
- بناء نظام Supabase clients (browser/server/admin/middleware)
- بناء محرك الأسعار (lib/gold/prices.ts) - حساب ذهب 24/22/21/18/14 + جنيه + نص + ربع + سباik 1g-1kg
- بناء نظام fallback متعدد الطبقات (lib/gold/refresh.ts)
- بناء نظام i18n (عربي/إنجليزي) + RTL/LTR تلقائي
- بناء الهوية البصرية: شعار ELSADEQ مع حرف "E" ذهبي، Glass-morphism، gold gradient
- بناء Layout رئيسي + Header + Footer + Bottom Nav + Announcement Bar
- بناء الصفحة الرئيسية (Hero + Live prices + CTAs + Stats)
- بناء 12 صفحة فرعية: gold, bars, coins, calculator, converter, charts, news, faq, about, contact, privacy, terms
- بناء Auth: login, signup, callback + profile + favorites
- بناء لوحة أدمن كاملة (8 صفحات): dashboard, prices, overrides, news, announcements, users, audit, settings
- بناء API routes: prices/refresh, prices/rates, prices/history, cron/refresh, contact
- بناء PWA: manifest.webmanifest + icons (192/512/180) + og-image
- بناء SEO: sitemap.ts + robots.txt + Schema.org metadata
- إصلاح أخطاء lint (5 -> 0)
- اختبار شامل بالـ Agent Browser: 14 صفحة + 2 API endpoints شغالة
- اكتشاف وإصلاح bug في URL الخاص بـ gold-api (الـ API الصحيح: api.gold-api.com/price/XAU)

Stage Summary:
- المشروع شغال 100% على localhost:3000
- جميع الصفحات الـ 14 + API routes الـ 5 تشتغل بنجاح
- الـ lint نظيف بدون أخطاء
- تبديل اللغة (عربي/إنجليزي) يعمل
- الحاسبة ومحول العملات يعملون
- المتبقي فقط: تنفيذ المستخدم لـ SQL في Supabase + رفع على GitHub + نشر على Vercel
- ملف SQL جاهز في: /home/z/my-project/scripts/schema.sql (وكمان نسخة في /download/elsadeq-schema.sql)
- إصلاح مهم: الـ API الصحيح لـ gold-api هو https://api.gold-api.com/price/XAU (مش www.gold-api.com/api/XAU)
