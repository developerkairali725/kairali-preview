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
// LP #1 — /lp/treatment-packages (rebuild of /ayurvedic-treatment-packages.html).
// Message match: "ayurvedic treatment packages Kerala" (Google Search,
// solution-aware → short, offer-led). Register: KTAHV clinical lock — the
// legacy page's programme-catalogue architecture is kept, its hospitality
// vocabulary is not. PRICE BLOCKS DEFERRED: the live page's price displays are
// carried only after a re-diff against live + owner confirmation (HARD GATE 6
// — no unverified figures tonight; flagged in the PR).
// Ads point at the LEGACY URL — nothing flips without Vikash's written word.
// ============================================================================

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Ayurvedic Treatment Packages in Kerala | Kairali KTAHV",
    description:
      "Physician-planned Ayurvedic treatment packages at Kairali's NABH-accredited hospital in Palakkad, Kerala. Consultation first — enquire on WhatsApp.",
    path: "/lp/treatment-packages",
    siteName: "Kairali — The Ayurvedic Healing Village",
    ogImage: "/images/therapy-abhyanga.jpg",
  }) as Metadata),
  keywords: [
    "ayurvedic treatment packages kerala",
    "ayurveda package india",
    "panchakarma package kerala",
    "ayurvedic hospital palakkad",
  ],
};

export default function Page() {
  return (
    <main>
      <LpSchema pageUrl={`${SITE_URL}/lp/treatment-packages`} />
      <LpHero
        overline="Kairali — The Ayurvedic Healing Village · NABH-accredited Ayurvedic hospital, Palakkad"
        title={
          <>
            Ayurvedic treatment packages in Kerala — <em>prescribed, not picked</em>.
          </>
        }
        sub="Every package here is a physician-planned programme: your consultation decides the therapies, the diet and the duration — then the package is built around you."
        photo="/images/therapy-abhyanga.jpg"
        photoAlt="Synchronised Abhyanga therapy at the Healing Village treatment rooms"
        photoCaption={{ b: "Hospital treatment rooms", s: "Therapies on a physician's schedule" }}
      />

      <Section
        overline="Programme families"
        title="The packages, as a physician reads them"
        lead="Four programme families cover most admissions. Which one fits — and for how long — is decided at consultation, not at checkout."
      >
        <Steps
          items={[
            { k: "Programme", h: "Panchakarma", p: "The classical five-fold cleansing programme — preparatory therapies, the indicated procedures, diet and rest." },
            { k: "Programme", h: "Rejuvenation", p: "Restorative therapies, oils and routine for patients run down by work, travel or recovery." },
            { k: "Programme", h: "Detoxification", p: "A shorter cleansing schedule where a full Panchakarma programme is not indicated." },
            { k: "Programme", h: "Stress management", p: "Therapy, routine, diet and rest structured around the nervous system's recovery." },
          ]}
        />
        <p className="lp-lead" style={{ marginTop: 22 }}>
          Programme fees depend on the physician&apos;s plan and your accommodation choice — our
          patient-services team shares current tariffs when you enquire.
        </p>
      </Section>

      <Section
        alt
        overline="Where patients stay"
        title="Hospital care, village quiet"
        lead="Patients are admitted to private villas across the treatment gardens — accommodation in service of the programme: rest, diet and therapy within walking distance of your physician."
      >
        <div className="photo-band">
          <img src="/images/patient-villa-classic.jpg" loading="lazy" decoding="async" alt="Classic patient villa at the Healing Village" />
          <img src="/images/patient-villa-maharaja.jpg" loading="lazy" decoding="async" alt="Maharaja patient villa exterior among the trees" />
          <img src="/images/healing-village-grounds.jpg" loading="lazy" decoding="async" alt="Treatment gardens at the Healing Village, Palakkad" />
        </div>
      </Section>

      <Section proof overline="Evidence before adjectives" title="On the record">
        <div className="proof-list">
          <div className="proof-item"><b>NABH accreditation</b><span>Certificate AH-2024-0250 · Panchakarma within accredited scope</span></div>
          <div className="proof-item"><b>Clinical Establishment</b><span>Permanent certificate under the Kerala Act</span></div>
          <div className="proof-item"><b>TripAdvisor Hall of Fame</b><span>Patient reviews, on the public record</span></div>
          <div className="proof-item"><b>Physician-led</b><span>Doctors plan and review every programme</span></div>
        </div>
      </Section>

      <Section overline="Your physicians" title="Who plans your package">
        <PhysicianRow />
      </Section>

      <Section
        alt
        id="consult"
        overline="Begin with a consultation"
        title="Ask about a treatment package"
        lead="Tell us what you are dealing with and when you could travel. We reply with programme options and current tariffs; your physician confirms the plan at consultation."
      >
        <LpFormSection formType="package-enquiry" heading="Enquire about packages" />
      </Section>

      <LpLegal />
      <StickyCta />
    </main>
  );
}
