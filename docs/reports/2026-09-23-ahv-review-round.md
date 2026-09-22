# AHV — owner review round of preview lcoihgtog (22–23 Sep 2026)

**Directives:** D-20260922-21..29 (owner chat + MCQs), Anoop's e-mail of 22 Sep (current doctors), Deepu's layout
doc of 19 Sep (Google Doc 18r4P1AM…), the 508-record chrome audit and the 1,778-load responsiveness sweep.
**Branch:** codex/ahv-english-staging-20260915 · **Site:** sites/ayurvedichealingvillage.com

## 1. What the owner flagged, what was found, what changed

| Owner's words | Measured cause | Change |
|---|---|---|
| "Kairali ,Pure Bliss, once in a lifetime experience!" — fix the comma | /our-villas/ tagline in the dataset + both views (and one testimonial "awesome ,very" on the campaign pages) | Corrected in place. |
| Chat with Priya vs the chat bubble — same thing, keep one | Footer "Chat with Priya" linked to chat.kairali.com (dead, 404 per Deepu); the Chatbase bubble works | chrome.js turns the footer link into the bubble's opener (wakes the deferred loader, opens the widget; falls back to the locked WhatsApp number if the widget never loads). One chat. D-20260922-21. |
| /social-responsibilities/ left nav far from the text on wide screens — all new families? | 71 article-reader routes had the legacy menu floated to the VIEWPORT edge (x=0) while the text sat at 350; 5 routes had it floated right with a 577px gap at 1920 | article-reader.css: `<main>` becomes a 300px + content grid inside the 1220px container, rail LEFT (the owner's preference from /books/), 40px gap at every width; title/hero above and CTA/footer bands below span both columns; body images stay in their column. Measured: gap 40 on 5 sample routes at 1024/1440/1920, 0 overflow. |
| /books/ nav links not clickable | The rail is `position:sticky; top:96px` and 1,081px tall — taller than the window, so its lower links can never be reached while it is pinned | consistency.js: a sticky rail that cannot fit the window becomes static (re-checked on resize). The audit found the same on 38 routes at 768 and 42 at 1440. |
| /kair-by-kairali/ and /festivals/ broken | Their "Things to do" legacy menu was not styled (the sheet only knew the corporate menu), so 22 links rendered as raw headings + bullets above the content; kair also opened with the source's own breadcrumb line "Home – Kair by Kairali" as a paragraph and carries no product photograph in the record | Menu rules generalised to every legacy `<nav>` with a list (card, left rail); stray "Home – …" paragraphs removed at runtime (9 in the datasets); hero/product image is an open item (§4). |
| /about-us/ leadership bios "stuck in a weird view" on desktop | The 66ch prose cap applied to the director `<li>` rows, which are grid cards — rows shrank to 673px | Cap now skips list items/definitions that are laid out inline (grid/flex). |
| /online-consultation/ — why no Dr. Deepu photo | Anoop (GM, 22 Sep e-mail): the consultation invitation must NOT name one doctor or years of experience — "everyone will want Dr. Deepu only"; panel wording requested | Left as is; the panel-wording MCQ was not answered (§4). |
| Dr. Ashikha Raj | Not on the GM's current-doctors list; her card sat on /panchkarma-treatment.html, a `doctors[]` entry on the 7 retreat pages, two block runs on the campaign pages, a figure on the Karkidaka page and a homepage team tile — which was painting Dr. Akhila's photo, while Akhila's tile painted Ashikha's | tools/repair-physician-roster.mjs removes every instance (11 nodes) and un-crosses the two homepage photos (D-20260922-27). Patient testimonials that mention "Dr. Ashika" are quotes and stay. |
| Contact page live map (Deepu) | Static OpenStreetMap image + Get-directions button | consistency.js: after the visitor accepts cookies the static map becomes a Google Maps embed; declined/undecided keeps the static map (D-20260922-28, HARD GATE 11 respected). |
| Header Contact item (Deepu) | — | Declined by the owner (D-20260922-29). |
| Responsiveness of all 254 pages | Sweep (7 widths × 254): 0 overflow at 360/390/1024/1280/1440/1920; **35 routes overflowed at 768** — 31 programme pages via a decorative watermark image (`width:430px; opacity:.08`) running past its column, plus /terms-and-conditions/ (one unbroken link) and the packages listing (3px) | chrome.css: watermark capped to its column and `overflow-x:clip` on `<main>` below 1024px (clip, not hidden — sticky rails still work); long links wrap. This is the one touch on the locked programme pages and it changes no design, only prevents a sideways scroll. |
| Missed images / empty placeholders | Sweep: 0 broken images across 1,778 loads; unfilled image slots on **/offers/** (4–5) and **/map/** (6 "MAP" boxes) only | Open (§4): both need photographs/maps chosen from the image bank. |

## 2. From the inbox (owner: "check my email for Deepu's feedback and others")

- **Anoop Vijayaraj, GM (21–22 Sep):** update Our Experts; consultation invitation must be a panel-of-doctors message
  without years of experience. Current doctors: Dr. Deepu John, Dr. Aashitha PS (new photo to be added), Dr. Akhila
  Oommen, Dr. Rahul Ramachandran, Dr. Adhina UB (new photo to be added). → Ashikha removed (above); panel wording
  pending the owner's answer; two photographs pending from the GM.
- **Deepu Sahani, developer (19 Sep Google Doc):** 17 layout/form points. Resolved by this and the previous round:
  header identical on every page, campaign-page layouts (all eight), panchkarma header, "Priya 404", footer differing
  on mobile, the dead search icon (in the search build), the 404s he listed are either built (/karkidaka…, /treatment-in-kerala-russian)
  or already ruled (docs/reports/2026-09-20-ahv-legacy-url-fates-what-is-left.md). Still his lane: field validation
  (phone/WhatsApp, required fields) — forms are wired by Deepu before the flip (Q-AHV-ENQUIRY-ENDPOINT). Ruled by the
  owner: live map yes, header Contact no. Unclear and not actioned: "dropdown item not showing after hover" (the
  shared header has no dropdowns; needs the page he meant).
- **Deepu (21 Sep, "Website PRs – Review, Approval and Deployment Status"):** a process question about PRs #299, #301,
  #304, #310/#311 — owner-side, not an AHV content item.
- **mkt@ktahv.com (22 Sep):** the V4 price list for 1 Oct 2026 – 30 Sep 2027 is on Drive (folder 1enbssF2…) — the
  tariff refresh input Q-AHV-TARIFF-REFRESH has been waiting for.
- **mkt@ktahv.com (22 Sep):** 360° virtual-tour shoot at the hospital 28–30 Sep covering all 30 villas and treatment
  areas — the natural moment to shoot what the image bank lacks (§3).

## 3. The three research streams (all in the repo)

- **Gallery best practice 2026:** docs/research/2026-09-23-ahv-gallery-best-practice.md — chaptered, captioned,
  story-led galleries; `lite-youtube` video facade; ImageGallery/ImageObject/VideoObject structured data; image
  sitemap; render all tiles (no click-to-load); 45+ lightbox rules; measurable acceptance checklist.
- **Image bank mining:** docs/media/ahv-gallery-candidates-2026-09-23.{json,md} — 2,380 stills enumerated,
  400 shortlisted with sha256 + dHash de-duplication against the 3,575 served files. Candidates per gallery:
  photo 80, property 80 (+83 reserve), treatments 80 (+269), villas 80, retreats 58, product 80 (61 KAPPL packshots
  [TO CONFIRM]), **sightseeing only 12** (the bank holds no off-campus photography at all), yoga 10 (9 already
  serve). Today's galleries carry 41 duplicate pairs by crop. Video: 290 files / 62.6 GB catalogued; YouTube channel
  492 videos, 369 listed, 157 flagged for a health-claim review before embedding (HARD GATE 7).
- **Search brainstorm:** pending (docs/research/2026-09-23-ahv-search-brainstorm.md when it lands) — top-bar search,
  programme finder and the FAQ filter on one typo-tolerant engine.

## 4. Open decisions for the owner (asked next, MCQ)

1. Consultation panel wording (Anoop) — unanswered in the last MCQ.
2. /walk-in-ayurveda-treatment/ — re-render through the article family now (left rail, prose system) vs a proper
   designed OPD page later; its H1 reads "OPD".
3. Hero/product photographs for article pages that show the generic aerial (kair-by-kairali and ~120 others) —
   assign per page from the bank candidates; kair needs its product shot.
4. /about-us/ leadership: the bank holds NO newer portraits (best: KVR and Abishek 400×400 from 2021, Gita 1000×618,
   Abhilash 999×562 award photo) — shoot new ones at the 28–30 Sep session, or use these; the "Asia's Best
   Ayurvedic Retreat Since 1999" banner remade as HTML text over a photograph.
5. Galleries: GO on the chaptered rebuild per the research spec, using the mined candidates; sightseeing needs a shoot.
6. Homepage "I am looking for / preferred dates" — where it should send the visitor.
7. /offers/ and /map/ image slots — fill from the bank.

## 5. Verification (this round)
- Sweep after the fixes (local build, 254 routes × 390/768/1440 = 762 loads): **0 horizontal overflow, 0 leftover
  note strings, 0 page errors** (the 35 tablet overflows of the audit are gone).
- Article rail grid measured on 6 routes at 1024/1440/1920: rail at the container's left edge, 40px gap to the text,
  0 overflow; tall rails static, short rails sticky.
- Homepage team tiles in the snapshot: Dr. Deepu John, Dr. Rahul R, Dr. Akhila Oommen — each on its own photograph;
  Dr. Ashikha Raj: 0 mentions in any served payload or snapshot (postcondition of the roster tool).
- Contact page with consent accepted: the map link holds the Google Maps iframe (embed URL, no key); without consent
  the static map stays. Footer "Chat with Priya" → `#chat`, opens the Chatbase bubble.
- /our-villas/ tagline: "Kairali, Pure Bliss, once in a lifetime experience!".
- Deployed: https://kairali-web-factory-ayurvedichealingvillage-4y0ckyest-kairali.vercel.app (previous lcoihgtog removed; the Vercel SSO login in the
  automation browser window prevented a second in-browser check this time — the deployment is the same prebuilt output
  the local checks ran against).

