/**
 * AHV galleries 2026 — the chaptered "photo collections" family (desktop + mobile).
 *
 * Consumed by tools/build-galleries-2026.mjs, which writes the template + logic
 * into BOTH the overlay .dc.html sources (english-candidate/package-overlay/…)
 * and the served view payloads (public/ahv/views/…). Nothing here is loaded at
 * runtime directly: the dc-runtime compiles the template and evaluates the
 * logic class exactly as it does for every other approved view.
 *
 * Design language is the family's own (docs: the site's gold standard) — paper
 * #F7F4EA, Mulish body, Marcellus headings, gold ◆ #C1882C, hairline #E9E2D3,
 * 52px gold buttons #EEB41E, 13px uppercase section labels #8F6212 — only the
 * CONTENT STRUCTURE changes (spec: docs/research/2026-09-23-ahv-gallery-best-practice.md §6):
 *   · chapter H2 + 2–3 sentence orientation paragraph + captioned <figure> grid,
 *     every tile in the HTML (no click-to-load), content-visibility per chapter;
 *   · hero is the only fetchpriority="high"; everything else lazy + async;
 *   · optional per-chapter video FACADE (self-hosted poster + play button; the
 *     youtube-nocookie iframe is injected only on click — zero third-party
 *     requests before that click);
 *   · chip row = in-page jump links (never filters that hide tiles);
 *   · native <dialog> lightbox: 44px controls, caption ≥18px BELOW the image,
 *     Esc / ← → / Home / End / swipe, focus return, closes on popstate,
 *     no transitions under prefers-reduced-motion.
 *
 * Runtime notes (memory: dc-runtime-design-package-gotchas):
 *   · images are React nodes (React.createElement), never "{{ p.src }}"
 *     interpolations — the placeholder pass would request the literal URL;
 *   · sc-for may nest (92 nested loops exist in the served views);
 *   · every gallery-specific CSS rule lives in the helmet <style> and keys on
 *     data-gallery-* attributes, so the runtime's inline-style parser never has
 *     to understand content-visibility / touch-action / ::backdrop.
 */

const FONT_LINKS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Marcellus&amp;family=Mulish:ital,wght@0,400;0,500;0,600;0,700;1,400&amp;display=swap" rel="stylesheet">`;

/** Base rules copied verbatim from the family's helmet, plus the gallery rules. */
function helmetStyle(mobile) {
  return `<style>
body{margin:0;background:#F7F4EA;color:#2A2118;font-family:'Mulish',sans-serif;font-size:18px;line-height:1.7${mobile ? ";overflow-x:hidden" : ""}}
a{color:#006038;text-decoration:none}a:hover{color:#004226;text-decoration:underline}
:focus-visible{outline:3px solid #6B7726;outline-offset:2px;box-shadow:0 0 0 6px rgba(247,244,234,.85)}
a:active,button:active{filter:brightness(.88)}
button{font-family:inherit;cursor:pointer}
h1,h2,h3,h4{font-weight:400;margin:0}
*{box-sizing:border-box}
@media (prefers-reduced-motion:reduce){*{transition:none !important;animation:none !important}}
[data-gallery-chapter]{content-visibility:auto;contain-intrinsic-size:auto 1200px}
[data-gallery-tile]{touch-action:pan-y pinch-zoom}
[data-gallery-tile] img{width:100%;height:auto;display:block}
dialog[data-gallery-dialog]{width:100%;max-width:none;height:100%;max-height:none;margin:0;padding:${mobile ? "12px" : "24px"};border:0;background:rgba(26,20,12,.96);color:#F7F4EA;display:none;flex-direction:column;align-items:center;justify-content:center;gap:12px;inset:0;overflow:hidden}
dialog[data-gallery-dialog][open]{display:flex}
dialog[data-gallery-dialog]::backdrop{background:rgba(26,20,12,.6)}
[data-gallery-stage]{touch-action:pan-y pinch-zoom;user-select:none;-webkit-user-select:none}
[data-gallery-facade]{position:relative;display:block;width:100%;padding:0;border:0;background:#1A140C;border-radius:4px;overflow:hidden;cursor:pointer}
[data-gallery-facade] img{width:100%;height:auto;display:block;aspect-ratio:16/9;object-fit:cover}
[data-gallery-facade] span{position:absolute;left:50%;top:50%;width:72px;height:72px;margin:-36px 0 0 -36px;border-radius:50%;background:#EEB41E;color:#2A2118;display:flex;align-items:center;justify-content:center;font-size:30px;line-height:1;box-shadow:0 2px 12px rgba(0,0,0,.35)}
[data-gallery-facade]:hover span{filter:brightness(.95)}
[data-gallery-iframe]{width:100%;aspect-ratio:16/9;height:auto;border:0;display:block;border-radius:4px;background:#000}
</style>`;
}

