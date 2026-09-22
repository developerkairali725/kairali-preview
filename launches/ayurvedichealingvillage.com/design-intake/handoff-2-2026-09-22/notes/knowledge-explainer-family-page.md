# T04 Knowledge / explainer family — desktop template
File: `AHV Template Knowledge Explainer Desktop.dc.html` (one DC, three real routes behind a review switcher)
Status: DESKTOP DRAFT — awaiting owner approval. Mobile not started (standing rule 4).
Source: live server HTML fetched 19 Sep 2026 (no drop folder existed for these three routes).

## Routes bound
| Route | Words | Live shape | Rendered state |
|---|---|---|---|
| /new-to-ayurveda/ | 644 | 12 headings, 8 lists, 6 images | default tab |
| /learn-about-ayurveda/ | 722 | prose wall, 0 lists, 2 images | tab 2 |
| /learn-more-about-ayurveda/ | 87 | 1 paragraph, no sub-headings | tab 3 |

## The typographic system (four other families inherit this)
- Measure 66–68ch, body 18px / 1.75, ink #2A2118 on ivory #F7F4EA. Lead paragraph 20–21px; the 87-word page runs at 23px so a single paragraph still reads as a page.
- H1 Marcellus clamp(38–58px). H2 Marcellus 32–34px, each preceded by a 64px gap + full-measure hairline (#DCD3BF) — the hairline is the section metronome. H3 drops to Mulish 700 13px / 2.4px tracking uppercase bronze, so a sub-level never competes with an H2.
- Lists: no disc. 22px bronze rule + text in a 2-col grid, 14px between items.
- Term:description pairs (live writes them as bold-lead bullets) become a `<dl>` with the term in Marcellus 21px in a 20ch column and hairline rows. This is the single biggest rhythm device on the 644-word page.
- Images: two treatments — full-measure, and a breakout that extends 120px into the left rail. Captions 14px with a bronze tick.
- Sticky "On this page" rail (230px) renders only when the route has sub-headings. It is what keeps the 722-word prose wall navigable.
- Long-form relief on the prose wall: one pulled sentence at Marcellus 30px between hairlines, `aria-hidden="true"` so the duplicated sentence is decorative only and is not re-indexed or re-read by screen readers.
- Short-page strategy: no padding, no invented body copy. Weight comes from the hero band, a centred 60ch paragraph at 23px, two real CTAs, then the full Knowledge Centre index (all 8 explainers in 5 grouped cards) as the page's lower half.
- Fixed closing block on every route: "Continue in the Knowledge Centre" (4 cards) → forest consultation band → frozen Home footer chrome.

## Copy handling
Body copy below the hero is VERBATIM from live on all three routes, including its typos ("a Kairali's", "Pita Dosha", the exclamation marks). Nothing was rewritten.

Added content — **APPROVED by owner 19 Sep 2026**, draft badges removed, now permanent page content:
1. Standfirst line on each of the three routes (required by Hero C; live has none).
2. Three-dosha explainer card on /new-to-ayurveda/ (general-knowledge definitions, no cure claims).
3. "Common questions before a first visit" — 3 Q&A, targets the long-tail queries a first-time reader searches. Ready to be marked up as FAQPage schema once approved.
4. Compact dosha glossary aside on /learn-about-ayurveda/.
5. Figure captions (5).

## Register-violation flags (brand §12.2, all inherited from verbatim live copy — do not fix without owner sign-off)
- "retreat", "Health Retreat", "Best Ayurvedic Resort in Kerala", "Wellness Resort in India", "luxury retreat center", "private luxury villas", "Ayurvedic spa therapy", "spa therapists" — leisure register, banned by the KTAHV clinical rule.
- "Relax / rejuvenate / relaxing / homey / transformative" — leisure verbs.
- "world-leader", "industry leader", "100% Natural" — superlatives / absolute claim.
- "Begin Your Journey to Wellness Today!" and "Experience Ayurveda and life!" — exclaiming headings, banned.
- "Perfect for Seniors" / "older folks" — register and audience-tone risk for a 45+/55+ readership.
- My own added copy uses the clinical register only (patient, physician, programme, consultation).

## Head contract (verbatim from live, for Codex)
- /new-to-ayurveda/ — title "New to Ayurveda? Experience Holistic Healing at Kairali"; og:title "New to Ayurveda"; robots index,follow; canonical self; og:image /2023/11/our-story.png; alternate locale fr_FR.
- /learn-about-ayurveda/ — title "Kairali – The Ayurvedic Healing Village | Ayurveda Pitta | Ayurveda Vata | Ayurvedic Massage in Kerala"; **robots noindex,follow**; no canonical emitted by live.
- /learn-more-about-ayurveda/ — title "Ayurveda programmes at kairali: A learning curve"; robots index,follow; canonical self; alternate locale fr_FR.

## Codex asks
1. Download and self-host the six live images from these routes (we are on substitutes from assets/img/ today): `2023/11/our-story.png` (already local at assets/img/article/our-story.png), `2023/07/kairalismostaffordableayurvedatrainingcourses.jpg`, `2023/07/Shirodhara-treatment-as-part-of-Panchakarma-therapy.jpg.webp`, `2024/10/takradhara-therpy.jpg`, `2023/09/panchakarma-package-1.jpg`, `2024/10/Yoga-Retreats-About-us-min.png`. Never hotlink.
2. Confirm the /learn-about-ayurveda/ **noindex** is intentional before porting; if not, it changes the whole family's indexation plan.
3. Card links now all use the Knowledge Centre sidebar URLs (`/why-pick-an-ayurveda-treatment-orayurvedic-retreat/`, `/why-get-training-in-ayurveda/`, `/what-is-panchkarma/`, `/ayurveda-retreats-for-everyone/`). Live also exposes `/why-pick-a-yoga-or-yoga-retreat/` and `/retreats-for-everyone/` for the same two articles — confirm the survivors against sitemap-final.json and 301 the others.
4. QA the three states at 1280 / 1440 / 1920 and at 200% browser zoom (rail collapse point).

## Open gaps
- Breadcrumb chain is provisional (Home / Knowledge Centre / page) — URL hierarchy, pending `sitemap/sitemap-final.json`.
- /learn-about-ayurveda/ ends mid-thought ("The following extracts are taken from her excellent manual") — the extracts themselves are not on the live page. Owner: supply them, or cut the sentence.
- No forms on these routes, so rule 8 does not apply.

## Done-bar
- SEO head contract captured verbatim above · link set taken from live body · WCAG 2.2 AA: body 18px, line-height 1.75, all targets ≥44px, no hover-only disclosure, no carousel, focus ring on every control, breakout figures keep full contrast · register flags listed above.

## Owner review — 19 Sep 2026
- All drafted content approved. DRAFT badges removed; the `showDrafts` prop is gone.
- Section rules lightened to #EAE3D2 and the missing rule added above "Learn About Ayurveda" on the long route, so every H2 opens on the same hairline.
- Closing consultation band: forest #134A33 replaced with a white card, bronze top rule, marigold primary CTA (owner: "random green why" — and brand conflict #1, owner dislikes dark green). Forest is now only used for inline link colour.
- Added a global `box-sizing:border-box` reset — the band's 104px padding was overflowing the viewport by 34px. Carry this into the mobile view.
- Swapped the 200px-wide training card image for assets/img/AHV-Ayurveda-Training-Practice.jpg.
