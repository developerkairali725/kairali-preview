# AHV English staging — the four owner-reported defects, investigated

**Session:** AHV English staging, 2026-09-15 · **Branch:** `codex/ahv-english-staging-20260915`
**Reported by the owner after reviewing a protected preview on a phone.**
Two were real defects in the current build and are fixed; two were artefacts of an
older, immutable preview URL. Evidence below is machine-collected, not self-reported.

## 1. "Quite a few links still go to the live site, not staging"

**Verdict: true of the preview being tested, not of the current build.**

The approved design stores **9,990 absolute links to the live domain** in its payload
(`grep` over `public/ahv/`: 9,821 `https://ayurvedichealingvillage.com` + 169 `www.`).
They are rewritten to staging-relative paths at runtime by `localizeLink()` in
`app/(english)/_families/boot.ts` — **which did not exist in the first two builds**:

| Commit | Preview | `localizeLink` present |
|---|---|---|
| `2106c75d` | `…28mytzyub…` | **no** — every internal link resolved to the live WordPress site |
| `e743f6f1` | mobile-fix preview | **no** |
| `5fecaf89` … `92654a15` | `…npq3l9mtf…` | yes |
| `e17c3b30` (HEAD) | `…8wn6ynliy…` | yes |

Current build, verified rather than assumed:

- Crawled **all 68 design families × 2 widths**, collected every `a[href]`/`area[href]`,
  resolved every unique internal path: **164 paths, 163 return HTTP 200.**
- Re-crawled 9 key routes after force-opening every `<details>`, menu, accordion and tab —
  because the first crawl only saw links present without interaction:
  **0 links to the live domain.**
- The only two absolute AHV-host anchors left are both correct by design:
  `bookings.ayurvedichealingvillage.com` (the external booking engine) and one
  `/wp-content/…jpeg` media link the localiser deliberately skips.

**Residual defect found by this crawl:** `/cdn-cgi/l/email-protection` → **404**, on 2
campaign templates. See §5.

**Standing risk, not yet addressed:** localisation is a *runtime* patch. If the boot script
is slow or fails, the raw hrefs are live-domain absolutes. Localising at import time — so an
absolute href never reaches the browser — would remove the failure mode entirely.

## 2. "Language switcher doesn't work"

**Verdict: true, and it has never worked — in any build.**

The `EN` control in the approved Chrome Header is a **`<span>`**:

```html
<span style="border:1px solid #C9BFA8;border-radius:4px;…">EN</span>
```

No `<a>`, no `<button>`, no click handler. `grep -c 'lang'` over
`public/ahv/components/AHV Chrome Header.dc.html` returns **0**. The
`ENGLISH · FRANÇAIS · DEUTSCH` line in the mobile menu is a plain `<div>` of text.

It is decorative in the approved design. Staging did not break it, and there is nothing for
it to point at — this build is English-only by instruction; DE/FR are later work.

**Not changed.** MODE A: a supplied design is implemented faithfully and problems are
flagged, never silently overridden. **Owner decision required:** hide the control until DE/FR
ship (recommended — a dead control on a hospital site costs trust), or leave it and wire it
when the translations land.

## 3. "Enquiry and contact page breadcrumbs didn't work"

**Verdict: working in the current build; they were navigating to WordPress in the old one.**

Verified live on the deployed preview:

| Route | Breadcrumb | Linked crumbs | Schema |
|---|---|---|---|
| `/contact-us/` | `Home / Contact Us` | `Home` → `/` | `BreadcrumbList` present |
| `/enquiry-form/` | `Home / Contact Us / Enquire Now` | `Home` → `/`, `Contact Us` → `/contact-us/` | present |

Both are visible (44 px tall, in flow) and the final crumb is correctly unlinked. On
`…28mytzyub…` these same crumbs carried absolute live-domain hrefs (§1) — tapping "Home"
left staging for the live site, which is the reported symptom.

