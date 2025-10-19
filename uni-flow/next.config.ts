import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@tanstack/react-table"],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias['@prisma/client'] = false;
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
