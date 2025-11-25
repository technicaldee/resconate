/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable more verbose error logging
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Show detailed error messages
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    DB_USER: process.env.DB_USER,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT,
  },
  // Logging configuration
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

module.exports = nextConfig


