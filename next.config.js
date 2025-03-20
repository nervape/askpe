/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable environment variables
  env: {
    OPENROUTER_API_URL: process.env.OPENROUTER_API_URL,
  },
  // We'll handle the API key securely via server-side environment variables
  output: 'standalone',
  images: {
    domains: ['ask.nvap.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Trust the proxy headers from Nginx
  poweredByHeader: false,
  experimental: {
    serverActions: {
      allowedOrigins: ['ask.nvap.app', 'localhost:3000', 'localhost:3001', 'localhost:3004'],
    },
  },
};

module.exports = nextConfig; 