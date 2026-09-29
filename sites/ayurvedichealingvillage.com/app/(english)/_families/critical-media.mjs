/** Shared first-screen image variants; only phone templates/snapshots use these. */
export function phoneCriticalMedia(html) {
  for (var name of ['wx-hero', 'ktahv-abhyanga-oil-therapy-2025', 'AHV-Enquiry-Garden-Banner']) {
    html = html.split('/ahv/assets/img/' + name + '.webp').join('/ahv/assets/img/' + name + '-768.webp');
  }
  return html;
}
/** Use the existing accessible award title for descriptive rendered link text.
 * No new content or translation: the title already belongs to this exact link.
 */
export function descriptiveAwardLinks(html) {
  html = html.split('aria-label="{{ g.alt }}"').join('aria-label="{{ g.caption }} — {{ g.alt }}"');
  return html.replace(/<a\b([^>]*)>([^<>]+)<[/]a>/gi, function (full, attrs, text) {
    var label = attrs.match(/aria-label="([^"]+)"/i);
    if (!label || label[1].indexOf(text.trim() + ' — ') !== 0) return full;
    var title = label[1].slice(text.trim().length);
    return '<a' + attrs + '>' + text + '<span class="ahv-link-context">' + title + '</span></a>';
  });
}

export function firstCriticalImage(html) {
  var paths = ['wx-hero', 'ktahv-abhyanga-oil-therapy-2025', 'AHV-Enquiry-Garden-Banner'].map(function (name) { return '/ahv/assets/img/' + name + '-768.webp'; });
  return paths.filter(function (path) { return html.indexOf(path) >= 0; }).sort(function (a, b) { return html.indexOf(a) - html.indexOf(b); })[0] || null;
}
