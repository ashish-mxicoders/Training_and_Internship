import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow mobile devices and LAN devices on the local network to connect without security blocks
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.*",
    "192.168.1.*",
    "10.*",
    "172.16.*",
  ],
  experimental: {
    agentUpgrade: "security",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
