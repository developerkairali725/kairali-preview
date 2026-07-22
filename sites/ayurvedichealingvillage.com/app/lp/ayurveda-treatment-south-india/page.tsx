import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import siteConfig from "../../../site.config.json";
import {
  LpHero,
  LpLegal,
  LpSchema,
  PhysicianRow,
  Section,
  Steps,
  StickyCta,
  SITE_URL,
} from "../../_components/lp";
import { LpFormSection } from "../../_components/lp-form";

// ============================================================================
// LP #6 — /lp/ayurveda-treatment-south-india (rebuild candidate for
// /Ayurveda_Treatment_Neo_S.India_Cities.html — city-geo PPC: Bengaluru /
// Chennai / Hyderabad). The strategy's proposed clean slug; the LIVE
// mixed-case slug keeps serving ads untouched until Vikash rules per URL.
// India-geo → the WhatsApp-first doctrine applies HARDEST here (§4 CTWA law):
// short page, fast to the one action. No distances/travel-times invented
// (HARD GATE 6) — connectivity stated generically.
// ============================================================================

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Ayurvedic Treatment in South India | Kairali, Palakkad",
    description:
      "A weekend train or short flight from Bengaluru, Chennai or Hyderabad: physician-planned Ayurvedic treatment at Kairali's NABH-accredited Kerala hospital.",
    path: "/lp/ayurveda-treatment-south-india",
    siteName: "Kairali — The Ayurvedic Healing Village",
    // Battery fix (18 Jul): therapy-south-india.jpg is a LEGACY CAMPAIGN BANNER
    // with baked-in text — "25% Summer Special Off on all packages", "Health
    // Retreat", a "World Luxury Spa Awards" badge: an unverified offer claim
    // (HARD GATE 6) + banned-register words in pixels. Swapped to the clean
    // mined campus photograph; the banner stays in the repo as a mined asset
    // only, never rendered.
    ogImage: "/images/treatment-context.jpg",
  }) as Metadata),
  keywords: [
    "ayurvedic treatment south india",
    "ayurveda hospital near bangalore",
    "panchakarma centre chennai hyderabad",
    "kairali palakkad",
  ],
};

export default function Page() {
  return (
    <main>
      <LpSchema pageUrl={`${SITE_URL}/lp/ayurveda-treatment-south-india`} />
      <LpHero
        overline="Kairali — The Ayurvedic Healing Village · NABH-accredited Ayurvedic hospital, Palakkad"
        title={
          <>
            Ayurvedic treatment in South India — <em>a real hospital</em>, within reach of your city.
          </>
        }
        sub="From Bengaluru, Chennai or Hyderabad, Palakkad is a straightforward trip by rail or air — and what waits at the end is an NABH-accredited Ayurvedic hospital, not a weekend salon."
        photo="/images/treatment-context.jpg"
        photoAlt="A patient villa amid the treatment gardens at the Healing Village, Palakkad"
        photoCaption={{ b: "The Healing Village, Palakkad", s: "Physician-planned programmes" }}
      />

      <Section
        overline="Why patients travel"
        title="Worth more than a city appointment"
        lead="A weekly session in your city has its place. An admitted programme is a different instrument: therapy, diet, routine and physician review, all in one place, for long enough to matter."
      >
        <Steps
          items={[
            { k: "Reason 1", h: "Admission, not appointments", p: "Days of continuous, physician-scheduled treatment build on each other in a way occasional sessions rarely can." },
            { k: "Reason 2", h: "The kitchen is the pharmacy", p: "Programme diets are prepared in the hospital kitchen — the half of Ayurveda a city visit skips." },
            { k: "Reason 3", h: "Getting here is easy", p: "Palakkad is well connected to Bengaluru, Chennai and Hyderabad by rail and by air via Coimbatore. Patient services will help you plan the leg from the station or airport." },
          ]}
        />
      </Section>

      <Section proof overline="Evidence before adjectives" title="On the record">
        <div className="proof-list">
          <div className="proof-item"><b>NABH accreditation</b><span>Certificate AH-2024-0250</span></div>
          <div className="proof-item"><b>Clinical Establishment</b><span>Permanent certificate under the Kerala Act</span></div>
          <div className="proof-item"><b>Physician-led</b><span>Consultation before admission, review through the stay</span></div>
          <div className="proof-item"><b>Patient villas</b><span>Quiet accommodation inside the treatment gardens</span></div>
        </div>
      </Section>

      <Section overline="Your physicians" title="Who plans your treatment">
        <PhysicianRow />
      </Section>

      <Section
        alt
        id="consult"
        overline="Fastest way: WhatsApp"
        title="Ask us anything, today"
        lead="WhatsApp is the quickest route — dates, programmes, tariffs, travel. Prefer a form? Same team, same answers."
      >
        <LpFormSection formType="city-enquiry" heading="Send an enquiry" />
      </Section>

      <LpLegal />
      <StickyCta />
    </main>
  );
}
