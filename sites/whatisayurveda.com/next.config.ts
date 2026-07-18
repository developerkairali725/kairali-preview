import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // consent + analytics ship TSX source (thin components over plain-JS cores)
  transpilePackages: ["@kairali/consent", "@kairali/analytics", "@kairali/chat", "@kairali/legal"],
};

export default nextConfig;
