// Renders sanitised source HTML (produced by pipeline/build_content.py from the live capture).
// Server-side transforms: tables get a scroll wrapper; YouTube and map embeds become click-to-load
// facades so no third-party frame loads until the visitor asks for it.

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

import { documentLinkHtml } from "@/lib/document-links";
import fs from "node:fs";
import path from "node:path";
let VS: Record<string, { ok: boolean; title?: string }> | null = null;
function videoStatus() {
  if (!VS) VS = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "videos-status.json"), "utf8")).videos;
  return VS!;
}

export function transformHtml(html: string): string {
  return documentLinkHtml(html)
    .replace(/<table>/g, '<div class="table-scroll"><table>').replace(/<\/table>/g, "</table></div>")
    .replace(/<div data-yt="([A-Za-z0-9_-]{11})" data-title="([^"]*)"><\/div>/g, (_m, id: string, title: string) => {
      const v = videoStatus()[id];
      if (v && !v.ok) return `<p class="notice">This film (YouTube ${id}) is currently unavailable on YouTube.</p>`;
      return videoFacade(id, v?.title || title);
    })
    .replace(/<div data-map="([^"]+)"><\/div>/g, (_m, src: string) =>
      `<div class="map-frame" data-map-src="${src}"><button type="button" class="btn secondary" data-load-map style="margin:24px">Show map (loads Google Maps)</button></div>`);
}

export function videoFacade(id: string, title: string): string {
  const t = title || "Kairali video";
  return `<div class="video" data-yt-id="${id}"><img class="poster" src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" width="480" height="360" loading="lazy" decoding="async" referrerpolicy="no-referrer"><button type="button" data-yt-play aria-label="Play video: ${esc(t)} (loads YouTube)"><span class="play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg></span></button><span class="vlabel">${esc(t)}</span></div>`;
}

export default function Prose({ html, className = "", id }: { html: string; className?: string; id?: string }) {
  return <div id={id} className={`prose ${className}`} dangerouslySetInnerHTML={{ __html: transformHtml(html) }} />;
}
