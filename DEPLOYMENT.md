# دليل النشر - Smart Leader Real Estate

## ✅ الإصلاحات المكتملة

تم إصلاح جميع المشاكل التالية:

1. **إصلاح API Contact** - الآن يربط بالباك إند الحقيقي
2. **توحيد الـ Ports** - جميع الخدمات تستخدم Port 5000
3. **إصلاح render.yaml** - تنسيق صحيح للمتغيرات
4. **إصلاح إعدادات البيئة** - URLs محدثة للنشر
5. **ربط AdminDashboard** - يحاول الاتصال بالباك إند أولاً

## 🚀 خطوات النشر

### 1. إعداد قاعدة البيانات (MongoDB Atlas)

1. اذهب إلى [MongoDB Atlas](https://www.mongodb.com/atlas)
2. أنشئ حساب جديد أو سجل الدخول
3. أنشئ cluster جديد
4. احصل على connection string
5. أضف IP address للـ Network Access

### 2. نشر الباك إند على Render

1. اذهب إلى [Render](https://render.com)
2. سجل الدخول بحساب GitHub
3. اضغط "New +" ثم "Web Service"
4. اختر repository الخاص بك
5. املأ البيانات:

   - **Name**: `smart-leader-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

6. أضف Environment Variables:

   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-leader-real-estate
   JWT_SECRET=your-super-secret-jwt-key-here
   FRONTEND_URL=https://smart-leader-real-estate.vercel.app
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com
   EMAIL_TO=admin@smartleader.com
   ```

7. اضغط "Create Web Service"

### 3. نشر الفرونت إند على Vercel

1. اذهب إلى [Vercel](https://vercel.com)
2. سجل الدخول بحساب GitHub
3. اضغط "New Project"
4. اختر repository الخاص بك
5. املأ البيانات:

   - **Framework Preset**: `Next.js`
   - **Root Directory**: `frontend`

6. أضف Environment Variables:

   ```
   NEXT_PUBLIC_API_URL=https://smart-leader-backend.onrender.com
   NEXT_PUBLIC_SITE_URL=https://smart-leader-real-estate.vercel.app
   ```

7. اضغط "Deploy"

### 4. إعداد البيانات الأولية

بعد نشر الباك إند:

1. اذهب إلى Render Dashboard
2. افتح Web Service الخاص بك
3. اذهب إلى "Shell" tab
4. نفذ الأوامر التالية:
   ```bash
   cd backend
   node scripts/seed.js
   ```

## 🔧 اختبار النشر

### 1. اختبار الباك إند

- اذهب إلى: `https://smart-leader-backend.onrender.com/api/health`
- يجب أن ترى: `{"status":"OK","timestamp":"...","uptime":...}`

### 2. اختبار الفرونت إند

- اذهب إلى: `https://smart-leader-real-estate.vercel.app`
- تأكد من أن الموقع يعمل
- جرب نموذج الاتصال

### 3. اختبار Admin Dashboard

- اذهب إلى: `https://smart-leader-real-estate.vercel.app/admin`
- استخدم البيانات:
  - **Email**: `admin@smartleader.com`
  - **Password**: `admin123456`

## 📝 ملاحظات مهمة

1. **Free Tier Limitations**:

   - Render: قد ينام الخدمة بعد 15 دقيقة من عدم الاستخدام
   - Vercel: 100GB bandwidth شهرياً

2. **Custom Domain**:

   - يمكنك ربط دومين مخصص في Vercel و Render
   - تحديث DNS records

3. **SSL Certificates**:

   - Vercel و Render يوفران SSL تلقائياً

4. **Environment Variables**:
   - تأكد من تحديث جميع URLs في البيئة الإنتاجية

## 🆘 استكشاف الأخطاء

### مشاكل شائعة:

1. **Backend لا يعمل**:

   - تحقق من Environment Variables
   - تحقق من MongoDB connection string
   - راجع logs في Render

2. **Frontend لا يتصل بالBackend**:

   - تحقق من `NEXT_PUBLIC_API_URL`
   - تأكد من أن Backend يعمل

3. **Database connection error**:
   - تحقق من MongoDB Atlas network access
   - تأكد من صحة connection string

## 📞 الدعم

إذا واجهت أي مشاكل:

1. راجع logs في Render/Vercel
2. تحقق من Environment Variables
3. تأكد من أن جميع الخدمات تعمل

---

**المشروع جاهز للنشر بنسبة 100%** ✅
