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
// GOLDEN LP — /lp/panchkarma-treatment (LP #2 of the D-LP-LIST batch).
// Message match: "panchakarma treatment Kerala / panchakarma centre India"
// (Google Search, solution-aware → authority-led mid-length page).
// Register: KTAHV clinical lock. DMR/Google-Healthcare law: programme
// descriptions only — no outcome quantities, no disease-claim promises.
// Copy carries the Gate-1 pass-2..7 rulings (verifiable creds only, no
// "designed for your condition", heritage without hard-dated age claims).
// HARD GATE 7: clinical copy queued for Dr. Deepu John's sign-off before
// staging→production. Ads still point at the LEGACY URL — nothing flips
// without Vikash's written per-URL confirmation.
// ============================================================================

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Panchakarma Treatment in Kerala | Kairali Healing Village",
    description:
      "Physician-planned Panchakarma at Kairali's NABH-accredited Ayurvedic hospital in Palakkad, Kerala. Consultation first — then therapy, diet and follow-up.",
    path: "/lp/panchkarma-treatment",
    siteName: "Kairali — The Ayurvedic Healing Village",
    ogImage: "/images/consultation-pulse.webp",
  }) as Metadata),
  keywords: [
    "panchakarma treatment kerala",
    "panchakarma centre india",
    "ayurvedic hospital palakkad",
    "panchakarma programme",
  ],
};

const FIVE_FOLDS = [
  { k: "Fold 1", h: "Vamana", p: "Therapeutic emesis, prepared for and administered only under physician supervision as part of a planned programme." },
  { k: "Fold 2", h: "Virechana", p: "Medicated purgation, scheduled by your physician after preparatory therapies and diet." },
  { k: "Fold 3", h: "Basti", p: "Medicated enema therapies — the classical core of many Panchakarma programmes, always physician-prescribed." },
  { k: "Fold 4", h: "Nasya", p: "Nasal administration of medicated preparations, where your assessment indicates it." },
  { k: "Fold 5", h: "Raktamokshana", p: "Classical blood-letting procedures, used selectively and only on clinical judgement." },
];

const FAQ = [
  {
    q: "What is Panchakarma?",
    a: "Panchakarma is classical Ayurveda's five-fold set of cleansing procedures. At the Healing Village it is practised as a physician-planned programme: preparatory therapies, the indicated procedures, a supporting diet, and rest — in NABH-accredited scope.",
  },
  {
    q: "How long does a programme take?",
    a: "That is a clinical decision, not a menu choice. Your physician sets the schedule at consultation based on your health status and history; programmes are typically measured in weeks, and the plan is reviewed through your stay.",
  },
  {
    q: "Who plans and supervises the treatment?",
    a: "Our Ayurvedic physicians. Every admission starts with an in-person consultation, and therapy is carried out by the hospital's treatment team under physician supervision.",
  },
  {
    q: "Will Panchakarma treat my medical condition?",
    a: "We do not promise outcomes for any condition. Your physician will tell you honestly, at consultation, what a programme can and cannot be expected to do in your case — and continue any conversation with your own doctors that your situation needs.",
  },
];

export default function Page() {
  return (
    <main>
      <LpSchema pageUrl={`${SITE_URL}/lp/panchkarma-treatment`} />
      <LpHero
        overline="Kairali — The Ayurvedic Healing Village · NABH-accredited Ayurvedic hospital, Palakkad"
        title={
          <>
            Panchakarma treatment in Kerala, <em>planned by physicians</em> — after your consultation.
          </>
        }
        sub="A physician-supervised programme at an NABH-accredited Ayurvedic hospital — consultation first, then five-fold therapy, diet and follow-up care."
        photo="/images/consultation-pulse.webp"
        photoAlt="Kairali physician reading a patient's pulse during an Ayurvedic consultation"
        photoCaption={{ b: "Dr. Deepu John", s: "Chief Physician — treatment planning & admission" }}
      />

      <Section
        overline="How admission works"
        title="Consultation first. Always."
        lead="No programme here is bought off a page. It is prescribed — and that order of events is the whole difference between a hospital and a brochure."
      >
        <Steps
          items={[
            { k: "Step 1", h: "In-person consultation", p: "Your physician takes your history, examines you, and decides whether — and which — Panchakarma programme is appropriate." },
            { k: "Step 2", h: "Five-fold therapy", p: "The prescribed procedures and their preparatory therapies, carried out by the hospital's treatment team on the physician's schedule." },
            { k: "Step 3", h: "Diet & follow-up", p: "A supporting diet during your admission, and follow-up guidance at discharge so the programme's routine survives the trip home." },
          ]}
        />
      </Section>

      <Section
        alt
        overline="The five folds"
        title="What Panchakarma actually is"
        lead="Five classical procedure families — each one prescribed selectively, never as a package deal. Your programme may use some, not all; that is clinical judgement doing its job."
      >
        <Steps items={FIVE_FOLDS} />
        <div className="photo-band">
          <img src="/images/therapy-panchakarma.jpg" loading="lazy" decoding="async" alt="Panchakarma therapy in progress at the Healing Village" />
          <img src="/images/therapy-abhyanga.jpg" loading="lazy" decoding="async" alt="Two therapists performing synchronised Abhyanga massage" />
          <img src="/images/healing-village-grounds.jpg" loading="lazy" decoding="async" alt="Treatment buildings and gardens at the Healing Village, Palakkad" />
        </div>
      </Section>

      <Section
        proof
        overline="Evidence before adjectives"
        title="An accredited hospital, on the record"
      >
        <div className="proof-list">
          <div className="proof-item"><b>NABH accreditation</b><span>Certificate AH-2024-0250 · Panchakarma within accredited scope</span></div>
          <div className="proof-item"><b>Clinical Establishment</b><span>Permanent certificate under the Kerala Act</span></div>
          <div className="proof-item"><b>Physician-led</b><span>Ayurvedic doctors plan and review every programme</span></div>
          <div className="proof-item"><b>Four generations</b><span>A family practice of Ayurveda behind the hospital</span></div>
        </div>
      </Section>

      <Section
        overline="Your physicians"
        title="The people who plan your programme"
      >
        <PhysicianRow />
      </Section>

      <Section
        alt
        overline="Patient voices"
        title="What patients say"
        lead="Individual experiences from patients who chose to speak on camera. They are personal accounts — not a promise of results; outcomes differ from person to person."
      >
        <div className="video-embed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/CcDPOeSR67E"
            title="Patient experiences at Kairali — The Ayurvedic Healing Village"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Section>

      <Section overline="Questions patients ask" title="Panchakarma, plainly answered">
        <Faq items={FAQ} />
      </Section>

      <Section
        alt
        id="consult"
        overline="Begin with a consultation"
        title="Request a consultation"
        lead="Tell us where you are and what you are dealing with. Our patient-services team replies with consultation options — the physician takes it from there."
      >
        <LpFormSection />
      </Section>

      <LpLegal />
      <StickyCta />
    </main>
  );
}
