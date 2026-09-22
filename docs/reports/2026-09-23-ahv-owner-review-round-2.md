# AHV — owner review round 2 (preview 8r3mqjl0y), 23 Sep 2026

Owner's review of preview `…-8r3mqjl0y-…` (chat, 2026-09-23 ~00:20–01:40 IST, captured as D-20260923-01).
Twenty-four findings across fourteen pages, plus the /sitemap/ question. Every fix below is a re-runnable
tool or a design-layer file, nothing hand-edited in `public/ahv/` (a re-import survives it). Evidence: the
Playwright sweep in §3 and the screenshots it wrote; the preview URL is in §6.

## 1. The big one — ONE section navigation for every content family

**What was wrong.** Each captured page carried whatever WordPress sidebar widget it happened to have:
/live-to-100-with-panchkarma/ (Knowledge Centre) printed the Things-To-Do menu; /yoga-retreats-for-everyone/
printed the Knowledge Center menu inline as body text; /things-to-do/, /gallery/, /village-facilities/, /about-us/
and /knowledge-centre/ had no section menu at all; the Claude-Design article family folded its groups behind
toggle buttons whose group headings ("Attractions") were not links; /books/ pinned a 19-link sticky rail whose
lower links could never be reached. Four shapes, none of them the page's own section.

