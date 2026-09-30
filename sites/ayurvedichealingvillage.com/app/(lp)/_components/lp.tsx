import type { ReactNode } from "react";
import {
  graph,
  kairaliOrganization,
  medicalClinic,
  serializeJsonLd,
  webSite,
} from "@kairali/schema";
import { LpSticky } from "./lp-sticky";

// KTAHV LP system — "consultation room, not brochure" (launches/ktahv-lp-batch/
// design-direction v5, Gate-1 trail applied). CLINICAL REGISTER ONLY.
// One conversion goal per page: a patient lead — WhatsApp-first (India-geo law),
// with the consultation form as the same goal's second modality below the fold.
// data-cta: whatsapp_click (hero + sticky) · enquiry_submit (form, from
// @kairali/forms). No nav, no footer links beyond the legal minimum.

export const SITE_URL = "https://ayurvedichealingvillage.com";
/** Locked fact (CLAUDE.md): Priya's KTAHV WhatsApp — any …38777 is WRONG. */
export const WHATSAPP_URL = "https://wa.me/919289838797";
export const WHATSAPP_DISPLAY = "+91 92898 38797";
/** Locked fact: the one public contact email. */
export const CONTACT_EMAIL = "info@kairali.com";

/** Dr. Deepu John's portrait, sized for its render slots (52px doc-chip /
 *  96px physician row → 192w covers 2x DPR). The legacy 220×260 PNG weighed
 *  64.6KB and Lighthouse measured 59.6KB of it wasted (modern-image-formats);
 *  this WebP is 5.0KB. Same photograph, converted losslessly-in-spirit —
 *  no fact changed (HARD GATE 6). */
export const DR_DEEPU_AVATAR = "/images/dr-deepu-john-192.webp";

export function WaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.66 15L2 22l5.2-1.36A10 10 0 1 0 12 2Zm5.42 14.13c-.23.65-1.33 1.24-1.86 1.28-.5.04-1.12.19-3.76-.78-3.18-1.25-5.2-4.5-5.36-4.71-.15-.21-1.28-1.71-1.28-3.26s.81-2.3 1.1-2.62c.28-.31.62-.39.83-.39h.6c.19 0 .45-.07.7.53.26.62.88 2.16.96 2.31.08.16.13.34.02.55-.1.21-.16.34-.31.52-.16.18-.33.41-.47.55-.16.15-.32.32-.14.63.18.31.8 1.32 1.72 2.14 1.18 1.05 2.18 1.38 2.49 1.53.31.16.49.13.67-.08.18-.21.78-.9.98-1.21.21-.31.42-.26.7-.16.29.11 1.83.86 2.14 1.02.31.16.52.23.6.36.07.13.07.75-.16 1.39Z" />
    </svg>
  );
}

/** The one marigold action. Label law: no doctor/physician wording on the
 *  Priya channel (scripts/cta-label-lint.mjs). */
export function WaButton({ id, label = "Speak to Priya on WhatsApp" }: { id?: string; label?: string }) {
  return (
    <a id={id} className="btn-wa" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" data-cta="whatsapp_click">
      <WaIcon />
      {label}
    </a>
  );
}

export type Cred = { b: ReactNode; s: string };

/** Verifiable-credentials strip (Gate-1 law: evidence before adjectives). */
export const DEFAULT_CREDS: Cred[] = [
  { b: <span className="nabh-chip">NABH</span>, s: "accredited · AH-2024-0250" },
  { b: "Panchakarma", s: "in NABH-accredited scope" },
  { b: "Clinical Establishment", s: "permanent certificate · Kerala Act" },
  { b: "Physician-led", s: "treatment team" },
];

