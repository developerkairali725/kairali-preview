/** Selected image variants; only phone templates/snapshots use these. */
export function phoneCriticalMedia(html) {
  for (var name of ['ktahv-abhyanga-oil-therapy-2025', 'AHV-Enquiry-Garden-Banner', 'wx-welcome', 'kt-317', 'wx-yogahall', 'kt-106']) {
    html = html.split('/ahv/assets/img/' + name + '.webp').join('/ahv/assets/img/' + name + '-768.webp');
  }
  return html.split('/ahv/assets/img/wx-hero.webp').join('/ahv/assets/img/wx-hero-544.webp')
    .split('/ahv/assets/img/ktahv-abhyanga-oil-therapy-2025-768.webp').join('/ahv/assets/img/ktahv-abhyanga-oil-therapy-2025-544.webp');
}
/** Use the existing accessible award title for descriptive rendered link text.
 * No new content or translation: the title already belongs to this exact link.
 */
export function descriptiveAwardLinks(html) {
  html = html.split('aria-label="{{ g.alt }}"').join('aria-label="{{ g.caption }}" aria-description="{{ g.alt }}"');
  return html.replace(/<a\b([^>]*)>([^<>]+)<[/]a>/gi, function (full, attrs, text) {
    var label = attrs.match(/aria-label="([^"]+)"/i);
    if (!label || label[1].indexOf(text.trim() + ' — ') !== 0) return full;
    var title = label[1].slice(text.trim().length);
    return '<a' + attrs + '>' + text + '<span class="ahv-link-context">' + title + '</span></a>';
  });
}

export function firstCriticalImage(html) {
  var paths = ['/ahv/assets/img/wx-hero-544.webp', '/ahv/assets/img/ktahv-abhyanga-oil-therapy-2025-544.webp', '/ahv/assets/img/AHV-Enquiry-Garden-Banner-768.webp'];
  return paths.filter(function (path) { return html.indexOf(path) >= 0; }).sort(function (a, b) { return html.indexOf(a) - html.indexOf(b); })[0] || null;
}
