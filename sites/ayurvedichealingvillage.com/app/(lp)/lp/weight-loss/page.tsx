import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import siteConfig from "../../../../site.config.json";
import {
  Cred,
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
// LP #3 — /lp/weight-loss (rebuild of /weight-loss.html — THE highest-risk
// page of the ten, per the mining notes).
// Message match: "ayurvedic weight loss treatment Kerala" (result-seeking
// audience → long, proof-led funnel KEPT; its claims rebuilt).
// DMR Act / Google Healthcare / ASCI law applied in full:
//   · every "N kgs in N days" quantified-outcome badge is GONE — that claim
//     class is BANNED (brief §2; DMR + Google Healthcare policy);
//   · the legacy "additional benefits" list naming diabetes/BP/cholesterol is
//     GONE — diabetes is a DMR-scheduled disease; no disease claims ship;
//   · outcomes are framed as programme description + disclaimed testimonial.
// Patient photos from the legacy funnel are NOT reused (consent unconfirmed —
// asset-manifest caution). HARD GATE 7: physician sign-off before production.
// Ads point at the LEGACY URL — nothing flips without Vikash's written word.
// ============================================================================

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Ayurvedic Weight Loss Treatment in Kerala | Kairali KTAHV",
    description:
      "A physician-guided Ayurvedic weight-management programme at Kairali's NABH-accredited hospital in Kerala — assessment, therapy, diet and follow-up.",
    path: "/lp/weight-loss",
    siteName: "Kairali — The Ayurvedic Healing Village",
    ogImage: "/images/consultation-pulse.webp",
  }) as Metadata),
  keywords: [
    "ayurvedic weight loss treatment kerala",
    "weight management programme ayurveda",
    "ayurvedic hospital palakkad",
  ],
};

// Battery beauty-gate fix (18 Jul pass-1, B2/B6): weight-loss-specific hero
// creds — the generic "Panchakarma in scope" chip read as component carryover
// on this avatar's page; the honest-advertising stance IS this LP's credential.
const CREDS_WL: Cred[] = [
  { b: <span className="nabh-chip">NABH</span>, s: "accredited · AH-2024-0250" },
  { b: "Physician-assessed", s: "admission after consultation" },
  { b: "Honest advertising", s: "no outcome figures, by policy and by law" },
  { b: "Hospital kitchen", s: "programme diets prepared in-house" },
];

const FAQ = [
  {
    q: "How much weight will I lose?",
    a: "We will not name a number, and you should distrust any advertisement that does. Bodies differ, and Indian law on medical advertising exists precisely because promised outcomes mislead. What we commit to is the programme itself: assessment, supervised therapy, a disciplined diet, and honest physician review of your progress.",
  },
  {
    q: "What does the programme involve day to day?",
    a: "A physician-set schedule: therapies through the morning, a prescribed diet from the hospital kitchen, activity appropriate to your assessment, and rest. The routine is the treatment.",
  },
  {
    q: "How long is an admission?",
    a: "Your physician decides at consultation, based on your health status and goals — typically a matter of weeks, reviewed as you go.",
  },
  {
    q: "I have other health conditions. Can I still come?",
    a: "Bring your medical records to the consultation. Your physician will review them, tell you plainly whether admission makes sense in your case, and coordinate with the care you already receive. We do not treat this programme as a substitute for the medical care your conditions need.",
  },
];

