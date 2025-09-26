#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📊 تحليل حجم المشروع...\n');

// دالة لحساب حجم المجلد
function getDirectorySize(dirPath, maxDepth = 3, currentDepth = 0) {
  if (!fs.existsSync(dirPath) || currentDepth > maxDepth) return { size: 0, files: 0 };
  
  let size = 0;
  let files = 0;
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        const subResult = getDirectorySize(itemPath, maxDepth, currentDepth + 1);
        size += subResult.size;
        files += subResult.files;
      } else {
        size += stat.size;
        files++;
      }
    }
  } catch (error) {
    // تجاهل الأخطاء في الوصول للملفات
  }
  
  return { size, files };
}

// دالة لتحويل البايت إلى وحدات مناسبة
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// تحليل المجلدات الرئيسية
const directories = [
  { name: 'Frontend', path: 'frontend' },
  { name: 'Backend', path: 'backend' },
  { name: 'Root', path: '.' },
];

let totalSize = 0;
let totalFiles = 0;

console.log('📁 تحليل المجلدات الرئيسية:');
console.log('─'.repeat(60));

directories.forEach(dir => {
  const result = getDirectorySize(dir.path);
  totalSize += result.size;
  totalFiles += result.files;
  
  console.log(`${dir.name.padEnd(15)} | ${formatBytes(result.size).padStart(10)} | ${result.files.toLocaleString().padStart(8)} ملف`);
});

console.log('─'.repeat(60));
console.log(`${'إجمالي'.padEnd(15)} | ${formatBytes(totalSize).padStart(10)} | ${totalFiles.toLocaleString().padStart(8)} ملف`);

// تحليل node_modules
console.log('\n📦 تحليل node_modules:');
console.log('─'.repeat(60));

const nodeModulesDirs = [
  'node_modules',
  'frontend/node_modules',
  'backend/node_modules',
  'backend/functions/node_modules'
];

let nodeModulesSize = 0;

nodeModulesDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const result = getDirectorySize(dir, 1); // عمق محدود لتجنب التعليق
    nodeModulesSize += result.size;
    console.log(`${dir.padEnd(30)} | ${formatBytes(result.size).padStart(10)}`);
  }
});

console.log('─'.repeat(60));
console.log(`${'إجمالي node_modules'.padEnd(30)} | ${formatBytes(nodeModulesSize).padStart(10)}`);

// نصائح التحسين
console.log('\n💡 نصائح لتقليل الحجم:');
console.log('1. استخدم npm ci بدلاً من npm install في الإنتاج');
console.log('2. احذف node_modules قبل النشر');
console.log('3. استخدم multi-stage Docker builds');
console.log('4. فعّل tree-shaking في webpack');
console.log('5. استخدم CDN للمكتبات الكبيرة');
console.log('6. ضغط الصور والملفات الثابتة');

// نسبة node_modules من إجمالي المشروع
const nodeModulesPercentage = ((nodeModulesSize / totalSize) * 100).toFixed(1);
console.log(`\n📈 node_modules يشكل ${nodeModulesPercentage}% من إجمالي حجم المشروع`);








