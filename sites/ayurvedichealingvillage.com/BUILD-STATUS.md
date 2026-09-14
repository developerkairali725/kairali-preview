## Staging handoff update — 15 September 2026

The staging-only review now blocks the older LP route group before its tracking/chat stack runs, and removes the design-only `route` query override from actual website URLs. These changes preserve all252approved English paths. Original media/font binaries are stored in the private company GitHub staging asset bundle, pinned by archive and file hashes; see english-candidate/ASSETS.md and run `pnpm assets:restore` after cloning. This resolves the binary storage choice without adding media blobs to Git history. Internal image README/SOURCES notes are excluded; licenses remain.

Staging is not a production release. SSR/static body content, production metadata/integrations and the recorded source-content exceptions still require production work; changing a single environment flag does not constitute launch approval or completion. Current verified design coverage:504route-width states; independent interactions and hosted checks are recorded separately by the reviewer.

# ayurvedichealingvillage.com — English candidate build status

Task **WOPS-AHV-ENGLISH-STAGING-BUILD-20260915-001** · staging build, uncommitted,
not pushed and not deployed. The independent reviewer handles hosting after verification.

Source of truth: the read-only approved package
`WOPS-AHV-CLAUDE-CONTINUATION-002/code-handoff/final-english-portable-candidate`
(252 active English routes, 136 Desktop/Mobile views, 21 datasets). Nothing in that
package was written to. `/ru/` and `/treatment-in-kerala-russian.html` stay deferred
and return 404.

## What was built

252 real, direct-path pages in this Next.js app — one URL per approved route, no
design selector, no iframe, no screenshots.

| Piece | Where |
|---|---|
| Route registry (252 routes → views + dataset + head facts) | `app/(english)/_families/registry.ts` |
| The one shared route component every page renders through | `app/(english)/_families/design-view.tsx` |
| Page bootstrap (mounts the approved design + runtime) | `app/(english)/_families/boot.ts` |
| Per-route head metadata, read from the package | `app/(english)/_families/metadata.ts` |
| Homepage `/` · all other routes | `app/(english)/page.tsx` · `app/(english)/[...slug]/page.tsx` |
| Importer (package → app) | `tools/import-english-candidate.mjs` |
| Verifier (against the accepted 504 baseline) | `tools/verify-english-candidate.mjs` |
| Committed records | `english-candidate/*.json` |
| Served payload (generated) | `public/ahv/**` |

**Families, not copies.** 136 view payloads serve all 252 routes; a route binds to a
family (view pair + dataset), it does not own a template. The chrome header and footer
are one shared component each, fetched once and cached.

**Lane separation.** The existing LP lane moved into `app/(lp)/` as its own root layout,
with URLs unchanged. It was not rewritten. The English lane has its own root layout
because the LP layout appends a social strip and a consent banner to everything it
wraps, and the approved design already carries its own footer, social row and cookie
notice — wrapping it would have shown the reviewer two of each.

## Verification (machine evidence, not self-report)

Acceptance bar is the design package's own accepted evidence
(`FINAL-PORTABLE-504-VERIFICATION.json`), the same bar the independent reviewer applies:
exact title, exact visible `h1[]`, exact `canonical[]`, exact mounted view file, robots
containing `noindex`, no overflow, no visible broken image, no page error, no off-origin
request, no response ≥ 400, no iframe. "HTTP 200 with some `<h1>`" is not the bar.

| Run | Result | Evidence |
|---|---|---|
| **Full sweep, 252 routes x 320 + 1024** | **504/504 states pass** | `english-candidate/route-verification.json` |
| Body text vs baseline, same sweep | 499/504 exact (5 accounted for below) | same file |
| Reviewer's first 25 routes @ 320 + 1024 | 50/50 pass | `english-candidate/route-verification-batch0.json` |
| Table-row repair set, body gating ON | 17/18 (only the film label) | `english-candidate/route-verification-repair-3.json` |
| Gallery-family repair set, body gating ON | 13/14 (only the film label) | `english-candidate/route-verification-repair-4.json` |
| Production build | clean, 273 static pages | `pnpm exec next build` |
| Staging locks | header, robots.txt, empty sitemap, 503 enquiry, 404 on deferred | curl, below |
| Compliance lint | 6 errors, all imported source | `node packages/compliance/bin/lint.js sites/ayurvedichealingvillage.com` |

