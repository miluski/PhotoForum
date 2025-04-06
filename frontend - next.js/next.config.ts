import type { NextConfig } from "next";
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: true,
});

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  images: {
    domains: ["78.88.231.247"], // Dodaj domenę backendu
  },
};

export default withBundleAnalyzer(nextConfig);
