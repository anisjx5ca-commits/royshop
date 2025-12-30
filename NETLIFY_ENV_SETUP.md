# Netlify Environment Variables Setup

## المشكلة
`.env.local` لا يُرفع إلى GitHub (موجود في `.gitignore`)، لذلك Netlify لا تملك متغيرات البيئة الضرورية.

## الحل: إضافة متغيرات البيئة في Netlify

### خطوات الإعداد:

1. **قم بتسجيل الدخول إلى Netlify Dashboard**
   - اذهب إلى: https://app.netlify.com

2. **اختر مشروعك (royshop)**

3. **اذهب إلى Site Settings**
   - انقر على: `Site settings` في الأعلى

4. **أذهب إلى Build & deploy → Environment**
   - أو مباشرة: Site settings → Build & deploy → Environment

5. **أنقر على "Edit variables"**

6. **أضف المتغيرات التالية:**

   ```
   Key: VITE_SUPABASE_URL
   Value: https://pguzlxoigpbjyfburfzw.supabase.co
   ```

   ```
   Key: VITE_SUPABASE_ANON_KEY
   Value: sb_publishable_4dYNskT-7b0uEfBfNUkUww_GMOTn6OR
   ```

7. **انقر Save**

8. **أعد نشر الموقع:**
   - اذهب إلى: Deployments
   - انقر على آخر deployment
   - انقر "Trigger deploy" → "Deploy site"

### التحقق من أن البيانات تُرفع:

بعد إضافة البيانات والنشر، افتح موقعك على Netlify وافتح Console (F12):
- يجب أن تراقول "✅ Supabase initialized successfully"
- يجب أن تظهر رسائل contact form في Supabase

## ملفات مهمة موجودة محليًا:

- `src/` - كل مكونات React
- `netlify.toml` - تكوين Netlify ✅
- `.env.local` - متغيرات البيئة (على جهازك فقط)
- `package.json` - جميع الحزم

## الملفات الموجودة على GitHub:

✅ جميع ملفات `src/`
✅ `netlify.toml`
✅ `package.json`
✅ `vite.config.ts`
✅ `.env.example` (نموذج فقط)

⛔ `.env.local` (غير موجود وهذا صحيح - لأسباب أمان)
