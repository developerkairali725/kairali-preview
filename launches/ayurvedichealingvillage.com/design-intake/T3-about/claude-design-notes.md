# Institutional trust + recruitment template — page notes

Files: `AHV Template Institutional Trust Desktop.dc.html` · `AHV Template Institutional Trust Mobile.dc.html` · `assets/institutional-trust-data.js`

Family: institutional trust (story, founders, vision, accreditations, social responsibility) + the two recruitment routes that earn traffic (`/ayurvedic-franchise/` 433 clicks, `/internships-at-kairali/` 227 clicks).

## Content status — READ FIRST
No live record for any of the four test routes exists in this project. `uploads/AHV-frozen-content-lock-608.json` points at `records/en/internships-at-kairali.json`, `records/en/social-responsibilities.json`, `records/en/our-story.json`, `records/en/careers.json` — none of those files are present locally, and live fetch was not available in this session. **Every body string in `assets/institutional-trust-data.js` is stand-in copy written to the specified volume so the layout can be judged at the extremes. It is not live copy and must be replaced verbatim from the records before porting.** The dashed bronze strip at the top of each view says so on the page; switch it off with the `stressNote` prop.

Head contracts are placeholders marked `[TO CONFIRM]` for the same reason. Breadcrumbs are provisional from URL hierarchy (no `sitemap/sitemap-final.json` yet).

## The template system
Three content modes, derived from the data, not hand-set per page:

- **prose** — asymmetric grid, 232px sticky section rail + main column. Rail appears only at 3+ sections. Section headings carry a hairline rule and a bronze `01`-style number.
- **gallery** — rail suppressed, main column takes the full 1220px, plates laid on a 12-column grid with a six-plate rhythm (7/5 wide pair → three-up → full-width band).
- **brief** — rail suppressed, column narrows to 760px and centres; the hero band shortens to 300px so a 150-word page does not read as a truncated one.

Block vocabulary inside a section: paragraph (66ch cap), h3, list (diamond / plain / numbered steps), key-value pairs, note, figure, two-up image grid. Lists whose items are all ≤46 characters go two-up on desktop — this is what stops the 10-list page becoming an endless single column.

### How each extreme lands
- `/internships-at-kairali/` (367w, 4 img, 7 lists, 10 headings) — the design target. Rail, five sections, figures inside the column, pairs table for the unconfirmed facts.
- `/social-responsibilities/` (977w, 10 lists) — rail carries the navigation; alternating list flavours and the two-up short-list rule break the wall.
- `/our-story/` (0w, 18 img) — gallery mode. The standfirst is the only prose the template adds and is flagged **DRAFT — approve or replace** on the page.
- `/careers/` (150w, 0 img) — brief mode. The "Current openings" section keeps its heading and states that nothing is listed rather than disappearing; the apply panel carries the lower page.

### Application path
Sand `#E0D7C4` panel, 4px gold left rule, left-aligned, two-column on desktop — deliberately unlike the fixed closing block (white, centred, gold hairline texture). Its single action is `mailto:info@kairali.com` in deep gold `#5A4420`, a fourth colour, so it does not compete with the three closing buttons. Rail gets a "How to apply →" jump link when the route has an apply block.

## Where it would break
- **More content:** a page beyond ~1,400 words or ~12 sections outgrows the sticky rail — the index exceeds the viewport and stops being scannable; it needs to scroll internally or collapse to top-level entries only.
- **Less content:** below roughly 80 words with no images, brief mode still leaves the closing block sitting close under the hero; that page wants the apply panel or it will look unfinished.
- **Gallery:** the six-plate rhythm assumes multiples of six. 18 lands cleanly; 19 or 20 leaves a short final row (acceptable) but 13 ends on an orphan full-width band.

## Register check
No banned word introduced (spa, resort, holiday, luxury, cure, journey, guests). "World Luxury Award Winner" appears only inside the fixed closing block, as the award's proper name. Stand-in copy uses patient / physician / treatment / programme / Panchakarma / admission / discharge / consultation throughout.

## Facts
Only the five supplied are used: info@kairali.com, +91 92898 38797 / https://wa.me/919289838797, /online-consultation/, /enquiry-form/. Every other number, date, fee or distance is a visible `[TO CONFIRM]`.

## Accessibility
Body 17–18px / 1.7. One h1, h2→h3 with no skipped level. All targets ≥44px, buttons 52px. No hover-only disclosure (the mobile index is a `<details>`, click-operated). `prefers-reduced-motion` honoured; nothing animates or autoplays. Skip link on both views. Mobile wrapper is `overflow-x:hidden` with no fixed widths — no sideways scroll at 360px.

## Codex asks
1. Supply the four live records (or the drops) so the body copy, head contract and image manifest can be replaced verbatim.
2. Download and self-host the real images for these routes; the current ones are existing `assets/img/` files standing in at the right counts.
3. Confirm the header/footer swap: this template draws both as grey placeholders per the brief. The approved chrome components exist in the project (`AHV Chrome Header.dc.html`, `AHV Chrome Footer.dc.html`) and can be dropped in with one line each.
4. QA at 320/360/390/430 and 1024/1280/1440/1920.
