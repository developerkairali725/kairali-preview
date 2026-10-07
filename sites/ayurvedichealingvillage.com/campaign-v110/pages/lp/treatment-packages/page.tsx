// /lp/treatment-packages/ — manifest row 25.
// Layout and copy: saved staging page
//   staging-pages/Ayurvedic Treatment Packages in Kerala _ Kairali KTAHV.html
// Facts checked against the live page (column D):
//   https://ayurvedichealingvillage.com/ayurvedic-treatment-packages.html
// Every change from staging is recorded in docs/changes/lp-treatment-packages.md.

import type { Metadata } from "next";
import EnquiryForm from "../../../components/EnquiryForm";
import PageShell from "../../../components/PageShell";
import {
  Lead,
  LpEnquiry,
  LpHero,
  LpSection,
  NabhChip,
  PhotoBand,
  PhysicianRow,
  ProofList,
  StepGrid,
} from "../../../components/lp";
import { contact } from "../../../lib/site";

import doctor from "../../../../public/campaign-v110/images/dr-deepu-john-192.webp";
import abhyanga from "../../../../public/campaign-v110/images/therapy-abhyanga.jpg";
import villaClassic from "../../../../public/campaign-v110/images/patient-villa-classic.jpg";
import villaMaharaja from "../../../../public/campaign-v110/images/patient-villa-maharaja.jpg";
import pathway from "../../../../public/campaign-v110/images/wx-pathway.jpg";

const PATH = "/lp/treatment-packages/";
const TITLE = "Ayurvedic Treatment Packages in Kerala | Kairali KTAHV";
const DESCRIPTION =
  "Physician-planned Ayurvedic treatment packages at Kairali's NABH-accredited hospital in Palakkad, Kerala. Consultation first — enquire on WhatsApp.";
const CANONICAL = "https://ayurvedichealingvillage.com/lp/treatment-packages/";
const OG_IMAGE = "https://ayurvedichealingvillage.com/campaign-v110/images/therapy-abhyanga.jpg";

// Head as on staging (robots noindex comes from app/layout.tsx).
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "ayurvedic treatment packages kerala",
    "ayurveda package india",
    "panchakarma package kerala",
    "ayurvedic hospital palakkad",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    siteName: "Kairali — The Ayurvedic Healing Village",
    locale: "en_IN",
    type: "website",
    // Staging declared 1200 × 630; the file is 703 × 464 and returns 404 on
    // the live domain (OPEN-ITEMS). Dimensions omitted rather than misstated.
    images: [{ url: OG_IMAGE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_IMAGE] },
};

// Staging JSON-LD, with "a family practising Ayurveda since 1908" removed and
// the clinic telephone set to the main number.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://ayurvedichealingvillage.com#org",
      name: "Kairali Ayurvedic Group",
      url: "https://www.kairali.com",
      email: contact.email,
      foundingDate: "1989",
      description: "Founded in 1989 by K. V. Ramesh and Gita Ramesh.",
      slogan: "health through ayurveda",
    },
    {
      "@type": "MedicalClinic",
      "@id": "https://ayurvedichealingvillage.com#clinic",
      name: "Kairali — The Ayurvedic Healing Village",
      url: "https://ayurvedichealingvillage.com",
      email: contact.email,
      telephone: "+919555156156",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Olassery P.O., Kodumbu",
        addressLocality: "Palakkad",
        addressRegion: "Kerala",
        addressCountry: "IN",
      },
      medicalSpecialty: "Ayurveda",
      parentOrganization: { "@id": "https://ayurvedichealingvillage.com#org" },
    },
    {
      "@type": "WebSite",
      "@id": "https://ayurvedichealingvillage.com#website",
      name: "Kairali — The Ayurvedic Healing Village",
      url: "https://ayurvedichealingvillage.com/lp/treatment-packages",
      publisher: { "@id": "https://ayurvedichealingvillage.com#org" },
      inLanguage: "en",
    },
  ],
};

