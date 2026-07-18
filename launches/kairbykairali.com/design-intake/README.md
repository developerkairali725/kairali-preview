# Design intake — kairbykairali.com

<!-- scaffolded by scripts/launch-scaffold.mjs on 2026-07-18 18:15:20 IST -->

**This folder is where the design for kairbykairali.com comes from. A human fills it. The
build reads it.** Nothing gets built here until something is in it (or the owner
explicitly rules MODE B — see the bottom).

## What to drop in — ONE of these three is REQUIRED

1. **Exported design frames or screenshots** — Figma/XD/Canva exports, or clean
   screenshots of the design. PNG or JPG, one file per page or per section.
   Name them so the order is obvious: `01-home-hero.png`, `02-home-treatments.png`.
2. **Reference-site URLs** — if the design *is* "make it like this site". Put them
   in a file called `reference-sites.md` here, one URL per line, each with one
   line saying what you want taken from it (layout? colour? typography? the feel?).
   "Like X" without saying *what* about X is not a design — it is a guess request.
3. **A wireframe** — hand-drawn and photographed is fine. Boxes and labels beat
   a paragraph describing boxes and labels.

## Also required: the page and section order

Add a file `page-order.md` here listing the pages the site has, top to bottom,
and inside each page the sections in order. Example:

```
Home: hero → what we treat → the doctors → testimonials → enquiry
About: story → the family → the centres → press
Contact: form → map → phone/WhatsApp
```

Without this the build has to invent the sitemap, and inventing the sitemap is
exactly what these gates exist to stop.

## What happens next

The agent **implements what is here, faithfully.** It does not redesign it,
re-theme it, restyle it, or "improve" it. If something in the supplied design
looks broken — layout that cannot work responsively, an accessibility problem
(contrast, tap targets, focus), or something off-brand against the brand manual
— the agent **stops and flags it to the owner**. It never silently overrides your
design. Your design is the authority; the agent executes it.

Then: the owner signs `design_source` in `../approvals.yaml`, the agent builds
**one page** (the golden page — the homepage unless the brief names another),
stops again for `golden_page` approval, and only then builds the rest to match.

## If this folder stays empty (MODE B — fallback, not the plan)

The agent proposes **one** design direction — tokens plus a single hero mockup —
reasoned from `REFERENCES.md` in this folder, never from nothing. It then STOPS
for the owner's approval before any page is built. MODE B costs an extra gate
(`design_direction`) precisely because it is the mode where the agent is doing a
human's job.
