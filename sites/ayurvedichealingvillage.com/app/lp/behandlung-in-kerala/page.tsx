import type { Metadata } from "next";
import { buildMetadata } from "@kairali/seo";
import siteConfig from "../../../site.config.json";
import {
  Cred,
  LpHero,
  LpLegal,
  LpSchema,
  Section,
  Steps,
  StickyCta,
  SITE_URL,
} from "../../_components/lp";
import { LpFormSection } from "../../_components/lp-form";

// ============================================================================
// LP #9 — /lp/behandlung-in-kerala (DE) — rebuild of /de/behandlung-in-kerala/
// (the live host truth: apex, not www — the owner's list spelling is corrected
// in the strategy). DE market = product-aware repeat-treatment seekers →
// short page (doctrine §3).
// LANGUAGE: German page content (wrapped lang="de"); site.config declares
// ["en"] tonight, so metadata routes through the EN path with og locale set to
// de_DE — the DE locale TREE ships with the full KTAHV rebuild (flagged).
// DE register lock respected: none of the German hospitality-vocabulary bans
// appear in this copy — the register is Patient, Arzt, Behandlung,
// Programm, Aufnahme, Konsultation. The legacy page's 13 forms collapse to
// ONE (+ the WhatsApp action); the AirIndia relic and search-form clutter die
// here. EUR price blocks DEFERRED pending re-diff + owner confirm.
// D-DEFR-AI-REVIEW: this DE copy is AI-drafted/AI-screened INTERIM — a native
// German check is queued before any ad points here (flagged in the PR).
// Ads point at the LEGACY URL — nothing flips without Vikash's written word.
// ============================================================================

const base = buildMetadata(siteConfig, {
  title: "Ayurveda-Behandlung in Kerala | Kairali Healing Village",
  description:
    "Ärztlich geplante Ayurveda-Behandlung im NABH-akkreditierten Krankenhaus von Kairali in Kerala: Konsultation, Therapie, Ernährung und Nachsorge.",
  path: "/lp/behandlung-in-kerala",
  siteName: "Kairali — The Ayurvedic Healing Village",
  ogImage: "/images/patient-villa-maharaja.jpg",
}) as Metadata;

export const metadata: Metadata = {
  ...base,
  openGraph: { ...(base.openGraph as Record<string, unknown>), locale: "de_DE" },
  keywords: [
    "ayurveda behandlung kerala",
    "panchakarma kerala deutschland",
    "ayurveda krankenhaus indien",
  ],
};

const CREDS_DE: Cred[] = [
  { b: <span className="nabh-chip">NABH</span>, s: "akkreditiert · AH-2024-0250" },
  { b: "Panchakarma", s: "im akkreditierten Leistungsumfang" },
  { b: "Clinical Establishment", s: "Zertifikat nach dem Kerala Act" },
  { b: "Ärztlich geführt", s: "Behandlungsteam" },
];

