import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // consent + analytics + chat + legal + forms ship TSX source (thin components
  // over plain-JS cores) — transpiled here, same contract as the rest of the fleet
  transpilePackages: ["@kairali/consent", "@kairali/analytics", "@kairali/chat", "@kairali/legal", "@kairali/forms"],
};

export default nextConfig;
