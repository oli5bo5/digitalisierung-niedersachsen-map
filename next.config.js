/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
  // Cloudflare Pages Konfiguration
  // output: 'export', // Only for Cloudflare Pages - Vercel doesn't need this
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