function helmet(mobile) {
  return `
<helmet>
${FONT_LINKS}

${helmetStyle(mobile)}
<meta name="description" content="Photographs of Kairali – The Ayurvedic Healing Village, Palakkad: the hospital, its treatments and its surroundings.">
<link rel="canonical" href="https://ayurvedichealingvillage.com/property-gallery/">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="/ahv/assets/img/logo_color-da22eb.svg" sizes="192x192">
</helmet>`;
}

/* ------------------------------------------------------------------ *
 * Shared blocks
 * ------------------------------------------------------------------ */

const CHIP_DESKTOP =
  'display:inline-flex;align-items:center;min-height:44px;padding:0 18px;border:1px solid #C9BFA8;border-radius:22px;background:#FFFFFF;color:#5A4420;font-weight:700;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;text-decoration:none';
const CHIP_MOBILE =
  'display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border:1px solid #C9BFA8;border-radius:22px;background:#FFFFFF;color:#5A4420;font-weight:700;font-size:12.5px;letter-spacing:1.4px;text-transform:uppercase;text-decoration:none';

const DLG_BTN =
  'display:inline-flex;align-items:center;justify-content:center;gap:10px;min-width:44px;min-height:48px;padding:0 20px;border:1px solid rgba(247,244,234,.5);border-radius:4px;background:transparent;color:#F7F4EA;font-weight:700;font-size:13.5px;letter-spacing:2px;text-transform:uppercase';
const DLG_BTN_GOLD =
  'display:inline-flex;align-items:center;justify-content:center;gap:10px;min-width:44px;min-height:48px;padding:0 22px;border:1.5px solid #EEB41E;border-radius:4px;background:#EEB41E;color:#2A2118;font-weight:700;font-size:13.5px;letter-spacing:2px;text-transform:uppercase';

function closingSection(mobile) {
  const pad = mobile ? "40px 16px" : "56px 24px";
  const li = mobile
    ? 'display:flex;gap:9px;align-items:baseline;font-size:15.5px;line-height:1.5;color:#2A2118'
    : 'display:flex;gap:12px;align-items:baseline;font-size:17px;color:#2A2118';
  const btn = mobile
    ? 'display:flex;align-items:center;justify-content:center;flex:1 1 100%;height:52px;padding:0 18px;border-radius:4px;'
    : 'display:inline-flex;align-items:center;justify-content:center;height:52px;padding:0 26px;border-radius:4px;';
  return `
  <section aria-labelledby="closing-h" style="margin-top:56px;background:#FFFFFF;border-top:1px solid #E9E2D3;border-bottom:1px solid #E9E2D3;padding:${pad};background-image:repeating-linear-gradient(135deg,rgba(193,136,44,.05) 0 1px,transparent 1px 9px)">
    <div style="max-width:760px;margin:0 auto;text-align:center">
      <ul style="list-style:none;margin:0 auto ${mobile ? "28px" : "34px"};padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:${mobile ? "12px 16px" : "14px 32px"};text-align:left;max-width:640px">
        <li style="${li}"><span aria-hidden="true" style="color:#C1882C">◆</span>NABH Certified Hospital</li>
        <li style="${li}"><span aria-hidden="true" style="color:#C1882C">◆</span>118+ Years Heritage</li>
        <li style="${li}"><span aria-hidden="true" style="color:#C1882C">◆</span>Individualised Programmes</li>
        <li style="${li}"><span aria-hidden="true" style="color:#C1882C">◆</span>World Luxury Award Winner</li>
      </ul>
      <h2 id="closing-h" style="font-family:'Marcellus',serif;font-size:26px;line-height:1.25;margin:0 0 12px">Not sure which programme fits?</h2>
      <p style="font-size:16.5px;line-height:1.7;color:#514A3F;max-width:56ch;margin:0 auto ${mobile ? "24px" : "28px"};text-wrap:pretty">Share your goal in your own words — the patient care team or an Ayurvedic doctor will point you to the right programme.</p>
      <div style="display:flex;flex-wrap:wrap;gap:${mobile ? "12px" : "14px"};justify-content:center">
        <a href="https://ayurvedichealingvillage.com/online-consultation/" onClick="{{ guard }}" data-cta="gallery-cta-consultation" style="${btn}background:#EEB41E;color:#2A2118;font-weight:700;font-size:14px;letter-spacing:1.5px;text-transform:uppercase;text-decoration:none" style-hover="filter:brightness(.95);text-decoration:none">Free Doctor Consultation</a>
        <a href="https://wa.me/919289838797" onClick="{{ guard }}" style="${btn}border:1.5px solid #006038;color:#006038;font-weight:700;font-size:14px;letter-spacing:1.5px;text-transform:uppercase;text-decoration:none" style-hover="background:#F2F6F1;text-decoration:none" target="_blank" rel="noopener noreferrer">WhatsApp Patient Care</a>
        <a href="https://ayurvedichealingvillage.com/enquiry-form/" onClick="{{ guard }}" style="${btn}border:1.5px solid #5A4420;color:#5A4420;font-weight:700;font-size:14px;letter-spacing:1.5px;text-transform:uppercase;text-decoration:none" style-hover="background:#FAF6EC;text-decoration:none">Enquire Now</a>
      </div>
    </div>
  </section>`;
}

