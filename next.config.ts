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

    // Next.js already has CSS handling built-in, we just need to
    // add the SCSS file extensions to the existing rules
    
    // Add SVG handling
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  
  // Remove the Turbopack custom rules as they're causing issues
  experimental: {
    // Keep other experimental features if needed
  },
  
  // Add SASS options
  sassOptions: {
    includePaths: ['./app', './app/styles', './app/components'],
  },
};

export default withNextIntl(nextConfig);