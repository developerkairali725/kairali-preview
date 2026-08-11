import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // WordPress published its article permalinks with trailing slashes. The
  // default framework normalizer would create an avoidable first hop before
  // the content redirect. middleware.ts owns slash normalization so those
  // legacy URLs reach their final semantic targets in one permanent hop.
  skipTrailingSlashRedirect: true,
  // consent + analytics ship TSX source (thin components over plain-JS cores).
  // NO @kairali/chat here — theblushlounge.com is bubble-EXEMPT by owner
  // ruling D-BL-BUBBLE-EXEMPT (18 Jul 2026): Sneha's own WhatsApp
  // (+91 88269 21110, D-BL-WHATSAPP) IS the chat surface on her personal
  // brand. The exemption is encoded loudly in scripts/chat-bubble-lint.mjs
  // (CHAT_EXEMPT), mirroring the abhilashkr pattern — never a silent skip.
  transpilePackages: ["@kairali/consent", "@kairali/analytics"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
          },
        ],
      },
    ];
  },
  // Protection map — the signed STRATEGY §4 legacy-PHP 301 set, live now that
  // every target exists (full build). Single-hop, content-rich → content-rich.
  // snehachowdhary.com's domain-level 301 is a DNS/human action at flip (D1
  // rule 8) and deliberately NOT here.
  async redirects() {
    return [
      { source: "/about.php", destination: "/about", permanent: true },
      { source: "/contact.php", destination: "/contact", permanent: true },
      { source: "/gallery.php", destination: "/portfolio", permanent: true },
      { source: "/bridal-makeup.php", destination: "/services#bridal", permanent: true },
      { source: "/creative-makeup.php", destination: "/services#editorial-sfx", permanent: true },
      { source: "/fashion-makeup.php", destination: "/services#party", permanent: true },
      { source: "/grooming-session.php", destination: "/services#grooming-men", permanent: true },
      { source: "/services.php", destination: "/services", permanent: true },
    ];
  },
};

export default nextConfig;
