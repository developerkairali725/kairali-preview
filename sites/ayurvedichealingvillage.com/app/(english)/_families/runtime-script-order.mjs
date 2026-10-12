/** Dependencies used during a view's state initialization must execute before
 * the design runtime compiles that view. Next beforeInteractive can still be
 * pending while the independent inline bootstrap mounts the design runtime.
 */
export function orderedRuntimeScripts(view, cfg, hasLeadReceipt) {
  const entries = [{ src: cfg.previewSrc, view: view.file || '' }];
  // The confirmation renderer consumes the one-use receipt inside the view's first render.
  const needsLeadReceipt = (view.logic || '').includes('window.AHV_LEAD_RECEIPT')
    || (view.template || '').includes('name="AHV Programme Enquiry"')
    || (view.scripts || []).some((src) => src.endsWith('/confirmation-family-render.js'));
  if (needsLeadReceipt && !hasLeadReceipt) {
    entries.push({ src: '/design/lead-receipt.js' });
  }
  // Monsoon belongs to the article family. Its guarded shared reader does not use the other families.
  const scripts = cfg.path === '/karkidaka-chikitsha-or-monsoon-wellness.html'
    ? (view.scripts || []).filter(src => !/\/(?:article|travel|collection|commercial|reader25a|reader25b|story|training7|reader6c|hist9|utility7|exception-five|lakshya-recovered)-family-(?:data|render)\.js$/.test(src) && !/\/seven-informational-(?:data|render)\.js$/.test(src) || /\/article-family-(?:data|render)\.js$/.test(src))
    : view.scripts || [];
  for (const src of scripts) entries.push({ src });
  entries.push({ src: cfg.supportSrc });
  return entries;
}
