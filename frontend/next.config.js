/** @type {import('next').NextConfig} */
const nextConfig = {
  // تحسين الأداء وتقليل الحجم
  compress: true,
  poweredByHeader: false,
  
  // تحسين الصور
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    // تحسين معالجة الصور الكبيرة
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // تحسين البناء
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // تقليل حجم البناء
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    return config;
  },
  
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
  
  // إعدادات إضافية لمعالجة البيانات الكبيرة
  serverRuntimeConfig: {
    maxFileSize: '10mb',
  },
  
  publicRuntimeConfig: {
    maxImageSize: '2mb',
    maxImagesPerProject: 10,
  },
}

module.exports = nextConfig