export default function TreatmentPackagesPage() {
  return (
    <PageShell campaign>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 1 · Hero (.lp-hero) */}
      <LpHero
        form={<EnquiryForm pagePath={PATH} whatsappText="I would like to enquire about an Ayurvedic treatment programme." />}
        overline="NABH-accredited Ayurvedic hospital, Palakkad"
        title={
          <>
            Ayurvedic treatment packages in Kerala — <em>prescribed, not picked</em>.
          </>
        }
        sub="Every package here is a physician-planned programme: your consultation decides the therapies, the diet and the duration — then the package is built around you."
        doctor={{
          image: {
            src: doctor,
            alt: "Dr. Deepu John, Chief Physician at Kairali — The Ayurvedic Healing Village",
          },
          name: "Dr. Deepu John",
          role: "Chief Physician — treatment planning & admission",
        }}
        creds={[
          { label: <NabhChip />, detail: "accredited · AH-2024-0250" },
          { label: "Panchakarma", detail: "in NABH-accredited scope" },
          { label: "Clinical Establishment", detail: "permanent certificate · Kerala Act" },
          { label: "Physician-led", detail: "treatment team" },
        ]}
        photo={{
          src: abhyanga,
          alt: "Synchronised Abhyanga therapy at the Healing Village treatment rooms",
          caption: "Hospital treatment rooms",
          detail: "Therapies on a physician's schedule",
        }}
      />

      {/* 2 · Programme families */}
      <LpSection id="programmes" overline="Programme families" title="The packages, as a physician reads them">
        <Lead>
          Four programme families cover most admissions. Which one fits — and for how long — is
          decided at consultation, not at checkout.
        </Lead>
        <StepGrid
          cards={[
            {
              k: "Programme",
              title: "Panchakarma",
              text: "The classical five-fold cleansing programme — preparatory therapies, the indicated procedures, diet and rest.",
            },
            {
              k: "Programme",
              title: "Rejuvenation",
              // Staging: "Restorative therapies, …" (restoration wording removed)
              text: "Rejuvenation therapies, oils and routine for patients run down by work, travel or recovery.",
            },
            {
              k: "Programme",
              title: "Detoxification",
              text: "A shorter cleansing schedule where a full Panchakarma programme is not indicated.",
            },
            {
              k: "Programme",
              title: "Stress management",
              text: "Therapy, routine, diet and rest structured around the nervous system's recovery.",
            },
          ]}
        />
        <Lead>
          Programme fees depend on the physician&apos;s plan and your accommodation choice — our
          patient-services team shares current tariffs when you enquire.
        </Lead>
      </LpSection>

      {/* 3 · Where patients stay */}
      <LpSection id="stay" variant="alt" overline="Where patients stay" title="Hospital care, village quiet">
        <Lead>
          Patients are admitted to private villas across the treatment gardens — accommodation in
          service of the programme: rest, diet and therapy within walking distance of your physician.
        </Lead>
        <PhotoBand
          images={[
            { src: villaClassic, alt: "Classic patient villa at the Healing Village" },
            { src: villaMaharaja, alt: "Maharaja patient villa exterior among the trees" },
            { src: pathway, alt: "Treatment gardens at the Healing Village, Palakkad" },
          ]}
        />
      </LpSection>

      {/* 4 · Why choose Kairali (.proof-band) */}
      <LpSection id="why" variant="proof" overline="Why choose Kairali" title="Care you can plan around">
        <ProofList
          items={[
            { title: "NABH accreditation", text: "Certificate AH-2024-0250 · Panchakarma within accredited scope" },
            { title: "Clinical Establishment", text: "Permanent certificate under the Kerala Act" },
            { title: "TripAdvisor Hall of Fame", text: "Reviews from guests on Tripadvisor" },
            { title: "Physician-led", text: "Doctors plan and review every programme" },
          ]}
        />
      </LpSection>

      {/* 5 · Your physicians */}
      <LpSection id="physicians" overline="Your physicians" title="Who plans your package">
        <PhysicianRow
          image={{ src: doctor, alt: "Dr. Deepu John, Chief Physician" }}
          name="Dr. Deepu John"
          role="Chief Physician — treatment planning & admission"
          note="Every programme at the Healing Village begins with an in-person consultation. Your physician assesses your health status, plans the treatment schedule, and reviews it through your stay and at discharge."
        />
      </LpSection>

      {/* 6 · Begin with a consultation (#consult) */}
      <LpEnquiry
        overline="Begin with a consultation"
        title="Ask about a treatment package"
        lead="Tell us what you are dealing with and when you could travel. We reply with programme options and current tariffs; your physician confirms the plan at consultation."
        form={{
          pagePath: PATH,
          heading: "Enquire about packages",
          intro: "Tell us how to reach you. Our patient care team can help you plan your visit.",
          whatsappText: `Hello, I would like to enquire about ${TITLE} (${PATH}).`,
        }}
        aside={{
          k: "What happens next",
          paragraphs: [
            // Staging: "Your request reaches our patient-services team with your
            // consent recorded." — not true while the form hands off to WhatsApp.
            <>
              Request a consultation and our patient care team will contact you about consultation options and the information your doctor may need before admission.
            </>,
            <>
              Prefer to talk now? Call <a href={contact.phone.href}>{contact.phone.display}</a>
              <br />
              International patients: <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </>,
          ],
        }}
      />
    </PageShell>
  );
}