function dialogBlock(mobile) {
  const cap = mobile
    ? 'display:{{ curCapDisplay }};width:100%;margin:0;color:#F7F4EA;font-size:18px;line-height:1.5;text-wrap:pretty'
    : 'display:{{ curCapDisplay }};width:100%;max-width:1280px;margin:0;color:#F7F4EA;font-size:18.5px;line-height:1.5;text-wrap:pretty';
  const bar = mobile
    ? 'width:100%;display:flex;justify-content:space-between;align-items:center;gap:12px'
    : 'width:100%;max-width:1280px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap';
  const nav = mobile
    ? 'width:100%;display:flex;gap:10px'
    : 'width:100%;max-width:1280px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap';
  const navBtn = mobile ? "flex:1;" : "";
  return `
<dialog id="gallery-dialog" data-gallery-dialog="1" aria-labelledby="gallery-dialog-h" onClose="{{ dlgClosed }}" onKeyDown="{{ dlgKey }}">
  <div style="${bar}">
    <div style="min-width:0">
      <h2 id="gallery-dialog-h" style="font-family:'Marcellus',serif;font-size:${mobile ? "18px" : "20px"};line-height:1.25;color:#F7F4EA">{{ dlgLabel }}</h2>
      <p aria-live="polite" style="margin:2px 0 0;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#EEB41E;min-height:24px">{{ counter }}</p>
    </div>
    <button type="button" id="gallery-close" data-cta="gallery-lightbox-close" onClick="{{ close }}" style="${DLG_BTN}" style-hover="background:rgba(247,244,234,.12)">Close<span aria-hidden="true">✕</span></button>
  </div>
  <div data-gallery-stage="1" onPointerDown="{{ swipeStart }}" onPointerUp="{{ swipeEnd }}" style="flex:1;width:100%;min-height:0;display:flex;align-items:center;justify-content:center">
    <sc-if value="{{ dlgOpen }}" hint-placeholder-val="{{ false }}">{{ expandedEl }}</sc-if>
  </div>
  <p style="${cap}">{{ curCaption }}</p>
  <div style="${nav}">
    <button type="button" data-cta="gallery-lightbox-prev" onClick="{{ prev }}" style="${navBtn}${DLG_BTN}" style-hover="background:rgba(247,244,234,.12)"><span aria-hidden="true">←</span>Previous</button>
    <button type="button" data-cta="gallery-lightbox-next" onClick="{{ next }}" style="${navBtn}${DLG_BTN_GOLD}" style-hover="filter:brightness(.95)">Next<span aria-hidden="true">→</span></button>
  </div>
</dialog>`;
}

/* ------------------------------------------------------------------ *
 * Desktop template
 * ------------------------------------------------------------------ */

