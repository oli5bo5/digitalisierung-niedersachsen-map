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

      
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