export function LpHero({
  overline,
  title,
  sub,
  creds = DEFAULT_CREDS,
  photo,
  photoAlt,
  photoCaption,
  waLabel,
  waNumberNote = WHATSAPP_DISPLAY,
  showDocChip = true,
}: {
  overline: string;
  title: ReactNode;
  sub: string;
  creds?: Cred[];
  photo: string;
  photoAlt: string;
  photoCaption?: { b: string; s: string };
  waLabel?: string;
  waNumberNote?: string;
  showDocChip?: boolean;
}) {
  return (
    <header className="lp-hero">
      <div className="lp-hero-copy">
        <a className="lp-brand-link" href="/"><img src="/ahv/assets/img/kairali-colorful-logo.webp" width={180} height={66} alt="Kairali — The Ayurvedic Healing Village" /></a>
        <p className="lp-overline">{overline.replace(/^Kairali — The Ayurvedic Healing Village · /, "")}</p>
        <h1>{title}</h1>
        <p className="lp-sub">{sub}</p>
        {showDocChip ? (
          <div className="doc-chip">
            <img src={DR_DEEPU_AVATAR} width={192} height={227} alt="Dr. Deepu John, Chief Physician at Kairali — The Ayurvedic Healing Village" />
            <div>
              <b>Dr. Deepu John</b>
              <span>Chief Physician — treatment planning &amp; admission</span>
            </div>
          </div>
        ) : null}
        <div className="cta-col">
          <WaButton id="lp-hero-cta" label={waLabel} />
          <a className="lp-enquire-link" href="#consult">Request a consultation ↓</a>
          <span className="wa-number">{waNumberNote}</span>
        </div>
        <div className="lp-creds">
          {creds.map((c, i) => (
            <div className="lp-cred" key={i}>
              <b>{c.b}</b>
              <span>{c.s}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="lp-hero-visual">
        <figure className="lp-photo" style={{ margin: 0 }}>
          <img src={photo} alt={photoAlt} width={720} height={720} fetchPriority="high" />
          {photoCaption ? (
            <figcaption>
              <b>{photoCaption.b}</b>
              <span>{photoCaption.s}</span>
            </figcaption>
          ) : null}
        </figure>
      </div>
    </header>
  );
}

export function Section({
  overline,
  title,
  lead,
  alt,
  children,
  proof,
  id,
}: {
  overline?: string;
  title?: ReactNode;
  lead?: string;
  alt?: boolean;
  proof?: boolean;
  children?: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={`lp-section${alt ? " alt" : ""}${proof ? " proof-band" : ""}`}>
      <div className="container">
        {overline ? <p className="overline">{overline.replace(/^Kairali — The Ayurvedic Healing Village · /, "")}</p> : null}
        {title ? <h2>{title}</h2> : null}
        {lead ? <p className="lp-lead">{lead}</p> : null}
        {children}
      </div>
    </section>
  );
}

export function Steps({ items }: { items: { k: string; h: string; p: string }[] }) {
  return (
    <div className="step-grid">
      {items.map((s) => (
        <div className="step-card" key={s.h}>
          <span className="k">{s.k}</span>
          <h3>{s.h}</h3>
          <p>{s.p}</p>
        </div>
      ))}
    </div>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq">
      {items.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function PhysicianRow({ note }: { note?: string }) {
  return (
    <>
      <div className="physician-row">
        <img src={DR_DEEPU_AVATAR} width={192} height={227} loading="lazy" decoding="async" alt="Dr. Deepu John, Chief Physician" />
        <div className="who">
          <b>Dr. Deepu John</b>
          <span>Chief Physician — treatment planning &amp; admission</span>
        </div>
      </div>
      <p className="physician-note" style={{ marginTop: 14 }}>
        {note ??
          "Every programme at the Healing Village begins with an in-person consultation. Your physician assesses your health status, plans the treatment schedule, and reviews it through your stay and at discharge."}
      </p>
    </>
  );
}

/** Legal strip — the doctrine's permitted minimum (privacy/terms + contact). */
export function LpLegal({ lang = "en" }: { lang?: "en" | "de" }) {
  const de = lang === "de";
  return (
    <footer className="lp-legal">
      <div className="container row">
        <span>© Kairali — The Ayurvedic Healing Village, Palakkad, Kerala</span>
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        <a href="/new-privacy-policy/">{de ? "Datenschutz (EN)" : "Privacy"}</a>
        <a href="/terms-and-conditions/">{de ? "Nutzungsbedingungen (EN)" : "Terms"}</a>
        <a href="/cookie-policy/">{de ? "Cookie-Richtlinie (EN)" : "Cookie policy"}</a>
      </div>
    </footer>
  );
}

/** Sticky mobile bar — client behavior lives in lp-sticky.tsx. */
export function StickyCta({ label }: { label?: string }) {
  return <LpSticky label={label} />;
}

/** JSON-LD: Organization + MedicalClinic (+ WebSite). Clinical schema family
 *  only — the legacy pages' hospitality @type was part of the register bug. */
export function LpSchema({ pageUrl, inLanguage = "en" }: { pageUrl: string; inLanguage?: string }) {
  const org = kairaliOrganization({ id: `${SITE_URL}#org` });
  const clinic = medicalClinic({
    id: `${SITE_URL}#clinic`,
    name: "Kairali — The Ayurvedic Healing Village",
    url: SITE_URL,
    email: CONTACT_EMAIL,
    telephone: WHATSAPP_DISPLAY,
    address: {
      streetAddress: "Olassery P.O., Kodumbu",
      addressLocality: "Palakkad",
      addressRegion: "Kerala",
      addressCountry: "IN",
    },
    medicalSpecialty: "Ayurveda",
    parentId: `${SITE_URL}#org`,
  });
  const site = webSite({
    id: `${SITE_URL}#website`,
    name: "Kairali — The Ayurvedic Healing Village",
    url: pageUrl,
    publisherId: `${SITE_URL}#org`,
    inLanguage,
  });
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(graph(org, clinic, site)) }}
    />
  );
}
