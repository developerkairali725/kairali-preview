import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import siteConfig from "../../../../site.config.json";
import {
  LpHero,
  LpLegal,
  LpSchema,
  Section,
  StickyCta,
  SITE_URL,
} from "../../_components/lp";
import { LpFormSection } from "../../_components/lp-form";

// ============================================================================
// LP #7 — /lp/kairali-brand (rebuild candidate for
// /Kairali_Brand_and_Competition_Neo-original.html — brand-defence +
// competitor-term campaign). The searcher already knows the name: the page's
// one job is CONFIRM AND CONVERT, fastest of the ten (shortest copy, form
// immediately after the hero). The legacy slug's "-original" A/B history is a
// question for Vikash (which variants serve) — the legacy URL keeps serving
// ads untouched until his written per-URL word.
// ============================================================================

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Kairali — The Ayurvedic Healing Village, Palakkad",
    description:
      "The original Kairali: an NABH-accredited Ayurvedic hospital in Palakkad, Kerala. Confirm you have the right place and speak to patient services now.",
    path: "/lp/kairali-brand",
    siteName: "Kairali — The Ayurvedic Healing Village",
    // Battery fix (18 Jul): kairali-brand-header.jpg is a LEGACY CAMPAIGN
    // BANNER with baked-in text — "Your Journey to Wellness Begins Here"
    // (banned word "journey" in pixels), a painted BOOK NOW pseudo-button and
    // a "Trusted and awardes health retreat" typo line. Swapped to the clean
    // mined campus photograph; banner stays mined-only, never rendered.
    ogImage: "/ahv/assets/img/wx-hero.webp",
  }) as Metadata),
  keywords: [
    "kairali ayurvedic healing village",
    "kairali palakkad",
    "kairali ayurveda hospital",
  ],
};

export default function Page() {
  return (
    <main>
      <LpSchema pageUrl={`${SITE_URL}/lp/kairali-brand`} />
      <LpHero
        overline="Kairali — The Ayurvedic Healing Village · NABH-accredited Ayurvedic hospital, Palakkad"
        title={
          <>
            You searched for Kairali. <em>This is the Healing Village</em> — the hospital itself.
          </>
        }
        sub="Right place: Kairali's NABH-accredited Ayurvedic hospital in Palakkad, Kerala — the family's flagship, where programmes are planned by physicians after an in-person consultation."
        photo="/ahv/assets/img/wx-hero.webp"
        photoAlt="Kairali — The Ayurvedic Healing Village campus"
        photoCaption={{ b: "The Healing Village, Palakkad", s: "Kairali's flagship hospital" }}
      />

      <Section proof overline="Confirm you have the right place" title="Kairali, on the record">
        <div className="proof-list">
          <div className="proof-item"><b>NABH accreditation</b><span>Certificate AH-2024-0250 — in the accredited AYUSH hospital list</span></div>
          <div className="proof-item"><b>Clinical Establishment</b><span>Permanent certificate under the Kerala Act</span></div>
          <div className="proof-item"><b>Four generations</b><span>A family practice of Ayurveda behind the hospital</span></div>
          <div className="proof-item"><b>TripAdvisor Hall of Fame</b><span>Patient reviews on the public record</span></div>
        </div>
      </Section>

      <Section
        alt
        id="consult"
        overline="You are one message away"
        title="Speak to patient services"
        lead="Dates, programmes, tariffs, travel — ask on WhatsApp for the fastest answer, or send the form and we reply by email."
      >
        <LpFormSection formType="brand-enquiry" heading="Send an enquiry" />
      </Section>

      <LpLegal />
      <StickyCta />
    </main>
  );
}
