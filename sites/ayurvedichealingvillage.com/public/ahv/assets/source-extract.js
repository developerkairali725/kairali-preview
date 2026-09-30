// AHV T04 collection/hub family — shared source-tree extractor for the seven collection datasets.
// Produces exact ordered blocks: headings, paragraphs, text runs, lists, tables, captions, images, embeds.
// Inline runs keep source emphasis and exact link destinations. Nothing is invented, nothing is dropped.
(function () {
  const INLINE = ['a', 'strong', 'b', 'em', 'i', 'span', 'sup', 'sub', 'small', 'code', 'u'];
  const BLOCK = /^(p|h[1-6]|ul|ol|li|table|tr|td|th|figure|figcaption|blockquote|iframe|video)$/;

  const txt = n => !n ? '' : (n.k === 't' ? (n.v || '') : (n.c || []).map(txt).join(''));

  function inl(nodes) {
    const out = [];
    (nodes || []).forEach(n => {
      if (n.k === 't') { if (n.v) out.push({ k: 't', v: n.v }); return; }
      if (n.k === 'img' || n.k !== 'e') return;
      if (n.tag === 'br') { out.push({ k: 'e', tag: 'br' }); return; }
      if (INLINE.includes(n.tag)) {
        const o = { k: 'e', tag: n.tag };
        // An anchor with no href is recorded with href:null — it is a source anchor without a destination and
        // must not be given one.
        if (n.tag === 'a') o.attrs = { href: (n.attrs && n.attrs.href !== undefined) ? n.attrs.href : null,
          target: (n.attrs && n.attrs.target) || null };
        o.c = inl(n.c); out.push(o); return;
      }
      // A non-inline, non-block wrapper contributes its own inline content in place.
      out.push(...inl(n.c));
    });
    return out;
  }

  const hasBlock = n => { let f = false; (function w(x) { if (f || !x || x.k !== 'e') return;
    if (BLOCK.test((x.tag || '').toLowerCase())) { f = true; return; } (x.c || []).forEach(w); })(n); return f; };
  // A source image is either a frozen img node or an external-image embed recovered to a local file.
  const isImg = x => !!x && (x.k === 'img' || (x.k === 'embed' && x.kind === 'external-image'));
  const hasImg = n => { let f = false; (function w(x) { if (f || !x) return;
    if (isImg(x)) { f = true; return; } (x.c || []).forEach(w); })(n); return f; };
  const imgAlt = x => x.k === 'embed' ? (x.title || '') : (x.alt || '');
  const imgUrl = x => x.k === 'embed' ? x.src : x.absolute;

  function extract(node, base, imgMap, account) {
    const out = [];
    // An anchor with no text and no image is an unlabelled link target. It is not rendered, and it is recorded
    // with its exact pointer and destination so nothing is silently omitted.
    const dropEmptyAnchors = (nodes, base2) => (nodes || []).reduce((acc, x, i) => {
      const q = base2 + '/c/' + i;
      if (x.k === 'e' && x.tag === 'a' && !txt(x).trim() && !hasImg(x)) {
        if (account) account.push({ ptr: q, href: (x.attrs && x.attrs.href) || null,
          reason: 'Source anchor with no text and no image — an unlabelled duplicate of the labelled anchor beside it. Not rendered; its exact destination is recorded here.' });
        return acc; }
      if (x.k === 'e' && x.c) { acc.push(Object.assign({}, x, { c: dropEmptyAnchors(x.c, q) })); return acc; }
      acc.push(x); return acc;
    }, []);
    // linkCtx carries the destination of an enclosing anchor, so a linked image keeps its exact source
    // destination instead of losing it when the anchor wrapper is unwrapped.
    // A source list item may hold inline content AND nested lists. Building lists recursively keeps the real
    // ul/ol/li hierarchy: an item's own inline lead is separated from its child lists, which are built the same
    // way to any depth. Nesting is never faked with text or CSS.
    function buildList(n, p) {
      const items = [];
      (n.c || []).forEach((li, i) => {
        if (li.k !== 'e' || li.tag !== 'li') return;
        const q = p + '/c/' + i;
        const lead = [], kids = [];
        (li.c || []).forEach((c, j) => {
          const cq = q + '/c/' + j;
          if (c.k === 'e' && (c.tag === 'ul' || c.tag === 'ol')) { kids.push(buildList(c, cq)); return; }
          lead.push(c);
        });
        const imgs = [];
        (function iw(x, xq, link) {
          if (!x) return;
          if (isImg(x)) { const m = imgMap[xq];
            imgs.push({ ptr: xq, src: m ? m.src : null, alt: imgAlt(x),
              width: m ? m.width : x.width, height: m ? m.height : x.height,
              sourceUrl: imgUrl(x), external: x.k === 'embed' || !!(m && m.external),
              recordedOriginalSha256: m ? m.sha : null,
              linkHref: link ? link.href : null, linkPtr: link ? link.ptr : null });
            return; }
          if (x.k !== 'e' || x.tag === 'ul' || x.tag === 'ol') return;
          const nx = (x.tag === 'a' && hasImg(x))
            ? { href: (x.attrs || {}).href === undefined ? null : (x.attrs || {}).href, ptr: xq } : link;
          (x.c || []).forEach((c, k) => iw(c, xq + '/c/' + k, nx));
        })({ k: 'e', tag: 'span', c: lead }, q, null);
        const leadTxt = lead.map(txt).join('').trim();
        // An item's own text excludes its nested lists — those carry their own item text.
        const prune = (nodes) => (nodes || []).reduce((acc, x) => {
          if (x.k === 'e' && x.tag === 'a' && !txt(x).trim()) return acc;
          if (x.k === 'e' && x.c) { acc.push(Object.assign({}, x, { c: prune(x.c) })); return acc; }
          acc.push(x); return acc;
        }, []);
        if (leadTxt || imgs.length || kids.length)
          items.push({ ptr: q, tree: prune(dropEmptyAnchors(inl(lead), q)), text: leadTxt,
            images: imgs, children: kids });
      });
      return { kind: 'list', ordered: (n.tag || '').toLowerCase() === 'ol', ptr: p, items,
        sourceClass: (n.attrs || {}).class || null };
    }
    let walkRef;
    walkRef = (function walk(n, p, linkCtx) {
      if (!n || n.k !== 'e') return;
      const t = (n.tag || '').toLowerCase();
      const cls = (n.attrs || {}).class || null;
      if (/^h[1-6]$/.test(t)) { const s = txt(n).trim();
        if (s) out.push({ kind: 'heading', tag: t, ptr: p, tree: dropEmptyAnchors(inl(n.c), p), text: s, sourceClass: cls }); return; }
      if (t === 'p' || t === 'blockquote') {
        const s = txt(n).trim();
        if (s) out.push({ kind: 'para', ptr: p, tree: dropEmptyAnchors(inl(n.c), p), text: s, sourceClass: cls });
        // A source paragraph can carry its own illustration. Emitting the paragraph text alone would drop that
        // placement, so any images inside are emitted after it, in source order, with any wrapping anchor kept.
        if (hasImg(n)) (function pw(x, q, link) {
          if (!x) return;
          if (isImg(x)) { const m = imgMap[q];
            out.push({ kind: 'image', ptr: q, src: m ? m.src : null, alt: imgAlt(x),
              width: m ? m.width : x.width, height: m ? m.height : x.height,
              sourceUrl: imgUrl(x), external: x.k === 'embed' || !!(m && m.external),
              recordedOriginalSha256: m ? m.sha : null,
              sourceClass: x.className || null, sourceStyle: x.style || null,
              inParagraph: p, linkHref: link ? link.href : null, linkPtr: link ? link.ptr : null });
            return; }
          if (x.k !== 'e') return;
          const nx = (x.tag === 'a' && hasImg(x))
            ? { href: (x.attrs || {}).href === undefined ? null : (x.attrs || {}).href, ptr: q } : link;
          (x.c || []).forEach((c, i) => pw(c, q + '/c/' + i, nx));
        })(n, p, null);
        return; }
      if (t === 'figcaption') { const s = txt(n).trim();
        if (s) out.push({ kind: 'caption', ptr: p, tree: dropEmptyAnchors(inl(n.c), p), text: s, sourceClass: cls }); return; }
      if (t === 'ul' || t === 'ol') { out.push(buildList(n, p)); return; }
      if (t === 'table') {
        const rows = [];
        (function tw(x, q) { if (!x || x.k !== 'e') return;
          if (x.tag === 'tr') { const cells = [];
            (x.c || []).forEach((c, i) => { if (c.k === 'e' && /^t[dh]$/.test(c.tag)) {
              const a = c.attrs || {};
              // Source rowspan/colspan are structural: dropping them collapses the header relationships the
              // source defines. They are carried verbatim (an absent attribute stays absent, not 1).
              const rs = a.rowspan != null ? Number(a.rowspan) : (a.rowSpan != null ? Number(a.rowSpan) : null);
              const cs = a.colspan != null ? Number(a.colspan) : (a.colSpan != null ? Number(a.colSpan) : null);
              cells.push({ tag: c.tag, ptr: q + '/c/' + i, text: txt(c).trim(),
                rowSpan: rs, colSpan: cs, sourceClass: a.class || null,
                tree: dropEmptyAnchors(inl(c.c), q + '/c/' + i) }); } });
            if (cells.length) rows.push({ ptr: q, cells }); return; }
          (x.c || []).forEach((c, i) => tw(c, q + '/c/' + i)); })(n, p);
        if (rows.length) out.push({ kind: 'table', ptr: p, rows, sourceClass: cls }); return;
      }
      if (t === 'iframe') { out.push({ kind: 'embedSlot', ptr: p, src: (n.attrs || {}).src || null,
        title: (n.attrs || {}).title || null }); return; }
      // An anchor wrapping an image: keep its destination and descend, so the image is a real link.
      if (t === 'a' && hasImg(n)) {
        const href = (n.attrs || {}).href;
        (n.c || []).forEach((c, i) => walk2(c, p + '/c/' + i, { href: href === undefined ? null : href, ptr: p }));
        return;
      }
      if (t === 'video') { out.push({ kind: 'videoSlot', ptr: p, src: (n.attrs || {}).src || null }); return; }
      // No block-level descendant and no image: this whole node is ONE run of text. Emitting it once keeps loose
      // text siblings together with their <b>/<span> neighbours instead of dropping them or splitting the run.
      if (!hasBlock(n) && !hasImg(n)) { const s = txt(n).trim();
        if (s) out.push({ kind: 'line', ptr: p, tree: dropEmptyAnchors(INLINE.includes(t) ? inl([n]) : inl(n.c), p), text: s, sourceClass: cls });
        return; }
      (n.c || []).forEach((c, i) => walk2(c, p + '/c/' + i, linkCtx));
      return;
    });
    walkRef(node, base, null);
    // Final sweep: an empty anchor can sit in a subtree that a block branch consumed whole (a plugin image-link
    // overlay, for example), so it would never pass through the inline path. Sweeping the original tree
    // guarantees every source anchor is either rendered or recorded — never silently omitted.
    if (account) (function sweep(n, p) {
      if (!n || n.k !== 'e') return;
      if (n.tag === 'a' && !txt(n).trim() && !hasImg(n) && !account.some(a => a.ptr === p)) {
        account.push({ ptr: p, href: (n.attrs && n.attrs.href) || null,
          sourceClass: (n.attrs && n.attrs.class) || null,
          reason: 'Source anchor with no text and no image — an unlabelled overlay or duplicate link target. Not rendered; its exact destination is recorded here.' });
        return; }
      (n.c || []).forEach((c, i) => sweep(c, p + '/c/' + i));
    })(node, base);
    function walk2(c, q, linkCtx) {
      // A bare text node that is a DIRECT child of a wrapper div, sitting alongside element or image
      // siblings. The wrapper takes the child-walk branch (it has block/image children), so this text had
      // no block branch of its own and was silently dropped — e.g. the "feature-box" captions
      // ("Living with nature", "No Preservatives") on the cleansing and wellness routes. Emitted here as a
      // `line` in source order, the kind the shared reader already renders.
      if (c && c.k === 't') {
        const s = txt(c).trim();
        if (s) out.push({ kind: 'line', ptr: q, tree: inl([c]), text: s, sourceClass: null,
          directTextChild: true });
        return;
      }
      if (isImg(c)) {        const m = imgMap[q];
        out.push({ kind: 'image', ptr: q, src: m ? m.src : null, alt: imgAlt(c),
          width: m ? m.width : c.width, height: m ? m.height : c.height,
          sourceUrl: imgUrl(c), external: c.k === 'embed' || !!(m && m.external),
          recordedOriginalSha256: m ? m.sha : null,
          sourceClass: c.className || null, sourceStyle: c.style || null,
          linkHref: linkCtx ? linkCtx.href : null, linkPtr: linkCtx ? linkCtx.ptr : null });
        return;
      }
      walkRef(c, q, linkCtx);
    }
    return out;
  }

  window.AHV_SOURCE_EXTRACT = { extract, inl, txt };
})();
