# DOM + live-behavior evidence — KTAHV LP batch (supplement to the Gate-2 screenshots)

Captured 2026-07-18 23:20:00 IST from the LIVE Vercel previews of branch HEAD
(dpl_5PxMTQPD3aQ9kdPsC3ceDwrxCbmS @ c7df440 for the 8 unchanged LPs;
dpl @ okudmx20l / commit 2711105 for the two hero-fixed LPs). Every extract below is from the
SERVED production-build HTML (curl of the preview) or a live Playwright measurement in the
same session — machine evidence, not self-report. This pack answers the Gate-2 pass-1
"NEEDS EVIDENCE" items that static screenshots cannot prove. All ten LPs are built from ONE
shared component system (app/_components/lp.tsx / lp-form.tsx / lp-sticky.tsx), so the
structural evidence holds for every route; per-LP copy differences are in the page sources.

## 1 · Hero photo caption (GPT blocking item 1)

Served HTML, /lp/panchkarma-treatment (identical component all LPs with a photoCaption):

    <figcaption><b>Dr. Deepu John</b><span>Chief Physician — treatment planning &amp; admission</span></figcaption>

The figcaption is rendered inside `.lp-photo`; on mobile (≤900px) `.lp-hero-visual { display:none }`
BY DESIGN (image-first-copy doctrine on small screens) — the physician identity is carried on mobile
by the doc-chip, which IS visible in the mobile screenshots.

## 2 · Patient-voices embed (GPT blocking item 2; Perplexity health-wording item 2)

Served HTML:

    <iframe src="https://www.youtube-nocookie.com/embed/CcDPOeSR67E"
      title="Patient experiences at Kairali — The Ayurvedic Healing Village" loading="lazy" …>

Origin is youtube-nocookie.com; `loading="lazy"` is why the frame area captures blank in a
full-page screenshot (capture artifact, not a missing embed). The disclaimer lead is served as:
"Individual experiences from patients who chose to speak on camera. They are personal accounts —
not a promise of results; outcomes differ from person to person." (weight-loss variant: "Individual
accounts, voluntarily given. They describe one person's experience — not a result you are promised;
outcomes differ from person to person.")

## 3 · FAQ answers, exact served wording (GPT blocking item 3; Perplexity health-wording item 1)

Served HTML, /lp/panchkarma-treatment — the DMR-critical answer in full:

    <details><summary>Will Panchakarma treat my medical condition?</summary><p>We do not promise
    outcomes for any condition. Your physician will tell you honestly, at consultation, what a
    programme can and cannot be expected to do in your case — and continue any conversation with
    your own doctors that your situation needs.</p></details>

