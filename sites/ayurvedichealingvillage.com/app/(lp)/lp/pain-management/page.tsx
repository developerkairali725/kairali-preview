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
// LP #8 — /lp/pain-management (rebuild of /pain-management.html — the REGISTER
// MODEL PAGE of the ten: zero visible banned words on the live page; its
// structure is preserved as the template the others rebuild toward).
// DMR care: the legacy "recommended for" condition list edges into scheduled-
// disease territory (rheumatism etc.) — this rebuild names NO scheduled
// diseases and describes programmes, never outcomes. Physician sign-off
// (HARD GATE 7) queued for the clinical copy before production.
// Ads point at the LEGACY URL — nothing flips without Vikash's written word.
// ============================================================================

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Ayurvedic Pain Management in Kerala | Kairali KTAHV",
    description:
      "Physician-assessed Ayurvedic pain-management programmes at Kairali's NABH-accredited hospital in Kerala: therapy, diet and routine — planned, not promised.",
    path: "/lp/pain-management",
    siteName: "Kairali — The Ayurvedic Healing Village",
    ogImage: "/images/therapy-pain-management.jpg",
  }) as Metadata),
  keywords: [
    "ayurvedic pain management kerala",
    "chronic pain ayurveda programme",
    "ayurvedic hospital palakkad",
  ],
};

const THERAPIES = [
  { k: "Therapy", h: "Abhyanga", p: "Whole-body medicated-oil massage by trained therapists, scheduled as your plan indicates." },
  { k: "Therapy", h: "Pizhichil", p: "Continuous warm-oil pouring with massage — a classical therapy for musculoskeletal complaints." },
  { k: "Therapy", h: "Kizhi", p: "Warm herbal poultices applied over affected areas, prepared in the hospital's own pharmacy." },
  { k: "Therapy", h: "Basti family", p: "Localised oil-retention therapies (e.g. for the lower back or knees) where the assessment indicates them." },
];

const FAQ = [
  {
    q: "What kinds of pain do patients come with?",
    a: "Most commonly long-running back, neck, shoulder and joint discomfort, and stiffness that has stopped responding to rest. Whether our programmes suit YOUR case is exactly what the consultation decides — bring your records and imaging.",
  },
  {
    q: "Will the programme fix my pain?",
    a: "No honest hospital promises that, and Indian law on medical advertising forbids it. What we commit to: a careful assessment, a physician-planned programme, supervised therapy, and a straight answer at every review.",
  },
  {
    q: "Do I stop my current treatment?",
    a: "No. Bring your prescriptions to the consultation; our physicians plan around your existing care and will tell you plainly what should not change.",
  },
];

export default function Page() {
  return (
    <main>
      <LpSchema pageUrl={`${SITE_URL}/lp/pain-management`} />
      <LpHero
        overline="Kairali — The Ayurvedic Healing Village · NABH-accredited Ayurvedic hospital, Palakkad"
        title={
          <>
            Ayurvedic pain management in Kerala — <em>assessed first</em>, then treated.
          </>
        }
        sub="A physician examines you, reads your records, and only then builds the programme: supervised therapies, diet and daily routine, reviewed through your admission."
        photo="/images/therapy-pain-management.jpg"
        photoAlt="A therapist administering a warm-oil therapy at the Healing Village"
        photoCaption={{ b: "Hospital treatment rooms", s: "Therapy on a physician's schedule" }}
      />

      <Section
        overline="The approach"
        title="Programme, not procedure"
        lead="Chronic discomfort rarely yields to one intervention. The programme treats it as a whole: therapy for the body, diet from the hospital kitchen, routine for the habits that feed the problem."
      >
        <Steps
          items={[
            { k: "Step 1", h: "Assessment", p: "In-person consultation with your records and imaging: the physician maps what hurts, what drives it, and what a programme can honestly aim at." },
            { k: "Step 2", h: "The plan", p: "Therapies, diet and routine set out day by day — and adjusted at physician reviews through your stay." },
            { k: "Step 3", h: "Discharge & after", p: "A home routine and follow-up guidance, so the programme's gains have somewhere to live after you leave." },
          ]}
        />
      </Section>

      <Section alt overline="The therapies" title="What your plan may draw on">
        <Steps items={THERAPIES} />
      </Section>

      <Section proof overline="Why choose Kairali" title="Care you can plan around">
        <div className="proof-list">
          <div className="proof-item"><b>NABH accreditation</b><span>Certificate AH-2024-0250</span></div>
          <div className="proof-item"><b>Clinical Establishment</b><span>Permanent certificate under the Kerala Act</span></div>
          <div className="proof-item"><b>In-house pharmacy</b><span>Medicated oils and poultices prepared on site</span></div>
          <div className="proof-item"><b>Physician-led</b><span>Assessment before admission, review through the stay</span></div>
        </div>
      </Section>

      <Section overline="Your physicians" title="Who assesses you">
        <PhysicianRow />
      </Section>

      <Section overline="Questions patients ask" title="Straight answers">
        <Faq items={FAQ} />
      </Section>

      <Section
        alt
        id="consult"
        overline="Begin with a consultation"
        title="Request an assessment"
        lead="Describe the discomfort, how long it has been there, and what you have tried. Patient services replies with consultation options; the physician takes it from there."
      >
        <LpFormSection formType="pain-consultation" heading="Request an assessment" />
      </Section>

      <LpLegal />
      <StickyCta />
    </main>
  );
}
