import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // consent + analytics + chat + legal + forms ship TSX source
  transpilePackages: ["@kairali/consent", "@kairali/analytics", "@kairali/chat", "@kairali/legal", "@kairali/forms"],
};

export default nextConfig;
