/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep your existing webpack configuration
  webpack(config: any) {
    config.module.rules.push({
      test: /\.less$/,
      use: [
        {
          loader: "style-loader",
        },
        {
          loader: "css-loader",
        },
        {
          loader: "less-loader",
          options: {
            lessOptions: {
              javascriptEnabled: true, // Needed for some Less features
            },
          },
        },
      ],
    });
    return config;
  },
  
  // Add Turbopack configuration
  experimental: {
    turbo: {
      rules: {
        // Configure loaders for Turbopack similar to what you have for webpack
        '.less': ['style-loader', 'css-loader', {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true,
            },
          },
        }],
      },
      // You can add other Turbopack-specific configurations here
    },
  },
};

export default nextConfig;