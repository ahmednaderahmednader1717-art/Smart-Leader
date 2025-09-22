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
  },
  
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
}

module.exports = nextConfig

