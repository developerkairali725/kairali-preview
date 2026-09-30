// AHV T07 enquiry/application family — shared prototype helpers. No network, no submit, no tracking, no persistence.
(function () {
  const A = 'https://ayurvedichealingvillage.com';
  const DEFAULT_ROUTE = '/contact-us/';
  function resolveRoute(propRoute) {
    let q = null; try { q = new URLSearchParams(location.search).get('route'); } catch (e) {}
    const want = q || propRoute || DEFAULT_ROUTE; const D = window.AHV_ENQUIRY || { routes: [] };
    return D.routes.find(r => r.path === want || r.slug === want) || D.routes.find(r => r.path === DEFAULT_ROUTE) || null;
  }
  // Inline tree → React. Internal links become governed absolute URLs and are default-prevented; tel:/mailto:/external kept but prevented too (prototype: no external actions).
  function inline(tree, key, guard) {
    return (tree || []).map((n, i) => {
      if (n.k === 't') return n.v;
      const k = key + '-' + i;
      if (n.tag === 'br') return React.createElement('br', { key: k });
      if (n.encodedEmail) return React.createElement('span', { key: k, 'data-encoded-email': 'true', style: { fontStyle: 'italic', color: '#75695A' }, title: 'Source e-mail is Cloudflare-encoded; recovery not authorised in this packet' }, ...inline(n.c, k, guard));
      if (n.tag === 'a') { const h = n.attrs.href || ''; const props = { key: k, href: h.startsWith('/') ? A + h : h, onClick: guard, style: { color: '#006038', textDecoration: 'underline', textUnderlineOffset: '3px', fontWeight: 600 } }; if (n.recovered) props['data-recovered-email'] = 'true'; if (/^https?:/.test(h) && !h.startsWith(A)) props.rel = 'noopener'; return React.createElement('a', props, /^(mailto:|tel:|https:\/\/(wa\.me|ig\.me|m\.me)\/)/.test(h) ? channelIcon(h) : null, ...inline(n.c, k, guard)); }
      const st = n.tag === 'strong' || n.tag === 'b' ? { fontWeight: 700 } : (n.tag === 'em' || n.tag === 'i') ? { fontStyle: 'italic' } : undefined;
      return React.createElement(n.tag === 'b' ? 'strong' : n.tag === 'i' ? 'em' : n.tag, { key: k, style: st }, ...inline(n.c, k, guard));
    });
  }
  const treeText = tree => (tree || []).map(n => n.k === 't' ? n.v : n.tag === 'br' ? '\n' : treeText(n.c)).join('');
  // Captured source validation rules (FLOW-CONTRACT) — client-side checks only, not a delivery guarantee.
  const V = {
    name: v => (v || '').trim().length >= 2, phone: v => (v || '').replace(/\D/g, '').length >= 7,
    email: v => /^\S+@\S+\.\S+$/.test((v || '').trim()), country: v => (v || '').trim().length >= 2, concern: v => (v || '').trim().length >= 3, consent: v => v === true
  };
  function waDraft(R, s) {
    const map = { name: s.fName, code: s.fCode, phone: s.fPhone, email: s.fEmail, country: s.fCountry, concern: s.fConcern, duration: s.duration || '-', who: s.who || '-', lang: s.lang || '-', time: s.time || '-', date: new Date().toISOString().slice(0, 10) };
    const text = R.flow.waTemplate.map(l => l.replace(/\{(\w+)\}/g, (_, k) => map[k] ?? '')).join('\n');
    return 'https://wa.me/' + R.flow.waNumber + '?text=' + encodeURIComponent(text);
  }
  function channelIcon(href) {
    const h = href || '';
    let path = 'M14 3h7v7m0-7L10 14M10 3H3v18h18v-7';
    if (h.startsWith('mailto:')) path = 'M3 5h18v14H3zM3 5l9 7 9-7';
    else if (h.startsWith('tel:')) path = 'M5 3h4l2 5-3 2a14 14 0 0 0 6 6l2-3 5 2v4c0 2-3 3-5 2C9 19 5 15 3 8c-1-2 0-5 2-5z';
    else if (h.includes('wa.me')) path = 'M21 11a9 9 0 0 1-13 8l-5 2 2-5A9 9 0 1 1 21 11zM8 7c0 5 4 9 8 9l1-3-3-1-1 2-3-3 2-1-1-3z';
    else if (h.includes('ig.me')) path = 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0M17 7h.01';
    else if (h.includes('m.me') || h === '#chat') path = 'M21 11c0 5-4 8-9 8H8l-5 3 1-6a8 8 0 0 1-1-5c0-5 4-8 9-8s9 3 9 8zM7 13l4-4 3 3 3-3';
    else if (h.includes('bookings.')) path = 'M3 5h18v16H3zM7 3v4m10-4v4M3 10h18M7 14h3m4 0h3';
    else if (h.includes('#message') || h.includes('consultation')) path = 'M5 3h14v18H5zM8 8h8M8 12h8M8 16h5';
    return React.createElement('svg', {width:22,height:22,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.7,strokeLinecap:'round',strokeLinejoin:'round','aria-hidden':'true',focusable:'false',style:{flexShrink:0,verticalAlign:'middle',marginRight:8}}, React.createElement('path',{d:path}));
  }
  function homeEnquiryDraft() {
    if (!location.hash.startsWith('#message?')) return null;
    const draft = new URLSearchParams(location.hash.slice(9)).get('draft');
    return draft ? draft.slice(0, 1000) : null;
  }
  function focusEnquiry(n) {
    const section = Array.from(document.querySelectorAll('#message')).find(el => el.getBoundingClientRect().height > 0);
    const input = section && section.querySelector('input[name="fname"]');
    if (input) { section.style.scrollMarginTop = '90px'; input.focus({ preventScroll: true }); section.scrollIntoView({ block: 'start' }); return; }
    if ((n || 0) < 30) setTimeout(() => focusEnquiry((n || 0) + 1), 50);
  }
  function applyHead(R) {
    const d = document, H = d.head, M = R.metadata;
    [...H.querySelectorAll('[data-ahv-head]')].forEach(n => n.remove());
    const add = (tag, attrs) => { const el = d.createElement(tag); Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v)); el.setAttribute('data-ahv-head', ''); H.appendChild(el); return el; };
    d.title = M.title; d.documentElement.lang = M.htmlLang || 'en-US';
    if (M.description) add('meta', { name: 'description', content: M.description });
    if (M.canonical) add('link', { rel: 'canonical', href: M.canonical });
    add('meta', { name: 'robots', content: M.robots });
    const og = M.og; add('meta', { property: 'og:locale', content: og.locale }); add('meta', { property: 'og:type', content: og.type }); add('meta', { property: 'og:title', content: og.title }); add('meta', { property: 'og:description', content: og.description }); add('meta', { property: 'og:url', content: og.url }); add('meta', { property: 'og:site_name', content: og.siteName });
    if (og.image) { add('meta', { property: 'og:image', content: og.image.url }); add('meta', { property: 'og:image:width', content: og.image.width }); add('meta', { property: 'og:image:height', content: og.image.height }); add('meta', { property: 'og:image:type', content: og.image.type }); }
    add('meta', { name: 'twitter:card', content: M.twitter.card });
    // Governed BreadcrumbList, emitted exactly as the route rules specify (utility routes carry none).
    if (R.breadcrumbSchemaExpected) { const bc = add('script', { type: 'application/ld+json' }); bc.textContent = JSON.stringify(R.breadcrumbSchemaExpected); }
    const s = add('script', { type: 'application/ld+json' });
    s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': [{ '@type': 'WebPage', '@id': A + R.path, url: A + R.path, name: M.title, description: M.description, isPartOf: { '@id': A + '/#website' }, inLanguage: 'en-US' }, { '@type': 'WebSite', '@id': A + '/#website', url: A + '/', name: 'Ayurvedic Healing Village', inLanguage: 'en-US' }] });
  }
  // Legacy T04 rows (/contact-us-old/, /enquiry-form-old/) — exact captured field definitions rendered as
  // reviewable controls. Requiredness comes from the CF7 validates-as-required class / captured aria-required,
  // never from the absent HTML required attribute. Hidden names render empty; no values are ever copied.
  function legacyFields(form, prefix, selects, guards) {
    const tbl = { country: selects.country, nationality: selects.nationality, statePlaceholder: selects.statePlaceholder, cityPlaceholder: selects.cityPlaceholder };
    return (form.fields || []).map((f, i) => {
      const id = prefix + '-' + (f.name ? String(f.name).replace(/[^a-z0-9]+/gi, '-').replace(/-+$/, '') : 'submit') + '-' + i;
      const o = {
        id: id, name: f.name || null, label: f.label || '', star: !!f.star,
        placeholder: f.placeholder || '',
        // Requiredness is the union of the captured HTML required attribute, the CF7 validates-as-required class
        // and captured aria-required — never one source alone.
        ariaRequired: (f.validatesAsRequired || f.htmlRequired) ? 'true' : 'false', htmlRequired: !!f.htmlRequired,
        sourceClass: f.sourceClass || '', pointer: f.pointer || (f.pointers || [])[0] || '',
        isText: false, isTextarea: false, isSelect: false, isRadio: false, isCheckbox: false, isFile: false, isSubmit: false,
        options: [], rows: f.rows || 3, disabled: !!f.disabled, note: '', type: f.type || 'text',
        min: f.min == null ? null : f.min, max: f.max == null ? null : f.max, maxLength: f.maxLength || null,
        accept: f.accept || null, describedBy: f.describedBy || null,
        // Captured source autocomplete tokens are preserved as definitions; their suitability is an implementation gate.
        autocomplete: f.autocomplete || null
      };
      if (f.group === 'radio' || f.group === 'checkbox') {
        o[f.group === 'radio' ? 'isRadio' : 'isCheckbox'] = true;
        // Values are the captured source values; three functional-history values use a hyphen where the
        // visible label keeps the source en dash.
        o.options = f.options.map((op, k) => ({ id: id + '-' + k, value: op.value, label: op.label, checked: !!op.checked }));
        return o;
      }
      if (f.control === 'select') {
        o.isSelect = true;
        // Option VALUES come from the captured source (independent oracle), never derived from the label:
        // country/state/city placeholders are value "0", the nationality placeholder is "" and disabled,
        // and 192 nationality values are lowercase source slugs.
        // Options come either from a shared captured table (legacy country/nationality/state/city) or, for
        // routes whose own capture carries them inline, from the route's own captured option list.
        const list = f.optionTable ? (tbl[f.optionTable] || []) : (f.options || []);
        o.options = list.map(op => ({ value: op.value, label: op.label, disabled: !!op.disabled }));
        if (f.disabled) o.note = guards.dependent;
        return o;
      }
      if (f.control === 'textarea') { o.isTextarea = true; return o; }
      if (f.type === 'file') { o.isFile = true; o.accept = f.accept || null; o.note = guards.upload; return o; }
      if (f.type === 'submit') { o.isSubmit = true; return o; }
      o.isText = true;
      return o;
    });
  }
  // Rich own-source body blocks: exact source order, source tags, inline links and images. Images are React
  // nodes, never a raw interpolated src.
  function sourceBlocks(list, guard) {
    const T = { fontSize: '17.5px', lineHeight: 1.75, textWrap: 'pretty' };
    return (list || []).map((b, i) => {
      const k = 'sb-' + i;
      if (b.kind === 'heading') return React.createElement(b.tag, { key: k, 'data-source-pointer': b.ptr, 'data-source-tag': b.sourceTag || undefined,
        style: { fontFamily: "'Marcellus',serif", fontWeight: 400, lineHeight: 1.25, margin: '22px 0 8px',
          fontSize: b.tag === 'h2' ? 'clamp(24px,2.4vw,31px)' : b.tag === 'h3' ? '23px' : '19px' } }, ...inline(b.tree, k, guard));
      if (b.kind === 'para') return React.createElement('p', { key: k, 'data-source-pointer': b.ptr, style: Object.assign({ margin: '0 0 14px', maxWidth: '78ch' }, T) }, ...inline(b.tree, k, guard));
      if (b.kind === 'line') return React.createElement('p', { key: k, 'data-source-pointer': b.ptr, 'data-source-line': 'true', style: Object.assign({ margin: '0 0 10px', maxWidth: '78ch' }, T) }, ...inline(b.tree, k, guard));
      if (b.kind === 'list') return React.createElement(b.ordered ? 'ol' : 'ul', { key: k, 'data-source-pointer': b.ptr,
        style: { margin: '0 0 16px', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '78ch' } },
        ...b.items.map((it, j) => React.createElement('li', { key: k + '-' + j, 'data-source-pointer': it.ptr, style: T }, ...inline(it.tree, k + '-' + j, guard))));
      if (b.kind === 'table') return React.createElement('div', { key: k, role: 'region', tabIndex: 0, 'aria-label': 'Source table',
          style: { margin: '0 0 18px', overflowX: 'auto', border: '1px solid #E0D7C4', borderRadius: '4px', outlineOffset: '2px' } },
        React.createElement('table', { 'data-source-pointer': b.ptr, style: { borderCollapse: 'collapse', width: '100%', background: '#fff' } },
          React.createElement('tbody', null, ...b.rows.map((row, ri) => React.createElement('tr', { key: k + '-r' + ri, 'data-source-pointer': row.ptr },
            ...row.cells.map((c, ci) => React.createElement(c.tag === 'th' ? 'th' : 'td', { key: ci, 'data-source-pointer': c.ptr, scope: c.tag === 'th' ? 'col' : undefined,
              style: { border: '1px solid #D8CFBD', padding: '10px 12px', fontSize: '16.5px', lineHeight: 1.55, textAlign: 'left', verticalAlign: 'top',
                background: c.tag === 'th' ? '#EFE9DA' : '#fff', fontWeight: c.tag === 'th' ? 700 : 400 } }, ...inline(c.tree, k + '-r' + ri + '-' + ci, guard))))))));
      if (b.kind === 'image') return React.createElement('img', { key: k, src: b.src, alt: b.alt || '', loading: 'lazy', 'data-source-pointer': b.ptr,
        style: { display: 'block', width: '100%', maxWidth: '320px', height: 'auto', borderRadius: '4px', margin: '0 0 14px' } });
      return null;
    });
  }
  window.AHV_ENQUIRY_RENDER = { channelIcon, homeEnquiryDraft, focusEnquiry, sourceBlocks, resolveRoute, inline, treeText, V, waDraft, applyHead, legacyFields, A, DEFAULT_ROUTE };
})();
