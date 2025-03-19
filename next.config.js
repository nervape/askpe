/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Enable environment variables
  env: {
    OPENROUTER_API_URL: process.env.OPENROUTER_API_URL,
  },
  // We'll handle the API key securely via server-side environment variables
};

module.exports = nextConfig; 