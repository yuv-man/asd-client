import type { Configuration } from 'webpack';

const withNextIntl = require('next-intl/plugin')('./i18n.config.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure webpack for SASS/SCSS files and SVG
  webpack(config: Configuration) {
    if (!config.module) {
      config.module = { rules: [] };
    }
    if (!config.module.rules) {
      config.module.rules = [];
    }

    // Enhanced SVG handling - transform to React components with customizable options
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"], 
    });

    return config;
  },
  
  // Add headers configuration for CSP
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https:;
              font-src 'self';
              connect-src 'self' https://*.googleapis.com https://accounts.google.com 
                           https://asd-server.onrender.com http://localhost:5000 
                           ws://localhost:5000 wss://asd-server.onrender.com;
              frame-src https://accounts.google.com;
            `.replace(/\s+/g, ' ').trim()
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          }
        ]
      }
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Add SASS options
  sassOptions: {
    includePaths: ['./app', './app/styles', './app/components'],
  },
};

export default withNextIntl(nextConfig);