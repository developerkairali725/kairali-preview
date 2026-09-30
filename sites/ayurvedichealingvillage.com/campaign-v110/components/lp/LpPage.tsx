// Renders an /lp/ page from its content model, in staging's section order,
// using the same components as the approved /lp/treatment-packages/.

import PageShell from "../PageShell";
import {
  Faq,
  Lead,
  LpEnquiry,
  LpHero,
  LpSection,
  NabhChip,
  PhotoBand,
  PhysicianNote,
  PhysicianRow,
  ProofList,
  StepGrid,
  VideoEmbed,
  VideoNote,
} from "./index";
import Runs from "./Runs";
import type { Block, LpContent } from "./types";

function BlockView({ b }: { b: Block }) {
  switch (b.type) {
    case "lead":
      return <Lead><Runs runs={b.runs} /></Lead>;
    case "para":
      return <p><Runs runs={b.runs} /></p>;
    case "steps":
      return <StepGrid cards={b.cards} />;
    case "photos":
      return <PhotoBand images={b.images} />;
    case "proof":
      return <ProofList items={b.items} />;
    case "physician":
      return <PhysicianRow image={b.image} name={b.name} role={b.role} />;
    case "physicianNote":
      return <PhysicianNote>{b.text}</PhysicianNote>;
    case "video":
      return <VideoEmbed youtubeId={b.youtubeId} title={b.title} />;
    case "videoNote":
      return <VideoNote><Runs runs={b.runs} /></VideoNote>;
    case "faq":
      return <Faq items={b.items.map((it) => ({ q: it.q, a: it.a.map((p, i) => <Runs key={i} runs={p} />) }))} />;
  }
}

export default function LpPage({ content: c }: { content: LpContent }) {
  return (
    <PageShell lang={c.lang} legalLabels={c.legalLabels}>
      {c.jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(c.jsonLd) }} />
      )}
      <LpHero
        overline={c.hero.overline}
        title={<Runs runs={c.hero.h1} />}
        sub={c.hero.sub}
        doctor={c.hero.doctor}
        creds={c.hero.creds.map((cr) => ({ label: cr.nabh ? <NabhChip /> : cr.label, detail: cr.detail }))}
        photo={c.hero.photo}
        ctaLang={c.lang && c.lang !== "en" ? "en" : undefined}
      />
      {c.sections.map((s) => (
        <LpSection key={s.id} id={s.id} variant={s.variant} overline={s.overline} title={s.title}>
          {s.blocks.map((b, i) => (
            <BlockView key={i} b={b} />
          ))}
        </LpSection>
      ))}
      <LpEnquiry
        overline={c.enquiry.overline}
        title={c.enquiry.title}
        lead={<Runs runs={c.enquiry.lead} />}
        form={{
          pagePath: c.path,
          heading: c.enquiry.form.heading,
          intro: c.enquiry.form.intro,
          whatsappText: c.whatsappText,
          lang: c.lang,
          headingLang: c.lang && c.lang !== "en" ? c.lang : undefined,
        }}
        aside={{
          k: c.enquiry.aside.k,
          kLang: c.enquiry.aside.kLang,
          paragraphs: c.enquiry.aside.paragraphs.map((p, i) => <Runs key={i} runs={p} />),
          paragraphLangs: c.enquiry.aside.paragraphLangs,
        }}
      />
    </PageShell>
  );
}