export default function Page() {
  return (
    <main lang="de">
      <LpSchema pageUrl={`${SITE_URL}/lp/behandlung-in-kerala`} inLanguage="de" />
      <LpHero
        overline="Kairali — The Ayurvedic Healing Village · NABH-akkreditiertes Ayurveda-Krankenhaus, Palakkad"
        title={
          <>
            Ayurveda-Behandlung in Kerala — <em>ärztlich geplant</em>, nach Ihrer Konsultation.
          </>
        }
        sub="Ein ärztlich überwachtes Programm in einem NABH-akkreditierten Ayurveda-Krankenhaus: zuerst die Konsultation, dann Therapie, Ernährung und Nachsorge."
        creds={CREDS_DE}
        photo="/images/patient-villa-maharaja.jpg"
        photoAlt="Patientenvilla im Behandlungsgarten des Healing Village, Palakkad"
        photoCaption={{ b: "The Healing Village, Palakkad", s: "Patientenvillen im Behandlungsgarten" }}
        waLabel="Priya auf WhatsApp schreiben"
        showDocChip={false}
      />

      <Section
        overline="So läuft die Aufnahme"
        title="Zuerst die Konsultation. Immer."
        lead="Kein Programm wird hier von einer Preisliste gebucht. Es wird verordnet — nach Anamnese und Untersuchung durch unsere Ärzte."
      >
        <Steps
          items={[
            { k: "Schritt 1", h: "Konsultation vor Ort", p: "Ihr Arzt erhebt die Anamnese, untersucht Sie und entscheidet, welches Programm — und welche Dauer — medizinisch sinnvoll ist." },
            { k: "Schritt 2", h: "Therapie", p: "Die verordneten Behandlungen, ausgeführt vom Behandlungsteam des Krankenhauses nach ärztlichem Plan." },
            { k: "Schritt 3", h: "Ernährung & Nachsorge", p: "Eine begleitende Ernährung aus der Krankenhausküche und klare Empfehlungen für die Wochen nach der Entlassung." },
          ]}
        />
      </Section>

      <Section
        alt
        overline="Behandlungen"
        title="Was Ihr Programm umfassen kann"
        lead="Welche Therapien zum Einsatz kommen, entscheidet die ärztliche Beurteilung — nicht der Katalog."
      >
        <Steps
          items={[
            { k: "Therapie", h: "Panchakarma", p: "Das klassische fünffache Reinigungsprogramm — vorbereitende Behandlungen, die angezeigten Verfahren, Ernährung und Ruhe." },
            { k: "Therapie", h: "Abhyanga", p: "Ganzkörpermassage mit medizinierten Ölen durch geschulte Therapeuten." },
            { k: "Therapie", h: "Shirodhara", p: "Der kontinuierliche Ölguss über die Stirn — verordnet, wo die Beurteilung ihn angezeigt." },
            { k: "Therapie", h: "Ernährungstherapie", p: "Die Küche des Krankenhauses kocht nach Ihrem Behandlungsplan — Ernährung ist hier Teil der Medizin." },
          ]}
        />
        <p className="lp-lead" style={{ marginTop: 22 }}>
          Programmpreise in Euro nennt Ihnen unser Patientenservice auf Anfrage — sie richten sich
          nach ärztlichem Plan und Unterkunft.
        </p>
      </Section>

      <Section proof overline="Belege statt Adjektive" title="Aktenkundig">
        <div className="proof-list">
          <div className="proof-item"><b>NABH-Akkreditierung</b><span>Zertifikat AH-2024-0250 · Panchakarma im Leistungsumfang</span></div>
          <div className="proof-item"><b>Clinical Establishment</b><span>Dauerhaftes Zertifikat nach dem Kerala Act</span></div>
          <div className="proof-item"><b>Ärztlich geführt</b><span>Konsultation vor Aufnahme, Visiten während des Aufenthalts</span></div>
          <div className="proof-item"><b>Internationale Patienten</b><span>Programme für Patienten aus aller Welt</span></div>
        </div>
      </Section>

      <Section
        alt
        id="consult"
        overline="Der erste Schritt"
        title="Konsultation anfragen"
        lead="Schreiben Sie uns, worum es geht und wann Sie reisen könnten. Unser Patientenservice antwortet auf Deutsch oder Englisch mit Programmvorschlägen und aktuellen Preisen. (Das Formular ist derzeit auf Englisch — die deutsche Fassung folgt mit dem vollständigen Relaunch.)"
      >
        <LpFormSection
          formType="de-consultation"
          heading="Konsultation anfragen"
          aside="Ihre Anfrage erreicht unseren Patientenservice mit dokumentierter Einwilligung. Wir antworten mit Konsultationsterminen und allem, was Ihr Arzt vor der Aufnahme wissen muss."
        />
      </Section>

      <LpLegal lang="de" />
      <StickyCta label="Priya auf WhatsApp schreiben" />
    </main>
  );
}