Both lanes still answer after the route-group move: `/lp/*`, `/privacy`, `/terms` and
`/lp/cookie-policy` all 200; `/ru/`, `/treatment-in-kerala-russian.html` and unknown
paths all 404 rather than falling back to an unrelated English page.

The 5 body-text diffs are both known classes, and neither is a content difference:

- **4 states** (`/ayurvedic-treatment-packages.html` and `/panchkarma-treatment.html`,
  each at both widths) differ only in a **random arithmetic captcha prompt** — the form
  asks "5 + 7 ?" on one load and "6 + 6 ?" on the next. The design package's own
  verification records exactly this: body text exact in 500 states, "four differ only in
  existing random arithmetic prompts". Same four.
- **1 state** (`/` at 1024) differs only in the hero film's control label
  (`PLAY THE FILM` vs `PAUSE THE FILM`). The audit harness forces
  `reducedMotion: reduce`, and the approved design honours it — `_setHero` auto-plays
  only when `(min-width: 900px)` matches and reduced motion does not. With reduced
  motion off, the film plays from the self-hosted `/ahv/assets/homepage-journey.mp4`
  (`paused:false, readyState:4, currentTime:4.05`) and the label matches the baseline.

## Defects found by the independent 320px review, and what fixed them

The reviewer's first batch scored 0/25 at 320px. Every failure was a shared root cause,
not a per-route problem. Nine causes, nine fixes.

1. **Shared chrome missing on 126 views.** The runtime resolves a `<dc-import>` sibling
   as `./<Name>.dc.html` relative to the document, which 404s on a direct-path URL, and
   it renders the reference "as an empty placeholder". Both chrome views are now exported
   to `public/ahv/components/` and registered in `window.__resources` before `support.js`
   loads, which is the runtime's own lookup. Map: `english-candidate/component-map.json`.
   The walk is transitive, so a third component could not be missed silently.
2. **Template placeholders fetched as URLs.** The approved templates carry 281
   `<img loading="lazy" src="{{ expr }}">` tags — all 281 are lazy, which is why the
   package never fetches them. The template is now never written to the DOM as markup at
   all (see 3), and the page stylesheet also carries `x-dc{display:none!important}`, the
   same rule `support.js` installs from `<head>` in the package.
3. **Table rows collapsed on 6 desktop states.** The approved views put `<sc-for>` inside
   `<tbody>`. An unknown element in table content is foster-parented out by the HTML
   parser, so `innerHTML` silently destroyed the loop: all four villa room tables and two
   programme tables rendered one empty row. The package survives this because it
   re-fetches its own document and re-parses the template from source text. This page has
   no `<x-dc>` to re-fetch, so it hands the runtime the source text directly through
   `__dcUpdate(name, "html", ...)` — the same entry point that self-repair uses. The
   `<x-dc>` node is mounted empty. Verified: all six now match the baseline body text
   exactly with body gating on.
4. **Wrong record on the eleven-route reader family.** Two approved views ship a
   `data-props` block that is not valid JSON (one missing comma), so the runtime dropped
   the prop defaults and every route fell back to the family default
   ("Ayurvedic Products"). Repaired at the payload level (see Source exceptions) and
   re-asserted through `__dcSetProps`, because a direct-path URL carries no `?route=`.
5. **Duplicate canonical, robots and title.** This app no longer emits canonical or
   robots meta on English routes — the approved design writes its own, once.
