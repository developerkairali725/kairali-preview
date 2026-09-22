# AHV gallery best practice, 2026 — research + GALLERY SPEC

- **Generated:** 2026-09-22 16:53:59 IST (machine clock; the owner's directive D-20260922-25 is logged as "owner chat, 2026-09-23 ~00:40 IST" — the file name follows the directive date, the stamp follows the clock)
- **As of commit:** `6c022d62` on `codex/ahv-english-staging-20260915`
- **Directive served:** D-20260922-25 — "research how images+video galleries are best shown in 2026 (Reddit/forums, SEO, AI search) and upgrade ours; use the WHOLE image bank, no duplicates, images that compel and sell the property and the treatments, plus videos; sightseeing gallery has only a few photos — fill it"
- **Register:** KTAHV clinical lock applies to every word of the spec (patient, physician, treatment, programme, Panchakarma, admission, consultation). Quoted third-party text that contains locked words is fenced as `quoted source data`, never reused as copy.
- **Type:** research report + implementable spec. Read-only on the repo; nothing else edited. The build itself is a separate, gated task (front gates: this touches page structure on a site in staging, so the change rides the issue state machine, not a re-run of the design gates — Gate-1 altitude rule).
- **Evidence labels** (OS v2 §4): OBSERVED_FIRST_PARTY = measured in this repo / the live site / Clarity this session; DOC_PRIMARY = vendor documentation fetched this session; SECONDARY = trade press / forum; ASSUMPTION = mine, flagged; UNKNOWN = not established.

---

## 0. The recommendation in one screen

1. **Stop shipping galleries as a mute grid.** Replace the single "photo-collections" template (filterable grid, "Tap to enlarge", 12-per-page "show more", no captions, no video) with a **story-led chaptered gallery**: named sections, each with a 2–3 sentence "what you are looking at" paragraph, 6–12 captioned photographs, one optional video, and a link to the page the photographs illustrate (treatment, villa, programme). Curated chapters beat an undifferentiated masonry wall for both persuasion (Baymard/NN/g/Smashing) and search (Google: "make sure images are placed near relevant text").
2. **Every photograph gets three pieces of text**: a unique `alt` (8–20 words, factual), a visible `<figcaption>` (one sentence, names subject + place inside the hospital), and a section it belongs to. Today 0 of 121 placements have a caption and 22 of 66 alts on `/photo-gallery/` are duplicates; live, 178 of 196 `<img>` on `/photo-gallery/` have empty or missing alt. That is the single largest gap.
3. **Video enters via a facade, never a raw iframe.** `lite-youtube` (youtube-nocookie, self-hosted poster, click-to-play, ~100 KB shared vs ~1.3 MB per raw embed), one per chapter where a video exists, plus a rebuilt `/video-gallery/` hub with a `VideoObject` per video. The live `/video-gallery/` ships 25 YouTube iframes (5 lazy) — that page is the site's heaviest.
4. **Structured data and an image sitemap make the gallery discoverable to Google Images, AI Overviews/AI Mode, Bing/Copilot, ChatGPT and Perplexity** — none of which needs anything "special", all of which need crawlable `<img src>` in HTML, descriptive alt/captions, on-page text, and markup that matches what is visible. Use the existing `imageGallery()` helper in `packages/schema` and extend `buildSitemap()` in `packages/seo` with the image extension.
5. **Render all images in the HTML** (max 69 per route), lazy-load below the fold, `content-visibility: auto` on chapters; drop the click-driven "show more" (Google does not click). Hero is the only `fetchpriority="high"`; first row eager, rest lazy.
6. **Accessibility for the 45+ patient**: native `<dialog>` lightbox with Esc / arrow keys / swipe, 44 px controls (WCAG 2.5.8 minimum is 24, we set 44), caption under the image (never overlaid), ≥ 18 px caption text at 4.5:1, no autoplay anywhere, `prefers-reduced-motion` honoured, pinch-zoom never disabled.
7. **Sourcing gap (owner-side, flagged, not filled):** six of eight routes currently hold only 5–13 legacy banner crops at 1280×572 / 1000×500 — too small and too wide for a 2026 gallery. The directive's "whole image bank" is the fix; the spec lists the exact per-route slots to fill and the minimum pixel size per slot.

---

## 1. Baseline — what exists today (OBSERVED_FIRST_PARTY)

### 1.1 Repo (English candidate, this branch)

| Route | H1 | Placements | With caption | Duplicate alts | Native size of tiles |
|---|---|---|---|---|---|
| `/photo-gallery/` | Photo Gallery | 66 | 0 | 22 | 1400×2000, 1400×1000 |
| `/property-gallery/` | Property Gallery | 13 | 0 | 5 | 1280×572 |
| `/treatments-gallery/` | Treatment Gallery | 9 | 0 | 2 | 1280×572 |
| `/villas-gallery/` | Villas Gallery | 9 | 0 | 2 | 1000×500 |
| `/sight-seeing-gallery/` | Sight Seeing Gallery | 7 | 0 | 2 | 1280×572 |
| `/retreats-gallery/` | Retreats Gallery | 5 | 0 | 1 | 1280×572 |
| `/product-gallery/` | Product Gallery | 6 | 0 | 2 | 1024×458 |
| `/yoga-gallery/` | Yoga Gallery | 6 | 0 | 2 | 1000×500 |

- Source: `sites/ayurvedichealingvillage.com/public/ahv/assets/img/gallery/` (264 files, 12 MB of WebP; largest single WebP 341 KB at 1400 px) and `public/ahv/assets/photo-collections-data.js` (121 placements, 121 unique files — no duplicate files within the dataset).
- Template: `english-candidate/package-overlay/AHV Template Photo Collections {Desktop,Mobile}.dc.html` + `public/ahv/assets/gallery-family-render.js`. Counted in the desktop template: `<figure>` 0, `figcaption` 0, `srcset` 0, `loading=` 0, `fetchpriority` 0, `<video>`/`iframe`/`youtube` 0, `touch`/`swipe`/`keydown` 0, `prefers-reduced-motion` 1, `role="dialog"` 1, `Escape` 1. Prerendered routes carry `loading="lazy"` on tiles (e.g. 12 of 17 imgs on `/photo-gallery/`) but no `<figure>` and no gallery-specific ld+json.
- Every route's dataset `head.robots` is `noindex, nofollow` — this is the **four-lock staging guard** (`tools/repair-robots-overrides.mjs`), not a gallery defect. Live serves `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` on all gallery routes (`english-candidate/live-robots-audit.json`). `app/sitemap.ts` returns `[]` while `AHV_STAGING !== "0"`; production wiring passes only `{ path }` to `buildSitemap()` — **no image extension exists yet**.
- The `/photo-gallery/` route carries a legacy `captionsBlock` of 11 marketing lines ("A Pathway to Peace…") that are *not* attached to any image and several of which breach the clinical register. Clinical-lock scan of the dataset: 4 hits — two alts quoting the entrance signboard (`"Kairali Ayurvedic Health Resort"`, a real sign, see §6.11), and the `/retreats-gallery/` intro + head description containing `journey` (source text).
- Shared helpers already available: `packages/schema/src/index.js` → `imageGallery()` (ImageGallery with `image[]`), `breadcrumbList()`, `itemList()`; `packages/seo` → `buildSitemap()`. No `VideoObject` helper, no `lite-youtube` anywhere in `packages/*` or `sites/*`.
- Video inventory in the candidate: 15 distinct YouTube IDs referenced (`D3QLxKpwtJs`, `3vWviQfW1Ug`, `ZgjrEXTiICw`, `UIeYZ0BqJic`, `rASffMR25u4`, `qMNfz4fcVgo`, `nwCIY-19BRE`, `nVqrUDzinmg`, `iPARaMRASUs`, `ExM6_gMdRHs`, `CcDPOeSR67E`, `3Xirq7h0bEo`, `1s1gMtcpTME`, `07tVC2oXd8g`, `DcTMckQD3rc`); the `/video-gallery/` prerender lists 19 titles, several of which carry locked words in their YouTube titles (`quoted source data`: "Luxury Ayurvedic Resort Kerala", "Kairali Health Resort Villa Interior", "Yoga Session with Guests at Kairali"). `uploadDate` and `duration` are not recorded anywhere in the repo (UNKNOWN — must be pulled from YouTube, never typed in).

### 1.2 Live site (fetched 2026-09-22)

- `https://ayurvedichealingvillage.com/photo-gallery/`: 665 KB HTML, **196 `<img>`, 178 with empty/missing alt, 5 distinct alt strings** (all "Ayurvedic Healing Village"), 0 `<figcaption>`, 84 `loading="lazy"`, ld+json types WebPage/ImageObject(primary image only)/BreadcrumbList/Organization/WebSite.
- `https://ayurvedichealingvillage.com/video-gallery/`: 561 KB HTML, **25 YouTube iframes, 5 lazy**, no `VideoObject`.

### 1.3 Engagement, Microsoft Clarity, 2026-06-24 → 2026-09-22 (non-bot)

| URL | Page views | Sessions | Avg scroll depth | Avg engagement |
|---|---|---|---|---|
| `/photo-gallery/` | 481 | 408 | 61.1 % | 53.8 s |
| `/gallery/` (hub) | 424 | 365 | 66.8 % | 13.2 s |
| `/video-gallery/` | 88 | 74 | 63.3 % | 70.8 s |
| `/sight-seeing-gallery/` | 42 | 39 | 90.1 % | 26.7 s |
| `/villas-gallery/` | 25 | 19 | 59.1 % | 22.9 s |
| `/property-gallery/` | 24 | 22 | 67.7 % | 42.2 s |
| `/treatments-gallery/`, `/yoga-gallery/`, `/retreats-gallery/`, `/product-gallery/` | not in the top rows returned (≤ 3 views each where they appeared as `.aspx` legacy URLs) | | | |

Reading: patients do open the galleries (≈ 1,000 gallery page views a quarter) and spend close to a minute on the photo and video pages, yet the hub page holds them only 13 s — the hub is a signpost, the photo page is the destination. The device split query returned no data (Clarity error type 3) — UNKNOWN; re-run before the build.

---

## 2. Q1 — How high-converting hospitality / health-property sites present galleries in 2025–26

### 2.1 Layout: curated chapters over masonry walls

- **Amanbagh (Aman), `https://www.aman.com/resorts/amanbagh/gallery`** (fetched): single grid, ~40 images then "Load 18 more", `<figure>` per image with **125+ character descriptive alt text** (e.g. `quoted source data`: "Amanbagh's main building reflected in the pool, with arched colonnades and warm stone architecture framed by trees."), no `<figcaption>`, no video, lightbox with prev/next arrows and a counter. Take: the alt discipline. Leave: the caption-less wall and click-to-load pagination.
- **Kamalaya, `https://www.kamalaya.com/gallery`** (fetched): "Photos & Videos" in one page, **filter chips by theme** (Rooms & Villas / Wellness / Holistic Activities / Landscapes / Facilities / Dining), ~60 items, **each tile carries a visible title** ("Lap pool and gym", "Traditional Thai Massage"), **Vimeo videos mixed into the grid with play icons**. Take: titled tiles, mixed media, theme chips. Leave: no intro text per theme.
- **Chiva-Som, `https://www.chivasom.com/gallery/`** (fetched): intro paragraph, filter tabs per property, ~70 images with descriptive alts ("A woman sitting on a balcony overlooking the ocean"), no captions, no video. Take: the one-paragraph orientation at the top.
- Ananda in the Himalayas, Six Senses Vana, Lanserhof, SHA returned 403/404 to the fetcher — UNKNOWN, not cited.
- **Smashing Magazine, "Usability Guidelines For Better Carousels UX" (Friedman, 2022)** (DOC_PRIMARY for UX): "Slides shouldn't rotate too quickly (min delay of 5–7s)", avoid auto-rotation on mobile; "Always show at which slide a user currently is"; replace dots with "labels, thumbnails, key highlights" — "Nothing can beat the clarity of numbers"; "Always support swipe gestures on mobile"; "slide advancement interactions follow an exponential rate of decay". Galleries work where "users study product image galleries … to understand the specifics" — i.e. when each image answers a question.
- **NN/g** (via search summary): auto-rotating carousels are largely ignored (Notre Dame data: ~1 % clicked, 84 % of those on slide 1); they "add complexity … in terms of usability and accessibility"; auto-forwarding hurts users with lower motor skills. Carousels earn their place only as **contextual image galleries**, not as ambient decoration.
- **Baymard Institute** (product-gallery research, SECONDARY but large-sample): always show thumbnails, signpost hidden ones ("show half of the final visible thumbnail"), mobile users naturally swipe; users overlook images that would have answered their question when the gallery hides them. Baymard, `https://baymard.com/blog/always-use-thumbnails-additional-images`, `https://baymard.com/blog/truncating-product-gallery-thumbnails`.
- **Hospitality conversion evidence** (SECONDARY, use with the stated caveats): Hospitality Net / Carmelon Digital claim that properties showing "more than 20 high-quality photos per room see up to 136% more bookings" and that "video tours and virtual walkthroughs further immerse visitors" (`https://www.hospitalitynet.org/opinion/4127383/…`). The Omni Hotels / VFM Interactive study: rich-media viewers "67% more likely to book"; video lift 2.9× that of virtual tours alone (`https://www.hospitalitynet.org/news/4033212.html`). None of these is a controlled test of *photo count* on a hospital site; they support "more, better-captioned, and some video", not a number.

**Synthesis for a hospital gallery:** the winning 2026 pattern is Kamalaya's mixed-media, titled tiles + Chiva-Som's orientation paragraph + Aman's alt discipline, arranged as **chapters** (a heading, a paragraph, 6–12 images, an optional video, a link onward) rather than filter chips over one wall. Chapters put the text next to the image (Google's ask), answer "what am I looking at" (the forum complaint, §5), and give each image a reason to exist (Baymard's finding). Filter chips survive only on `/photo-gallery/` as in-page jump links to the chapters — they must not hide content from the DOM.

### 2.2 Captions and "what you are looking at"

- Reddit r/SEO "Should I be worried about thin content?" recommends at least an H1 and "a paragraph … with some information about the photographs"; r/Wordpress "Should I index thumbnail images on my Artwork Page…": "Search engines won't rank pages solely on images—you need accompanying text to give context"; captions should contain "a title, interesting details about the image, the year, etc." (SECONDARY; URLs in §8).
- r/squarespace "Caption covers half of my work when you click on a photo": overlay captions hide the image on mobile; put captions "outside the image".
- Google Image SEO: "Google extracts information about the subject matter of the image from the content of the page, including captions and image titles" and "make sure images are placed near relevant text".

### 2.3 Lightbox UX and mobile

- Native `<dialog>` + `showModal()` gives focus trapping and Esc for free; Smashing's expandable-gallery article (2021) uses `<button aria-expanded>` inside `role="list"`, arrow keys between siblings, Esc to close, and `prefers-reduced-motion` → `transition-duration: 0s` (`https://www.smashingmagazine.com/2021/10/build-expandable-accessible-gallery/`).
- Mobile: swipe left/right, a numeric counter ("4 of 12"), caption below, pinch-zoom allowed, close button ≥ 44 px in the top corner, never trap the back button (close on `popstate`).
- Performance: the lightbox loads the *next* size up (`sizes="100vw"`), not an original; the tile's `srcset` is reused.

---

## 3. Q2 — Image + video SEO and AI search (DOC_PRIMARY unless marked)

### 3.1 Google Images (`https://developers.google.com/search/docs/appearance/google-images`)

- "Using standard HTML image elements helps crawlers find and process images" — `<img src>`, not CSS backgrounds; `<picture>`/`srcset` allowed but "Always specify a fallback URL using the `src` attribute".
- "Wherever possible, make sure images are placed near relevant text and on pages relevant to the image subject matter."
- Alt text: "Focus on creating useful, information-rich content that uses keywords appropriately"; avoid stuffing.
- Filenames: descriptive (`my-new-black-kitten.jpg` over `IMG00023.JPG`). Our gallery files are SHA-256 hashes (`00bdeed5….webp`) — see §6.6 for the fix.
- Preview image: `primaryImageOfPage` / `mainEntity.image` / `og:image`; "Avoid using a generic image".
- Formats supported in `src`: BMP, GIF, JPEG, PNG, WebP, SVG, **AVIF**.
- Image sitemaps: supported; **`<image:caption>`, `<image:title>`, `<image:geo_location>`, `<image:license>` are deprecated** — only `<image:loc>` counts; up to 1,000 images per `<url>` (`…/sitemaps/image-sitemaps`).
- `ImageObject` licence markup (`…/structured-data/image-license-metadata`): `contentUrl` required plus at least one of `creator`, `creditText`, `copyrightNotice`, `license`; "If you have the same image on multiple pages, add structured data … to each image on each page"; structured data wins over conflicting IPTC/EXIF.
- Robots meta (`…/robots-meta-tag`): `max-image-preview:large` = "A larger image preview, up to the width of the viewport, may be shown" (already live); `noimageindex` must never appear on gallery routes.
- Lazy loading (`…/javascript/lazy-loading`): use browser-level lazy loading or IntersectionObserver; **"Google Search does not interact with your page"** — content behind a click ("show more") is not seen; paginated chunks need "persistent, unique URL[s]"; verify in URL Inspection that image URLs "appear in the `src` attribute … in the rendered HTML".

### 3.2 Google Video (`…/appearance/video`, `…/structured-data/video`, `…/sitemaps/video-sitemaps`)

- Rich video features (video results, Key Moments) require "a dedicated watch page for each video"; embedded-on-other-pages videos "can appear as text results and image results with video badges".
- "The video must be embedded on a watch page", "can't be hidden behind other elements", "Don't rely on user actions (such as swiping, clicking, or typing) to load the video" — the *element* must be in the rendered HTML; a facade that renders the poster + `VideoObject` in HTML satisfies this (the player script loads on click, the video element/embedUrl is declared up front).
- Thumbnail: "valid thumbnail that's available at a stable URL", min 60×30, must be fetchable by Googlebot-Image.
- `VideoObject` required: `name`, `thumbnailUrl`, `uploadDate`; recommended `description`, `duration`, `contentUrl`/`embedUrl`, `interactionStatistic`; "Make sure to use unique text in the `name` … for each video"; "Ensure that any information … is consistent with the actual video content".
- YouTube-hosted: "Google may index the video both on your web page and on the third-party platform's equivalent page … We still recommend that you provide structured data" and video-sitemap entries; use `<video:player_loc>` for iframe platforms.
- Key Moments: automatic, or `Clip` (needs deep-linkable ≥ 30 s video) or, for YouTube, timestamps in the YouTube description.

### 3.3 AI search — Google AI Overviews/AI Mode, Bing/Copilot, ChatGPT/Perplexity

- Google, "AI features and your website" and the May-2025 post "Top ways to ensure your content performs well in Google's AI experiences": **"There are no additional requirements to appear in AI Overviews or AI Mode, nor other special optimizations necessary"**; "support your textual content with high-quality images and videos"; structured data must have "all the content in your markup … also visible on your web page"; preview controls (`nosnippet`, `data-nosnippet`, `max-snippet`, `max-image-preview`, `noindex`) govern AI features too (`https://developers.google.com/search/blog/2025/05/succeeding-in-ai-search`, `…/appearance/ai-features`).
- Bing Webmaster Guidelines (rewritten 2025) and "AI Performance in Bing Webmaster Tools" (Feb 2026): Copilot and Bing AI answers "rely on the same core crawling, indexing, and ranking foundation"; images and video "should reinforce the primary text on the page and should not be the sole source of information"; align "text, images, and video" so they consistently represent the same entity (`https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview`, SEJ summary). Bing's July-2025 sitemap post: `lastmod` freshness "directly influence[s] how quickly updates are reflected in … AI generated answers"; pair sitemaps with IndexNow.
- ChatGPT / Perplexity browsing (SECONDARY — ShortPixel, AltText.ai 2026 guides): answer engines read the HTML the crawler gets — alt text, captions, surrounding text, schema — and "if your … images have empty alts and your competitor's don't, the AI cites your competitor". No primary documentation from OpenAI/Perplexity on image selection was found — UNKNOWN beyond "crawlable HTML + descriptive text".
- **"Images that answer a query":** the practical rule from all of the above is that a photograph is only retrievable for a question ("what does a Panchakarma treatment room look like", "Kairali villa interior") if the words of that question sit *in the HTML next to the image* — alt + caption + chapter heading. Decorative wide crops without text answer nothing.

### 3.4 Performance (web.dev)

- Third-party embeds (`https://web.dev/articles/embed-best-practices`): "Lite-youtube-embed is a recommended facade for the YouTube player, which looks like the real player but is 224 times faster"; a lazy iframe alone "can save approximately 500 KB"; iframes need `width`/`height` to avoid CLS. Frontend Masters / HN (`https://news.ycombinator.com/item?id=40897205`): raw embeds "are like 1.3MB in size with no shared resources between multiple embeds"; the web component "is more like 100k and does share resources". Caveats voiced on HN: facade adds "hundreds of milliseconds" to first play (mmmmmbop); hot-linked `i.ytimg.com` posters still let Google track (mindhunter) → self-host the poster; "Save to Watch Later" is absent (X-Cubed) — acceptable for a hospital.
- `lite-youtube-embed` (`https://github.com/paulirish/lite-youtube-embed`): `<lite-youtube videoid="…" playlabel="Play: …">`, uses `youtube-nocookie.com`, supports `params`, custom poster, progressive-enhancement fallback link.
- LCP + lazy loading (`https://web.dev/articles/lcp-lazy-loading`): lazy-loading above-the-fold images cost ~13–15 % LCP; lazy-load only below the fold. `fetchpriority` (`https://web.dev/articles/fetch-priority`): `high` on the LCP image (Google Flights 2.6 s → 1.9 s); `low` on "offscreen images in an image carousel"; at most one `high` per page.
- Formats (SECONDARY 2025–26 guides): AVIF ≈ 50 % smaller than JPEG, WebP ≈ 25–35 %; serve `<picture>` AVIF → WebP → JPEG; always set `width`/`height`; `decoding="async"` with `loading="lazy"`.

---

## 4. Q3 — Accessibility and the 45+ reader

- **WCAG 2.2 SC 2.5.8 Target Size (Minimum), AA** (`https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html`): "The size of the target for pointer inputs is at least 24 by 24 CSS pixels" with spacing/equivalent/inline/UA/essential exceptions; 2.5.5 (AAA) is 44×44. Spec adopts **44 px** for lightbox controls and chapter links, 24 px spacing minimum for tiles.
- **W3C WAI "Developing Websites for Older People"** (`https://www.w3.org/WAI/older-users/developing/`): 1.4.4 resize text to 200 %; 1.4.3 contrast 4.5:1; 2.2.2 Pause/Stop/Hide for anything moving > 5 s; 1.4.2 audio control; 1.2.2 captions for prerecorded video; 2.1.1 keyboard; 2.2.1 no time limits.
- Autoplay: 2.2.2 requires an on-page control; `prefers-reduced-motion` maps to 2.3.3 — "two separate rails and one does not substitute for the other"; the preferred approach is **not to autoplay** (thoughtbot, motionspec). web.dev `prefers-reduced-motion`: drop "animated gradients, parallax scrolling, background videos", reveal animations; pattern `@media (prefers-reduced-motion: reduce) { … animation: none }`.
- Caption text for older readers: ≥ 18 px (1.125 rem) body, line-height 1.5, never light-grey-on-white; captions below the image, not overlaid; counter and controls with visible labels (Smashing: numbers beat dots).
- Never set `user-scalable=no`; never intercept pinch; swipe must have button equivalents (Smashing: "dragging alone is insufficient").

---

## 5. Q4 — What NOT to do (forum threads, SECONDARY)

| Mistake | Where it is said | Applies to us today |
|---|---|---|
| Gallery pages "that are just photo galleries with minimal or no text" get noindexed or ignored | r/SEO "Noindexing thin pages" `https://www.reddit.com/r/SEO/comments/1c27b81/noindexing_thin_pages/`; r/SEO "Should I be worried about thin content?" `…/f9bmom/` | Yes — 7 of 8 routes are H1 + one paragraph + tiles |
| Alt treated as SEO decoration or left empty; "Every image that serves a functional purpose should include ALT text" | r/SEO "SEO Question: Galeries and ALT TEXT" `https://www.reddit.com/r/SEO/comments/1gvoyx2/seo_question_galeries_and_alt_text/` | Live: 178/196 empty; candidate: 22 duplicates |
| Images only reachable through JS / click-loaded lazy loading that Google never renders | r/DigitalMarketingAsks 2025 `https://www.reddit.com/r/DigitalMarketingAsks/comments/1nc9y8x/` + Google lazy-loading doc | "Show more" hides tiles 13+ from the crawler |
| Captions overlaid on the image, unreadable on mobile; no pinch zoom | r/squarespace `https://www.reddit.com/r/squarespace/comments/1so2q5d/` | Template has no captions at all; lightbox untested for pinch |
| Infinite scroll bolted onto a lightbox ("does such a unicorn exist?") | r/webdev `https://www.reddit.com/r/webdev/comments/s2ckv2/` | Not present — keep it that way |
| Raw YouTube iframes: 1.3 MB each, no shared resources, tracking before play | HN `https://news.ycombinator.com/item?id=40897205` | Live `/video-gallery/`: 25 iframes |
| Auto-rotating hero carousels; dots instead of numbers/labels | Smashing / NN/g | Not in the gallery template — keep it out |
| Hot-linking `i.ytimg.com` posters (tracking) | HN mindhunter | Decide at build: self-host posters |
| Hash filenames (`IMG00023`-class) | Google Images doc | All 264 gallery files are SHA-256 names |
| Marketing caption blocks not attached to any image (11 "About –" lines) | Google: text near *relevant* image; Bing: media must "reinforce the primary text" | `/photo-gallery/` `captionsBlock` |

Perplexity's synthesis of the forum evidence explicitly could **not** substantiate quotable 2024–26 threads for: masonry-specific criticism, autoplay, native `<dialog>`, an r/TechSEO or r/UXDesign consensus. Those points in this report rest on the vendor docs and Smashing/NN/g/Baymard instead, and are labelled as such.

---

## 6. GALLERY SPEC — the eight routes (+ hub + video hub)

Scope: `/photo-gallery/`, `/property-gallery/`, `/treatments-gallery/`, `/villas-gallery/`, `/retreats-gallery/`, `/product-gallery/`, `/sight-seeing-gallery/`, `/yoga-gallery/`, served today by one "photo-collections" family; plus `/gallery/` (hub, article-reader family) and `/video-gallery/` (article-reader family). One new family replaces "photo-collections": **`ahv-template-gallery-chapters`** (desktop + mobile pair). `/video-gallery/` moves onto the same family with video-only chapters. `/gallery/` keeps its family; its three cards gain the chapter counts.

### 6.1 Information architecture

| Route | Role | Chapters (heading → onward link) | Target photographs | Video slot |
|---|---|---|---|---|
| `/photo-gallery/` | Master gallery, the destination (481 views/qtr) | 1 The hospital and its grounds → `/property-gallery/` · 2 Treatment rooms and Panchakarma → `/treatments-gallery/` · 3 Villas → `/villas-gallery/` · 4 Yoga and meditation → `/yoga-gallery/` · 5 Ayurvedic cuisine · 6 Kerala culture on site · 7 Around Palakkad → `/sight-seeing-gallery/` | 8–12 per chapter, 60–80 total, **no image appears in two chapters** | one per chapter where a matching video exists (max 4 on the page) |
| `/property-gallery/` | Grounds, buildings, reception, herbal garden, pond | 1 Arrival and reception · 2 The Ayurvedic hospital block · 3 Herbal garden and grounds · 4 The village at dusk | 24–36 | 1 (property walk-through) |
| `/treatments-gallery/` | The clinical core; the page a physician should be proud of | 1 Consultation and pharmacy · 2 Treatment rooms · 3 Panchakarma procedures (Abhyanga, Shirodhara, Nasya, Kizhi…) · 4 After treatment: rest areas | 24–40 | 1–2 (treatment, Nasya) |
| `/villas-gallery/` | Admission decision support | 1 per villa category (name as the villa pages name them) · exterior / bedroom / bathroom / verandah per category | 4–6 per category | 1 (villa interior) |
| `/retreats-gallery/` | Programme life (rename heading per §6.11 — "retreat" is permitted; "journey" is not) | 1 A day in the programme · 2 Group sessions · 3 Cuisine and dining hall | 18–30 | 1 |
| `/product-gallery/` | KAPPL medicines used on site | 1 Dispensary and pharmacy · 2 Preparations used in treatment (link to the product page or KAPPL site the owner names) | 12–18 (needs new originals; 1024×458 banners are unusable) | 0 |
| `/sight-seeing-gallery/` | "only a few photos — fill it" (directive) | 1 Within an hour of the hospital · 2 Palakkad and the Western Ghats · 3 Cultural sites | 24–36 (must come from the image bank; never stock) | 1 (paddy-field buggy) |
| `/yoga-gallery/` | Yoga centre + training | 1 The yoga hall · 2 Morning practice · 3 Teacher-training cohorts | 18–24 | 1–2 (yoga session, yoga centre) |
| `/video-gallery/` | Video hub, one `VideoObject` per video | chapters mirror the photo chapters; each video: facade + 2–3 sentence description + link to the photo chapter | — | all 15 (after dedupe) |
| `/gallery/` | Hub | three cards with chapter counts and one representative image each | 3 | 0 |

Chapter order follows the paper's §10 sequence (Attention → Orientation → Relevance → Trust → Desire → Confidence → Action): open on the single strongest establishing photograph, orient with "where you are", show the clinical core, show the villas, close with the consultation CTA that the template already carries.

### 6.2 Page anatomy (every gallery route)

1. **Header**: H1 (existing), one-sentence intro in the clinical register (existing `intro.text` rewritten where it breaches the lock), **chapter jump-links** (`<nav aria-label="Sections">`, buttons ≥ 44 px, anchor links — never filters that remove tiles from the DOM).
2. **Hero**: one landscape photograph, `fetchpriority="high"`, `loading="eager"`, `sizes="100vw"`, `<figcaption>`. This is the LCP element; nothing else is `high`.
3. **Chapters** (`<section aria-labelledby>` with `content-visibility: auto; contain-intrinsic-size: …`): H2 → orientation paragraph (2–3 sentences: what the place is, what happens there, who a patient meets) → `<ul role="list">` of `<li><figure><button aria-haspopup="dialog"><img …></button><figcaption>…</figcaption></figure></li>` → optional `<lite-youtube>` block with its own H3 + description → "Read about …" link to the owning page (`data-cta="gallery-chapter-link"`).
4. **Grid**: CSS grid `repeat(auto-fill, minmax(280px, 1fr))` desktop, 2 columns ≥ 480 px, 1 column below; `aspect-ratio` set per tile from `w`/`h` so nothing jumps (CLS); mixed 3:2 / 2:3 allowed inside a row; no JS masonry.
5. **Lightbox**: native `<dialog>`; opens with the tile's caption and alt; counter "n of N (chapter name)"; prev/next buttons 44 px, arrow keys, swipe (pointer events with ≥ 40 px threshold), Esc and close button, closes on `popstate`; caption **below** the image at ≥ 18 px; `aria-live="polite"` announces "Image 4 of 12: <caption>"; focus returns to the opening tile; body scroll locked; transitions disabled under `prefers-reduced-motion: reduce`.
6. **Footer CTA**: existing consultation strip unchanged (it already carries the WhatsApp number +91 92898 38797 rule from LOCKED FACTS — verify on build).

### 6.3 Per-image rules (data model + copy)

`photo-collections-data.js` → new `gallery-chapters-data.js` with, per image: `src` (descriptive filename, §6.6), `w`, `h`, `alt`, `caption`, `chapter`, `subject` (controlled vocabulary: treatment | villa | grounds | yoga | cuisine | culture | surroundings | product | people), `credit` (default "Kairali – The Ayurvedic Healing Village"), `dateTaken` if known (else null — never guessed), `linksTo` (route the photograph illustrates), `variants` (generated srcset widths).

- **alt**: 8–20 words; states subject + action + place ("Therapist applying warm herbal oil during Abhyanga in a ground-floor treatment room"); no "image of/photo of"; no keyword lists; **unique within the route**; decorative crops (none expected in a gallery) get `alt=""` and no caption.
- **caption** (`<figcaption>`): ≤ 120 characters, one sentence, present tense, names the thing the way the owning page names it ("Shirodhara, Panchakarma block, first floor"); may end with a short link "About Shirodhara →". Captions that name a **treatment or clinical claim** are clinical content → **Dr. Deepu John sign-off** before staging → production (HARD GATE 7). Captions describing places only (villa, garden) → Abilash approval.
- **Register**: locked words never appear in alt or caption; locked-word linter runs on the dataset (the check used in §1.1 becomes a test).
- **Facts**: villa names, treatment names, building names come from the existing route pages and the facts sheet, never from the photograph's guess. Where the subject cannot be identified, the caption describes only what is visible and the row carries `"needsIdentification": true`, surfaced in the PR as a question — HARD GATE 6.
- **Duplicates**: the same file may not appear in two routes' *same-purpose* chapters; `/photo-gallery/` chapters may reuse up to 3 images from each sibling route (curated best-of) and must say so via `linksTo`. Pixel-level duplicates (already hashed) are rejected by a test.

### 6.4 Video block (YouTube facade)

- Component `packages/ui` → `<LiteYouTube>` wrapping `lite-youtube-embed` (vendored, MIT, ≈ 3 KB JS + 2 KB CSS, not fetched from a CDN at runtime). Attributes: `videoid`, `playlabel="Play: <clinical title>"`, `params="rel=0&modestbranding=1"`, self-hosted `poster` (WebP 1280×720, ≤ 90 KB) — no `i.ytimg.com` hot-link. Domain `youtube-nocookie.com`.
- Markup rendered in HTML: `<figure><lite-youtube …><a href="https://www.youtube.com/watch?v=ID" class="lyt-visually-hidden">Watch on YouTube</a></lite-youtube><figcaption>…</figcaption></figure>` + H3 + 2–3 sentence description + (Phase 2) "Chapters" list with `t=` links if the owner supplies timestamps.
- **On-page titles are the site's clinical titles, not YouTube's** (several YouTube titles carry locked words). Google asks that `VideoObject.name`/`description` be "consistent with the actual video content" — a clinical retitle of the same footage is consistent; the YouTube-side titles are an owner-side change on the channel and are listed as an ask (§6.11).
- Consent: the facade makes **no third-party request until click**; if the site's consent framework classifies YouTube as a marketing vendor, the click handler must check the existing consent state before injecting the iframe — **read the consent API, never modify it** (HARD GATE 11). ASSUMPTION to verify at build: which category the current consent package assigns to YouTube.
- Never autoplay; never mute-autoplay a background loop; one facade per chapter; `loading` of the poster is `lazy` except when the video is the hero of `/video-gallery/`.
- Self-hosted MP4/WebM is **not** recommended for these 15 videos (CDN cost, no transcript/caption tooling, no YouTube discovery); revisit only if the owner wants a 10–15 s silent establishing clip, which would then be `<video muted playsinline preload="none" poster>` with a visible play control and no autoplay under reduced motion.
- Transcripts/captions: YouTube auto-captions exist per video (UNKNOWN whether reviewed); a 3–5 line on-page summary per video is the minimum text; full transcripts are Phase 2 on per-video watch pages.

### 6.5 Structured data (JSON-LD, one `@graph` per route, generated from the dataset)

- Existing `WebPage` + `BreadcrumbList` + `Organization` stay. Add:
- `ImageGallery` (via `packages/schema` `imageGallery()`), `@id: <canonical>#gallery`, `name` = H1, `description` = intro, `url` = canonical, `mainEntityOfPage` = WebPage, and — extending the helper additively — `image[]` of full `ImageObject` nodes: `contentUrl` (absolute, the 1600 px variant), `url` = same, `name` = caption, `caption` = caption, `description` = alt, `width`, `height`, `creditText`, `copyrightNotice` ("© Kairali Ayurvedic Group" — owner to confirm the exact notice), `creator` `{ "@type": "Organization", "name": "Kairali – The Ayurvedic Healing Village" }`, `license` and `acquireLicensePage` only if the owner supplies a page (else omitted, not invented), `representativeOfPage: true` on the hero only. `WebPage.primaryImageOfPage` → the hero's `ImageObject`.
- `hasPart`: one `ItemList` per chapter (`itemList()` helper) listing that chapter's `ImageObject` `@id`s in order — this is what lets an answer engine cite "the Panchakarma treatment rooms at Kairali" as a group.
- `VideoObject` per video (new helper `videoObject()` in `packages/schema`, additive): `name` (clinical), `description`, `thumbnailUrl` (self-hosted poster, absolute, stable), `uploadDate` (**from YouTube, ISO 8601 — never typed**), `duration` (ISO 8601, from YouTube), `embedUrl` = `https://www.youtube-nocookie.com/embed/<id>`, `url` = watch URL on our page (`<canonical>#video-<id>`), `publisher` → Organization `@id`, `isFamilyFriendly: true`, `inLanguage`. Markup only where the facade is rendered on that page.
- Validation: Rich Results Test on every route; Schema.org validator for `ImageGallery`; zero errors, warnings only for optional fields we deliberately omit.

### 6.6 Files, naming, formats, image sitemap

- **Filenames**: `/ahv/assets/img/gallery/<route>/<chapter>-<subject-slug>-<nn>.<ext>` (e.g. `treatments/panchakarma-shirodhara-03.avif`); the hash stays in the manifest as provenance (`importedSha256`), not in the URL. Old hash URLs are not live (staging only) — no redirects needed; confirm with `live-robots-audit.json` that no `/ahv/assets/img/gallery/<hash>` URL exists on production (it does not — production is WordPress).
- **Variants**: 480, 768, 1200, 1600 px wide (portrait: same widths); formats AVIF + WebP + JPEG fallback in `<picture>`; `sizes` per breakpoint (`(min-width:1200px) 33vw, (min-width:480px) 50vw, 100vw`); lightbox uses the 1600 px variant. Generated by extending `tools/resize-images-to-render.mjs` / `convert-images-webp.mjs` (AVIF via `sharp`, quality 55–62; WebP q 78 as today).
- **Image sitemap**: extend `packages/seo` `buildSitemap()` to accept `images?: string[]` per page and emit them (Next.js `MetadataRoute.Sitemap` supports `images`); `app/sitemap.ts` passes the route's absolute 1600 px `contentUrl`s (≤ 1,000 per URL; we max at ~80). Stays `[]` under the staging lock; turns on with `AHV_STAGING=0` like everything else. Also set `lastmod` from the dataset's `generated` (Bing freshness).
- **Video sitemap**: separate `app/video-sitemap.xml` route emitting `<video:video>` with `thumbnail_loc`, `title`, `description`, `player_loc` (embed URL), `duration`, `publication_date` for the videos on `/video-gallery/` (and chapter pages where embedded). Only when production; referenced from the sitemap index.
- **EXIF/IPTC**: strip GPS (patients' privacy is not at stake but there is no benefit); keep/write IPTC `Credit`/`Copyright` to match the JSON-LD (Google prefers structured data on conflict). Geo: no `geo_location` (deprecated); location lives in the caption and in `Organization.address`.
- **OG image**: each route's `og:image` = its hero (1200×630 crop, already produced by `tools/build-og-images.mjs`).

### 6.7 Performance budget (mobile, Moto G-class throttled, p75)

| Metric | Budget | Note |
|---|---|---|
| LCP | ≤ 2.5 s | hero `<picture>` ≤ 120 KB at 768 w, `fetchpriority="high"`, preloaded |
| CLS | < 0.05 | every `<img>`/facade has `width`/`height` or `aspect-ratio` |
| INP | < 200 ms | lightbox opens synchronously; no layout thrash on swipe |
| HTML | ≤ 250 KB | all tiles in HTML; captions inline; JSON-LD ≤ 40 KB |
| Initial image bytes (viewport) | ≤ 450 KB | hero + first row only; rest `loading="lazy" decoding="async"` |
| Total page transfer, full scroll | ≤ 3.5 MB for 80 images | 480/768 variants only; 1600 px only inside the lightbox |
| Per-tile variant | ≤ 45 KB @480, ≤ 90 KB @768, ≤ 180 KB @1200, ≤ 300 KB @1600 | AVIF first |
| Third-party requests before any click | **0** | facade + self-hosted posters |
| JS | ≤ 25 KB gzipped for gallery + lightbox + facade | no gallery plugin |
| Lighthouse | ≥ 90 perf / 100 SEO / 100 a11y on `/photo-gallery/` and `/treatments-gallery/` | Factory ship rule |

### 6.8 Accessibility rules (binding)

- Tiles are `<button>` (not bare `<a>` to a file); `aria-haspopup="dialog"`, accessible name = caption (not "Open Photo Gallery image 1").
- Controls ≥ 44×44 CSS px, ≥ 8 px gap; tiles ≥ 24 px apart on touch.
- Keyboard: Tab through tiles; Enter opens; Esc closes; ←/→ navigate; Home/End first/last; focus returns to the tile.
- Swipe with button equivalents; pinch-zoom allowed; `touch-action: pan-y pinch-zoom` on tiles.
- Caption/counter text ≥ 18 px, contrast ≥ 4.5:1 on the dialog backdrop; text resizes to 200 % without loss.
- No autoplay, no auto-advance, no hover-only information; `prefers-reduced-motion: reduce` → no transitions, no parallax, poster only for video.
- `aria-live` announcement on image change; dialog labelled by the chapter heading.
- axe-core: 0 serious/critical on desktop + mobile (registry row `axe-core-a11y`).

### 6.9 Analytics (read-only wiring, existing package)

`data-cta` events: `gallery-tile-open` (route, chapter, index), `gallery-lightbox-next/prev`, `gallery-video-play` (videoid), `gallery-chapter-link` (target route), `gallery-cta-consultation`. Success measures against the Clarity baseline (§1.3): scroll depth on `/photo-gallery/` ≥ 75 % (from 61 %), engagement ≥ 75 s (from 54 s), ≥ 10 % of gallery sessions follow a chapter link to a treatment/villa page (UNKNOWN today — first read after launch), `/video-gallery/` page weight from ~25 embeds to 0 pre-click third-party bytes.

### 6.10 Build sequence (Lane A, one PR per step, staging only)

1. Dataset: `tools/build-gallery-chapters.mjs` produces `gallery-chapters-data.js` from the image bank manifest (docs/media/) + a hand-curated `gallery-chapters.yaml` (chapter → files → captions). Captions land as a **paste file under `/content/`** for Abilash + Dr. Deepu John review before they ship.
2. `packages/schema`: add `videoObject()`; extend `imageGallery()` to accept `ImageObject` nodes and `hasPart` (additive). Tests.
3. `packages/seo`: `images`/`lastmod` in `buildSitemap()`; video sitemap builder. Tests.
4. `packages/ui`: `<LiteYouTube>` + `<GalleryChapters>` + `<GalleryDialog>` (TSX, no plugin). Tests + axe.
5. Family `ahv-template-gallery-chapters` (desktop/mobile) bound to the nine routes; `/gallery/` cards updated.
6. Spec additions to `ktahv-critical-flows.spec.ts` (§7) — never edited to pass.
7. Preview → design-qa + seo-aeo-geo-auditor in parallel → Phase-5 battery (beauty, go-science, design Gate 2 on the rendered page) → owner review.

### 6.11 Gaps and owner asks (flag, not fill)

- **Image bank**: which folders of the "whole image bank" (docs/media/ manifest) hold gallery-grade originals for each chapter; minimum 1600 px on the long edge; the sight-seeing chapter needs 24–36 photographs that were **taken by Kairali** — no stock. Per D-20260719-29, missing slots go out as a creative-team request draft with the 7-part spec; the build proceeds with flagged placeholders.
- **Entrance signboard alts** (`"Kairali Ayurvedic Health Resort"` appears on a physical sign): ruling needed — omit the sign's wording from alt/caption (describe "tiled entrance gate with an electric buggy") or keep the quotation. Recommendation: omit; the lock has no signage exception.
- **`/retreats-gallery/` intro and meta description** contain `journey` — rewrite in the paste file; and confirm "Retreats" remains an approved heading word (it is not on the banned list).
- **YouTube titles** with locked words: an owner-side channel edit; on-page names are clinical regardless.
- **`uploadDate`/`duration`** for 15 videos: pull with the YouTube Data API using an owner-supplied key, or read manually from each video page and record in the dataset with the date read — never estimated.
- **Copyright notice / licence page** for `ImageObject`: exact wording and whether an image-licence page should exist.
- **Consent category of YouTube** in the current consent package (read-only check).
- **Clarity device split** for gallery routes (query failed) — re-run before the golden chapter is built.
- **Per-video watch pages** (Phase 2, needs strategy-gate approval because it adds routes): the only way to Key Moments / video rich results.

---

## 7. Acceptance checklist (measurable; every line has a command or an inspection)

Data and copy
- [ ] `node tools/verify-gallery-dataset.mjs` → 0 images without `alt`, 0 without `caption`, 0 duplicate alts within a route, 0 pixel-duplicate files across all routes, 0 locked-word hits in `alt`/`caption`/`intro`/`head` (the §1.1 regex, all casing).
- [ ] Every caption ≤ 120 chars; every alt 8–20 words; no alt begins "image of"/"photo of".
- [ ] Every row has `chapter`, `subject`, `linksTo`; every `linksTo` route exists in `route-manifest.json`.
- [ ] Rows with `needsIdentification: true` = 0 at ship, or listed in the PR body as owner questions.
- [ ] Captions naming treatments carry `clinicalSignoff: "Dr. Deepu John <date IST>"` in the paste file commit.

Markup
- [ ] `curl -s <route> | grep -c '<figcaption'` equals the route's image count (+ videos).
- [ ] All tiles present in server HTML (no "show more"): `grep -c '<img' ` ≥ image count.
- [ ] `grep -c 'fetchpriority="high"'` = 1 per route; hero has no `loading="lazy"`; every other `<img>` has `loading="lazy" decoding="async"`.
- [ ] Every `<img>` and `<lite-youtube>` has `width`+`height` (or CSS `aspect-ratio`).
- [ ] `<picture>` offers `image/avif` and `image/webp` sources + JPEG/WebP `src` fallback.
- [ ] Filenames are descriptive slugs; 0 hash-named URLs in HTML (`grep -cE '/gallery/[0-9a-f]{64}\.'` = 0).
- [ ] 0 requests to `youtube.com`, `youtube-nocookie.com`, `ytimg.com`, `googlevideo.com` before a play click (Playwright `page.on('request')` assertion).
- [ ] After click: exactly one iframe from `youtube-nocookie.com`.

Structured data
- [ ] Rich Results Test: 0 errors on all 9 routes; `VideoObject` detected on `/video-gallery/` and each chapter page with a video.
- [ ] JSON-LD `ImageGallery.image[].contentUrl` set equals the set of 1600 px URLs in the HTML (script diff = 0).
- [ ] `VideoObject.uploadDate`/`duration` present for every video and sourced (dataset field `metaSource: "youtube-api|manual <date>"`).
- [ ] `WebPage.primaryImageOfPage` = hero; `og:image` = hero crop.

Sitemaps (production flag only)
- [ ] `AHV_STAGING=0 pnpm build` → `sitemap.xml` entries for the 9 routes each carry `<image:image>` nodes = image count (≤ 1,000); `video-sitemap.xml` carries 15 `<video:video>` with `player_loc`.
- [ ] Staging build (`AHV_STAGING` unset) → sitemap `[]`, robots still `noindex` (four-lock guard intact).

Performance (Lighthouse CI, mobile, 3 runs, median)
- [ ] `/photo-gallery/`, `/treatments-gallery/`, `/video-gallery/`: perf ≥ 90, SEO 100, a11y 100, best-practices ≥ 95.
- [ ] LCP ≤ 2.5 s, CLS < 0.05, INP < 200 ms; initial image bytes ≤ 450 KB; JS ≤ 25 KB gz.
- [ ] Largest tile variant sizes within §6.7 (script over `public/ahv/assets/img/gallery/**`).

Accessibility (axe + manual)
- [ ] axe-core: 0 serious/critical on desktop 1440 and mobile 375 for all 9 routes, lightbox open and closed.
- [ ] Keyboard-only: open, next, prev, close, focus returns — recorded Playwright trace.
- [ ] Touch: swipe next/prev; pinch-zoom works in the dialog; all controls ≥ 44 px (Playwright bounding-box assertion).
- [ ] `prefers-reduced-motion: reduce` emulation: 0 running animations/transitions (`getAnimations().length === 0`).
- [ ] Caption font-size ≥ 18 px and contrast ≥ 4.5:1 (axe colour-contrast + computed style).
- [ ] No element autoplays (`document.querySelectorAll('[autoplay]').length === 0`).

Register and facts
- [ ] Banned-word scan over rendered HTML of the 9 routes (all casing) = 0, excluding the two pre-existing approved chips.
- [ ] LOCKED FACTS grep: `info@kairali.com` only; WhatsApp `+91 92898 38797` only; no `…38777`.

Analytics and proof
- [ ] `data-cta` attributes present on tiles, dialog controls, facade, chapter links (count assertions).
- [ ] Post-deploy: fetch each staging route, diff against the dataset (captions, counts) — diff pasted in the PR.
- [ ] `ktahv-critical-flows.spec.ts` green, plus the new gallery spec file green; runs pasted in full.

---

## 8. Sources

Primary documentation
- Google Image SEO best practices — https://developers.google.com/search/docs/appearance/google-images
- Google image sitemaps — https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
- Google image licence metadata / ImageObject — https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata
- Google video SEO best practices — https://developers.google.com/search/docs/appearance/video
- Google VideoObject / Clip / SeekToAction — https://developers.google.com/search/docs/appearance/structured-data/video
- Google video sitemaps — https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps
- Google lazy-loaded content — https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading
- Google robots meta (max-image-preview, noimageindex) — https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- Google AI features and your website — https://developers.google.com/search/docs/appearance/ai-features
- Google, "Top ways to ensure your content performs well in Google's AI experiences on Search" (May 2025) — https://developers.google.com/search/blog/2025/05/succeeding-in-ai-search
- Bing Webmaster Guidelines (2025 rewrite) — https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a ; Bing AI Performance (Feb 2026) — https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview ; Bing sitemaps in AI search (Jul 2025) — https://blogs.bing.com/webmaster/July-2025/Keeping-Content-Discoverable-with-Sitemaps-in-AI-Powered-Search
- web.dev embed best practices — https://web.dev/articles/embed-best-practices ; LCP and lazy loading — https://web.dev/articles/lcp-lazy-loading ; fetchpriority — https://web.dev/articles/fetch-priority ; prefers-reduced-motion — https://web.dev/articles/prefers-reduced-motion ; browser-level lazy loading — https://web.dev/articles/browser-level-image-lazy-loading
- lite-youtube-embed — https://github.com/paulirish/lite-youtube-embed
- WCAG 2.2 SC 2.5.8 — https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html ; WAI older users — https://www.w3.org/WAI/older-users/developing/

UX research and trade press
- Smashing, carousel UX guidelines — https://www.smashingmagazine.com/2022/04/designing-better-carousel-ux/
- Smashing, expandable accessible gallery — https://www.smashingmagazine.com/2021/10/build-expandable-accessible-gallery/
- NN/g, carousels video — https://www.nngroup.com/videos/carousels-websites-mobile-apps/
- Baymard, thumbnails — https://baymard.com/blog/always-use-thumbnails-additional-images ; signposting hidden thumbnails — https://baymard.com/blog/truncating-product-gallery-thumbnails
- Hospitality Net, conversion-first hotel design 2025 — https://www.hospitalitynet.org/opinion/4127383/conversion-first-design-what-every-hotel-website-must-fix-in-2025.html ; Omni/VFM rich-media study — https://www.hospitalitynet.org/news/4033212.html
- Hotel Tech Report, design trends — https://hoteltechreport.com/news/hotel-web-design-trends
- Frontend Masters, "YouTube embeds are bananas heavy" — https://frontendmasters.com/blog/youtube-embeds-are-bananas-heavy-and-its-fixable/
- ShortPixel, alt text and AI search 2026 — https://shortpixel.com/blog/why-alt-text-is-your-secret-weapon-for-ai-search-visibility-in-2026/

Forums (SECONDARY; reddit.com is blocked to the fetcher, retrieved through Perplexity with URLs)
- HN, YouTube embeds thread — https://news.ycombinator.com/item?id=40897205
- r/SEO, Noindexing thin pages — https://www.reddit.com/r/SEO/comments/1c27b81/noindexing_thin_pages/
- r/SEO, Should I be worried about thin content? — https://www.reddit.com/r/SEO/comments/f9bmom/should_i_be_worried_about_thin_content/
- r/SEO, Galleries and ALT text — https://www.reddit.com/r/SEO/comments/1gvoyx2/seo_question_galeries_and_alt_text/
- r/Wordpress, index thumbnail images on an artwork page — https://www.reddit.com/r/Wordpress/comments/1j0c5g2/should_i_index_thumbnail_images_on_my_artwork/
- r/squarespace, caption covers the image — https://www.reddit.com/r/squarespace/comments/1so2q5d/caption_covers_half_of_my_work_when_you_click_on/
- r/webdev, lightbox + infinite scroll — https://www.reddit.com/r/webdev/comments/s2ckv2/best_lightbox_gallery_thats_light_simple_and/
- r/DigitalMarketingAsks, images not appearing (lazy loading) — https://www.reddit.com/r/DigitalMarketingAsks/comments/1nc9y8x/what_seo_issues_are_you_struggling_with_the_most/

Live exemplars fetched
- Amanbagh gallery — https://www.aman.com/resorts/amanbagh/gallery
- Kamalaya gallery — https://www.kamalaya.com/gallery
- Chiva-Som gallery — https://www.chivasom.com/gallery/

---

## 9. Checker pass

- Instruction re-read: research four questions with sources; write one report with findings + a concrete spec for the eight routes (sections, caption/alt rules, video block with facade, structured data, image sitemap, performance budget, measurable acceptance checklist); clinical register; IST timestamp to the second; edit nothing else. All present above. No other file was written.
- Claim vs evidence: every repo/live/Clarity number in §1 was produced by commands run this session (OBSERVED_FIRST_PARTY). Vendor rules in §3–4 are from fetched pages (DOC_PRIMARY). Hospitality conversion figures and forum quotes are SECONDARY and labelled.
- Unverified / not established: Ananda, Six Senses, Lanserhof, SHA gallery structures (blocked); a primary OpenAI/Perplexity statement on image selection; Clarity device split for gallery routes; YouTube `uploadDate`/`duration`; the consent category of YouTube in the current consent package; whether the image bank holds enough sight-seeing originals; the exact copyright notice wording. Each is listed in §6.11 as an owner ask, none is filled.
- Timestamp note: the machine clock read 2026-09-22 16:53:59 IST at write time while the directive was logged as "2026-09-23 ~00:40 IST" owner chat; the file name follows the directive date as instructed, the header stamp follows the clock (HARD GATE 6: no invented time).
