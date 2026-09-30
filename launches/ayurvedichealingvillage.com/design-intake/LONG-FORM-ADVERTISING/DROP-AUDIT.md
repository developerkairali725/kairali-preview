# Long-form advertising — the drop, audited

2026-09-20. `AHV-Long-Form-Advertising-Desktop-standalone.html`, 1,953,974 bytes. Audited before
anything is wired, per the standing rule: a supplied design is the authority and the agent
implements it, but every claim about it is a candidate until it is measured.

## What arrived

A `__bundler` self-contained export, not the file list the handover described. Inside it:

| part | size |
|---|---|
| loader script | 16,792 B |
| asset manifest (41 assets, base64) | 1,834,131 B |
| external-resource map | 588 B |
| the page template | 100,345 B |

41 bundled assets: **18 JPEG · 5 PNG · 12 woff2 · 3 JS · 2 HTML · 1 CSS**. The 2 HTML are the
chrome header and footer; the 3 JS include React 18.3.1 and ReactDOM, so the unpkg and Google
Fonts URLs in the resource map are satisfied from the bundle rather than fetched.

## Self-containment: proven, with one real gap

Rendered at 1440 with **every network request blocked at the browser**:

```
off-origin requests attempted   0
page errors                     0
words rendered              3,725
headings                       32
images rendered                26   <- 4 of them broken
fonts resolved      Marcellus, Mulish   (from the bundled woff2)
page height                18,859px
horizontal overflow            no
```

Nothing was even attempted off-machine. That is a stronger result than the T04 drop needed.

**The gap: 4 broken image slots, and they are the chrome logos.**

```
assets/img/kairali-colorful-logo.png     x2  (header + footer)
assets/img/ktahv-logo-white-brand.svg    x2  (header + footer)
```

The chrome HTML is bundled; the images it references are not. So the drop is self-contained for
everything the designer authored and not for the chrome it imports. **Not a blocker** — both files
are already in this repo at `public/ahv/assets/img/` — but the claim needed checking rather than
accepting, and the next drop should bundle them or declare them external.

## The design does what the handover says

- **The switcher is real.** Two tabs, labelled exactly as the register rule requires — by filename
  and by audience, never by the banned word in the URL:
  `wellness-resort-kerala.html — 3,506w / 53 headings` and
  `defence-paramilitary offer — 189w / no images`.
- **The rail is real and measures right**: a sticky `div` **264px wide**, 924px tall, carrying the
  14 numbered chapters, with the **"Speak to a physician"** card pinned beneath it — consultation
  one click from anywhere.
- **The rail suppresses on the short route.** Switched to the offer tab: 457 words, 2 images,
  3,490px tall, and **zero sticky rail candidates**. The 189-word route does not read as padded,
  exactly as designed.
- **Persuasion is by specificity.** No countdown, no scarcity banner, no interstitial.
- The chapter labels are clinical — *"02 Why Kairali — the hospital"*, *"09 Patient accounts"* —
  while the body keeps the live verbatim copy. That is the split the handover asked for.

## The handover's checkable items, measured against the package

| # | claim | measured |
|---|---|---|
| 3 | "3 Lacs / 87%" is in the copy | **confirmed** — an `h3` reads *"Kairali has performed more than 3 Lacs Treatments with an 87% satisfactory rate"* |
| 7 | enquiry endpoint unknown, posts to the route URL | **confirmed** — `action="https://ayurvedichealingvillage.com/wellness-resort-kerala.html" method="post"`, fields `fname, phone, email, country, rdogender, message, result, chkAgree`, required on `fname, phone, email, result, chkAgree`. That is an **off-origin POST of patient contact details to the live WordPress host** |
| 10 | slug says 30%, body caps at 20% | **confirmed on the offer tab** — the only percentages rendered are **20%, 10%, 15%** |
| 11 | JSON-LD wrong on the wellness route | **cannot apply** — the template carries **0** `ld+json` blocks. Consistent with the sitewide finding that none of the 254 routes emit structured data |

## The register, counted

Banned words in the template's own rendered copy — verbatim live copy retained for SEO under the
handover's standing rule 1, so **expected**, but the size is worth stating:

```
resort   18      spa      17      luxury   15
cure      1      guests    1      (retreat 17 — off-register, not banned)
```

**69 banned-word hits on a page that is the biggest search surface on the site** (368,721
impressions). The owner has parked the EN register cleanup until after go-live, so this is not a
build blocker — it is the same debt, concentrated. One sentence shows the shape of it: *"the
finest Ayurveda and wellness resort our country has to offer … widely regarded as the best
WELLNESS RESORT in India."*

## What wiring this needs, and what it blocks on

Ready now: the view, the chrome, the fonts, 22 content images, both routes.

Blocked on the owner, unchanged from the handover: the current programme list (item 1), the
current award list and order (item 2), the live Tripadvisor score (item 4), the hero regrade
(item 5), and the 30%-vs-20% ruling (item 10). Blocked on Deepu: the real form endpoint (item 7).

Not in this drop, and the handover says so: **mobile**. Desktop goes out for approval first.
