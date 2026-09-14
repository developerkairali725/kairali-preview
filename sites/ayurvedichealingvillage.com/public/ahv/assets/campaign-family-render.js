// AHV T06 campaign / offer family — shared prototype renderer (Desktop + Mobile readers).
// Reads assets/campaign-family-data.js. Applies the per-route head contract (prototype only — Next.js must emit it
// server-side per legacy route, preserving the exact .html path, case and absent trailing slash).
(function () {
  const A = 'https://ayurvedichealingvillage.com';
  const DEFAULT_ROUTE = '/treatment-in-kerala.html';

  function resolveRoute(propRoute) {
    let q = null;
    try { q = new URLSearchParams(location.search).get('route'); } catch (e) {}
    const want = q || propRoute;
    const D = window.AHV_CAMPAIGN || { routes: [] };
    // An explicitly requested route that does not exist must NOT fall back to an unrelated record — that
    // is how a 404 becomes a plausible-looking wrong page (an unknown route used to render
    // /treatment-in-kerala.html complete with its title, canonical, copy and image list). Only a missing
    // query takes the default, which is unchanged.
    if (want) return D.routes.find(r => r.path === want || r.slug === want) || null;
    return D.routes.find(r => r.path === DEFAULT_ROUTE) || D.routes[0] || null;
  }

  // The not-found state is a rendered visitor-facing page: it gets a truthful title, the English runtime
  // locale and noindex, and deliberately no canonical — inventing one for a path that is not a route would
  // be worse than omitting it.
  function applyNotFoundHead() {
    const d = document, H = d.head;
    [...H.querySelectorAll('[data-ahv-head]')].forEach(n => n.remove());
    [...H.querySelectorAll('link[rel="canonical"], meta[name="robots"], meta[name="description"], meta[property^="og:"], meta[name^="twitter:"], script[type="application/ld+json"]')].forEach(n => n.remove());
    d.documentElement.lang = 'en-US';
    d.title = 'Route not in the campaign set — Ayurvedic Healing Village';
    const add = (tag, attrs) => {
      const el = d.createElement(tag);
      Object.entries(attrs).forEach(([k, v]) => { if (v != null) el.setAttribute(k, v); });
      el.setAttribute('data-ahv-head', '');
      H.appendChild(el);
    };
    add('meta', { name: 'robots', content: 'noindex, nofollow' });
    add('meta', { name: 'description', content: 'The requested route is not one of the campaign routes in this prototype. No other page was substituted for it.' });
  }

  function notFoundVals(requested) {
    const D = window.AHV_CAMPAIGN || { routes: [] };
    // Only the English routes are listed. The dataset also holds the deferred Russian legacy record
    // (/treatment-in-kerala-russian.html, html lang ru-RU); translations are out of scope for this phase,
    // so it is preserved in the dataset but not offered on an English visitor-facing state.
    return {
      notFound: true, found: false,
      requestedRoute: requested || '(none given)',
      validRoutes: D.routes
        .filter(r => !/^ru/i.test((r.metadata && (r.metadata.sourceHtmlLang || r.metadata.htmlLang)) || 'en'))
        .map(r => r.path)
    };
  }

  // Inline-only renderer for the offer-terms article trees (p / ul / li / strong / br / a).
  function inline(node, key, guard) {
    if (node.k === 't') return node.v;
    if (node.tag === 'br') return React.createElement('br', { key });
    const props = { key }; const st = {};
    if (node.tag === 'strong') st.fontWeight = 700;
    if (node.tag === 'em') st.fontStyle = 'italic';
    if (node.tag === 'a' && node.attrs && node.attrs.href) {
      const h = node.attrs.href;
      Object.assign(st, { color: '#006038', textDecoration: 'underline', textUnderlineOffset: '3px', fontWeight: 600 });
      if (h.startsWith('/')) { props.href = A + h; props.onClick = guard; } else { props.href = h; props.rel = 'noopener'; }
    }
    if (Object.keys(st).length) props.style = st;
    return React.createElement(node.tag, props, ...(node.c || []).map((c, i) => inline(c, key + '-' + i, guard)));
  }

  function offerBlocks(R, guard, mobile) {
    return R.blocks.map((b, i) => {
      const key = 'b' + b.p; const extra = { key, 'data-pos': b.p };
      if (b.sourceTag !== b.tag) extra['data-correction'] = b.sourceTag + '→' + b.tag;
      if (b.tag === 'h2') return React.createElement('h2', Object.assign(extra, { id: 'terms', style: { fontFamily: "'Marcellus',serif", fontWeight: 400, fontSize: mobile ? '25px' : 'clamp(25px,2.2vw,30px)', lineHeight: 1.25, margin: '40px 0 14px', color: '#2A2118', textWrap: 'balance' } }), ...(b.tree.c || []).map((c, j) => inline(c, key + '-' + j, guard)));
      if (b.tag === 'p') return React.createElement('p', Object.assign(extra, { style: { margin: '0 0 18px', fontSize: mobile ? '17px' : '17.5px', lineHeight: 1.7, color: '#2A2118', textWrap: 'pretty' } }), ...(b.tree.c || []).map((c, j) => inline(c, key + '-' + j, guard)));
      if (b.tag === 'ul') return React.createElement('ul', Object.assign(extra, { style: { margin: '0 0 18px', padding: '0 0 0 26px', listStyle: 'disc' } }),
        ...(b.tree.c || []).filter(li => li.k === 'e' && li.tag === 'li').map((li, j) => React.createElement('li', { key: key + '-li' + j, style: { margin: '0 0 10px', fontSize: mobile ? '17px' : '17.5px', lineHeight: 1.7, color: '#2A2118', textWrap: 'pretty' } }, ...(li.c || []).map((c, k) => inline(c, key + '-li' + j + '-' + k, guard)))));
      return null;
    });
  }

  // Prototype head binding. Emits the governed self-canonical (source canonical is absent on these legacy routes)
  // and ports no hreflang (no proven reciprocal cluster). No offer/award/certification schema.
  function applyHead(R) {
    const d = document; const M = R.metadata; const H = d.head;
    [...H.querySelectorAll('[data-ahv-head]')].forEach(n => n.remove());
    const add = (tag, attrs) => { const el = d.createElement(tag); Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v)); el.setAttribute('data-ahv-head', ''); H.appendChild(el); return el; };
    d.title = M.title;
    d.documentElement.lang = M.htmlLang || 'en';
    // Empty source description (V3 membership route): emit NO description meta rather than invent one.
    if (M.description) add('meta', { name: 'description', content: M.description });
    add('link', { rel: 'canonical', href: M.effectiveCanonical });
    if (M.robots) add('meta', { name: 'robots', content: M.robots });
    const og = M.openGraph || {};
    if (og.locale) add('meta', { property: 'og:locale', content: og.locale });
    if (og.type) add('meta', { property: 'og:type', content: og.type });
    if (og.title) add('meta', { property: 'og:title', content: og.title });
    if (og.description) add('meta', { property: 'og:description', content: og.description });
    if (og.url) add('meta', { property: 'og:url', content: og.url });
    if (og.siteName) add('meta', { property: 'og:site_name', content: og.siteName });
    (og.images || []).forEach(im => { add('meta', { property: 'og:image', content: im.url }); if (im.width) add('meta', { property: 'og:image:width', content: im.width }); if (im.height) add('meta', { property: 'og:image:height', content: im.height }); if (im.type) add('meta', { property: 'og:image:type', content: im.type }); });
    if (M.twitter && M.twitter.card) add('meta', { name: 'twitter:card', content: M.twitter.card });
    // Governed BreadcrumbList, exactly as the route record specifies. Records without a chain emit none.
    if (R.breadcrumbSchemaExpected) { const bcs = add('script', { type: 'application/ld+json' }); bcs.textContent = JSON.stringify(R.breadcrumbSchemaExpected); }
    const s = add('script', { type: 'application/ld+json' });
    const wp = { '@type': 'WebPage', '@id': M.effectiveCanonical, url: M.effectiveCanonical, name: M.title, isPartOf: { '@id': A + '/#website' }, inLanguage: M.htmlLang || 'en' };
    if (M.description) wp.description = M.description;
    s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': [
      wp,
      { '@type': 'WebSite', '@id': A + '/#website', url: A + '/', name: 'Ayurvedic Healing Village', inLanguage: 'en-US' }
    ] });
  }

  // Retreat-overview (/ayurveda-retreat-kerala.html): the dataset is an ordered list of source sections keyed by
  // source pointer. This shapes it for the templates — caps every image at its natural width and resolves
  // source-relative hrefs — without changing a single source string.
  function deepCap(o) {
    if (Array.isArray(o)) return o.map(deepCap);
    if (o && typeof o === 'object') {
      if (typeof o.src === 'string') {
        const w = o.width || 0;
        return Object.assign({}, o, {
          maxWidth: w + 'px',
          maxW56: Math.min(56, w || 56) + 'px', maxW72: Math.min(72, w || 72) + 'px',
          maxW84: Math.min(84, w || 84) + 'px', maxW120: Math.min(120, w || 120) + 'px',
          maxW150: Math.min(150, w || 150) + 'px'
        });
      }
      const out = {};
      Object.keys(o).forEach(k => { out[k] = deepCap(o[k]); });
      return out;
    }
    return o;
  }

  function retreatVals(R) {
    const ro = {};
    (R.sections || []).forEach(s => { ro[s.pattern] = deepCap(s); });
    const abs = h => (h && h.charAt(0) === '/') ? A + h : h;
    // Same-page anchors resolve through the route's explicit source-to-target map (see routes[2].navigationMap):
    // #support -> the treatment-support section (technical correction; the source id never existed),
    // #contact -> the enquiry form (recorded prototype conversion; source #contact was the footer contact block).
    const nav = {};
    ((R.navigationMap || {}).entries || []).forEach(e => { if (e.target) nav[e.sourceHref] = e.target; });
    const href = h => (h && h.charAt(0) === '#') ? (nav[h] || h) : abs(h);
    ['hero', 'aboutSplit', 'cardGrid', 'ebook', 'doctors', 'whyUs', 'villas', 'consultation', 'footer'].forEach(k => {
      const s = ro[k]; if (!s) return;
      if (s.ctas) s.ctas = s.ctas.map(c => ({ text: c.text, href: href(c.href) }));
      if (s.cta) s.cta = { text: s.cta.text, href: href(s.cta.href) };
      if (s.readMore) s.readMore = { text: s.readMore.text, href: href(s.readMore.href) };
      if (s.benefits) s.benefits = s.benefits.map(b => ({ text: b.text, href: href(b.href) }));
      if (s.villas) s.villas = s.villas.map(v => Object.assign({}, v, { cta: { text: v.cta.text, href: href(v.cta.href) } }));
      if (s.policyLinks) s.policyLinks = s.policyLinks.map(l => ({ text: l.text, href: abs(l.href) }));
    });
    if (ro.attractions) ro.attractions.articles = ro.attractions.articles.map(a => Object.assign({}, a, { href: a.sourceHref }));
    return ro;
  }

  // Shared V2 offer variant (/offers/senior-citizen-offer/ and /offers/new/): one component set, two exact datasets.
  function offerVariantVals(R) {
    const ov = {};
    (R.sections || []).forEach(s => { ov[s.component] = deepCap(s); });
    const nav = {};
    ((R.navigationMap || {}).entries || []).forEach(e => { if (e.target) nav[e.sourceHref] = e.target; });
    const href = h => (h && h.charAt(0) === '#') ? (nav[h] || h) : ((h && h.charAt(0) === '/') ? A + h : h);
    const fix = c => ({ text: c.text, href: href(c.sourceHref), sourceHref: c.sourceHref, inPage: (c.sourceHref || '').charAt(0) === '#' });
    if (ov.hero) ov.hero.ctas = ov.hero.ctas.map(fix);
    if (ov.doctor) ov.doctor.ctas = ov.doctor.ctas.map(fix);
    if (ov.formSec && ov.formSec.cta) ov.formSec.cta = fix(ov.formSec.cta);
    if (ov.fcta) ov.fcta.cta = fix(ov.fcta.cta);
    ov.isSenior = R.variant === 'senior';
    ov.isNew = R.variant === 'new';
    ov.hasTestimonials = !!ov.testimonials;
    ov.hasFcta = !!ov.fcta;
    ov.hasForm = !!(R.form && R.form.fields);
    return ov;
  }

  // V3 membership variant (/kairali-air-india-maharaja-club.html): source co-brand chrome, eight main sections,
  // ten exact source images and the seven source form controls under their real source meanings.
  function membershipVals(R) {
    const mv = {};
    (R.sections || []).forEach(s => { mv[s.component] = deepCap(s); });
    const nav = {};
    ((R.navigationMap || {}).entries || []).forEach(e => { if (e.target) nav[e.sourceHref] = e.target; });
    const href = h => (h && h.charAt(0) === '#') ? (nav[h] || h) : ((h && h.charAt(0) === '/') ? A + h : h);
    if (mv.coBrandHeader) mv.coBrandHeader.nav = mv.coBrandHeader.nav.map(n => ({ text: n.text, href: href(n.sourceHref), sourceHref: n.sourceHref }));
    if (mv.coBrandHeader) mv.coBrandHeader.homeHrefAbs = A + mv.coBrandHeader.homeHref;
    if (mv.programmes) mv.programmes.cards = mv.programmes.cards.map(c => Object.assign({}, c, { href: href(c.sourceHref) }));
    if (mv.coBrandFooter) mv.coBrandFooter.links = mv.coBrandFooter.links.map(l => ({ text: l.text, href: A + l.sourceHref, sourceHref: l.sourceHref }));
    return mv;
  }

  // V1 family retreat (/family-ayurvedic-retreat-kerala.html): source chrome + 11 main sections, 16 programme
  // tabs, four independent room galleries, seven itinerary disclosures, eight FAQ disclosures, seven form controls.
  function familyVals(R) {
    const fv = {};
    (R.sections || []).forEach(s => { fv[s.component] = deepCap(s); });
    const nav = {};
    ((R.navigationMap || {}).entries || []).forEach(e => { if (e.target) nav[e.sourceHref] = e.target; });
    const href = h => (h && h.charAt(0) === '#') ? (nav[h] || h) : ((h && h.charAt(0) === '/') ? A + h : h);
    if (fv.chrome) fv.chrome.nav = fv.chrome.nav.map(n => ({ text: n.text, href: href(n.sourceHref), sourceHref: n.sourceHref }));
    if (fv.hero) fv.hero.cta = { text: fv.hero.cta.text, href: href(fv.hero.cta.sourceHref), sourceHref: fv.hero.cta.sourceHref };
    if (fv.offerBanner) fv.offerBanner.cta = { text: fv.offerBanner.cta.text, href: href(fv.offerBanner.cta.sourceHref), sourceHref: fv.offerBanner.cta.sourceHref };
    fv.form = deepCap(R.form);
    return fv;
  }

  // V4 Russian legacy route (/treatment-in-kerala-russian.html): encoding-recovered block content,
  // one-H1 hierarchy repair, Cyrillic-capable type, guarded 9-control source form.
  function russianVals(R, state, setCur, setSlide) {
    const rv = { topBar: deepCap(R.topBar), form: deepCap(R.form), fonts: R.fonts };
    const nav = {};
    ((R.navigationMap || {}).entries || []).forEach(e => { if (e.target) nav[e.sourceHref] = e.target; });
    const href = h => !h ? null : (h.charAt(0) === '#' ? (nav[h] || h) : (h.charAt(0) === '/' ? A + h : h));
    const cur = (state && state.v4Cur) || {};
    rv.sections = (R.sections || []).map(s => Object.assign({}, s, {
      blocks: (s.blocks || []).map(b => {
        const o = Object.assign({}, deepCap(b));
        o.isH1 = b.kind === 'heading' && b.level === 'h1';
        o.isH2 = b.kind === 'heading' && b.level === 'h2';
        o.isH3 = b.kind === 'heading' && b.level === 'h3';
        o.isH4 = b.kind === 'heading' && b.level === 'h4';
        o.isH5 = b.kind === 'heading' && b.level === 'h5';
        o.isH6 = b.kind === 'heading' && b.level === 'h6';
        o.isPara = b.kind === 'para';
        o.isQuote = b.kind === 'quote';
        o.isList = b.kind === 'list';
        o.isText = b.kind === 'text';
        o.isImg = b.kind === 'imgOne';
        o.isSlideshow = b.kind === 'slideshow';
        if (b.kind === 'slideshow') {
          const idx = (state && typeof state.v4Slide === 'number') ? state.v4Slide : (b.initialIndex || 0);
          o.frameList = (b.frames || []).map((f, i) => Object.assign({}, f, {
            id: 'v4-frame-' + i, hidden: i !== idx, display: i === idx ? 'block' : 'none'
          }));
          o.controlList = (b.frames || []).map((f, i) => ({
            id: 'v4-slide-' + i, panelId: 'v4-frame-' + i, label: f.positionLabel, num: String(i + 1),
            pressed: i === idx ? 'true' : 'false',
            bg: i === idx ? '#0F5737' : '#fff', fg: i === idx ? '#F7F4EA' : '#0F5737',
            select: () => setSlide(i)
          }));
          o.status = 'Слайд ' + (idx + 1) + ' из ' + (b.frames || []).length;
          o.nextSelect = () => setSlide(((idx + 1) % ((b.frames || []).length || 1)));
        }
        o.isAwardGrid = b.kind === 'awardGrid';
        o.isCurrency = b.kind === 'currency';
        o.isCta = b.kind === 'cta';
        if (b.kind === 'cta') {
          o.href = href(b.sourceHref);
          // Cloudflare email-protection hrefs resolve to the recovered same-route address; source href kept in data.
          o.hrefFinal = b.hrefRecovered || o.href;
          o.inert = !b.sourceHref || b.sourceHref === '#';
        }
        if (b.kind === 'li') o.isLi = true;
        if (b.kind === 'currency') {
          // Per-villa scoping: exactly one price panel shows, INR first per the source active class.
          const active = cur[b.villa] || b.initialPanel;
          o.groupLabel = b.villa + ' — currency';
          o.triggerList = b.triggers.map(t => ({
            id: 'v4-cur-' + t.targetPanel, panelId: 'v4-panel-' + t.targetPanel, label: t.label,
            pressed: t.targetPanel === active ? 'true' : 'false',
            bg: t.targetPanel === active ? '#0F5737' : '#fff', fg: t.targetPanel === active ? '#F7F4EA' : '#0F5737',
            select: () => setCur(b.villa, t.targetPanel)
          }));
          o.panelList = b.panels.map(p => ({
            id: 'v4-panel-' + p.sourceId, text: p.text, regionLabel: b.villa + ' ' + p.currency,
            hidden: p.sourceId !== active, display: p.sourceId === active ? 'block' : 'none'
          }));
        }
        return o;
      })
    }));
    return rv;
  }

  window.AHV_CAMPAIGN_RENDER = { resolveRoute, offerBlocks, applyHead, applyNotFoundHead, notFoundVals, retreatVals, offerVariantVals, membershipVals, familyVals, russianVals, A, DEFAULT_ROUTE };
})();
