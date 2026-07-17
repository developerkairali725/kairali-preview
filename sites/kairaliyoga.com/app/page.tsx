// kairaliyoga.com — Sanskrit-forward editorial one-pager (entity: group ·
// register E, the factory's first true E-register surface).
// Design: docs/design-research/kairaliyoga-2026-07-16.md (D-DESIGN-DIFF) —
// full-bleed dawn photo hero with a slow brand-legal fade (no usable video
// asset tonight; HF-AMB video is a flagged beauty-pass upgrade), goal-first
// selector, Sanskrit-name editorial programme blocks, honest enquire-for-
// dates admissions strip, day-at-Kairali timeline, expectation-setting
// section, objection FAQ, cascading enquiry ladder.
// Facts law (rule 6): programme names/durations/inclusions ONLY as printed
// in docs/rates/RATES_RECKONER.md (26–27 yoga lists + Ayurveda Training
// Courses V2). NO prices, NO batch dates (none exist), NO invented outcomes.
// Testimonials: content/testimonials.json — verbatim excerpts of the legacy
// site's testimonials page, ≤3, guards-compared against the mined HTML.
// Teachers: the legacy yoga-teachers page publishes NO named roster → this
// section ships without names (provenance flag in the build brief).
// KTAHV clinical register wherever the hospital is named: patient, physician,
// treatment, programme, admission — never spa/resort/holiday/luxury/guests.
// Contact: info@kairali.com + interim WhatsApp (DECISIONS 2026-07-13 18:51).

import {
  graph,
  kairaliOrganization,
  webSite,
  breadcrumbList,
  faqPage,
  serializeJsonLd,
} from "@kairali/schema";
import testimonialsData from "../content/testimonials.json";

const SITE = "https://kairaliyoga.com";
const EMAIL = "info@kairali.com";
const WHATSAPP_URL = "https://wa.me/919289838797";

// Rolling-number law: computed from the fixed origins, never typed.
const LINEAGE_YEARS = new Date().getFullYear() - 1908;
const GROUP_YEARS = new Date().getFullYear() - 1989;

// The three programmes, exactly as printed in RATES_RECKONER.md (26–27 yoga
// lists): plain-English printed name = the overline; Sanskrit name = the
// display line; minimum nights = the printed "Minimum Duration".
// Q-YOGA-IAST interim (design review it.1 finding 1, QUESTIONS.md): Kurale
// itself misanchors IAST macrons (font-level, reproduced from the Google CDN
// build — critic-macron-probe-cdn-kurale.png), so the oversized Kurale
// display sets `display` (ASCII-romanized) while `iast` carries the
// reckoner-EXACT spelling in the Asap/Lato support faces, which render the
// marks correctly. Pending Abilash's ruling; never render `iast` in Kurale.
const PROGRAMMES = [
  {
    id: "dhyana",
    english: "Kairali’s Yoga & Meditation Package",
    display: "Dhyana-Yoga Shibiram",
    iast: "Dhyāna-Yoga Shibiram",
    nights: "07 nights minimum",
    body: "The full shape of a practice: a private sunrise yoga session and a private guided mindfulness session each evening, one Ayurvedic therapy every day, and the physician’s daily check-in — for at least seven nights, long enough for the rhythm to become yours.",
  },
  {
    id: "agni",
    english: "Digestive Wellness & Gut Health Yoga Therapy",
    display: "Agni Dipanam Yoga Chikitsa",
    iast: "Agni Dīpanam Yoga Chikitsa",
    nights: "14 nights minimum",
    body: "Yoga therapy for digestive wellness, paired with the hospital’s Ayurvedic kitchen — three vegetarian meals a day composed from organic ingredients, daily therapy, and a physician reading your progress across a minimum of fourteen nights.",
  },
  {
    id: "prana",
    english: "Yoga based Stress & Energy Reset Program",
    display: "Prana Samya Yoga Chikitsa",
    iast: "Prāna Sāmya Yoga Chikitsa",
    nights: "07 nights minimum",
    body: "A yoga-based stress and energy reset: breath-led practice at sunrise, one therapy through the day, mindfulness as the light goes — a minimum of seven nights, each one quieter than the last.",
  },
];

