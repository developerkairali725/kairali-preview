/** Keep YouTube links safe in the first server response, before client scripts run. */
export function youtubeNewTabs(html: string): string {
  return html.replace(/<a\b[^>]*>/gi, (tag) => {
    const href = tag.match(/\bhref\s*=\s*(["'])(.*?)\1/i);
    if (!href) return tag;
    let url: URL;
    try { url = new URL(href[2], "https://ayurvedichealingvillage.com"); } catch { return tag; }
    if (!/^https?:$/.test(url.protocol) || !/(^|\.)(youtube\.com|youtu\.be|youtube-nocookie\.com)$/.test(url.hostname)) return tag;
    const rel = tag.match(/\brel\s*=\s*(["'])(.*?)\1/i);
    const tokens = Array.from(new Set((rel?.[2] || "").split(/\s+/).filter(Boolean).concat(["noopener", "noreferrer"])));
    return tag.replace(/\s+(target|rel)\s*=\s*(["']).*?\2/gi, "").replace(/>$/, ` target="_blank" rel="${tokens.join(" ")}">`);
  });
}
