// Classify a link by what it IS, keeping the full URL: an internal page (staging origin or the production
// host), the separate bookings subdomain, the XML sitemap, a static asset/download, an action (tel/mailto/WhatsApp/
// javascript), a same-page anchor, or an external site. Used by the locale-persistence and footer checks.
const PROD_HOSTS = new Set(["ayurvedichealingvillage.com", "www.ayurvedichealingvillage.com"]);
export function classifyHref(href, pageUrl, stagingOrigin) {
  const raw = String(href || "").trim();
  if (!raw) return { kind: "empty", url: raw };
  if (/^(tel|mailto|sms|javascript):/i.test(raw)) return { kind: "action", url: raw };
  let u; try { u = new URL(raw, pageUrl); } catch { return { kind: "invalid", url: raw }; }
  const page = new URL(pageUrl);
  if (/^(wa\.me|api\.whatsapp\.com)$/i.test(u.hostname)) return { kind: "action", url: u.href };
  if (/^bookings\.ayurvedichealingvillage\.com$/i.test(u.hostname)) return { kind: "bookings", url: u.href };
  const internal = u.origin === stagingOrigin || u.origin === page.origin || PROD_HOSTS.has(u.hostname);
  if (!internal) return { kind: "external", url: u.href };
  if (raw.startsWith("#") || (u.pathname === page.pathname && u.hash && u.search === page.search)) return { kind: "same-page", url: u.href };
  if (/\.xml$/i.test(u.pathname)) return { kind: "sitemap-xml", url: u.href };
  if (/^\/(documents|ahv|_next|images|wp-content|design)\//.test(u.pathname) || /\.(pdf|jpe?g|png|webp|svg|mp4|zip|docx?)$/i.test(u.pathname)) return { kind: "asset", url: u.href };
  return { kind: "internal-page", url: u.href, path: u.pathname };
}
