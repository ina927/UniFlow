import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@tanstack/react-query", "clsx"],
  transpilePackages: ["@tanstack/react-table"],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias['@prisma/client'] = false;
    }
    return config;
  },
};

export default nextConfig;
