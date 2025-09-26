#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 بدء تنظيف المشروع...\n');

// دالة لحذف المجلدات
function deleteDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    console.log(`🗑️  حذف: ${dirPath}`);
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

// دالة لحساب حجم المجلد
function getDirectorySize(dirPath) {
  if (!fs.existsSync(dirPath)) return 0;
  
  let size = 0;
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      size += getDirectorySize(filePath);
    } else {
      size += stat.size;
    }
  }
  
  return size;
}

// دالة لتحويل البايت إلى ميجابايت
function bytesToMB(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2);
}

// تنظيف الملفات المؤقتة
const tempFiles = [
  'frontend/.next',
  'frontend/out',
  'frontend/build',
  'backend/dist',
  'node_modules/.cache',
  'frontend/node_modules/.cache',
  'backend/node_modules/.cache'
];

console.log('📁 تنظيف الملفات المؤقتة...');
let totalSaved = 0;

tempFiles.forEach(file => {
  const fullPath = path.resolve(file);
  const size = getDirectorySize(fullPath);
  if (size > 0) {
    console.log(`📊 حجم ${file}: ${bytesToMB(size)} MB`);
    totalSaved += size;
  }
  deleteDirectory(fullPath);
});

// تنظيف ملفات npm cache
console.log('\n📦 تنظيف npm cache...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✅ تم تنظيف npm cache');
} catch (error) {
  console.log('⚠️  فشل في تنظيف npm cache');
}

// تنظيف ملفات yarn cache (إذا كان موجود)
try {
  execSync('yarn cache clean', { stdio: 'inherit' });
  console.log('✅ تم تنظيف yarn cache');
} catch (error) {
  console.log('ℹ️  yarn غير مثبت أو لا يوجد cache');
}

console.log(`\n🎉 تم الانتهاء من التنظيف!`);
console.log(`💾 إجمالي المساحة المحررة: ${bytesToMB(totalSaved)} MB`);

// نصائح إضافية
console.log('\n💡 نصائح لتقليل استهلاك المساحة:');
console.log('1. استخدم npm ci بدلاً من npm install في الإنتاج');
console.log('2. احذف node_modules قبل النشر وأعد التثبيت');
console.log('3. استخدم .dockerignore لتجاهل الملفات غير الضرورية');
console.log('4. فعّل tree-shaking في webpack');
console.log('5. استخدم CDN للمكتبات الكبيرة');