6. **Stale canonical on the 8 gallery routes.** The family renderers mark their head
   nodes `data-ahv-head` and state the rule in their own source: where a governed node
   exists, the view's static helmet node for that slot must not survive. Pushing the
   template re-applies the helmet *after* the renderer has written its head, so the boot
   guard re-applies the renderer's rule as the final state — governed node wins, per slot,
   for title, canonical, description, og/twitter and robots.
7. **Runtime overwriting the staging noindex.** `applyHead()` reads `robots` from the
   dataset, so the import rewrites those values too, not just the view helmets.
8. **Missing narrow correction (320px home rendered 349px wide).** The package's accepted
   preview layer (`preview/english-responsive-override.css` + `portable-preview.js`) is
   carried over byte-for-byte and applied through its own marker contract — the
   Home-Mobile-only header fix and the shared <=360px footer fix. No new layout fix was
   invented; the marker is set by the package's own script from the view filename.
9. **React hydration error #418 wiping the design**, and **`/ahv/.image-slots.state.json`
   → 400**. The design root is rendered with `dangerouslySetInnerHTML`, so React neither
   hydrates nor reconciles its children. The sidecar is served as
   `ahv-image-slots.state.json` (Next.js rejects dotfiles under `public/`) with the
   package's original bytes.

Two further defects were found by the full sweep after those fixes, and are also fixed:

10. **Nine images 404'd on 42 states.** The first import copied only files it could find
    referenced. That inference cannot be made sound here: the approved views build image
    URLs by concatenation (`const W = 'assets/img/'; ... W + 'badge.png'`), and other
    names carry percent-escapes or parentheses. The importer now copies the four payload
    roots **wholesale**, which makes a missing asset structurally impossible.
11. **Stale files survived a re-import.** The importer now prunes anything it did not
    write this run, so the payload is exactly reproducible. This is what had kept
    `assets/img/SOURCES.txt` (provenance, deliberately excluded from `public/`) in the
    payload after it was excluded.

## Staging locks

- `X-Robots-Tag: noindex, nofollow, noarchive, noimageindex` on every response
  (`next.config.ts`) — a header is the one directive page JavaScript cannot overwrite.
- `robots.txt` → `Disallow: /`. Sitemap empty.
- Payload robots values rewritten to `noindex, nofollow` at import, plus the boot head guard.
- **Enquiry API fails closed.** `app/api/enquiry/route.ts` returns 503 with a truthful
  "not accepted here, nothing sent or stored" message and **never reads the request body
  or calls the lead store**. It does not fake success. Production behaviour is unchanged:
  with `AHV_STAGING=0` the export is exactly the handler `@kairali/forms/route` returns.