export function desktopTemplate() {
  return `${helmet(false)}
<div data-screen-label="Photo collections template — Desktop 1440">
<a href="#main-content" style="position:fixed;left:-9999px;top:12px;z-index:220;background:#5A4420;color:#F7F4EA;padding:14px 24px;border-radius:4px;font-weight:700;font-size:15px" style-focus="left:16px">Skip to main content</a>
<dc-import name="AHV Chrome Header" hint-size="100%,72px"></dc-import>
<main id="main-content">

  <section style="width:min(1220px,94%);margin:0 auto;padding:30px 0 26px">
    <nav aria-label="Breadcrumb" style="font-size:15px;color:#75695A;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
      <sc-for list="{{ crumbs }}" as="c" hint-placeholder-count="2">
        <a href="{{ c.url }}" onClick="{{ guard }}" style="display:inline-flex;align-items:center;min-height:44px">{{ c.label }}</a>
        <span aria-hidden="true" style="color:#C9BFA8">/</span>
      </sc-for>
      <span aria-current="page" style="color:#2A2118">{{ crumbLast }}</span>
    </nav>
    <p style="margin:0;font-weight:700;font-size:12.5px;letter-spacing:2.6px;text-transform:uppercase;color:#8F6212">Kairali — The Ayurvedic Healing Village · Since 1908</p>
    <div style="display:grid;grid-template-columns:minmax(0,7fr) minmax(0,6fr);gap:28px 72px;align-items:start;padding-top:12px">
      <h1 style="font-family:'Marcellus',serif;font-size:clamp(34px,3.6vw,54px);line-height:1.12;margin:0;text-wrap:balance">{{ h1 }}</h1>
      <div style="min-width:0">
        <p style="font-size:18px;line-height:1.7;color:#514A3F;max-width:66ch;margin:0;border-left:3px solid #C1882C;padding-left:20px;text-wrap:pretty">{{ intro }}</p>
        <p style="margin:14px 0 0 23px;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#5A4420">{{ tally }}</p>
      </div>
    </div>
    <nav aria-label="Sections" style="margin-top:26px;border-top:1px solid #E9E2D3;padding-top:18px">
      <ul style="list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:10px">
        <sc-for list="{{ chapterLinks }}" as="c" hint-placeholder-count="4">
          <li style="margin:0"><a href="{{ c.href }}" data-cta="gallery-chapter-jump" style="${CHIP_DESKTOP}" style-hover="background:#FAF6EC;text-decoration:none"><span aria-hidden="true" style="color:#C1882C;margin-right:9px">◆</span>{{ c.label }}</a></li>
        </sc-for>
      </ul>
    </nav>
  </section>

  <figure style="width:100%;max-width:1440px;margin:0 auto">
    <button type="button" data-gallery-tile="1" data-gallery-index="0" data-cta="gallery-tile-open" aria-haspopup="dialog" aria-label="{{ heroName }}" onClick="{{ heroOpen }}" style="display:block;width:100%;padding:0;border:0;background:#E0D7C4;overflow:hidden">{{ heroEl }}</button>
    <figcaption style="width:min(1220px,94%);margin:12px auto 0;font-size:16.5px;line-height:1.55;color:#514A3F;text-wrap:pretty">{{ heroCaption }}</figcaption>
  </figure>

  <sc-for list="{{ chapters }}" as="ch" hint-placeholder-count="3">
    <section id="{{ ch.id }}" data-gallery-chapter="1" aria-labelledby="{{ ch.hid }}" style="width:min(1220px,94%);margin:0 auto;padding:56px 0 8px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:24px;flex-wrap:wrap;border-bottom:1px solid #E9E2D3;padding-bottom:14px">
        <h2 id="{{ ch.hid }}" style="font-family:'Marcellus',serif;font-size:clamp(26px,2.4vw,34px);line-height:1.18;text-wrap:balance">{{ ch.title }}</h2>
        <p style="margin:0;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#5A4420">{{ ch.tally }}</p>
      </div>
      <p style="font-size:18px;line-height:1.7;color:#514A3F;max-width:72ch;margin:18px 0 26px;text-wrap:pretty">{{ ch.intro }}</p>
      <ul role="list" style="list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;align-items:flex-start;gap:24px 14px">
        <sc-for list="{{ ch.images }}" as="p" hint-placeholder-count="6">
          <li style="flex-grow:{{ p.grow }};flex-shrink:1;flex-basis:min({{ p.basis }}px,48%);min-width:0;margin:0">
            <figure style="margin:0">
              <button type="button" data-gallery-tile="1" data-gallery-index="{{ p.i }}" data-cta="gallery-tile-open" aria-haspopup="dialog" aria-label="{{ p.name }}" onClick="{{ p.open }}" style="display:block;width:100%;padding:0;border:0;background:#E0D7C4;border-radius:4px;overflow:hidden;position:relative" style-hover="filter:brightness(1.04)">{{ p.imgEl }}</button>
              <figcaption style="margin:8px 0 0;font-size:16px;line-height:1.55;color:#514A3F;text-wrap:pretty">{{ p.caption }}</figcaption>
            </figure>
          </li>
        </sc-for>
        <li aria-hidden="true" style="flex:9999 1 0;min-width:0;margin:0"></li>
      </ul>
      <sc-if value="{{ ch.hasVideo }}" hint-placeholder-val="{{ false }}">
        <div style="margin-top:34px;display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:24px 48px;align-items:start;border-top:1px solid #E9E2D3;padding-top:28px">
          <figure style="margin:0">
            {{ ch.videoEl }}
            <figcaption style="margin:8px 0 0;font-size:16px;line-height:1.55;color:#514A3F;text-wrap:pretty">{{ ch.videoCaption }}</figcaption>
          </figure>
          <div style="min-width:0">
            <p style="margin:0 0 6px;font-weight:700;font-size:13px;letter-spacing:2.6px;text-transform:uppercase;color:#8F6212">Video</p>
            <h3 style="font-family:'Marcellus',serif;font-size:24px;line-height:1.25;margin:0 0 12px;text-wrap:balance">{{ ch.videoTitle }}</h3>
            <p style="font-size:17px;line-height:1.7;color:#514A3F;margin:0;text-wrap:pretty">{{ ch.videoDesc }}</p>
            <a href="{{ ch.videoWatch }}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;min-height:44px;margin-top:6px;font-weight:700;font-size:15px">Watch on YouTube (opens a new tab)</a>
          </div>
        </div>
      </sc-if>
      <sc-if value="{{ ch.hasLink }}" hint-placeholder-val="{{ false }}">
        <p style="margin:26px 0 0"><a href="{{ ch.linkHref }}" onClick="{{ guard }}" data-cta="gallery-chapter-link" style="display:inline-flex;align-items:center;gap:10px;min-height:44px;font-weight:700;font-size:15.5px;letter-spacing:.3px"><span aria-hidden="true" style="color:#C1882C">◆</span>{{ ch.linkLabel }}<span aria-hidden="true">→</span></a></p>
      </sc-if>
    </section>
  </sc-for>
${closingSection(false)}
</main>
<dc-import name="AHV Chrome Footer" hint-size="100%,620px"></dc-import>
${dialogBlock(false)}
</div>
`;
}

