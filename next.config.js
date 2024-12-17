/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
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

    // Exclude open-resume directories
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/open-resume/**', '**/temp-resume/**', '**/temp-open-resume/**']
    };

    return config;
  }
};

module.exports = nextConfig; 