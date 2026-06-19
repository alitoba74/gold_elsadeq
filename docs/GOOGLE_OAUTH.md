# 🔐 دليل إعداد Google OAuth لـ ELSADEQ

## الخطوة 1: إنشاء Google Cloud Project

1. ادخل على [Google Cloud Console](https://console.cloud.google.com)
2. اضغط **Select a project** → **NEW PROJECT**
3. اكتب اسم المشروع: `ELSADEQ`
4. اضغط **CREATE**

## الخطوة 2: تفعيل Google+ API

1. من القائمة الجانبية: **APIs & Services** → **Library**
2. ابحث عن **Google+ API** أو **People API**
3. اضغط **ENABLE**

## الخطوة 3: إعداد OAuth Consent Screen

1. من **APIs & Services** → **OAuth consent screen**
2. اختر **External** (لو مش عندك Google Workspace)
3. اضغط **CREATE**
4. عبّي البيانات:
   - **App name**: `ELSADEQ`
   - **User support email**: `alielsadeq4@gmail.com`
   - **Developer contact information**: `alielsadeq4@gmail.com`
5. اضغط **SAVE AND CONTINUE**
6. في **Scopes**:
   - اضغط **ADD OR REMOVE SCOPES**
   - اختر:
     - `userinfo.email`
     - `userinfo.profile`
     - `openid`
   - اضغط **SAVE AND CONTINUE**
7. في **Test users**:
   - اضغط **ADD USERS**
   - أضف `alielsadeq4@gmail.com`
   - اضغط **SAVE AND CONTINUE**

## الخطوة 4: إنشاء OAuth 2.0 Client ID

1. من **APIs & Services** → **Credentials**
2. اضغط **+ CREATE CREDENTIALS** → **OAuth client ID**
3. اختر **Application type**: `Web application`
4. اكتب **Name**: `ELSADEQ Web Client`
5. في **Authorized JavaScript origins**:
   - `http://localhost:3000`
   - `https://gold_elsadeq.vercel.app`
6. في **Authorized redirect URIs**:
   - `https://axcbqgpsggvcixcgmauf.supabase.co/auth/v1/callback`
7. اضغط **CREATE**
8. **احفظ الـ Client ID و Client Secret** (هتظهر مرة واحدة بس)

## الخطوة 5: تفعيل Google Provider في Supabase

1. ادخل على [Supabase Dashboard](https://supabase.com/dashboard)
2. اختار مشروعك (project ref: `axcbqgpsggvcixcgmauf`)
3. من القائمة اليسار: **Authentication** → **Providers**
4. اختار **Google**
5. فعّل **Enable Google provider**
6. الصق:
   - **Client ID**: من الخطوة 4
   - **Client Secret**: من الخطوة 4
7. انسخ الـ **Redirect URL** المعروض (هو نفسه اللي في الخطوة 4.6)
8. اضغط **Save**

## الخطوة 6: اختبار تسجيل الدخول

1. افتح `https://gold_elsadeq.vercel.app/auth/login` (أو localhost:3000/auth/login)
2. اضغط **Continue with Google**
3. اختار حسابك
4. المفروض يرجعك للموقع وأنت مسجّل دخول

## ⚠️ ملاحظات مهمة

- **في وضع Testing**: بس الـ test users اللي هقدروا يسجّلوا. عشان تطلقه للكل، اضغط **PUBLISH APP** في OAuth consent screen.
- **الـ Client Secret سري جداً** - ما تشاركوش مع حد ولا ترفعه على GitHub.
- **لو غيرت الدومين**: لازم تضيفه في authorized redirect URIs في Google Console.

## 🐛 مشاكل شائعة

| المشكلة | الحل |
|---|---|
| `redirect_uri_mismatch` | اتأكد إن redirect URI في Google Console = `https://YOUR-PROJECT.supabase.co/auth/v1/callback` |
| `access_denied` | المستخدم مش في test users - أضفه |
| `invalid_client` | Client ID أو Secret غلط |
| بيدور في loop | امسح cookies وأعد المحاولة |
