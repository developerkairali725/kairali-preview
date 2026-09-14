import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import siteConfig from "../../../../site.config.json";
import {
  Faq,
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
// LP #10 — /lp/treatment-in-kerala (rebuild of /treatment-in-kerala.html —
// the broadest head term of the set, and the WORST visible banned-word counts
// of the ten on the live page). The legacy "300K+ treatments / 87%
// satisfaction" stat block is NOT carried — owner verification first (HARD
// GATE 6; mining note). The legacy duplicated-H1 typo dies here: one H1,
// message-matched. Price blocks DEFERRED pending re-diff + owner confirm.
// Ads point at the LEGACY URL — nothing flips without Vikash's written word.
// ============================================================================

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Ayurvedic Treatment in Kerala | Kairali Healing Village",
    description:
      "Physician-planned Ayurvedic treatment at Kairali's NABH-accredited hospital in Palakkad, Kerala — consultation, therapy, diet and follow-up, on the record.",
    path: "/lp/treatment-in-kerala",
    siteName: "Kairali — The Ayurvedic Healing Village",
    ogImage: "/images/healing-village-grounds.jpg",
  }) as Metadata),
  keywords: [
    "ayurvedic treatment kerala",
    "ayurveda kerala hospital",
    "panchakarma treatment india",
    "kairali healing village",
  ],
};

const FAQ = [
  {
    q: "What treatments does the hospital offer?",
    a: "Classical Ayurvedic programmes: Panchakarma and its five-fold procedures, restorative and cleansing therapies, pain-management programmes, and physician-planned diet and routine. Which of them apply to you is decided at consultation.",
  },
  {
    q: "How do I choose the right programme?",
    a: "You do not have to — that is the physician's job. Send your situation and records; the consultation settles the programme, its length and its schedule.",
  },
  {
    q: "Is this a medical facility or a wholesome hotel?",
    a: "A hospital first — NABH-accredited and physician-led, with proper admission and discharge. The comfort is deliberate: quiet villas and gardens help patients rest, sleep and recover between treatments. You will be comfortable here, and you will be cared for as a patient.",
  },
];

export default function Page() {
  return (
    <main>
      <LpSchema pageUrl={`${SITE_URL}/lp/treatment-in-kerala`} />
      <LpHero
        overline="Kairali — The Ayurvedic Healing Village · NABH-accredited Ayurvedic hospital, Palakkad"
        title={
          <>
            Ayurvedic treatment in Kerala, <em>the way a hospital does it</em> — consultation first.
          </>
        }
        sub="Kairali's Healing Village runs classical Ayurvedic programmes under physician supervision: assessment, therapy, hospital-kitchen diet, and follow-up at discharge."
        photo="/images/healing-village-grounds.jpg"
        photoAlt="Treatment buildings and gardens of the Healing Village in Palakkad"
        photoCaption={{ b: "The Healing Village, Palakkad", s: "An accredited Ayurvedic hospital" }}
      />

      <Section
        overline="What we treat you with"
        title="The programme families"
        lead="Every admission draws on the same clinical toolkit — which tools, and for how long, is your physician's call at consultation."
      >
        <Steps
          items={[
            { k: "Programme", h: "Panchakarma", p: "The classical five-fold cleansing sequence: preparation, the indicated procedures, rebuilding." },
            { k: "Programme", h: "Restorative care", p: "Oil therapies, diet and routine for depletion, poor sleep and long recoveries." },
            { k: "Programme", h: "Pain management", p: "Assessment-led programmes for chronic back, neck and joint discomfort." },
            { k: "Programme", h: "Diet & routine", p: "The hospital kitchen and a physician-set daily rhythm — the quiet half of every programme." },
          ]}
        />
      </Section>

      <Section
        alt
        overline="The place"
        title="A hospital built like a village"
      >
        {/* Battery nit-fix: hero already serves healing-village-grounds.jpg —
            band leads with the other campus photograph instead of repeating it. */}
        <div className="photo-band">
          <img src="/images/hospital-campus.jpg" loading="lazy" decoding="async" alt="Treatment buildings of the Healing Village campus" />
          <img src="/images/therapy-abhyanga.jpg" loading="lazy" decoding="async" alt="Therapists at work in a treatment room" />
          <img src="/images/patient-villa-classic.jpg" loading="lazy" decoding="async" alt="A patient villa in the treatment gardens" />
        </div>
      </Section>

      <Section proof overline="Evidence before adjectives" title="On the record">
        <div className="proof-list">
          <div className="proof-item"><b>NABH accreditation</b><span>Certificate AH-2024-0250 · Panchakarma within accredited scope</span></div>
          <div className="proof-item"><b>Clinical Establishment</b><span>Permanent certificate under the Kerala Act</span></div>
          <div className="proof-item"><b>Four generations</b><span>A family practice of Ayurveda behind the hospital</span></div>
          <div className="proof-item"><b>TripAdvisor Hall of Fame</b><span>Patient reviews on the public record</span></div>
        </div>
      </Section>

      <Section overline="Your physicians" title="Who plans your treatment">
        <PhysicianRow />
      </Section>

      <Section overline="Questions patients ask" title="Plainly answered">
        <Faq items={FAQ} />
      </Section>

      <Section
        alt
        id="consult"
        overline="Begin with a consultation"
        title="Request a consultation"
        lead="Tell us what you are dealing with and when you could travel. Patient services replies with options; the physician decides the programme with you."
      >
        <LpFormSection />
      </Section>

      <LpLegal />
      <StickyCta />
    </main>
  );
}
