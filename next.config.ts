import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  // Enable detailed error messages in development
  webpack: (config, { dev, isServer }) => {
    if (dev && isServer) {
      config.optimization.minimize = false;
    }
    return config;
  },
};

export default nextConfig;