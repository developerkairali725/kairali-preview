// AHV T06 campaign — renderer for the remaining nine English routes.
// Reuses the proven T04 ordered-source block reader (/ahv/assets/collection-family-render.js) rather than adding a
// new template per URL. Prototype binding only: no submission, no tracking, no provider, no map, no embed.
(function () {
  const A = 'https://ayurvedichealingvillage.com';

  function resolveRoute(propRoute) {
    let q = null;
    try { q = new URLSearchParams(location.search).get('route'); } catch (e) {}
    const D = window.AHV_CAMPAIGN_NINE || { routes: [] };
    const want = q || propRoute;
    // An explicitly requested route that does not exist must NOT silently fall back to an unrelated
    // record — that is how a 404 becomes a plausible-looking wrong page. Only an absent request defaults.
    if (want) return D.routes.find(r => r.path === want || r.slug === want) || null;
    return D.routes[0] || null;
  }

  // Head contract: exactly the source values under the governed effective canonical. Absent source metadata
  // stays absent — no description, image or offer schema is invented.
  function applyHead(R) {
    const d = document, H = d.head, M = R.metadata;
    [...H.querySelectorAll('[data-ahv-head]')].forEach(n => n.remove());
    [...H.querySelectorAll('link[rel="canonical"]:not([data-ahv-head]), meta[name="robots"]:not([data-ahv-head]), meta[name="description"]:not([data-ahv-head]), meta[property^="og:"]:not([data-ahv-head]), meta[name^="twitter:"]:not([data-ahv-head]), script[type="application/ld+json"]:not([data-ahv-head])')].forEach(n => n.remove());
    const add = (tag, attrs, text) => {
      const el = d.createElement(tag);
      Object.entries(attrs).forEach(([k, v]) => { if (v != null) el.setAttribute(k, v); });
      if (text != null) el.textContent = text;
      el.setAttribute('data-ahv-head', '');
      H.appendChild(el); return el;
    };
    d.title = M.title;
    // Governed English runtime locale. The source's own html lang value stays recorded in the dataset
    // (metadata.htmlLang) and is not overwritten there.
    d.documentElement.lang = 'en-US';
    if (M.description) add('meta', { name: 'description', content: M.description });
    add('link', { rel: 'canonical', href: M.effectiveCanonical });
    if (M.robots) add('meta', { name: 'robots', content: M.robots });
    const og = M.openGraph || {};
    ['locale', 'type', 'title', 'description', 'url', 'siteName'].forEach(k => {
      if (og[k]) add('meta', { property: 'og:' + (k === 'siteName' ? 'site_name' : k), content: og[k] });
    });
    (og.images || []).forEach(im => {
      add('meta', { property: 'og:image', content: im.url });
      if (im.width) add('meta', { property: 'og:image:width', content: im.width });
      if (im.height) add('meta', { property: 'og:image:height', content: im.height });
      if (im.type) add('meta', { property: 'og:image:type', content: im.type });
    });
    if (M.twitter && M.twitter.card) add('meta', { name: 'twitter:card', content: M.twitter.card });
    const wp = { '@type': 'WebPage', '@id': M.effectiveCanonical, url: M.effectiveCanonical, name: M.title,
      isPartOf: { '@id': A + '/#website' }, inLanguage: 'en-US' };
    if (M.description) wp.description = M.description;
    // Governed BreadcrumbList, emitted exactly as the route record specifies. Routes without a recorded
    // chain emit none — no ancestry is invented.
    if (R.breadcrumbSchemaExpected) add('script', { type: 'application/ld+json' }, JSON.stringify(R.breadcrumbSchemaExpected));
    add('script', { type: 'application/ld+json' }, JSON.stringify({ '@context': 'https://schema.org', '@graph': [
      wp, { '@type': 'WebSite', '@id': A + '/#website', url: A + '/', name: 'Ayurvedic Healing Village', inLanguage: 'en-US' }
    ] }));
  }

  const LBL = { fname: 'Name', lname: 'Last Name', phone: 'Phone No', email: 'Email Id', message: 'Message',
    result: 'Answer the sum shown in the source captcha', rdogender: 'Gender', chkAgree: 'Consent' };

  // The source form, control for control: exact names, types, order and requiredness, with a real visible label
  // for each (the source relied on placeholders alone). Inert by contract — nothing is posted anywhere.
  function formEl(F, note) {
    if (!F || !F.fields || !F.fields.length) return null;
    const R = React.createElement;
    const base = { width: '100%', boxSizing: 'border-box', minHeight: '48px', padding: '12px 14px', fontSize: '17px', lineHeight: 1.5,
      border: '1px solid #9A8E78', borderRadius: '4px', background: '#fff', color: '#2A2118',
      fontFamily: "'Mulish',sans-serif" };
    const rows = [];
    const radios = F.fields.filter(f => f.type === 'radio');
    const seen = {};
    F.fields.forEach((f, i) => {
      const k = 'f' + i;
      if (f.type === 'submit') return;
      if (f.type === 'radio') {
        if (seen[f.name]) return; seen[f.name] = true;
        rows.push(R('fieldset', { key: k, style: { border: 0, margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: '18px', alignItems: 'center' } },
          R('legend', { style: { padding: 0, fontSize: '17px', fontWeight: 700, marginBottom: '8px' } }, LBL[f.name] || f.name),
          ...radios.filter(r => r.name === f.name).map((r, j) => R('label', { key: k + '-' + j,
            style: { display: 'inline-flex', alignItems: 'center', gap: '10px', minHeight: '44px', fontSize: '17px' } },
            R('input', { type: 'radio', name: r.name, value: r.value, 'data-source-pointer': r.ptr,
              style: { width: '22px', height: '22px' } }), r.value))));
        return;
      }
      if (f.type === 'checkbox') {
        // The consent anchor comes from the route's own source node — href and link text both. The Neo
        // routes' source href has no trailing slash; hardcoding one would overwrite source evidence.
        const ca = F.consentAnchor;
        const href = ca ? (/^https?:/.test(ca.sourceHref) ? ca.sourceHref : A + ca.sourceHref) : null;
        const linkText = (ca && ca.text) ? ca.text.replace(/\s+/g, ' ') : 'privacy & terms of use.';
        rows.push(R('label', { key: k, style: { display: 'flex', gap: '12px', alignItems: 'flex-start', minHeight: '44px', fontSize: '17px', lineHeight: 1.6 } },
          R('input', { type: 'checkbox', name: f.name, 'data-source-pointer': f.ptr, required: f.required || undefined,
            style: { width: '22px', height: '22px', marginTop: '3px', flex: '0 0 auto' } }),
          R('span', null, 'I have read and agree to ayurvedichealingvillage.com ',
            href
              ? R('a', { href: href, 'data-source-href': ca.sourceHref, 'data-source-pointer': ca.ptr,
                  onClick: undefined, /* preview-only nav guard neutralised for the published site */ style: { textUnderlineOffset: '2px' } }, linkText)
              : R('span', null, linkText))));
        return;
      }
      const id = 'c9-' + f.name + '-' + i;
      rows.push(R('div', { key: k, style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
        R('label', { htmlFor: id, style: { fontSize: '17px', fontWeight: 700 } },
          (LBL[f.name] || f.placeholder || f.name), f.required ? R('span', { style: { color: '#8A2B1F' } }, ' *') : null),
        f.control === 'textarea'
          ? R('textarea', { id, name: f.name, rows: f.rows || 4, placeholder: f.placeholder || undefined,
              required: f.required || undefined, 'data-source-pointer': f.ptr, style: Object.assign({}, base, { resize: 'vertical' }) })
          : R('input', { id, type: f.type, name: f.name, placeholder: f.placeholder || undefined,
              required: f.required || undefined, 'data-source-pointer': f.ptr, style: base })));
    });
    // The source submit control, with the source's own visible label. Cleansing and Wellness ship
    // <button type="button" id="btnSubmit">Submit</button>; the Neo/Preventive/WeightLoss routes ship
    // input[type=submit] with no value, whose visible text is the browser default. Either way the label is
    // not invented, and the control's source tag/type/id/name travel with it.
    const sub = F.submit;
    return R('form', { 'data-source-pointer': F.ptr, 'data-source-action': F.sourceAction,
        'data-source-method': F.sourceMethod, noValidate: true, onSubmit: e => e.preventDefault(),
        style: { display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '560px', width: '100%',
          boxSizing: 'border-box', minWidth: 0,
          background: '#FBF8F1', border: '1px solid #E0D7C4', borderRadius: '6px', padding: 'clamp(16px,4vw,24px)' } },
      ...rows,
      R('button', { key: 'sub', type: 'submit',
        'data-source-pointer': sub ? sub.ptr : undefined,
        'data-source-control': sub ? sub.control + '[type=' + sub.type + ']' : undefined,
        'data-source-id': sub && sub.id ? sub.id : undefined,
        'data-source-name': sub && sub.name ? sub.name : undefined,
        style: { minHeight: '52px', padding: '0 28px', border: '1px solid #0F5737', borderRadius: '4px',
          background: '#0F5737', color: '#F7F4EA', fontSize: '17px', fontWeight: 700, cursor: 'pointer',
          fontFamily: "'Mulish',sans-serif" } }, sub ? sub.renderedLabel : 'Submit'),
      R('p', { key: 'note', style: { margin: 0, fontSize: '17px', lineHeight: 1.65, color: '#5A5245' } }, note));
  }

  // The page H1, at the campaign scale. A source H1 arrives inside the ordered block stream, so it is rendered
  // here rather than by the shared T04 block reader — that reader has no h1 case (the collection routes render
  // their H1 outside the stream) and would size a source H1 below its own H2s. The T04 pages are untouched.
  const H1_STYLE = { fontFamily: "'Marcellus',serif", fontWeight: 400, fontSize: 'clamp(30px,3.4vw,44px)',
    lineHeight: 1.18, margin: '0 0 22px', color: '#2A2118', textWrap: 'balance' };

  // Blocks in exact source order: contiguous runs go to the shared reader, source H1s are rendered in place.
  // Legacy sources carry more than one H1 (duplicate desktop/mobile wrappers). The first renders as the page's
  // single H1; each later one keeps its exact text and renders as an H2 marked with the correction.
  function bodyEls(blocks, guard) {
    const CR = window.AHV_COLLECTION_RENDER;
    const out = []; let run = []; let seenH1 = 0;
    const flush = tag => { if (run.length) { out.push(...CR.sourceBlocks(run, 'n' + tag, guard)); run = []; } };
    (blocks || []).forEach((b, i) => {
      if (b.kind === 'heading' && b.tag === 'h1') {
        flush(i);
        seenH1 += 1;
        const first = seenH1 === 1;
        out.push(React.createElement(first ? 'h1' : 'h2', {
          key: 'h1-' + i, 'data-source-pointer': b.ptr,
          'data-correction': first ? undefined : 'h1→h2',
          style: first ? H1_STYLE : Object.assign({}, H1_STYLE, { fontSize: 'clamp(24px,2.4vw,32px)', margin: '26px 0 10px', lineHeight: 1.22 })
        }, ...CR.inline(b.tree, 'h1-' + i, guard)));
        return;
      }
      if (b.kind === 'inertEmbed') { flush(i); out.push(inertEmbedEl(b, 'em-' + i)); return; }
      run.push(b);
    });
    flush('z');
    return out;
  }

  // View-time breakpoint selection. The source ships both members of each responsive image pair and hid one
  // in CSS; the kits captured no stylesheet, so the surviving evidence is the class token on each image.
  // Each view renders only the member its width would have shown. The suppressed sibling is not dropped —
  // it stays in the dataset and is accounted in the QA harness.
  // Generic deep filter: drops non-matching image objects wherever they nest (blocks, list items, nested
  // lists, table cells). A shape-specific walk missed images nested inside list items.
  function forBreakpoint(blocks, bp) {
    const drop = v => v && typeof v === 'object' && !Array.isArray(v)
      && typeof v.src === 'string' && typeof v.ptr === 'string'
      && v.breakpoint != null && v.breakpoint !== bp;
    return (function copy(n) {
      if (!n || typeof n !== 'object') return n;
      if (Array.isArray(n)) return n.filter(x => !drop(x)).map(copy);
      const out = {};
      Object.keys(n).forEach(k => { out[k] = (n[k] && typeof n[k] === 'object') ? copy(n[k]) : n[k]; });
      return out;
    })(blocks);
  }

  function nineVals(R, guard, bp) {
    const el = bodyEls(forBreakpoint(R.blocks, bp || 'wide'), guard);
    // Route-level H1 only where the source stream carries none (the short-offer route: see its heading decision).
    const h1 = R.h1 ? React.createElement('h1', { style: H1_STYLE }, R.h1) : null;
    return {
      route: R, title: R.metadata.title, path: R.path,
      h1El: h1,
      bodyEl: el,
      formEl: formEl(R.form, 'This form is being connected. Until then, please write to info@kairali.com or message us on WhatsApp at +91 92898 38797.'),
      hasForm: !!(R.form && R.form.fields && R.form.fields.length),
      canonical: R.metadata.effectiveCanonical,
      robots: R.metadata.robots,
      indexable: R.governance.indexable ? 'Indexable' : 'Not indexable (source noindex)',
      layoutFit: R.governance.layoutFit,
      headingDecision: R.headingLedger.decision,
      flags: R.releaseFlags || [],
      imageCount: String(R.imageAccounting.placements),
      blockCount: String(R.blocks.length),
      // The link guard travels with the vals so every anchor in the view — including the breadcrumb parents
      // — is inert. Returning it from nineVals keeps the two views from drifting apart.
      guard: guard,
      // Route-specific breadcrumb. Routes with no recorded chain render no nav and emit no BreadcrumbList.
      showBreadcrumb: !!(R.breadcrumb && R.breadcrumb.length),
      crumbs: (R.breadcrumb || []).slice(0, -1).map(c => ({ url: A + c.path, label: c.label })),
      crumbLast: (R.breadcrumb && R.breadcrumb.length) ? R.breadcrumb[R.breadcrumb.length - 1].label : '',
      notFound: false, found: true, requestedRoute: '', validRoutes: []
    };
  }

  // A requested route that does not exist gets a real, visible state naming what was asked for and what
  // exists. Returning only nulls made the page paint nothing at all — a silent blank is no better than
  // silently rendering an unrelated record.
  // The not-found state is a rendered visitor-facing page, so it gets a governed head of its own: a real
  // title, the English runtime locale, and noindex — it is not a source route and must never be indexed.
  // Without this the miss path shipped no <title> and no lang at all (WCAG 2.4.2 and 3.1.1, both Level A).
  function applyNotFoundHead(requested) {
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
    const D = window.AHV_CAMPAIGN_NINE || { routes: [] };
    return Object.assign(emptyVals(), {
      notFound: true, found: false,
      showBreadcrumb: false, crumbs: [], crumbLast: '',
      requestedRoute: requested || '(none given)',
      validRoutes: D.routes.map(r => r.path)
    });
  }

  const emptyVals = () => ({ route: null, title: '', path: '', h1El: null, bodyEl: null, formEl: null,
    hasForm: false, canonical: '', robots: '', indexable: '', layoutFit: '', headingDecision: '',
    flags: [], imageCount: '0', blockCount: '0', notFound: false, found: false, requestedRoute: '', validRoutes: [],
    showBreadcrumb: false, crumbs: [], crumbLast: '', guard: () => {} /* preview-only nav guard neutralised for the published site */ });

  // A source embed, never mounted: no provider frame, no provider request. The visitor sees a plain label
  // and a real (inert) link to the source destination. The technical accounting — provider, pointer,
  // "not loaded in this prototype" — lives only in the QA harness, never in a visitor view.
  function inertEmbedEl(b, key) {
    const R = React.createElement;
    const still = b.still;
    const isMap = b.provider === 'google-maps';
    // The source title on video embeds is the provider's own generic player label; show a plain word instead.
    const srcTitle = /youtube video player/i.test(b.title || '') ? null : b.title;
    const label = (still && still.label) || srcTitle || (isMap ? 'Location' : 'Video');
    const linkText = isMap ? 'Open the location map' : 'Watch the video';
    return R('figure', { key: key, 'data-source-pointer': b.ptr, 'data-source-embed': b.provider,
        style: { margin: '28px 0', display: 'flex', flexDirection: 'column', minWidth: 0,
          border: '1px solid #E0D7C4', borderRadius: '6px', overflow: 'hidden', background: '#FBF8F1' } },
      still ? R('img', { src: still.src, alt: label, loading: 'lazy',
        style: { display: 'block', width: '100%', height: 'auto' } }) : null,
      R('figcaption', { style: { padding: '16px', fontSize: '17px', lineHeight: 1.6, color: '#2A2118',
          display: 'flex', flexWrap: 'wrap', gap: '6px 14px', alignItems: 'baseline' } },
        R('span', null, label),
        R('a', { href: b.sourceUrl, onClick: undefined, /* preview-only nav guard neutralised for the published site */
          style: { textUnderlineOffset: '2px', minHeight: '44px', display: 'inline-flex', alignItems: 'center' } },
          linkText)));
  }

  window.AHV_CAMPAIGN_NINE_RENDER = { resolveRoute, applyHead, applyNotFoundHead, nineVals, bodyEls, forBreakpoint, formEl, inertEmbedEl, emptyVals, notFoundVals, A };
})();
