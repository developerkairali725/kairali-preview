# Abhilash pilot release strategy

## Information architecture

The release keeps every existing English public URL. It adds exact top-level
page equivalents for German and French:

| Page | English | German | French |
|---|---|---|---|
| Home | `/` | `/de` | `/fr` |
| About | `/about` | `/de/ueber-mich` | `/fr/a-propos` |
| Work | `/work` | `/de/arbeit` | `/fr/travail` |
| Investing | `/investing` | `/de/investitionen` | `/fr/investissements` |
| Writing | `/writing` | `/de/texte` | `/fr/ecrits` |
| Media | `/media` | `/de/medien` | `/fr/medias` |
| Recognition | `/recognition` | `/de/auszeichnungen` | `/fr/distinctions` |
| Speaking | `/speaking` | `/de/vortraege` | `/fr/conferences` |
| Contact | `/contact` | `/de/kontakt` | `/fr/contact` |
| FAQ | `/faq` | `/de/fragen` | `/fr/questions` |
| Now | `/now` | `/de/aktuell` | `/fr/maintenant` |
| Privacy | `/privacy` | `/de/datenschutz` | `/fr/confidentialite` |

All 36 top-level URLs form reciprocal `hreflang` clusters. English is the
`x-default`. The published essay has no false alternate because its body has not
received a reviewed full translation.

## Technical direction

- Next.js App Router with multiple root layouts so emitted HTML has the correct
  `lang` attribute without turning static pages dynamic.
- Static generation only for declared `de`/`fr` slugs; unknown locale routes
  and draft essays fail closed.
- Existing Instrument Serif, Instrument Sans and IBM Plex Mono files are
  self-hosted from verified build artifacts. This removes the known intermittent
  Google-font build dependency without a visual redesign.
- One route map drives navigation, language switching, sitemap and alternates so
  those surfaces cannot drift independently.
- Person schema remains global; localized pages add `ProfilePage`, localized FAQ
  pages add `FAQPage`, and the published essay retains `BlogPosting`.

## Discoverability decision

Search Console ownership and the existing sitemap submission were already
proved. The release expands the sitemap from the existing English set to 37
canonical URLs. Submit the same canonical sitemap once after production and let
Google recrawl; do not create a second property or repeat indexing requests.

The keyword map is intent-led and contains no fabricated search volume. Branded
entity queries and page-specific institutional intent are the priority. A paid
Semrush/DataForSEO volume layer remains optional evidence, not invented input.

## Measurement and conversion decision

The personal site has one honest conversion path: the visitor's own email
client. There is no backend form, CRM, checkout, ad campaign or chatbot. GA4,
GTM and ad pixels remain absent until the owner completes the legal/consent lane.
The code is inert when no measurement ID exists.

## Release path

1. Clean local build and four-template Lighthouse gate.
2. Local browser, metadata, schema, internal-link, draft-lock and viewport QA.
3. Vercel preview; repeat key public checks and capture the immutable target.
4. Protected GitHub PR. No self-approval or branch-protection bypass.
5. Git-linked production after required owner review/checks.
6. Public Day-1 checks; update the existing Search Console sitemap once.
