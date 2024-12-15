/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle punycode deprecation
    config.resolve.fallback = {
      ...config.resolve.fallback,
      punycode: false,
    };

    // Handle PDF.js worker
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'pdfjs-dist': 'pdfjs-dist/build/pdf.mjs',
      };
    }

    return config;
  },
  reactStrictMode: true,
};

module.exports = nextConfig; 