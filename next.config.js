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
  output: 'export',
      
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