/* ------------------------------------------------------------------ *
 * Mobile template
 * ------------------------------------------------------------------ */

export function mobileTemplate() {
  return `${helmet(true)}
<div data-screen-label="Photo collections template — Mobile 390">
<a href="#main-content" style="position:fixed;left:-9999px;top:12px;z-index:220;background:#5A4420;color:#F7F4EA;padding:14px 20px;border-radius:4px;font-weight:700;font-size:15px" style-focus="left:12px">Skip to main content</a>
<dc-import name="AHV Chrome Header" narrow="true" style="position:sticky;top:0;z-index:80" hint-size="100%,64px"></dc-import>
<main id="main-content">

  <section style="padding:18px 16px 20px">
    <nav aria-label="Breadcrumb" style="font-size:15px;color:#75695A;display:flex;gap:8px;align-items:center;flex-wrap:wrap">
      <sc-for list="{{ crumbs }}" as="c" hint-placeholder-count="2">
        <a href="{{ c.url }}" onClick="{{ guard }}" style="display:inline-flex;align-items:center;min-height:44px">{{ c.label }}</a>
        <span aria-hidden="true" style="color:#C9BFA8">/</span>
      </sc-for>
      <span aria-current="page" style="color:#2A2118">{{ crumbLast }}</span>
    </nav>
    <p style="margin:2px 0 0;font-weight:700;font-size:12.5px;letter-spacing:2.6px;text-transform:uppercase;color:#8F6212;line-height:1.5">Kairali — The Ayurvedic Healing Village · Since 1908</p>
    <h1 style="font-family:'Marcellus',serif;font-size:32px;line-height:1.18;margin:10px 0 0;text-wrap:balance">{{ h1 }}</h1>
    <p style="font-size:17.5px;line-height:1.7;color:#514A3F;margin:16px 0 0;max-width:66ch;border-left:3px solid #C1882C;padding-left:16px;text-wrap:pretty">{{ intro }}</p>
    <p style="margin:12px 0 0 19px;font-weight:700;font-size:12.5px;letter-spacing:2px;text-transform:uppercase;color:#5A4420">{{ tally }}</p>
    <nav aria-label="Sections" style="margin-top:20px;border-top:1px solid #E9E2D3;padding-top:16px">
      <ul style="list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px">
        <sc-for list="{{ chapterLinks }}" as="c" hint-placeholder-count="4">
          <li style="margin:0;min-width:0"><a href="{{ c.href }}" data-cta="gallery-chapter-jump" style="${CHIP_MOBILE}"><span aria-hidden="true" style="color:#C1882C;margin-right:8px">◆</span>{{ c.label }}</a></li>
        </sc-for>
      </ul>
    </nav>
  </section>

  <figure style="width:100%;margin:0">
    <button type="button" data-gallery-tile="1" data-gallery-index="0" data-cta="gallery-tile-open" aria-haspopup="dialog" aria-label="{{ heroName }}" onClick="{{ heroOpen }}" style="display:block;width:100%;padding:0;border:0;background:#E0D7C4;overflow:hidden">{{ heroEl }}</button>
    <figcaption style="margin:10px 16px 0;font-size:16.5px;line-height:1.55;color:#514A3F;text-wrap:pretty">{{ heroCaption }}</figcaption>
  </figure>

  <sc-for list="{{ chapters }}" as="ch" hint-placeholder-count="3">
    <section id="{{ ch.id }}" data-gallery-chapter="1" aria-labelledby="{{ ch.hid }}" style="padding:36px 16px 8px">
      <h2 id="{{ ch.hid }}" style="font-family:'Marcellus',serif;font-size:26px;line-height:1.2;margin:0 0 4px;text-wrap:balance">{{ ch.title }}</h2>
      <p style="margin:0 0 14px;font-weight:700;font-size:12.5px;letter-spacing:2px;text-transform:uppercase;color:#5A4420">{{ ch.tally }}</p>
      <p style="font-size:17.5px;line-height:1.7;color:#514A3F;max-width:66ch;margin:0 0 22px;text-wrap:pretty">{{ ch.intro }}</p>
      <ul role="list" style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:24px">
        <sc-for list="{{ ch.images }}" as="p" hint-placeholder-count="4">
          <li style="min-width:0;margin:0">
            <figure style="margin:0">
              <button type="button" data-gallery-tile="1" data-gallery-index="{{ p.i }}" data-cta="gallery-tile-open" aria-haspopup="dialog" aria-label="{{ p.name }}" onClick="{{ p.open }}" style="display:block;width:100%;padding:0;border:0;background:#E0D7C4;border-radius:4px;overflow:hidden">{{ p.imgEl }}</button>
              <figcaption style="display:flex;justify-content:space-between;gap:12px;align-items:baseline;margin:8px 0 0;font-size:16.5px;line-height:1.55;color:#514A3F;text-wrap:pretty"><span>{{ p.caption }}</span><span aria-hidden="true" style="flex:none;font-weight:700;font-size:11.5px;letter-spacing:1.6px;text-transform:uppercase;color:#8F6212">{{ p.ordinal }}</span></figcaption>
            </figure>
          </li>
        </sc-for>
      </ul>
      <sc-if value="{{ ch.hasVideo }}" hint-placeholder-val="{{ false }}">
        <div style="margin-top:30px;border-top:1px solid #E9E2D3;padding-top:24px">
          <p style="margin:0 0 6px;font-weight:700;font-size:12.5px;letter-spacing:2.6px;text-transform:uppercase;color:#8F6212">Video</p>
          <h3 style="font-family:'Marcellus',serif;font-size:22px;line-height:1.25;margin:0 0 14px;text-wrap:balance">{{ ch.videoTitle }}</h3>
          <figure style="margin:0">
            {{ ch.videoEl }}
            <figcaption style="margin:8px 0 0;font-size:16px;line-height:1.55;color:#514A3F;text-wrap:pretty">{{ ch.videoCaption }}</figcaption>
          </figure>
          <p style="font-size:17px;line-height:1.7;color:#514A3F;margin:14px 0 0;text-wrap:pretty">{{ ch.videoDesc }}</p>
          <a href="{{ ch.videoWatch }}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;min-height:44px;margin-top:4px;font-weight:700;font-size:15px">Watch on YouTube (opens a new tab)</a>
        </div>
      </sc-if>
      <sc-if value="{{ ch.hasLink }}" hint-placeholder-val="{{ false }}">
        <p style="margin:22px 0 0"><a href="{{ ch.linkHref }}" onClick="{{ guard }}" data-cta="gallery-chapter-link" style="display:inline-flex;align-items:center;gap:10px;min-height:44px;font-weight:700;font-size:15.5px"><span aria-hidden="true" style="color:#C1882C">◆</span>{{ ch.linkLabel }}<span aria-hidden="true">→</span></a></p>
      </sc-if>
    </section>
  </sc-for>
${closingSection(true)}
</main>
<dc-import name="AHV Chrome Footer" narrow="true" hint-size="100%,900px"></dc-import>
${dialogBlock(true)}
</div>
`;
}

