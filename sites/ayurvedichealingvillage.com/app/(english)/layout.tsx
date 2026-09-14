import type { Metadata } from "next";
import type { ReactNode } from "react";
import { faviconIcons } from "@kairali/seo";

/**
 * AHV English candidate — root layout for the approved-design lane.
 *
 * This is a SECOND root layout (Next.js route-group root layouts). The LP lane
 * keeps its own at app/(lp)/layout.tsx, unchanged. The two are separated
 * because the LP layout is deliberately chromeless-plus-fleet-furniture — it
 * appends a social strip and a consent banner to every page it wraps — and the
 * approved English design already carries its own header, footer, social row
 * and cookie notice. Wrapping the design in the LP layout would have shown the
 * reviewer two footers and two consent banners, i.e. not the approved design.
 *
 * DELIBERATELY ABSENT, pending the owner's word (staging build, 15 Sep 2026):
 * consent scripts, analytics, and the chat loader. The task forbids tracking
 * and consent changes, and this lane has never had any; adding the fleet set
 * here would BE that change. Flagged in BUILD-STATUS.md as a pre-production
 * decision, not a silent omission.
 */
export const metadata: Metadata = {
  icons: faviconIcons(),
  // No robots meta here BY DESIGN: the approved design writes its own, and a
  // second one made every head carry a duplicate. Staging no-index is held by
  // the X-Robots-Tag header (next.config.ts), robots.txt, the import-time
  // rewrite of the payload's robots values, and the boot head guard.
};

export default function EnglishCandidateLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-US">
      <body>
        {/* Two rules, both load-bearing.
            1. Paper tone from the approved design, so the first paint before
               the runtime mounts is the design's background, not white.
            2. x-dc{display:none} is the SAME rule support.js installs from
               <head> in the package, and it has to be in the served CSS for
               the same reason: the approved templates carry 281 interpolated
               <img loading="lazy" src="{{ expr }}"> tags. Visible for even one
               frame, the browser resolves "{{ expr }}" as a URL and 404s.
               Hidden from the start, lazy loading never begins and the runtime
               replaces the node with the compiled design. */}
        <style>
          {"html,body{margin:0;background:#F7F4EA;color:#2A2118}x-dc{display:none!important}"}
        </style>
        {children}
      </body>
    </html>
  );
}
