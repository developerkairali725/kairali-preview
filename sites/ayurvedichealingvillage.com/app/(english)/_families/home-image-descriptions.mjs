const descriptions = {
  '/ahv/assets/img/kt-199.webp': 'Two therapists providing an Ayurvedic oil massage at Kairali',
  '/ahv/assets/img/kt-181.webp': 'Ayurvedic herbal poultice treatment at Kairali',
  '/ahv/images/ad83198eacd55a67cab2a6d74e8cf2b2e935634769520511515e605d6c392fae.svg': 'Kairali – The Ayurvedic Healing Village',
};

/** Describe the audited homepage photos and logo; decorative art stays silent. */
export function describeHomeImages(html) {
  return html.replace(/<img\b[^>]*>/gi, tag => {
    if (/\baria-hidden=["']true["']/i.test(tag)) return tag;
    const src = tag.match(/\bsrc=["']([^"']+)["']/i)?.[1];
    const description = descriptions[src];
    if (!description) return tag;
    const alt = tag.match(/\balt=["']([^"']*)["']/i);
    if (alt?.[1].trim() && alt[1].trim() !== "Photo") return tag;
    return alt ? tag.replace(alt[0], `alt="${description}"`) : tag.replace(/<img\b/i, `<img alt="${description}"`);
  });
}
