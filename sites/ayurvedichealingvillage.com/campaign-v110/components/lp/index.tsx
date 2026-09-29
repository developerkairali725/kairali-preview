// Shared building blocks for the /lp/ pages. Each mirrors a component of the
// saved staging pages (class names noted) so page structure stays as staging.

import Image, { type StaticImageData } from "next/image";
import EnquiryForm from "../EnquiryForm";
import { ENQUIRY_HREF, ENQUIRY_ID, PRIMARY_CTA, contact } from "../../lib/site";
import s from "./lp.module.css";

type Img = { src: StaticImageData; alt: string };

// Small source photos are served as the original file: Next's resized copies
// would be narrower than the original and then stretched on screen.
const SMALL = 800;
const original = (img: StaticImageData) => img.width <= SMALL;

// Largest width at which a cover-cropped frame of ratio w/h never upscales.
const noUpscale = (img: StaticImageData, ratio: number) =>
  Math.floor(Math.min(img.width, img.height * ratio));

// `sizes` for the hero photo. The frame crops the photo (cover), so the image
// must be wider than the frame whenever it is wider in proportion: request
// frame width × (photo ratio ÷ frame ratio). Desktop frame 4:5, max 520px;
// phones 16:10 at full width.
function coverSizes(img: StaticImageData) {
  const ratio = img.width / img.height;
  const desktop = Math.ceil(Math.min(noUpscale(img, 4 / 5), 520) * Math.max(1, ratio / (4 / 5)));
  const mobileVw = Math.ceil(100 * Math.max(1, ratio / (16 / 10)));
  return `(max-width: 900px) ${mobileVw}vw, ${desktop}px`;
}

