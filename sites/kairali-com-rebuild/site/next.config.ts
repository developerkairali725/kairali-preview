import type { NextConfig } from "next";

// SITE_ENV decides indexability: only "production" may be indexed. Local and preview
// builds send `noindex` in both the X-Robots-Tag header and the robots meta tag.
const isProduction = process.env.SITE_ENV === "production";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: { unoptimized: true }, // images are pre-optimised to WebP by pipeline/
  async headers() {
    const common = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    return [
      {
        source: "/:path*",
        headers: isProduction ? common : [...common, { key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      // Local/preview only: never let a browser keep a stale page after a rebuild (owner saw pre-change styling).
      ...(isProduction ? [] : [{ source: "/((?!_next/static|media/|fonts/|download/|og/|brand/).*)", headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }] }]),
      { source: "/fonts/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/media/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }] },
    ];
  },
};

export default nextConfig;
