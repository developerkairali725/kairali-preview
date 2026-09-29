// Content for /lp/behandlung-in-kerala/ — generated from the saved staging page
//   staging-pages/Ayurveda-Behandlung in Kerala _ Kairali Healing Village.html
// then corrected by hand. Every change from staging is logged in
// docs/changes/lp-behandlung-in-kerala.md.

import type { LpContent } from "../../../components/lp/types";
import imgPatientVillaMaharaja from "../../../../public/campaign-v110/images/patient-villa-maharaja.avif";

const content: LpContent = {
  path: "/lp/behandlung-in-kerala/",
  // German page: all German copy is exactly as staged (not translated, not
  // corrected). English strings from staging and from the shared components
  // are marked lang="en" and listed for translation review in OPEN-ITEMS.
  lang: "de",
  // Staging's own footer labels.
  legalLabels: { privacy: "Datenschutz (EN)", terms: "Nutzungsbedingungen (EN)", cookies: "Cookie-Richtlinie (EN)" },
  head: {"title": "Ayurveda-Behandlung in Kerala | Kairali Healing Village", "description": "Ärztlich geplante Ayurveda-Behandlung im NABH-akkreditierten Krankenhaus von Kairali in Kerala: Konsultation, Therapie, Ernährung und Nachsorge.", "keywords": ["ayurveda behandlung kerala", "panchakarma kerala deutschland", "ayurveda krankenhaus indien"], "canonical": "https://ayurvedichealingvillage.com/lp/behandlung-in-kerala/", "ogImage": "https://ayurvedichealingvillage.com/campaign-v110/images/patient-villa-maharaja.jpg", "locale": "de_DE", "siteName": "Kairali — The Ayurvedic Healing Village"},
  jsonLd: {"@context": "https://schema.org", "@graph": [{"@type": "Organization", "@id": "https://ayurvedichealingvillage.com#org", "name": "Kairali Ayurvedic Group", "url": "https://www.kairali.com", "email": "info@kairali.com", "foundingDate": "1989", "description": "Founded in 1989 by K. V. Ramesh and Gita Ramesh.", "slogan": "health through ayurveda"}, {"@type": "MedicalClinic", "@id": "https://ayurvedichealingvillage.com#clinic", "name": "Kairali — The Ayurvedic Healing Village", "url": "https://ayurvedichealingvillage.com", "email": "info@kairali.com", "telephone": "+919555156156", "address": {"@type": "PostalAddress", "streetAddress": "Olassery P.O., Kodumbu", "addressLocality": "Palakkad", "addressRegion": "Kerala", "addressCountry": "IN"}, "medicalSpecialty": "Ayurveda", "parentOrganization": {"@id": "https://ayurvedichealingvillage.com#org"}}, {"@type": "WebSite", "@id": "https://ayurvedichealingvillage.com#website", "name": "Kairali — The Ayurvedic Healing Village", "url": "https://ayurvedichealingvillage.com/lp/behandlung-in-kerala", "publisher": {"@id": "https://ayurvedichealingvillage.com#org"}, "inLanguage": "de"}]},
  hero: {
    overline: "NABH-akkreditiertes Ayurveda-Krankenhaus, Palakkad",
    h1: ["Ayurveda-Behandlung in Kerala — ", {"em": "ärztlich geplant"}, ", nach Ihrer Konsultation."],
    sub: "Ein ärztlich überwachtes Programm in einem NABH-akkreditierten Ayurveda-Krankenhaus: zuerst die Konsultation, dann Therapie, Ernährung und Nachsorge.",
    creds: [{"label": "NABH", "nabh": true, "detail": "akkreditiert · AH-2024-0250"}, {"label": "Panchakarma", "detail": "im akkreditierten Leistungsumfang"}, {"label": "Clinical Establishment", "detail": "Zertifikat nach dem Kerala Act"}, {"label": "Ärztlich geführt", "detail": "Behandlungsteam"}],
    photo: { ...{ src: imgPatientVillaMaharaja, alt: "Patientenvilla im Behandlungsgarten des Healing Village, Palakkad" }, caption: "The Healing Village, Palakkad", detail: "Patientenvillen im Behandlungsgarten" },
  },
  sections: [
    {
      id: "so-l-uft-die-aufnahme",
      overline: "So läuft die Aufnahme",
      title: "Zuerst die Konsultation. Immer.",
      blocks: [
        { type: "lead", runs: ["Kein Programm wird hier von einer Preisliste gebucht. Es wird verordnet — nach Anamnese und Untersuchung durch unsere Ärzte."] },
        { type: "steps", cards: [{"k": "Schritt 1", "title": "Konsultation vor Ort", "text": "Ihr Arzt erhebt die Anamnese, untersucht Sie und entscheidet, welches Programm — und welche Dauer — medizinisch sinnvoll ist."}, {"k": "Schritt 2", "title": "Therapie", "text": "Die verordneten Behandlungen, ausgeführt vom Behandlungsteam des Krankenhauses nach ärztlichem Plan."}, {"k": "Schritt 3", "title": "Ernährung & Nachsorge", "text": "Eine begleitende Ernährung aus der Krankenhausküche und klare Empfehlungen für die Wochen nach der Entlassung."}] },
      ],
    },
    {
      id: "behandlungen",
      variant: "alt",
      overline: "Behandlungen",
      title: "Was Ihr Programm umfassen kann",
      blocks: [
        { type: "lead", runs: ["Welche Therapien zum Einsatz kommen, entscheidet die ärztliche Beurteilung — nicht der Katalog."] },
        { type: "steps", cards: [{"k": "Therapie", "title": "Panchakarma", "text": "Das klassische fünffache Reinigungsprogramm — vorbereitende Behandlungen, die angezeigten Verfahren, Ernährung und Ruhe."}, {"k": "Therapie", "title": "Abhyanga", "text": "Ganzkörpermassage mit medizinierten Ölen durch geschulte Therapeuten."}, {"k": "Therapie", "title": "Shirodhara", "text": "Der kontinuierliche Ölguss über die Stirn — verordnet, wo die Beurteilung ihn angezeigt."}, {"k": "Therapie", "title": "Ernährungstherapie", "text": "Die Küche des Krankenhauses kocht nach Ihrem Behandlungsplan — Ernährung ist hier Teil der Medizin."}] },
        { type: "lead", runs: ["Programmpreise in Euro nennt Ihnen unser Patientenservice auf Anfrage — sie richten sich nach ärztlichem Plan und Unterkunft."] },
      ],
    },
    {
      id: "belege-statt-adjektive",
      variant: "proof",
      overline: "Belege statt Adjektive",
      title: "Aktenkundig",
      blocks: [
        { type: "proof", items: [{"title": "NABH-Akkreditierung", "text": "Zertifikat AH-2024-0250 · Panchakarma im Leistungsumfang"}, {"title": "Clinical Establishment", "text": "Dauerhaftes Zertifikat nach dem Kerala Act"}, {"title": "Ärztlich geführt", "text": "Konsultation vor Aufnahme, Visiten während des Aufenthalts"}, {"title": "Internationale Patienten", "text": "Programme für Patienten aus aller Welt"}] },
      ],
    },
  ],
  enquiry: {"overline": "Der erste Schritt", "title": "Konsultation anfragen", "lead": ["Schreiben Sie uns, worum es geht und wann Sie reisen könnten. Unser Patientenservice antwortet auf Deutsch oder Englisch mit Programmvorschlägen und aktuellen Preisen. (Das Formular ist derzeit auf Englisch — die deutsche Fassung folgt mit dem vollständigen Relaunch.)"], "form": {"heading": "Konsultation anfragen", "intro": "Tell us how to reach you. Our patient care team can help you plan your visit."}, "aside": {"k": "What happens next", "kLang": "en", "paragraphLangs": ["de", "en"], "paragraphs": [["Wir antworten mit Konsultationsterminen und allem, was Ihr Arzt vor der Aufnahme wissen muss."], ["Prefer to talk now? Call ", {"a": "+91 9555 156 156", "href": "tel:+919555156156"}, {"br": true}, "International patients: ", {"a": "info@kairali.com", "href": "mailto:info@kairali.com"}]]}},
  whatsappText: "Hello, I would like to enquire about Ayurveda-Behandlung in Kerala | Kairali Healing Village (/lp/behandlung-in-kerala/).",
};

export default content;