export default function Page() {
  return (
    <main>
      <LpSchema pageUrl={`${SITE_URL}/lp/weight-loss`} />
      <LpHero
        overline="Kairali — The Ayurvedic Healing Village · NABH-accredited Ayurvedic hospital, Palakkad"
        title={
          <>
            Ayurvedic weight-loss treatment in Kerala — <em>a programme, not a promise</em>.
          </>
        }
        sub="Physician-assessed, hospital-admitted weight management: supervised therapies, a prescribed diet, daily routine and follow-up. No numbers promised — a method, honestly run."
        creds={CREDS_WL}
        photo="/images/consultation-pulse.webp"
        photoAlt="Kairali physician assessing a patient at consultation"
        photoCaption={{ b: "Dr. Deepu John", s: "Chief Physician — treatment planning & admission" }}
      />

      <Section
        overline="Why the crash-diet loop fails"
        title="You have probably tried harder than most people ever will"
        lead="Restriction, rebound, repeat — the cycle is not a willpower failure, it is a method failure. An admitted programme changes the method: the food, the routine, the therapy and the review all happen in one supervised place."
      >
        <Steps
          items={[
            { k: "The pattern", h: "Diets end", p: "Anything you can only do for six weeks will only work for six weeks. The programme is built as a routine you take home." },
            { k: "The pattern", h: "Alone is hard", p: "At home, the kitchen, the schedule and the accountability are all yours to police. Under admission, they are the hospital's job." },
            { k: "The pattern", h: "One-size fails", p: "The same plan cannot fit every body. Your programme starts from your assessment, not from a template." },
          ]}
        />
      </Section>

      <Section
        alt
        overline="The programme"
        title="What a weight-management admission looks like"
      >
        <Steps
          items={[
            { k: "Step 1", h: "Assessment", p: "In-person consultation: history, examination, and your records reviewed. The physician sets the plan — or tells you honestly if admission is not the right tool." },
            { k: "Step 2", h: "Supervised therapy", p: "Daily treatments — massage-based and cleansing therapies as indicated — carried out by the hospital's treatment team." },
            { k: "Step 3", h: "Diet & routine", p: "A prescribed diet from the hospital kitchen and a daily rhythm of activity and rest. The routine is designed to survive your trip home." },
            { k: "Step 4", h: "Review & follow-up", p: "Progress reviewed by your physician through the stay; discharge guidance and follow-up so the work continues after you leave." },
          ]}
        />
        {/* Battery beauty-gate fix (B2/B6): the place itself — the programme's
            setting is half its method (quiet, gardens, hospital kitchen), and
            this was the only LP of the ten without a Kerala/place band. */}
        <div className="photo-band">
          <img src="/images/healing-village-grounds.jpg" loading="lazy" decoding="async" alt="Treatment gardens between the Healing Village's buildings, Palakkad" />
          <img src="/images/therapy-abhyanga.jpg" loading="lazy" decoding="async" alt="Supervised therapy in a Healing Village treatment room" />
          <img src="/images/patient-villa-classic.jpg" loading="lazy" decoding="async" alt="A quiet patient villa inside the treatment gardens" />
        </div>
      </Section>

      <Section proof overline="Evidence before adjectives" title="On the record">
        <div className="proof-list">
          <div className="proof-item"><b>NABH accreditation</b><span>Certificate AH-2024-0250</span></div>
          <div className="proof-item"><b>Clinical Establishment</b><span>Permanent certificate under the Kerala Act</span></div>
          <div className="proof-item"><b>Physician-led</b><span>Assessment before admission, review through the stay</span></div>
          <div className="proof-item"><b>Honest advertising</b><span>No outcome figures, by policy and by law</span></div>
        </div>
      </Section>

      <Section overline="Your physicians" title="Who runs your programme">
        <PhysicianRow />
      </Section>

      {/* Patient-voices video section REMOVED 21 Jul 2026 (Dr. Deepu John's
          review: "video is not available" — verified: YouTube JztT26hwdnA
          returns 404 on oembed, the video is gone). HARD GATE 6: nothing
          invented in its place; the section returns when a working patient
          video is supplied (creative-asset request lane). */}

      <Section overline="Questions patients ask" title="Asked and answered — honestly">
        <Faq items={FAQ} />
      </Section>

      <Section
        alt
        id="consult"
        overline="Begin with a consultation"
        title="Request a consultation"
        lead="Tell us where you are starting from. Our patient-services team replies with consultation options; the physician decides the programme with you."
      >
        <LpFormSection />
      </Section>

      <LpLegal />
      <StickyCta />
    </main>
  );
}