**Gap found while checking:** `/panchkarma-treatment.html` renders **no breadcrumb at all**
(`nav[aria-label="Breadcrumb"]` absent, no `BreadcrumbList`). Flagged, not changed — it is
one of the owner's two hand-made pages.

## 4. "Enquiry page format looked bad — the original was better"

**Verdict: one real defect, fixed. Two design observations, flagged not changed.**

### Fixed: a spam honeypot was rendering as a visible form field

`/enquiry-form/` showed a full-width text input labelled **"Leave this empty"** between
"Your message" and the consent checkbox. It is a honeypot, and the approved dataset says so —
`routes[9].enquiry.fields[5]`:

```json
{ "name": "website", "type": "text", "label": "Leave this empty",
  "honeypot": true, "note": "Source honeypot field, retained exactly as captured." }
```

The sibling record for `/contact-us/` declares
`form.honeypot = { "name": "company", "omitted": true }` and its renderer omits it correctly.
`enquiry-family-render.js` never reads the flag (`grep -c honeypot` → **0**), so the field
rendered like a real question.

Fixed in `boot.ts` by walking the `AHV_*` dataset globals — the same records the renderer
used — and hiding whatever they mark as a honeypot. Not fixed in the payload:
`public/ahv/assets/*.js` is imported source that `tools/import-english-candidate.mjs`
rewrites wholesale, so the edit would not survive a re-import.

Hidden the way a honeypot must be — off-screen, `aria-hidden="true"`, `tabindex="-1"`, still
in the DOM and in the submitted payload so it still traps bots. `display:none` would defeat it.

Verified on the hosted deployment, Chromium **and** WebKit, 390 px and 1280 px:
`left:-9999 · onScreen:false · tabindex:-1 · aria-hidden:true`.
Regression across 8 routes × 2 widths: body-text character counts **identical** to before the
fix on every page, so nothing drifted against the accepted 504-state baseline.

### Flagged, not changed — these are the approved design

1. **The form sits ~6,000 px down an ~8,400 px page.** On a phone that is roughly fifteen
   screens of scrolling before a patient can enquire, on the page whose job is enquiries.
   This is the most likely reason the legacy page felt better.
2. **The "Priya" portrait reads as an AI-generated stock face** inside a green leaf badge with
   a "👍 Help??" speech bubble, on a NABH-accredited hospital page; and
   `Message Priya on WhatsApp Or call: +919555156156` is two different calls-to-action merged
   into a single anchor.

Both are design changes and belong to the owner.

## 5. Found while investigating, not reported

- **`[email protected]` appears 85 times** across 10 datasets, with 58
  `cdn-cgi/l/email-protection` links — Cloudflare email-obfuscation artefacts captured from
  the legacy site. Visitors see that literal string where an address should be, and the link
  404s. The locked fact (`info@kairali.com` is the public contact address everywhere) supplies
  the correct value, so this is fixable without inventing anything.
- **Every non-homepage route ships a duplicate hidden `<header>` and `<footer>`**
  (`header[0]` `display:none`, 0×0; `header[1]` the real 64 px one). Not visible to users —
  the logo renders correctly — but it duplicates the `banner`/`contentinfo` landmarks and the
  whole navigation link set in the DOM, which matters for screen readers and for the planned
  server-rendered output. The homepage carries its own chrome and has only one of each.
- **Phone numbers check out:** all 252 `wa.me` links use `919289838797` (the locked fact);
  the known-wrong `…38777` appears **zero** times. `tel:` links use `9555156156` in four
  different formats — cosmetic inconsistency only.

## Correction to an earlier claim in this session

An interim report quoted "zero horizontal overflow, zero JS errors, zero 4xx" from the audit
sweep. Those figures were **phone-width only**. The desktop pass silently discarded its
results for 67 of 68 families: `page.screenshot({fullPage:true})` exceeded its 30-second
default on these very tall pages and threw inside the same `try` that wrapped data collection.
The screenshot is evidence, not a gate, so `tools/audit-mobile-ux.mjs` now captures it
separately and records a failure instead of losing the findings. Desktop is being re-run.