- A capture-phase `submit` guard blocks any native form submission on English pages
  (`preventDefault` only — the design's own preview behaviour still runs).
- All flips are one env var: `AHV_STAGING=0` restores production robots, sitemap and the
  real enquiry handler.
- No DNS, domain, alias, redirect-map or production WordPress change. The commented
  legacy→`/lp/` cutover map in `next.config.ts` stays commented.

## Source exceptions — owner-preserved, recorded openly

Nothing below was rewritten. The approved design's copy is untouched.

1. **KTAHV language lock.** 191 of 252 routes carry terms the fleet clinical lock
   bans — 2,772 occurrences across 14 of the locked words, scanned with the fleet's own
   list imported from `packages/compliance` (no second copy of the list exists). The
   full per-word and per-route tally is committed, machine-readable and unredacted in
   `english-candidate/language-lock-audit.json`; it is not restated here only because
   quoting the words would itself trip the gate this build must not weaken.
   **This is a GST-exposure decision for the owner and Dr. Deepu John before
   production.** It is not something a build may silently fix, and nothing was fixed.
2. **A careers-department email** (local part `career@`, domain kairali.com) in
   `assets/enquiry-family-data.js`, recovered verbatim from the live source for the
   careers and apply routes. It trips the `locked-facts` rule, which requires the public
   contact address everywhere. Left exactly as approved; needs the owner's word on
   whether a departmental address is permitted.
3. **A legacy typo** (local part `infoo@`, domain kairali.com) in
   `assets/policy-family-data.js`. It appears ONLY inside that dataset's provenance
   record, which documents that the legacy live page carried the typo and that the
   design resolved it to the correct public address. The rendered page is correct. The
   lint rule has no suppression path for emails, so this audit-trail string is reported
   as an error rather than hidden.
4. **Two clinical-lock hits inside the shared chrome components** now that they are
   served from `public/ahv/components/`: one word in the footer's standing description
   line, and one in a keyboard handler in the header's script (a key name, not copy).
   Both are approved-source bytes and are left untouched.
5. **`data-props` JSON repair**, 2 views (`AHV Page Article Reader Desktop/Mobile`):
   one missing comma inserted so the block parses. The source labels this block
   "Prototype route binding (not part of the public design)". Both repairs are recorded
   in `english-candidate/view-manifest.json` (`propsRepaired`, with the source sha256).
   No design copy, markup or asset is affected.
6. **Duplicate and mismatched titles in the source**, preserved deliberately, e.g.
   `/the-baoli-advert-box-deal/` and `/the-baoli-special-deal/` both titled
   "Animal Husbandry | Kairali's Organic Produce", and
   `/revitalizing-and-strengthening-treatment-for-cancer-patients/` titled
   "Yoga retreats for everyone". These are facts of the approved dataset records.
7. **WHO attribution and the Weight Loss 1.4M+ safety claim** are unchanged, per the
   owner's "1 no 2 yes" of 15 Sep 2026. No clinical substantiation was supplied or
   inferred.


Compliance lint on this site reports errors from the imported payload — items 2 and 3
above, plus clinical-lock hits inside the shared chrome components — and warnings from
imported source text. **No gate was weakened, no rule was edited, no finding was hidden
by changing a file format, and no imported file was edited to make a lint pass.** The
findings are real facts about the approved source and are listed here so the owner
decides them, which is the only place that decision belongs.

## Known limitations — read before production

1. **No server-rendered body.** The approved design is a client-side runtime (React UMD
   + the packaged `dc-runtime`); the server response carries the real per-route `<head>`
   and the boot payload, not the page text. Metadata being correct is **not** the same
   as SEO being complete, and this build does not claim it is. A crawler without JS sees
   no body copy. Static/SSR rendering of the approved design is required work before the
   site goes live on a ranked domain; it is not a staging blocker.
2. **391 MB of binaries** under `public/ahv/` (2,160 files total, 401 MB). Committing that to git is an owner decision.
   `english-candidate/asset-manifest.json` is the in-repo record (path, bytes, source and
   served sha256 per file) and `tools/import-english-candidate.mjs` regenerates the tree
   from the read-only package on any machine. Options worth a decision before deploy:
   an image-optimisation pass, Git LFS, or a blob/CDN origin.
3. **`/cookie-policy` collision.** It is both an approved English route and an LP-lane
   legal page. The approved route won; the LP page moved to `/lp/cookie-policy` and the
   LP footer link follows it. This is the only URL the two lanes contested — flagged for
   the owner's confirmation.
4. **Trailing slashes.** Source routes are `/about-us/`; Next serves `/about-us` and
   308-redirects the slashed form. Legacy links resolve in one hop.
5. **Viewport switch is a reload.** The two views are separate approved documents, not
   one fluid layout, so crossing 700px reloads rather than re-renders.
6. **Consent, analytics and the chat loader are deliberately absent from the English
   lane.** The task forbids tracking and consent changes and this lane never had any;
   adding the fleet set here would *be* that change. The approved design carries its own
   cookie notice. This needs an explicit decision before production.
7. **Locale.** English only, as instructed. DE/FR translation is later work.
