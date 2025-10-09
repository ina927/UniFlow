import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@tanstack/react-query", "clsx"],
  transpilePackages: ["@tanstack/react-table"],
};

export default nextConfig;
