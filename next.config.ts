import type { Configuration } from 'webpack';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure webpack for SASS/SCSS files
  webpack(config: Configuration) {
    // Add configuration for SASS/SCSS files
    config.module = config.module || { rules: [] };
    (config.module.rules = config.module.rules || []).push({
      test: /\.(sass|scss)$/,
      use: [
        "style-loader",
        "css-loader",
        "sass-loader",
      ],
    });

    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  
  // Add Turbopack configuration
  experimental: {
    turbo: {
      rules: {
        // Configure loaders for SASS/SCSS
        '.scss': ['style-loader', 'css-loader', 'sass-loader'],
        '.sass': ['style-loader', 'css-loader', 'sass-loader'],
      },
    },
  },
  
  // Add SASS options
  sassOptions: {
    includePaths: ['./app', './app/styles', './app/components'],
  },
};

export default nextConfig;