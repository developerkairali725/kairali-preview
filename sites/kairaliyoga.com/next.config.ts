import type { NextConfig } from "next";

// Protection map (docs/site-briefs/kairaliyoga-build-2026-07-16.md): every
// mined legacy .aspx page gets an explicit single-hop fate on this domain.
// Anchors are honest — each legacy page lands on the section that actually
// replaces it, never on a thin target (Build Decision Matrix §2).
//
//   /default.aspx                → /            (homepage → homepage)
//   /about-us.aspx               → /            (about copy folded into the one-pager)
//   /retreat-programs.aspx       → /#programmes (the real programmes)
//   /testimonials.aspx           → /#voices     (the carried-over testimonials)
//   /yoga-teachers.aspx          → /#teachers   (teaching section, unnamed roster)
//   /yoga-and-ayurveda.aspx      → /            (philosophy essay retired; no thin anchor)
//   /media-center.aspx           → /            (2013-era feed retired)
//   /competition-form.aspx       → /#enquire    (form → enquiry ladder)
//   /free-consultation-form.aspx → /#enquire    (form → enquiry ladder)
const LEGACY_REDIRECTS: Array<{ source: string; destination: string }> = [
  { source: "/default.aspx", destination: "/" },
  { source: "/about-us.aspx", destination: "/" },
  { source: "/retreat-programs.aspx", destination: "/#programmes" },
  { source: "/testimonials.aspx", destination: "/#voices" },
  { source: "/yoga-teachers.aspx", destination: "/#teachers" },
  { source: "/yoga-and-ayurveda.aspx", destination: "/" },
  { source: "/media-center.aspx", destination: "/" },
  { source: "/competition-form.aspx", destination: "/#enquire" },
  { source: "/free-consultation-form.aspx", destination: "/#enquire" },
];

const nextConfig: NextConfig = {
  transpilePackages: ["@kairali/consent", "@kairali/analytics", "@kairali/chat", "@kairali/legal"],
  async redirects() {
    return LEGACY_REDIRECTS.map(({ source, destination }) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