**What ships.** `tools/build-section-nav.mjs` reads the OWNER-AUTHORISED breadcrumb of every route (dataset
`crumbs`/`breadcrumb`, or the view's own breadcrumb nav) and derives each section's page tree from it — nothing
typed by hand, the rail says exactly what the breadcrumb says, one level wider. Output:
`english-candidate/section-nav.json` + `public/design/section-nav.data.js`. `public/design/section-nav.js`
removes the captured sidebar (by component name, by `ctx-h`, or by the context-menu component's `/c/1`
pointer subtree) and builds `<nav aria-label="In this section: …">`; `section-nav.css` lays it out.

| Section (hub) | Routes carrying the rail | Nodes in the tree |
|---|---|---|
| About Us | 31 | 31 |
| Village Facilities | 15 | 15 |
| Things to Do (incl. the four attractions pages) | 17 | 16 |
| Knowledge Centre | 15 | 14 |
| Training Programs | 9 (courses keep their own design, are listed) | 16 |
| News & Past Events | 11 | 13 |
| Gallery | 3 | 9 |
| Offers (article pages only) | 5 | 9 |
| All Programmes (article siblings only) | 8 | 14 |
| Careers · the reviews section (/read-feedback/, breadcrumb label as the source names it) | 2 · 2 | 3 · 1 |

119 routes in scope; 75 designed/locked families deliberately kept out (forms, campaigns, policies, galleries,
package pages, villas, the past-event page designs, T6 product family which has its own designed rail).

**How it behaves (2026 standards, older visitors).** Desktop ≥1024: a 300px card on the left, sticky while it
fits, scrolls inside its own box when it does not (no link is ever unreachable), current page bold on a gold
bar, ancestors bold, no groups hidden behind toggles, 17px rows ≥48px tall. Phone/tablet: one 56px bar under
the page title — "In this section · Things to Do ▾" — tap to open. Three placements: `grid` (main becomes a
300px + 1fr grid; title and hero span both columns, the closing "Where we are"/"Guidance" blocks span again),
`inline` (the article family's existing left column), `toc` (under the attractions family's "On this page").
Measured: no rail overlaps the footer on any of eight sampled pages; no horizontal overflow at 1366/390.

Retired: the legacy-sidebar rules in `public/design/article-reader.css` (the menus they matched are gone).

## 2. The rest of the list

| Owner finding | Fix | Where |
|---|---|---|
| /enquiry-form/ "looks incomplete" | rebound to the designed **contact** variant with its own H1/eyebrow/lede | `tools/repair-enquiry-form.mjs` |
| Home "I am looking for" needs autocomplete | live combobox: 6 rows (programmes › questions › pages), keyboard + Enter | `public/design/search.js` (+css) |
| Home: two of three buttons dead | "Find a programme" was blocked by the staging submit guard → GET search forms exempted; Enquire link now same-origin; Book Your Stay verified live (200) | `boot.ts`, `tools/repair-home-search.mjs` |
| Two chat bubbles on desktop | where the design's "CHAT WITH PRIYA" exists it opens Chatbase and Chatbase's launcher/nudges are hidden; elsewhere Chatbase's launcher is the only control | `public/design/chrome.js` |
| Search icon text brown on the hero | white (`color:inherit` no longer appended when the anchor set a colour) | `tools/repair-home-search.mjs` |
| Placeholder Priya photo; small Gita photo at her quotes (contact + consultation) | Priya = the Chatbase assistant's own avatar, self-hosted; Gita = 64px round portrait beside the attribution (both variants) | `tools/repair-enquiry-portraits.mjs` |
| Panchakarma: testimonial without video | the middle card (Dr. Rajesh P., Mumbai) is a TEXT testimonial in the source — no video ever existed; nothing missing | — |
| Butterfly download button unreadable | button rule wins over the prose-link colour | `article-reader.css` |
| Attractions in left nav not clickable | the disclosure menu is gone; every rail entry is a link | §1 |
| /things-to-do/ terrible, no images, not linked | 11 lead paragraphs → cards with the target page's own photograph + link, in three grids; the stray "–" separator paragraphs removed | `tools/repair-things-to-do.mjs`, `consistency.js` |
| Senior offer: dark hero, empty testimonials, award strip, stock hero | hero text light on the wash; five slides carry the video's own title + channel (YouTube oEmbed, cached in `english-candidate/video-titles.json`); awards as 5-up captioned cards; hero = Kairali verandah consultation photo | `campaign.css`, `tools/repair-senior-offer.mjs` |
| /offers/ "Discover" button dead, "Destination" line, empty images | three card buttons → the site's own offer routes, Destination lines dropped, four slots + the featured block painted with Kairali photographs | `tools/repair-offers-cards.mjs` |
| Live-to-100 nav stretched / wrong section | §1 (Knowledge Centre rail) | |
| Package pages: Sanskrit names | 3 of 5 missing lines filled from the owner's register; 2 have no name in the register → Q-AHV-SANSKRIT-YOGA | `tools/repair-sanskrit-names.mjs` |
| /ayurvedic-products/ collapsible nav, unclickable | §1 | |
| Knowledge Centre: latest package names | 32 programme-link labels updated to the register name (commercial 20, utility7 11, collection 1); only anchors to programme routes, never prose | `tools/repair-programme-link-names.mjs` |
| Akhila Oommen's photo is Ashika | her own portrait ships as `team-akhila-oommen-2.webp` (homepage roster, consultation panel); identification in Q-AHV-AKHILA-PHOTO | `tools/repair-physician-roster.mjs` step 4 |
| Training courses: Learn more + Enquire | both buttons on every row, desktop table and mobile cards | `tools/repair-training-table.mjs` |
| /ayurvedic-links/ brand line twice | the article family's own kicker + the house eyebrow; eyebrow dropped for that family | `article-reader.css` |
| /no-smoking/ header not sticky; rail over footer | outer header mount made sticky ≥700px; rail bounded by its grid area | `chrome.css`, §1 |
| /gallery/ broken, galleries missing | 11 gallery cards (8 photo collections + Ayurveda, Video, Virtual Tour) with covers from the gallery manifests | `tools/repair-gallery-hub.mjs` |
| /village-facilities/, /yoga-retreats-for-everyone/ no family nav | §1 (menu subtree removed, rail added) | |

## 3. Evidence

Playwright sweep (`tests/_verify.tmp.mjs`, 25 routes × 1366/390, throwaway by house rule): 0 console errors,
0 failed requests, 0 legacy menus left, rail present on every in-scope route, no horizontal overflow, Chatbase
launcher never visible beside the design's Priya button, sticky header at 0px after scrolling on /no-smoking/.
The only "CHECK" flags were the `[TO CONFIRM]` fact chips on /offers/ (kept on purpose, D-20260922-10).

## 4. /sitemap/ — "only 197 links, are we missing anything?"

Counted on the build: the page's `<main>` links **209 distinct paths**; the manifest serves **254 routes**.
The 56 not linked split into: 21 canonicalised duplicates (`sitemapExclude`), 15 legacy `.html` campaign
pages, 11 old/test/utility pages (`*-old/`, test pages, cart/checkout/thank-you), and about a dozen real pages
that should be there — /all-programs/, /ayurveda-training-programs/, /gallery/, /learn-about-ayurveda/,
/new-to-yoga-teacher-training/, /no-refridgeration/, /our-story/, /panchakarma/, /retreats-for-everyone/, the
finder hubs, /yoga-retreats/, /yoga-and-ayurveda/, the two offer campaigns. Seven links also miss their trailing
slash and three point at dead paths (/opd/, /sitemap_index.xml, /panchkarma/). The `sitemap.xml` is EMPTY by
design (`app/sitemap.ts` staging lock, turns on with `AHV_STAGING=0`). Another session was editing the
/sitemap/ views and `english-candidate/sitemap-navigation.json` while this ran (uncommitted, untouched here), so
the missing-page list is theirs to absorb; I have not changed the sitemap page.

## 5. Open for the owner

Q-AHV-SANSKRIT-YOGA · Q-AHV-AKHILA-PHOTO · Q-AHV-OFFER-PHOTOS (QUESTIONS.md, 23 Sep 2026).

## 6. Preview

Commit e3bc2b17 on `codex/ahv-english-staging-20260915`, prebuilt and deployed: **https://kairali-web-factory-ayurvedichealingvillage-he04otg43-kairali.vercel.app** (SSO-protected; the
earlier 8r3mqjl0y preview stays up for side-by-side comparison). Local build 2 verified before deploy: 25 routes × 1366/390,
0 console errors, 0 failed requests, 0 legacy menus, rail on every in-scope route.