/* ------------------------------------------------------------------ *
 * Logic (one class, variant-aware via the mobile flag baked in)
 * ------------------------------------------------------------------ */

export function logic(mobile) {
  const MOBILE = mobile ? "true" : "false";
  return `
class Component extends DCLogic {
  state = { i: null, playing: {} };
  componentDidMount() {
    document.documentElement.lang = 'en-US'; this.syncHead();
    this._onPop = () => { if (this.state.i != null) this.close(); };
    window.addEventListener('popstate', this._onPop);
    const d = this.dialog();
    if (d) { this._onDlgClose = () => { if (this.state.i != null) this.closed(); }; d.addEventListener('close', this._onDlgClose); }
  }
  componentDidUpdate() { this.syncHead(); }
  componentWillUnmount() {
    document.body.style.overflow = '';
    window.removeEventListener('popstate', this._onPop);
    const d = this.dialog(); if (d && this._onDlgClose) d.removeEventListener('close', this._onDlgClose);
  }
  dialog() { return document.getElementById('gallery-dialog'); }

  route() {
    const D = window.AHV_PHOTO_COLLECTIONS;
    if (!D) return null;
    const want = this.props.route || '/property-gallery/';
    return D.routes.find(r => r.path === want) || D.routes[0];
  }
  syncHead() {
    const R = this.route(); if (!R || this._head === R.path) return;
    this._head = R.path;
    void (R.head.title); /* title governed by the route manifest */
    const set = (sel, attr, val) => { const el = document.head.querySelector(sel); if (el) el.setAttribute(attr, val); };
    set('meta[name="description"]', 'content', R.head.description);
    set('link[rel="canonical"]', 'href', R.head.canonical);
    set('meta[name="robots"]', 'content', R.head.robots);
  }
  /* The lightbox sequence: hero first, then every chapter's tiles in page order. */
  flat() {
    const R = this.route(); if (!R) return [];
    if (this._flatFor === R) return this._flat;
    const out = [];
    if (R.hero) out.push(Object.assign({}, R.hero, { chapter: R.h1, k: 1, n: 1 }));
    R.chapters.forEach(ch => ch.images.forEach((p, k) => out.push(Object.assign({}, p, { chapter: ch.title, k: k + 1, n: ch.images.length }))));
    this._flatFor = R; this._flat = out;
    return out;
  }
  open(i) {
    this._from = i;
    this.setState({ i });
    const d = this.dialog();
    if (d && !d.open) { try { d.showModal(); } catch (e) { d.setAttribute('open', ''); } }
    document.body.style.overflow = 'hidden';
    setTimeout(() => { const c = document.getElementById('gallery-close'); if (c) c.focus(); }, 30);
  }
  close() {
    const d = this.dialog();
    if (d && d.open) d.close(); else this.closed();
  }
  closed() {
    const from = this._from;
    this.setState({ i: null });
    document.body.style.overflow = '';
    setTimeout(() => { const b = document.querySelector('button[data-gallery-index="' + from + '"]'); if (b) b.focus(); }, 30);
  }
  go(d) {
    if (this.state.i == null) return;
    const n = this.flat().length; if (!n) return;
    this.setState(s => ({ i: (s.i + d + n) % n }));
  }
  goTo(i) { if (this.state.i == null) return; this.setState({ i }); }
  play(id) { this.setState(s => ({ playing: Object.assign({}, s.playing, { [id]: true }) })); }

  renderVals() {
    const R = this.route();
    const guard = () => {}; /* preview-only nav guard neutralised for the published site */
    if (!R) return { guard, chapters: [], chapterLinks: [], crumbs: [] };
    const A = 'https://ayurvedichealingvillage.com';
    const MOBILE = ${MOBILE};
    const rowH = this.props.rowHeight ?? 250;
    const eager = MOBILE ? 2 : 3;
    const sizes = MOBILE ? '100vw' : '(min-width:1240px) 400px, 33vw';
    const crumbs = R.crumbs.slice(0, -1).map(c => ({ label: c.label, url: A + c.path }));
    const flat = this.flat();
    const open = this.state.i != null;
    const cur = open ? flat[this.state.i] : null;
    const total = flat.length;
    const videos = R.chapters.filter(ch => ch.video).length;

    const img = (p, opts) => React.createElement('img', Object.assign({
      src: p.src, alt: p.alt || '', width: p.width, height: p.height,
      srcSet: p.src768 ? (p.src768 + ' 768w, ' + p.src + ' 1600w') : undefined,
      sizes: p.src768 ? sizes : undefined,
      decoding: 'async',
      style: { width: '100%', height: 'auto', display: 'block' }
    }, opts));

    let idx = 0;
    const chapters = R.chapters.map((ch, ci) => {
      const V = ch.video;
      const playing = !!(V && this.state.playing[V.youtubeId]);
      let videoEl = null;
      if (V) {
        videoEl = playing
          ? React.createElement('iframe', {
              'data-gallery-iframe': '1',
              src: 'https://www.youtube-nocookie.com/embed/' + V.youtubeId + '?autoplay=1&rel=0&modestbranding=1',
              title: V.title, width: 1280, height: 720, allowFullScreen: true,
              allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
              referrerPolicy: 'strict-origin-when-cross-origin' })
          : React.createElement('button', {
              type: 'button', 'data-gallery-facade': '1', 'data-cta': 'gallery-video-play',
              'aria-label': 'Play: ' + V.title, onClick: () => this.play(V.youtubeId) },
              React.createElement('img', { src: V.poster.src, alt: 'Poster frame of the film: ' + V.title, width: V.poster.width, height: V.poster.height, loading: 'lazy', decoding: 'async' }),
              React.createElement('span', { 'aria-hidden': 'true' }, '\\u25B6'));
      }
      return {
        id: ch.id, hid: ch.id + '-h', title: ch.title, intro: ch.intro,
        tally: ch.images.length + (ch.images.length === 1 ? ' photograph' : ' photographs'),
        images: ch.images.map((p, k) => {
          idx += 1;
          const i = idx;
          const ar = p.width / p.height;
          return {
            i, name: p.caption, caption: p.caption,
            ordinal: (k + 1) + ' of ' + ch.images.length,
            grow: Math.round(ar * 100), basis: Math.round(ar * rowH),
            imgEl: img(p, { loading: (ci === 0 && k < eager) ? 'eager' : 'lazy' }),
            open: () => this.open(i)
          };
        }),
        hasVideo: !!V,
        videoTitle: V ? V.title : '', videoDesc: V ? V.description : '',
        videoCaption: V ? V.caption : '', videoWatch: V ? ('https://www.youtube.com/watch?v=' + V.youtubeId) : '',
        videoEl,
        hasLink: !!ch.linkTo, linkHref: ch.linkTo ? (A + ch.linkTo) : '', linkLabel: ch.linkLabel || ''
      };
    });

    return {
      guard, crumbs, crumbLast: R.crumbs[R.crumbs.length - 1].label,
      h1: R.h1, intro: R.intro.text,
      tally: (total - 1) + ' photographs · ' + R.chapters.length + ' chapters' + (videos ? ' · ' + videos + (videos === 1 ? ' video' : ' videos') : ''),
      chapterLinks: R.chapters.map(ch => ({ href: '#' + ch.id, label: ch.title })),
      heroEl: R.hero ? img(R.hero, { loading: 'eager', fetchpriority: 'high', sizes: '100vw' }) : null,
      heroName: R.hero ? R.hero.caption : '', heroCaption: R.hero ? R.hero.caption : '',
      heroOpen: () => this.open(0),
      chapters,
      dlgOpen: open,
      dlgLabel: cur ? cur.chapter : R.h1,
      counter: cur ? (cur.k + ' of ' + cur.n) : '',
      curCaption: cur && cur.caption ? cur.caption : '',
      curCapDisplay: cur && cur.caption ? 'block' : 'none',
      expandedEl: cur ? React.createElement('img', { src: cur.src, alt: cur.alt || '', width: cur.width, height: cur.height, decoding: 'async',
        style: { display: 'block', width: 'auto', height: 'auto', maxWidth: 'min(1280px,100%)', maxHeight: MOBILE ? 'calc(100vh - 230px)' : 'calc(100vh - 220px)', objectFit: 'contain', borderRadius: '4px', background: '#000' } }) : null,
      close: () => this.close(), prev: () => this.go(-1), next: () => this.go(1),
      dlgClosed: () => { if (this.state.i != null) this.closed(); },
      swipeStart: (e) => { this._sx = e.clientX; this._sy = e.clientY; },
      swipeEnd: (e) => {
        if (this._sx == null) return;
        const dx = e.clientX - this._sx, dy = e.clientY - this._sy; this._sx = null;
        if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy)) this.go(dx < 0 ? 1 : -1);
      },
      dlgKey: (e) => {
        if (e.key === 'Escape') { e.preventDefault(); this.close(); return; }
        if (e.key === 'ArrowLeft') { e.preventDefault(); this.go(-1); return; }
        if (e.key === 'ArrowRight') { e.preventDefault(); this.go(1); return; }
        if (e.key === 'Home') { e.preventDefault(); this.goTo(0); return; }
        if (e.key === 'End') { e.preventDefault(); this.goTo(total - 1); return; }
      }
    };
  }
}
`;
}

/** The data-props block, unchanged from the approved family (route enum + row height). */
export const PROPS = {
  route: {
    editor: "enum",
    default: "/property-gallery/",
    options: [
      "/property-gallery/",
      "/photo-gallery/",
      "/product-gallery/",
      "/villas-gallery/",
      "/treatments-gallery/",
      "/yoga-gallery/",
      "/retreats-gallery/",
      "/sight-seeing-gallery/",
    ],
    tsType: "string",
    section: "Template test",
  },
  rowHeight: { editor: "range", default: 250, min: 170, max: 320, step: 10, unit: "px", tsType: "number", section: "Collection" },
};
