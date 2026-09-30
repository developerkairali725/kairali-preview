/* AHV portable preview layer — WOPS-AHV-CLAUDE-CONTINUATION-002, group 14 phase A.
   English only. No approved design byte is changed by this file.

   What it does: injects the accepted preview/english-responsive-override.css into a previewed
   document and sets the marker attribute data-ahv-preview-target="home-mobile" on the document
   root ONLY when the document being previewed is the Home Mobile view.

   Why a layer rather than an edit: the override is a preview-only correction for two demonstrated
   narrow-viewport defects. Baking it into the approved views would change protected source bytes and
   would apply the Home Mobile header correction to views it was never authorised for. Keeping it in a
   layer means the approved views stay byte-identical and the correction travels with the portable
   preview instead.

   Marker discipline: the header rules in the CSS are all scoped to the marker, so they reach the Home
   Mobile document and nothing else. The shared footer newsletter rule is deliberately unscoped, as
   accepted in group 2 — it is shared chrome and the correction holds wherever the footer is imported.

   The CSS applies only at max-width 360px, so 390 and 1024 are untouched.

   Usage, from a preview harness that owns the previewed frame:
     AHV_PREVIEW.attach(frameDocument, 'Home Mobile.dc.html');
   or, when a document wants to opt itself in:
     <script src="preview/portable-preview.js" data-ahv-view="Home Mobile.dc.html"></script>
*/
(function () {
  var CSS_HREF = 'english-responsive-override.css';
  var CSS_SHA256 = 'cab6610571ccded737be6e69b4958aee4ee5d2ee793e3cc77c7e17e627d26410';
  var MARKER = 'data-ahv-preview-target';
  // The marker is granted to this view and no other. Extending this list is a governance decision,
  // not a styling one: each entry authorises the marker-scoped header correction for that document.
  var MARKED_VIEWS = { 'Home Mobile.dc.html': 'home-mobile' };

  // The stylesheet is a SIBLING of this script, so resolve against the script's own URL. Resolving
  // against the harness document produced preview/preview/... and 404'd, which measurement caught
  // because the header correction did not apply.
  var SELF_URL = (function () {
    try { if (document.currentScript && document.currentScript.src) return document.currentScript.src; } catch (e) {}
    return null;
  })();
  function resolveHref(doc, href) {
    try {
      var base = SELF_URL || (doc === document ? document.baseURI : document.baseURI);
      return new URL(href, base).href;
    } catch (e) { return href; }
  }

  function attach(doc, viewName) {
    doc = doc || document;
    if (!doc || !doc.documentElement) return { attached: false, reason: 'no document' };
    var target = MARKED_VIEWS[viewName] || null;
    if (target) doc.documentElement.setAttribute(MARKER, target);
    else doc.documentElement.removeAttribute(MARKER);

    var existing = doc.querySelector('link[data-ahv-preview-layer]');
    if (!existing) {
      var link = doc.createElement('link');
      link.rel = 'stylesheet';
      link.href = resolveHref(doc, CSS_HREF);
      link.setAttribute('data-ahv-preview-layer', '');
      link.setAttribute('data-ahv-preview-sha256', CSS_SHA256);
      doc.head.appendChild(link);
      existing = link;
    }
    return { attached: true, view: viewName || null, marker: target,
      stylesheet: existing.href, sha256: CSS_SHA256 };
  }

  function detach(doc) {
    doc = doc || document;
    var link = doc.querySelector('link[data-ahv-preview-layer]');
    if (link) link.remove();
    doc.documentElement.removeAttribute(MARKER);
    return { attached: false };
  }

  function state(doc) {
    doc = doc || document;
    return { marker: doc.documentElement.getAttribute(MARKER),
      stylesheetPresent: !!doc.querySelector('link[data-ahv-preview-layer]'),
      markedViews: Object.keys(MARKED_VIEWS) };
  }

  window.AHV_PREVIEW = { attach: attach, detach: detach, state: state,
    cssHref: CSS_HREF, cssSha256: CSS_SHA256, markedViews: MARKED_VIEWS };

  // Self-attach when a document opts in by naming itself on the script tag.
  var self = document.currentScript;
  if (self && self.getAttribute('data-ahv-view')) attach(document, self.getAttribute('data-ahv-view'));
})();
