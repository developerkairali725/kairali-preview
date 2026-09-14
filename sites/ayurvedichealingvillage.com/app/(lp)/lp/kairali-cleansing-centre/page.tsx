import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import siteConfig from "../../../../site.config.json";
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
// LP #5 — /lp/kairali-cleansing-centre (rebuild of /kairali-cleansing-centre.html).
// Message match: "ayurvedic hospital Kerala / cleansing centre" — the legacy
// page closest to the clinical register in INTENT; its body copy was still
// hospitality-toned (its meta described the villas in banned-register
// vocabulary) and its schema carried the
// hospitality @type. Both fixed here. Price blocks DEFERRED pending re-diff +
// owner confirm (HARD GATE 6).
// Ads point at the LEGACY URL — nothing flips without Vikash's written word.
// ============================================================================

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Kairali Cleansing Centre | Ayurvedic Hospital in Kerala",
    description:
      "Physician-planned cleansing programmes at Kairali's NABH-accredited Ayurvedic hospital in Palakkad — Panchakarma in scope, admission to discharge.",
    path: "/lp/kairali-cleansing-centre",
    siteName: "Kairali — The Ayurvedic Healing Village",
    ogImage: "/images/therapy-panchakarma.jpg",
  }) as Metadata),
  keywords: [
    "ayurvedic hospital kerala",
    "ayurvedic cleansing centre",
    "panchakarma detox kerala",
    "kairali healing village",
  ],
};

export default function Page() {
  return (
    <main>
      <LpSchema pageUrl={`${SITE_URL}/lp/kairali-cleansing-centre`} />
      <LpHero
        overline="Kairali — The Ayurvedic Healing Village · NABH-accredited Ayurvedic hospital, Palakkad"
        title={
          <>
            Kairali&apos;s cleansing centre — <em>Panchakarma as hospital medicine</em>, not a menu.
          </>
        }
        sub="Cleansing programmes prescribed by physicians and carried out under supervision: preparatory therapy, the indicated procedures, a hospital-kitchen diet, and proper discharge."
        photo="/images/therapy-panchakarma.jpg"
        photoAlt="A Panchakarma cleansing therapy underway at the Healing Village"
        photoCaption={{ b: "Hospital treatment rooms", s: "Cleansing procedures under supervision" }}
      />

      <Section
        overline="How cleansing works here"
        title="Prepared, performed, closed out"
        lead="Classical cleansing is a sequence, not a session. Skipping the preparation or the wind-down is how cleansing programmes go wrong — so here the sequence is the law."
      >
        <Steps
          items={[
            { k: "Stage 1", h: "Preparation", p: "Internal and external oleation and warming therapies ready the body for the main procedures, on the physician's schedule." },
            { k: "Stage 2", h: "The procedures", p: "The indicated cleansing procedures from the classical five-fold set — only those your assessment calls for." },
            { k: "Stage 3", h: "Rebuilding", p: "Diet, rest and restorative therapy close the programme, with discharge guidance for the weeks after." },
          ]}
        />
        {/* Battery beauty-gate fix (18 Jul pass-1, B2): the place band — the
            village setting is part of the safety story (rest between
            procedures happens somewhere real), and this LP lacked any
            Kerala/place imagery. */}
        <div className="photo-band">
          <img src="/images/healing-village-grounds.jpg" loading="lazy" decoding="async" alt="Treatment gardens between the Healing Village's buildings, Palakkad" />
          <img src="/images/therapy-abhyanga.jpg" loading="lazy" decoding="async" alt="Preparatory oleation therapy in a hospital treatment room" />
          <img src="/images/patient-villa-classic.jpg" loading="lazy" decoding="async" alt="A quiet patient villa where patients rest between procedures" />
        </div>
      </Section>

      <Section proof overline="Evidence before adjectives" title="On the record">
        <div className="proof-list">
          <div className="proof-item"><b>NABH accreditation</b><span>Certificate AH-2024-0250 · Panchakarma within accredited scope</span></div>
          <div className="proof-item"><b>Clinical Establishment</b><span>Permanent certificate under the Kerala Act</span></div>
          <div className="proof-item"><b>Physician-led</b><span>Every cleansing programme is prescribed, never self-selected</span></div>
          <div className="proof-item"><b>Hospital kitchen</b><span>Programme diets prepared in-house</span></div>
        </div>
      </Section>

      <Section overline="Your physicians" title="Who prescribes the programme">
        <PhysicianRow />
      </Section>

      <Section
        alt
        id="consult"
        overline="Begin with a consultation"
        title="Ask about a cleansing programme"
        lead="Tell us your situation and travel window. Patient services replies with options and current tariffs; the physician decides the programme with you at consultation."
      >
        <LpFormSection formType="cleansing-enquiry" heading="Ask about cleansing programmes" />
      </Section>

      <LpLegal />
      <StickyCta />
    </main>
  );
}
