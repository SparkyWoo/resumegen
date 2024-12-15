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
  reactStrictMode: true,
};

module.exports = nextConfig; 