// Ayurveda Training Courses V2 (reckoner): the real training offer — names,
// durations and one-line descriptions as printed. No YTT is invented.
const TRAININGS = [
  { name: "1 Day Workshop", duration: "1 day", note: "Introductory session with hands-on Abhyangam massage" },
  { name: "3 Day Certificate Program", duration: "3 days", note: "Theory and practice of core therapies" },
  { name: "5 Day Intensive Program", duration: "5 days", note: "In-depth training in five major therapies" },
  { name: "10 Days Advanced Program", duration: "10 days", note: "Advanced curriculum for wellness professionals" },
  { name: "20 Days Advanced Consultant Program", duration: "20 days", note: "Comprehensive training, including lifestyle consulting and advanced therapies" },
];

const FAQS = [
  {
    q: "I am new to yoga — is a programme suitable for me?",
    a: "Yes. Sessions are private, not group classes, so the teaching meets you where you are — beginner or long-time practitioner. Tell us your experience when you enquire and the programme is shaped accordingly.",
  },
  {
    q: "Is this a yoga retreat or a hospital?",
    a: "Kairali — The Ayurvedic Healing Village is a NABH-accredited Ayurvedic hospital in Palakkad, Kerala. Your stay is structured as an admission: a physician sees you daily, therapies are prescribed, and the campus keeps hospital discipline — no alcohol, no smoking. The yoga is real practice; the setting is real medicine.",
  },
  {
    q: "Can I come alone?",
    a: "Yes. Admission is individual — travelling alone changes nothing about the programme, your consultation, or your daily therapies.",
  },
  {
    q: "How do I reach Palakkad?",
    a: "Palakkad Railway Station is 25 km from the Healing Village, Coimbatore Airport 75 km, and Cochin or Calicut airports 125 km. Transfers by AC vehicle are arranged on request when your admission is confirmed.",
  },
  {
    q: "What about visas?",
    a: "We do not give visa advice — please consult the Indian mission in your country. What we can confirm quickly, on WhatsApp or by email, is programme fit, dates and arrival logistics.",
  },
  {
    q: "Why are no prices published here?",
    a: `Rates depend on villa type, occupancy and the current tariff year, so a single number on a website would mislead you. Write to ${EMAIL} or message us on WhatsApp and the current tariff comes back to you directly.`,
  },
];

