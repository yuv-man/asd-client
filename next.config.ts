import type { Configuration } from 'webpack';

const withNextIntl = require('next-intl/plugin')('./i18n.config.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure webpack for SASS/SCSS files
  webpack(config: Configuration) {
    if (!config.module) {
      config.module = { rules: [] };
    }
    if (!config.module.rules) {
      config.module.rules = [];
    }

    // Add SVG handling
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  
  // Add headers configuration for CSP
  async headers() {
    return [
      {
        source: '/:path*',
        async headers() {
          return [
            {
              source: '/:path*',
              headers: [
                {
                  key: 'Content-Security-Policy',
                  value: `
                    default-src 'self';
                    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com;
                    style-src 'self' 'unsafe-inline';
                    img-src 'self' data: https:;
                    font-src 'self';
                    connect-src 'self' https://*.googleapis.com https://accounts.google.com https://wonderkid-backend.onrender.com;
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
        }        
      }
    ];
  },
  
  // Add SASS options
  sassOptions: {
    includePaths: ['./app', './app/styles', './app/components'],
  },
};

export default withNextIntl(nextConfig);