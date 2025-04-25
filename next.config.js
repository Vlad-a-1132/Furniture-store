/** @type {import('next').Config} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc'
      },
      {
        protocol: 'http',
        hostname: 'localhost'
      }
    ],
    // Кэшируем изображения
    minimumCacheTTL: 60,
  },
  // Оптимизируем сборку
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Включаем кэширование
  staticPageGenerationTimeout: 180,
  generateEtags: true,
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    }
    
    // Увеличиваем timeout для chunks
    config.watchOptions = {
      ...config.watchOptions,
      aggregateTimeout: 300,
      poll: 1000,
    }
    
    return config
  },
  // Добавляем явное указание порта
  serverOptions: {
    port: 3001
  },
  // Добавляем baseUrl для API запросов
  env: {
    NEXT_PUBLIC_BASE_URL: 'http://localhost:3001'
  }
} 