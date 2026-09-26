import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.us-west-1.console.aws.amazon.com",
      },
    ],
  },
};

export default nextConfig;
