/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle punycode deprecation
    config.resolve.fallback = {
      ...config.resolve.fallback,
      punycode: false,
    };
    return config;
  },
  // Existing config options
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig; 