/* ── .lp-hero ──────────────────────────────────────────────────────────── */
export function LpHero({
  overline,
  title,
  sub,
  doctor,
  creds,
  photo,
  ctaLang,
}: {
  /** Set to "en" on a non-English page: the CTA and phone line are English. */
  ctaLang?: string;
  overline: string;
  title: React.ReactNode;
  sub: string;
  doctor?: { image: Img; name: string; role: string };
  creds: { label: React.ReactNode; detail: string }[];
  photo: Img & { caption: string; detail: string };
}) {
  const style = {
    "--photo-max-desktop": `${noUpscale(photo.src, 4 / 5)}px`,
  } as React.CSSProperties;
  return (
    <header className={s.hero} aria-labelledby="hero-title">
      <div className={s.heroCopy}>
        <p className={s.heroOverline}>{overline}</p>
        <h1 id="hero-title">{title}</h1>
        <p className={s.heroSub}>{sub}</p>
        {/* CTA placement 2: one primary button, phone as plain text beneath */}
        <div className={s.ctaCol} lang={ctaLang}>
          <a id="hero-cta" className="btn btn-primary" href={ENQUIRY_HREF}>
            {PRIMARY_CTA}
          </a>
          <p className={s.ctaPhone}>
            Or call <a href={contact.phone.href}>{contact.phone.display}</a>
          </p>
        </div>
        {doctor && (
          <div className={s.docChip}>
            <Image src={doctor.image.src} alt={doctor.image.alt} width={52} height={52} />
            <div>
              <b>{doctor.name}</b>
              <span>{doctor.role}</span>
            </div>
          </div>
        )}
        <ul className={s.creds}>
          {creds.map((c) => (
            <li key={c.detail} className={s.cred}>
              <b>{c.label}</b>
              <span>{c.detail}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={s.heroVisual}>
        <figure className={s.photo} style={style}>
          <Image
            src={photo.src}
            alt={photo.alt}
            sizes={coverSizes(photo.src)}
            unoptimized={original(photo.src)}
            priority
          />
          <figcaption>
            <b>{photo.caption}</b>
            <span>{photo.detail}</span>
          </figcaption>
        </figure>
      </div>
    </header>
  );
}

export function NabhChip() {
  return <span className={s.nabhChip}>NABH</span>;
}

/* ── .lp-section (+ .alt / .proof-band) ─────────────────────────────────── */
export function LpSection({
  id,
  variant,
  overline,
  title,
  children,
}: {
  id: string;
  variant?: "alt" | "proof";
  overline: string;
  title: string;
  children: React.ReactNode;
}) {
  const cls = [s.section, variant === "alt" && s.alt, variant === "proof" && `${s.proof} on-dark`]
    .filter(Boolean)
    .join(" ");
  return (
    <section id={id} className={cls} aria-labelledby={`${id}-title`}>
      <div className="container">
        <p className="overline">{overline}</p>
        <h2 id={`${id}-title`}>{title}</h2>
        {children}
      </div>
    </section>
  );
}

export function Lead({ children }: { children: React.ReactNode }) {
  return <p className={s.lead}>{children}</p>;
}

/* ── .step-grid / .step-card ────────────────────────────────────────────── */
export function StepGrid({ cards }: { cards: { k: string; title: string; text: string }[] }) {
  return (
    <ul className={s.stepGrid}>
      {cards.map((c) => (
        <li key={c.title} className={s.stepCard}>
          <span className={s.k}>{c.k}</span>
          <h3>{c.title}</h3>
          <p>{c.text}</p>
        </li>
      ))}
    </ul>
  );
}

/* ── .photo-band ────────────────────────────────────────────────────────── */
export function PhotoBand({ images, height = 236 }: { images: Img[]; height?: number }) {
  // Staging draws every photo 240px tall, cover-cropped, filling its cell, so
  // the band looks the same on every screen. The height is capped at the
  // shortest photo.
  const h = Math.min(height, ...images.map((i) => i.src.height));
  return (
    <div className={s.photoBand}>
      {images.map((i) => (
        <Image
          key={i.alt}
          src={i.src}
          alt={i.alt}
          sizes="(max-width: 900px) 100vw, 380px"
          unoptimized={original(i.src)}
          style={{ height: h }}
        />
      ))}
    </div>
  );
}

/* ── .proof-list ────────────────────────────────────────────────────────── */
export function ProofList({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ul className={s.proofList}>
      {items.map((i) => (
        <li key={i.title} className={s.proofItem}>
          <b>{i.title}</b>
          <span>{i.text}</span>
        </li>
      ))}
    </ul>
  );
}

/* ── .physician-row ─────────────────────────────────────────────────────── */
export function PhysicianRow({
  image,
  name,
  role,
  note,
}: {
  image: Img;
  name: string;
  role: string;
  note?: string;
}) {
  return (
    <>
      <div className={s.physicianRow}>
        <Image src={image.src} alt={image.alt} width={96} height={96} />
        <div>
          <b>{name}</b>
          <span>{role}</span>
        </div>
      </div>
      {note && <p className={s.physicianNote}>{note}</p>}
    </>
  );
}

export function PhysicianNote({ children }: { children: React.ReactNode }) {
  return <p className={s.physicianNote}>{children}</p>;
}

/* ── #consult: .form-wrap = .enquiry-form + .form-aside ──────────────────── */
export function LpEnquiry({
  overline,
  title,
  lead,
  form,
  aside,
}: {
  overline: string;
  title: string;
  lead: React.ReactNode;
  form: { pagePath: string; heading: string; intro: string; whatsappText: string; lang?: string; headingLang?: string };
  aside: { k: string; kLang?: string; paragraphs: React.ReactNode[]; paragraphLangs?: (string | undefined)[] };
}) {
  return (
    <LpSection id={ENQUIRY_ID} variant="alt" overline={overline} title={title}>
      <Lead>{lead}</Lead>
      <div className={s.formWrap}>
        <EnquiryForm {...form} />
        <div className={s.formAside}>
          <span className={s.k} lang={aside.kLang}>
            {aside.k}
          </span>
          {aside.paragraphs.map((p, i) => (
            <p key={i} lang={aside.paragraphLangs?.[i]}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </LpSection>
  );
}

/* ── .faq (details/summary) ─────────────────────────────────────────────── */
export function Faq({ items }: { items: { q: string; a: React.ReactNode[] }[] }) {
  return (
    <div className={s.faq}>
      {items.map((it) => (
        <details key={it.q}>
          <summary>{it.q}</summary>
          {it.a.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </details>
      ))}
    </div>
  );
}

/* ── .video-embed (+ .video-note) ───────────────────────────────────────── */
export function VideoEmbed({ youtubeId, title }: { youtubeId: string; title: string }) {
  return (
    <div className={s.video}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export function VideoNote({ children }: { children: React.ReactNode }) {
  return <p className={s.videoNote}>{children}</p>;
}
