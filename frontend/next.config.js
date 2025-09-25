/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimization and size reduction
  compress: true,
  poweredByHeader: false,
  swcMinify: true,
  
  // Image optimization
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'images.unsplash.com', 'firebasestorage.googleapis.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Bundle optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    // Optimize bundle size
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        firebase: {
          test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
          name: 'firebase',
          chunks: 'all',
        },
        ui: {
          test: /[\\/]node_modules[\\/](framer-motion|lucide-react)[\\/]/,
          name: 'ui',
          chunks: 'all',
        },
      },
    }
    
    return config
  },
  
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
}

module.exports = nextConfig