(weight-loss: "We will not name a number, and you should distrust any advertisement that does…" —
full text in the served HTML of /lp/weight-loss; pain-management: "No honest hospital promises
that, and Indian law on medical advertising forbids it…")

## 4 · Consent checkbox + privacy link (GPT blocking item 4)

Served HTML (all 10 forms, @kairali/forms):

    <input type="checkbox" required="" name="consent"/> …I agree that Kairali may use my details to
    respond to this enquiry, as described in the <a href="/privacy">privacy policy</a>.

`required` is a native HTML constraint — the browser blocks submit until checked. The submit
button carries `data-cta="enquiry_submit"`.

## 4b · formType routing + hero asset filenames (treatment-packages pass-1 asks)

The per-LP `formType` (package-enquiry / cleansing-enquiry / city-enquiry / brand-enquiry /
pain-consultation / de-consultation / international-enquiry / consultation) is NOT a hidden
input — it is a React prop serialized into the JSON POST body by packages/forms/src/EnquiryForm.tsx:

    body: JSON.stringify({ site, formType, consent: true, fullName…, landingPage, referrer })

and stored with the lead by packages/forms/src/route-handler.ts (`storeLead(input, { site,
formType, consent })`). Deliberately NOT live-submitted for evidence — a real submission would
write a production lead record (store-first CRM); source + route-handler are the proof.

Hero/photo asset filenames, from the served HTML `<img src>` attributes (e.g.
/lp/treatment-packages serves `/images/therapy-abhyanga.jpg`, `/images/patient-villa-classic.jpg`,
`/images/patient-villa-maharaja.jpg`, `/images/healing-village-grounds.jpg`,
`/images/dr-deepu-john.png`) — extraction transcript in the battery session; per-route lists
reproducible with `grep -o '<img src="/images/[^"]*"' <served html>`.

## 5 · Sticky bar behavior + tap target (GPT major item 5)

app/globals.css (production build serves the same rules):

    .lp-sticky { position: fixed; left:0; right:0; bottom:0; z-index:40; … display:none; }
    .lp-sticky .btn-wa { width:100%; … min-height: 52px; }
    @media (max-width: 900px) { .lp-sticky { display: block; } }

Fixed-position (sticky by construction), mobile-only, 52px ≥ 44px tap target. Full-page screenshots
un-fix fixed elements (renders once at DOM position) — another capture artifact.

## 6 · Link targets + event wiring (GPT major item 6)

Served HTML, per LP: exactly `3 × href="https://wa.me/919289838797"` (hero CTA, sticky CTA,
form-aside utility link) and `2 × data-cta="whatsapp_click"` + `1 × data-cta="enquiry_submit"`.
No other tel/wa targets exist. …38777 absent everywhere (grep of all 10 served pages).

LIVE event-fire proof (Playwright, this session, preview page): with `window.gtag` stubbed,
clicking the hero CTA and the sticky CTA each produced
`gtag('event','whatsapp_click',{link_url:'https://wa.me/919289838797',link_text:'Speak to Priya on WhatsApp'})`.
The delegated listener is served as `<script id="kairali-cta-events">` on every LP.

## 7 · "Four generations" proof chip (Perplexity item 3)

Canonical source: docs/group-inputs/kairali-lineage.md — CONFIRMED as the single canonical
heritage reference by the owner (D-1908-DOC, 17 Jul 2026; all seven flags ruled). The four
generations are named individually (§0b): Dr. Sankunny Vaidiar (gen 1, first clinic 1908) →
Dr. K.S. Vasudevan (gen 2) → K.V. Ramesh & Gita Ramesh (gen 3) → the fourth generation in the
group's leadership today; the group's own published About page calls K.V. Ramesh "the bridge
between the four generations". Under D-EXTREVIEW-OWNER-FACTS (18 Jul), owner-confirmed facts
are AUTHORITY — external-reviewer doubt about them lands in the advisory lane, never a blocking
FAIL.

## 6b · Single-H1 count — machine transcript (all ten routes)

Run 2026-07-18 22:44 IST against the curl-saved served HTML of every preview route
(`grep -o "<h1" $f | wc -l` per file):

    ayurveda-treatment-south-india: h1=1 · ayurvedic-hospital-kerala: h1=1 ·
    behandlung-in-kerala: h1=1 · kairali-brand: h1=1 · kairali-cleansing-centre: h1=1 ·
    pain-management: h1=1 · panchkarma-treatment: h1=1 · treatment-in-kerala: h1=1 ·
    treatment-packages: h1=1 · weight-loss: h1=1

Exactly ONE `<h1>` per route — the legacy duplicated-H1 defect is dead on all ten.

## 7b · Banned-word scan — machine transcript (register ban, absolute)

Screenshots cannot prove absence; the SERVED HTML can. Run 2026-07-18 22:46 IST (and re-run
23:00 IST on the two hero-fixed pages) against the curl-saved HTML of ALL TEN preview routes:

    for f in html/*.html; do
      grep -oiE "\b(spa|resort|holiday|luxur[a-z]*|cure[sd]?|journey|guests?|urlaub[a-z]*|luxus|vacances|luxe)\b|\bKur\b|\bGäste\b" "$f"
    done
    → CLEAN on all 10 (zero matches; the only near-hit in the repo is a code COMMENT about the
      legacy slug, which never renders)

Pixel layer: the battery's pass-1 screenshot review CAUGHT two legacy banner images with banned
words baked into pixels ("World Luxury Spa Awards" badge; "Your Journey to Wellness Begins Here")
and REMOVED both (commit 2711105, pass-2 screenshots) — the pixel claim is not asserted blindly;
it was audited image-by-image and the two violations were fixed.

## 7c · Consent-banner claim "Nothing is stored until you choose" — machine-verified TRUE

packages/consent/src/core.js: the inline default is `gtag('consent','default', DENIED_ALL)`
before any tag; `localStorage.setItem(CONSENT_STORAGE_KEY, …)` exists ONLY inside
`applyChoice()` — the click handler of the banner buttons. Pre-choice reads return null;
malformed storage stays denied. Additionally NEXT_PUBLIC_GA4_ID / GTM_ID are UNSET tonight, so
@kairali/analytics renders only the inert data-cta listener (no loaders, no cookies). The
banner sentence is a verified description of the implementation, not marketing copy.

## 8 · noindex + robots + sitemap (registry inversion check)

Every LP serves `<meta name="robots" content="noindex, nofollow"/>`; /sitemap.xml contains
zero /lp/ URLs; robots.txt is allow-all BY DESIGN so the meta-noindex is crawlable.

## 9 · Per-route served extracts (title · robots · schema @types · formType · images) — answers every route-specific-evidence ask

Extracted from the curl-saved served HTML (22:46/23:15 IST) + page-source formType props:

### ayurveda-treatment-south-india
- title: Ayurvedic Treatment in South India | Kairali, Palakkad
- robots: noindex, nofollow
- schema @types: "@type":"MedicalClinic" "@type":"Organization" "@type":"PostalAddress" "@type":"WebSite" 
- formType: formType="city-enquiry"
- images: /images/dr-deepu-john.png /images/treatment-context.jpg /images/dr-deepu-john.png 

### ayurvedic-hospital-kerala
- title: Ayurvedic Hospital in Kerala | Kairali Healing Village
- robots: noindex, nofollow
- schema @types: "@type":"MedicalClinic" "@type":"Organization" "@type":"PostalAddress" "@type":"WebSite" 
- formType: formType="international-enquiry"
- images: /images/dr-deepu-john.png /images/hospital-campus.jpg /images/healing-village-grounds.jpg /images/therapy-abhyanga.jpg /images/patient-villa-classic.jpg /images/dr-deepu-john.png 

### behandlung-in-kerala
- title: Ayurveda-Behandlung in Kerala | Kairali Healing Village
- robots: noindex, nofollow
- schema @types: "@type":"MedicalClinic" "@type":"Organization" "@type":"PostalAddress" "@type":"WebSite" 
- formType: formType="de-consultation"
- images: /images/patient-villa-maharaja.jpg 

### kairali-brand
- title: Kairali — The Ayurvedic Healing Village, Palakkad
- robots: noindex, nofollow
- schema @types: "@type":"MedicalClinic" "@type":"Organization" "@type":"PostalAddress" "@type":"WebSite" 
- formType: formType="brand-enquiry"
- images: /images/dr-deepu-john.png /images/hospital-campus.jpg 

### kairali-cleansing-centre
- title: Kairali Cleansing Centre | Ayurvedic Hospital in Kerala
- robots: noindex, nofollow
- schema @types: "@type":"MedicalClinic" "@type":"Organization" "@type":"PostalAddress" "@type":"WebSite" 
- formType: formType="cleansing-enquiry"
- images: /images/dr-deepu-john.png /images/therapy-panchakarma.jpg /images/dr-deepu-john.png 

### pain-management
- title: Ayurvedic Pain Management in Kerala | Kairali KTAHV
- robots: noindex, nofollow
- schema @types: "@type":"MedicalClinic" "@type":"Organization" "@type":"PostalAddress" "@type":"WebSite" 
- formType: formType="pain-consultation"
- images: /images/dr-deepu-john.png /images/therapy-pain-management.jpg /images/dr-deepu-john.png 

### panchkarma-treatment
- title: Panchakarma Treatment in Kerala | Kairali Healing Village
- robots: noindex, nofollow
- schema @types: "@type":"MedicalClinic" "@type":"Organization" "@type":"PostalAddress" "@type":"WebSite" 
- formType: formType="consultation" (default)
- images: /images/dr-deepu-john.png /images/consultation-pulse.webp /images/therapy-panchakarma.jpg /images/therapy-abhyanga.jpg /images/healing-village-grounds.jpg /images/dr-deepu-john.png 

### treatment-in-kerala
- title: Ayurvedic Treatment in Kerala | Kairali Healing Village
- robots: noindex, nofollow
- schema @types: "@type":"MedicalClinic" "@type":"Organization" "@type":"PostalAddress" "@type":"WebSite" 
- formType: formType="consultation" (default)
- images: /images/dr-deepu-john.png /images/healing-village-grounds.jpg /images/healing-village-grounds.jpg /images/therapy-abhyanga.jpg /images/patient-villa-classic.jpg /images/dr-deepu-john.png 

### treatment-packages
- title: Ayurvedic Treatment Packages in Kerala | Kairali KTAHV
- robots: noindex, nofollow
- schema @types: "@type":"MedicalClinic" "@type":"Organization" "@type":"PostalAddress" "@type":"WebSite" 
- formType: formType="package-enquiry"
- images: /images/dr-deepu-john.png /images/therapy-abhyanga.jpg /images/patient-villa-classic.jpg /images/patient-villa-maharaja.jpg /images/healing-village-grounds.jpg /images/dr-deepu-john.png 

### weight-loss
- title: Ayurvedic Weight Loss Treatment in Kerala | Kairali KTAHV
- robots: noindex, nofollow
- schema @types: "@type":"MedicalClinic" "@type":"Organization" "@type":"PostalAddress" "@type":"WebSite" 
- formType: formType="consultation" (default)
- images: /images/dr-deepu-john.png /images/consultation-pulse.webp /images/dr-deepu-john.png 


## 10 · DE lang wrapper (behandlung pass-1 ask)

Served HTML of /lp/behandlung-in-kerala: `<main lang="de">` wraps the entire page content —
the correct per-page language declaration for a single DE campaign page inside a site whose
config declares ["en"] tonight. `<html lang="en">` stays until the DE locale TREE ships with
the full KTAHV rebuild (declared on-page and in STRATEGY §1 #9; flagged, not silent).
