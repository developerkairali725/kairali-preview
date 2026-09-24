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
// LP #4 — /lp/ayurvedic-hospital-kerala (rebuild candidate for
// /wellness-resort-kerala.html — the legacy slug carries a banned word, so the
// FACTORY slug is the strategy's proposed replacement; the LIVE slug decision
// is Vikash's, per URL, in writing, and the legacy URL keeps serving ads
// untouched until he rules).
// Message match: high-volume hospitality-intent international searchers. The
// strategy's answer to the register tension: "the hospital the searcher
// actually needs" — meet the intent (rest, care, Kerala), sell the hospital.
// Register: KTAHV clinical lock; USD price blocks DEFERRED pending re-diff +
// owner confirm (HARD GATE 6). Form-first for international; WA retained.
// ============================================================================

export const metadata: Metadata = {
  ...(buildMetadata(siteConfig, {
    title: "Ayurvedic Hospital in Kerala | Kairali Healing Village",
    // The query word below is deliberate EN message-match to the live
    // hospitality-intent query this campaign serves (strategy §1 #4); the EN
    // banned list deliberately excludes it — the DE seed ban targets German copy.
    // Suppressions are per-line and reported as loud info, never silent.
    description:
      "Searching for wellness in Kerala? Kairali is the NABH-accredited Ayurvedic hospital behind the famous gardens — physician-planned care, village quiet.", // compliance-allow: wellness
    path: "/lp/ayurvedic-hospital-kerala",
    siteName: "Kairali — The Ayurvedic Healing Village",
    ogImage: "/ahv/assets/img/wx-hero.webp",
  }) as Metadata),
  keywords: [
    "ayurvedic hospital kerala",
    "wellness kerala ayurveda", // compliance-allow: wellness
    "ayurvedic treatment centre palakkad",
    "panchakarma hospital india",
  ],
};

export default function Page() {
  return (
    <main>
      <LpSchema pageUrl={`${SITE_URL}/lp/ayurvedic-hospital-kerala`} />
      <LpHero
        overline="Kairali — The Ayurvedic Healing Village · NABH-accredited Ayurvedic hospital, Palakkad"
        title={
          <>
            Came looking for wellness in Kerala? <em>What you need is a hospital</em> that feels like a village.{/* compliance-allow: wellness */}
          </>
        }
        sub="Kairali's Healing Village is an NABH-accredited Ayurvedic hospital set in treatment gardens: physician-planned programmes, admission and discharge, quiet villas — care first, scenery second."
        photo="/ahv/assets/img/wx-hero.webp"
        photoAlt="The Healing Village campus in Palakkad — treatment buildings among gardens"
        photoCaption={{ b: "The Healing Village, Palakkad", s: "A hospital in treatment gardens" }}
      />

      <Section
        overline="The difference"
        title="What a hospital brings that a hotel does not"
        lead="Many places in Kerala offer Ayurvedic therapies. The difference here is who decides your treatment, and on what grounds."
      >
        <Steps
          items={[
            { k: "Difference 1", h: "A physician decides", p: "Your programme is prescribed at consultation from your history and examination — not chosen from a brochure page." },
            { k: "Difference 2", h: "Accredited protocols", p: "NABH accreditation means audited clinical processes: records, hygiene, qualified therapists, physician oversight." },
            { k: "Difference 3", h: "Admission to discharge", p: "You are a patient here, with a plan that is reviewed through your stay and closed out properly at discharge." },
          ]}
        />
      </Section>

      <Section
        alt
        overline="After you leave"
        title="Post-treatment care, taken seriously"
        lead="The fortnight after a programme matters as much as the programme. Discharge comes with diet and routine guidance, and our physicians remain reachable for follow-up questions as you settle back home."
      >
        <div className="photo-band">
          <img src="/ahv/assets/img/wx-pathway.jpg" loading="lazy" decoding="async" alt="Gardens between treatment buildings at the Healing Village" />
          <img src="/images/therapy-abhyanga.jpg" loading="lazy" decoding="async" alt="Therapists at work in a Healing Village treatment room" />
          <img src="/images/patient-villa-classic.jpg" loading="lazy" decoding="async" alt="A patient villa at the Healing Village" />
        </div>
      </Section>

      <Section proof overline="Why choose Kairali" title="Care you can plan around">
        <div className="proof-list">
          <div className="proof-item"><b>NABH accreditation</b><span>Certificate AH-2024-0250 · Panchakarma within accredited scope</span></div>
          <div className="proof-item"><b>Clinical Establishment</b><span>Permanent certificate under the Kerala Act</span></div>
          <div className="proof-item"><b>TripAdvisor Hall of Fame</b><span>Patient reviews on the public record</span></div>
          <div className="proof-item"><b>International patients</b><span>Programmes run for patients from around the world</span></div>
        </div>
      </Section>

      <Section overline="Your physicians" title="Who looks after you">
        <PhysicianRow />
      </Section>

      <Section
        alt
        id="consult"
        overline="Begin with a consultation"
        title="Plan your admission"
        lead="Tell us what you are hoping to address and your travel window. Our patient-services team replies with programme options and current tariffs; your physician confirms the plan at consultation."
      >
        <LpFormSection
          formType="international-enquiry"
          heading="Plan your admission"
          aside="For international patients the simplest start is email — send your enquiry and our patient-services team replies with programme options, current tariffs and what to prepare before travel."
        />
      </Section>

      <LpLegal />
      <StickyCta />
    </main>
  );
}