const jsonLd = graph(
  kairaliOrganization({
    id: `${SITE}/#organization`,
    url: SITE,
    // it.2 (SEO audit WARN): strengthen the entity graph — the group's icon
    // mark rasterized at 512px (never a recreated logo, ch.02) + sameAs.
    logo: `${SITE}/logo.png`,
    sameAs: ["https://www.kairali.com", "https://www.ayurvedichealingvillage.com"],
  }),
  webSite({
    id: `${SITE}/#website`,
    name: "Kairali Yoga",
    url: SITE,
    publisherId: `${SITE}/#organization`,
    inLanguage: "en",
  }),
  faqPage({
    id: `${SITE}/#faq`,
    questions: FAQS.map((f) => ({ question: f.q, answer: f.a })),
  }),
  breadcrumbList({
    id: `${SITE}/#breadcrumb`,
    items: [{ name: "Home", url: SITE }],
  }),
);

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      {/* ---------- Full-bleed dawn hero (no fleet build opens on a photo) ---------- */}
      <header className="hero" id="top">
        <img
          className="hero-media"
          src="/images/ktahv-round-stone-cottages-dawn.jpg"
          srcSet="/images/ktahv-round-stone-cottages-dawn-640.jpg 640w, /images/ktahv-round-stone-cottages-dawn-800.jpg 800w, /images/ktahv-round-stone-cottages-dawn-1280.jpg 1280w, /images/ktahv-round-stone-cottages-dawn.jpg 1600w"
          sizes="100vw"
          alt="Round stone cottages of the Ayurvedic Healing Village at dawn, amid coconut palms, a curving footpath and a water channel"
          width={1600}
          height={1067}
          fetchPriority="high"
        />
        <div className="hero-scrim" aria-hidden="true" />
        <div className="container hero-content">
          <a className="wordmark" href="/" aria-label="Kairali Yoga — home">
            <img src="/images/kairali-icon.svg" alt="" aria-hidden="true" width="44" height="31" />
            <span>Kairali Yoga</span>
          </a>
          <p className="overline hero-overline">The Ayurvedic Healing Village · Palakkad, Kerala</p>
          <h1>Yoga, kept the way a lineage keeps it.</h1>
          <p className="lede">
            Residential yoga and meditation programmes at Kairali&rsquo;s
            NABH-accredited Ayurvedic hospital — private sunrise practice, one
            Ayurvedic therapy a day, and a physician who knows your name.
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href="#enquire" data-cta="hero_enquire">
              Enquire about a programme
            </a>
            <a className="btn btn-ghost" href="#programmes" data-cta="hero_programmes">
              The three programmes
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ---------- Goal-first selector — a bordered index rail (it.2 de-twin:
            the fleet's white card-doors and the hero-overlap trick were
            arogyashala's; this site routes through an editorial contents
            rail instead. IAST programme names stay in Asap here — the
            support face renders the macrons correctly.) ---------- */}
        <nav className="paths container" aria-label="What brings you to Kairali">
          <p className="paths-question" aria-hidden="true">What brings you?</p>
          <div className="paths-rail">
            <a className="path" href="#dhyana" data-cta="goal_deepen">
              <span className="path-kicker">I want to</span>
              <span className="path-title">Deepen my practice</span>
              <span className="path-hint">Dhyāna-Yoga Shibiram</span>
              <span className="path-arrow" aria-hidden="true">&darr;</span>
            </a>
            <a className="path" href="#agni" data-cta="goal_restore">
              <span className="path-kicker">I want to</span>
              <span className="path-title">Restore my system</span>
              <span className="path-hint">Agni Dīpanam &amp; Prāna Sāmya</span>
              <span className="path-arrow" aria-hidden="true">&darr;</span>
            </a>
            <a className="path" href="#training" data-cta="goal_train">
              <span className="path-kicker">I want to</span>
              <span className="path-title">Train in the tradition</span>
              <span className="path-hint">Ayurveda training courses</span>
              <span className="path-arrow" aria-hidden="true">&darr;</span>
            </a>
          </div>
        </nav>

        {/* ---------- The programmes — Sanskrit-name editorial ---------- */}
        <section className="section programmes" id="programmes" aria-labelledby="programmes-heading">
          <div className="container">
            <p className="overline">The Programmes</p>
            <h2 id="programmes-heading">Three programmes, named in Sanskrit, kept by physicians</h2>
            <p className="measure">
              Each programme runs on the Healing Village&rsquo;s all-inclusive
              admission — accommodation, meals and daily therapy in one
              arrangement, with a printed minimum stay. The names below are the
              programmes&rsquo; own, as the hospital prints them.
            </p>

            {PROGRAMMES.map((p) => (
              <article className="programme" id={p.id} key={p.id} aria-label={p.english}>
                <p className="overline programme-english">{p.english}</p>
                {/* Kurale display = romanized; the reckoner-exact IAST lives
                    in the Lato subline below (Q-YOGA-IAST interim). */}
                <h3 className="programme-sanskrit">{p.display}</h3>
                <p className="programme-iast">{p.iast}</p>
                <p className="programme-nights">{p.nights}</p>
                <p className="programme-body">{p.body}</p>
                <a
                  className="text-cta"
                  href="#enquire"
                  data-cta={`prog_${p.id}_enquire`}
                >
                  Enquire about this programme &rarr;
                </a>
              </article>
            ))}

            {/* Honest admissions device: no batch calendar exists, so none is
                invented — dates are set with the visitor (rule 6). */}
            <aside className="admissions" aria-label="Admissions and dates">
              <div>
                <p className="admissions-title">Admissions are year-round. Dates are set with you.</p>
                <p className="admissions-body">
                  The Healing Village publishes no batch calendar — your start
                  date is agreed when you enquire, against the villa and
                  physician availability of your month.
                </p>
              </div>
              <a className="btn btn-primary" href="#enquire" data-cta="admissions_enquire">
                Enquire for upcoming dates
              </a>
            </aside>
          </div>
        </section>

        {/* ---------- A day at Kairali — time-axis device ---------- */}
        <section className="section day" id="day" aria-labelledby="day-heading">
          <div className="container">
            <p className="overline">A Day at Kairali</p>
            <h2 id="day-heading">Sunrise to lamplight, the day holds you</h2>
            <ol className="timeline">
              <li>
                <div className="timeline-text">
                  <p className="timeline-when">Sunrise</p>
                  <h3>Private yoga, before the heat</h3>
                  <p>
                    Your practice opens the day — a private session, one
                    teacher, one mat, the campus still quiet.
                  </p>
                </div>
                <img
                  src="/images/ktahv-yoga-cobra-instructor-adjustment.jpg"
                  srcSet="/images/ktahv-yoga-cobra-instructor-adjustment-640.jpg 640w, /images/ktahv-yoga-cobra-instructor-adjustment-800.jpg 800w, /images/ktahv-yoga-cobra-instructor-adjustment.jpg 1066w"
                  sizes="(min-width: 760px) 420px, calc(100vw - 40px)"
                  alt="A yoga instructor adjusts a practitioner in cobra posture on a mat in the bright yoga hall"
                  width={1066}
                  height={1600}
                  loading="lazy"
                />
              </li>
              <li>
                <div className="timeline-text">
                  <p className="timeline-when">Morning</p>
                  <h3>The physician&rsquo;s check-in</h3>
                  <p>
                    A daily wellness check-in with the Ayurvedic doctor — your
                    programme is read and adjusted every day, not set once and
                    forgotten.
                  </p>
                </div>
                <img
                  src="/images/ktahv-physician-consultation-room.jpg"
                  srcSet="/images/ktahv-physician-consultation-room-640.jpg 640w, /images/ktahv-physician-consultation-room-800.jpg 800w, /images/ktahv-physician-consultation-room-1024.jpg 1024w, /images/ktahv-physician-consultation-room.jpg 1600w"
                  sizes="(min-width: 760px) 420px, calc(100vw - 40px)"
                  alt="The physician’s consultation room — a curved wooden desk, chairs and stool, round frosted windows and founders’ portraits on the brick wall"
                  width={1600}
                  height={1067}
                  loading="lazy"
                />
              </li>
              <li>
                <div className="timeline-text">
                  <p className="timeline-when">Midday</p>
                  <h3>One therapy, every day</h3>
                  <p>
                    An Ayurvedic therapy each day of your stay, herbal steam
                    baths included — prescribed by the physician at your
                    consultation.
                  </p>
                </div>
                <img
                  src="/images/ktahv-therapist-carrying-dhara-pot-sunrise.jpg"
                  srcSet="/images/ktahv-therapist-carrying-dhara-pot-sunrise-640.jpg 640w, /images/ktahv-therapist-carrying-dhara-pot-sunrise-800.jpg 800w, /images/ktahv-therapist-carrying-dhara-pot-sunrise-1024.jpg 1024w, /images/ktahv-therapist-carrying-dhara-pot-sunrise.jpg 1600w"
                  sizes="(min-width: 760px) 420px, calc(100vw - 40px)"
                  alt="A therapist carries a brass bowl and a hanging clay dhara pot along a cottage verandah in early light"
                  width={1600}
                  height={1066}
                  loading="lazy"
                />
              </li>
              <li>
                <div className="timeline-text">
                  <p className="timeline-when">Mealtimes</p>
                  <h3>The Ayurvedic table</h3>
                  <p>
                    Three wholesome vegetarian meals a day, cooked from organic
                    ingredients — with in-room mineral water and herbal detox
                    water carrying you between them.
                  </p>
                </div>
                <img
                  src="/images/ahv-food-idiyappam-veg-stew.jpg"
                  srcSet="/images/ahv-food-idiyappam-veg-stew-640.jpg 640w, /images/ahv-food-idiyappam-veg-stew-800.jpg 800w, /images/ahv-food-idiyappam-veg-stew-1024.jpg 1024w, /images/ahv-food-idiyappam-veg-stew.jpg 1600w"
                  sizes="(min-width: 760px) 420px, calc(100vw - 40px)"
                  alt="Idiyappam on a banana leaf with a bowl of vegetable stew garnished with curry leaves"
                  width={1600}
                  height={1066}
                  loading="lazy"
                />
              </li>
              <li>
                <div className="timeline-text">
                  <p className="timeline-when">Evening</p>
                  <h3>Guided mindfulness as the light goes</h3>
                  <p>
                    A private guided mindfulness session closes the day — what
                    the sunrise practice opened, the evening sits with.
                  </p>
                </div>
                <img
                  src="/images/ktahv-meditation-seated-chin-mudra.jpg"
                  srcSet="/images/ktahv-meditation-seated-chin-mudra-640.jpg 640w, /images/ktahv-meditation-seated-chin-mudra-800.jpg 800w, /images/ktahv-meditation-seated-chin-mudra.jpg 1066w"
                  sizes="(min-width: 760px) 420px, calc(100vw - 40px)"
                  alt="A practitioner seated cross-legged in meditation with chin mudra on a mat in the yoga hall"
                  width={1066}
                  height={1600}
                  loading="lazy"
                />
              </li>
              <li>
                <div className="timeline-text">
                  <p className="timeline-when">Once a week</p>
                  <h3>The village around the practice</h3>
                  <p>
                    Ayurveda and yoga workshops, Ayurvedic cooking classes,
                    organic farm tours, village walks and nature trails — the
                    Kerala that grows the kitchen&rsquo;s ingredients.
                  </p>
                </div>
                <img
                  src="/images/ktahv-organic-farm-rice-transplanting.jpg"
                  srcSet="/images/ktahv-organic-farm-rice-transplanting-640.jpg 640w, /images/ktahv-organic-farm-rice-transplanting-800.jpg 800w, /images/ktahv-organic-farm-rice-transplanting-1024.jpg 1024w, /images/ktahv-organic-farm-rice-transplanting.jpg 1600w"
                  sizes="(min-width: 760px) 420px, calc(100vw - 40px)"
                  alt="Farm workers bend in a line transplanting rice seedlings in a flooded paddy field, misty palms behind"
                  width={1600}
                  height={1066}
                  loading="lazy"
                />
              </li>
            </ol>
          </div>
        </section>

        {/* ---------- What to expect — expectation-setting ---------- */}
        <section className="section expect" id="expect" aria-labelledby="expect-heading">
          <div className="container expect-grid">
            <div>
              <p className="overline">What to Expect</p>
              <h2 id="expect-heading">A hospital&rsquo;s honesty, a village&rsquo;s pace</h2>
              <dl className="expect-list">
                <div>
                  <dt>Arrival</dt>
                  <dd>
                    Check-in from 12 noon, check-out by 10 AM. AC-vehicle
                    transfers from Palakkad station (25 km), Coimbatore airport
                    (75 km) or Cochin/Calicut airports (125 km), arranged on
                    request.
                  </dd>
                </div>
                <div>
                  <dt>The campus</dt>
                  <dd>
                    Villa accommodation across landscaped grounds, with a
                    swimming pool, library and gym. This is a working
                    NABH-accredited hospital: the campus is strictly
                    alcohol-free and smoke-free.
                  </dd>
                </div>
                <div>
                  <dt>The table</dt>
                  <dd>
                    Three wholesome vegetarian Ayurvedic meals daily, cooked
                    from organic ingredients, with in-room mineral water and
                    herbal detox water through the day.
                  </dd>
                </div>
                <div>
                  <dt>The discipline</dt>
                  <dd>
                    Anything beyond the programme — internal herbal medicines,
                    additional treatment — happens only on the physician&rsquo;s
                    prescription. Nothing is upsold on a menu.
                  </dd>
                </div>
              </dl>
            </div>
            <figure className="expect-photo">
              <img
                src="/images/ktahv-grounds-water-channel-cottages.jpg"
                srcSet="/images/ktahv-grounds-water-channel-cottages-640.jpg 640w, /images/ktahv-grounds-water-channel-cottages-800.jpg 800w, /images/ktahv-grounds-water-channel-cottages.jpg 1067w"
                sizes="(min-width: 760px) 380px, calc(100vw - 40px)"
                alt="A stone-lined water channel curves through lawns past coconut palms and brick cottages of the Healing Village"
                width={1067}
                height={1600}
                loading="lazy"
              />
              <figcaption>The Healing Village grounds, Palakkad.</figcaption>
            </figure>
          </div>
        </section>

        {/* ---------- Training — the real offer, honestly framed. TTC is NOT
            offered (Abilash ruling 17 Jul 2026, D-YOGA-PRIVATE batch) — the
            copy states the non-offering explicitly; guards ban any offering
            claim (test/guards.test.js TTC regex). ---------- */}
        <section className="section training" id="training" aria-labelledby="training-heading">
          <div className="container">
            <p className="overline">Train in the Tradition</p>
            <h2 id="training-heading">Ayurveda training courses at the hospital</h2>
            <p className="measure">
              Kairali&rsquo;s training programmes teach Ayurvedic therapy —
              daily theory classes with Ayurvedic doctors and hands-on practice
              with senior therapists, certified by the Kairali Institute of
              Panchakarma Therapies. Kairali does not run a yoga
              teacher-training certification — if that is what you are
              researching, write to us anyway: we will tell you honestly
              whether what we teach fits what you seek.
            </p>
            <ul className="training-list">
              {TRAININGS.map((t) => (
                <li key={t.name}>
                  <span className="training-duration">{t.duration}</span>
                  <span className="training-text">
                    <strong>{t.name}</strong> — {t.note}
                  </span>
                </li>
              ))}
            </ul>
            <a className="text-cta" href="#enquire" data-cta="training_enquire">
              Ask about a training course &rarr;
            </a>
          </div>
        </section>

        {/* ---------- Teachers — no named roster (legacy page publishes none) ---------- */}
        <section className="section teachers" id="teachers" aria-labelledby="teachers-heading">
          <div className="container teachers-grid">
            <figure className="teachers-photo">
              <img
                src="/images/ktahv-yoga-namaste-greeting-instructor.jpg"
                srcSet="/images/ktahv-yoga-namaste-greeting-instructor-640.jpg 640w, /images/ktahv-yoga-namaste-greeting-instructor-800.jpg 800w, /images/ktahv-yoga-namaste-greeting-instructor-1024.jpg 1024w, /images/ktahv-yoga-namaste-greeting-instructor.jpg 1600w"
                sizes="(min-width: 760px) 480px, calc(100vw - 40px)"
                alt="A yoga instructor and a practitioner face each other in namaste greeting inside the bright yoga hall"
                width={1600}
                height={1066}
                loading="lazy"
              />
              <figcaption>Session opening, the yoga hall.</figcaption>
            </figure>
            <div>
              <p className="overline">The Teaching</p>
              <h2 id="teachers-heading">Five points of yoga, one physician beside them</h2>
              <p>
                The teaching at Kairali is built around the five points of yoga
                — postures, breathing, relaxation, meditation and diet — held
                in private sessions rather than crowded halls.
              </p>
              <p>
                Beside the teachers stand the hospital&rsquo;s Ayurvedic
                doctors: your practice and your treatment are read together,
                by people who compare notes about you every day.
              </p>
            </div>
          </div>
        </section>

        {/* ---------- Guestbook — legacy entries read as historical record,
            not as this page's peer-proof (it.2 reframe, critic finding 5).
            Quotes/attributions stay verbatim (guards) + provenance note. ---------- */}
        <section className="section voices" id="voices" aria-labelledby="voices-heading">
          <div className="container">
            <p className="overline">From the Guestbook</p>
            <h2 id="voices-heading">Entries kept as they were written</h2>
            <div className="voices-grid">
              {testimonialsData.testimonials.map((t) => (
                <blockquote className="voice" key={t.name}>
                  <p>&ldquo;{t.quote}&rdquo;</p>
                  <footer>
                    <cite>{t.name}</cite>
                    <span>{t.position}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
            <p className="voices-note">
              As published on the previous kairaliyoga.com — carried over at
              this rebuild.
            </p>
          </div>
        </section>

        {/* ---------- FAQ — the objections, answered plainly (it.2: fresh
            heads — "Straight Answers / Before you ask" was arogyashala's
            verbatim pair; two columns at desktop widths) ---------- */}
        <section className="section faq" id="faq" aria-labelledby="faq-heading">
          <div className="container">
            <p className="overline">Asked, Answered</p>
            <h2 id="faq-heading">The questions a stay raises</h2>
            <div className="faq-list">
              <div className="faq-col">
                {FAQS.slice(0, 3).map((f) => (
                  <details key={f.q}>
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
              <div className="faq-col">
                {FAQS.slice(3).map((f) => (
                  <details key={f.q}>
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Enquiry ladder — question → WhatsApp → email ---------- */}
        <section className="section enquire" id="enquire" aria-labelledby="enquire-heading">
          <div className="container">
            <p className="overline">Enquire</p>
            <h2 id="enquire-heading">Start wherever you are</h2>
            <ol className="ladder">
              {/* it.2: rung markers are spelled-out Kurale words, not the
                  fleet's giant Lato numerals (.flow-num de-twin) */}
              <li className="ladder-rung">
                <span className="ladder-num" aria-hidden="true">One</span>
                <div className="ladder-body">
                  <h3>Just a question?</h3>
                  <p>
                    Ask it on WhatsApp — programme fit, your month, anything.
                    A person answers, not a bot.
                  </p>
                  <a className="btn btn-primary" href={WHATSAPP_URL} data-cta="whatsapp_question">
                    <WhatsAppIcon />
                    WhatsApp your question
                  </a>
                </div>
              </li>
              <li className="ladder-rung">
                <span className="ladder-num" aria-hidden="true">Two</span>
                <div className="ladder-body">
                  <h3>Ready to plan a stay?</h3>
                  <p>
                    Write with your preferred programme, month and how many
                    nights you can give it — we reply with what is possible.
                  </p>
                  <a
                    className="btn btn-secondary"
                    href={`mailto:${EMAIL}?subject=Yoga%20programme%20enquiry%20—%20kairaliyoga.com`}
                    data-cta="email_enquiry"
                  >
                    Email a programme enquiry
                  </a>
                </div>
              </li>
              <li className="ladder-rung">
                <span className="ladder-num" aria-hidden="true">Three</span>
                <div className="ladder-body">
                  <h3>Want the numbers?</h3>
                  <p>
                    Rates are quoted per night by villa type and occupancy, and
                    change by tariff year — request the current tariff and it
                    comes back to you directly.
                  </p>
                  <a
                    className="btn btn-secondary"
                    href={`mailto:${EMAIL}?subject=Request%20—%20current%20yoga%20tariff`}
                    data-cta="email_tariff"
                  >
                    Request the current tariff
                  </a>
                </div>
              </li>
            </ol>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p className="footer-title">Kairali Yoga — at Kairali, The Ayurvedic Healing Village</p>
          <p className="footer-address">
            Olassery P.O., Kodumbu, Palakkad District — 678551, Kerala, India
          </p>
          <p>
            <a href={`mailto:${EMAIL}`} data-cta="email_click">{EMAIL}</a> ·{" "}
            <a href={WHATSAPP_URL} data-cta="whatsapp_click">WhatsApp +91 92898 38797</a>
          </p>
          <nav className="footer-nav" aria-label="Kairali sites">
            <a href="https://www.kairali.com">Kairali Ayurvedic Group</a>
            <a href="https://www.ayurvedichealingvillage.com">The Ayurvedic Healing Village</a>
            <a href="https://www.kairaliproducts.in">Kairali Store (India)</a>
          </nav>
          <nav className="footer-nav footer-legal" aria-label="Legal">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/cookie-policy">Cookies</a>
          </nav>
          <p className="footer-fine">
            © {new Date().getFullYear()} Kairali Ayurvedic Group — founded
            1989, {GROUP_YEARS} years ago, by a family practising Ayurveda
            since 1908 · {LINEAGE_YEARS} years of lineage
          </p>
        </div>
      </footer>
    </>
  );
}
