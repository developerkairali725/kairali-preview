#!/usr/bin/env python3
"""Mine a live site: homepage + same-host links (1 level), save HTML + text + URL inventory.
Immutable raw-sources layer (CLAUDE.md doctrine a). Usage: python3 scripts/mine.py <domain>"""
import sys, re, html, urllib.request, urllib.parse, pathlib, csv

domain = sys.argv[1]
base = f"https://{domain}"
out = pathlib.Path(f"content-mined/{domain}")
out.mkdir(parents=True, exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0 (Macintosh) KairaliFactoryMiner/1.0"}

def fetch(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace"), r.geturl()

def slug(url):
    p = urllib.parse.urlparse(url).path.strip("/") or "index"
    return re.sub(r"[^a-zA-Z0-9._-]", "_", p)[:80]

def to_text(h):
    h = re.sub(r"(?is)<(script|style|noscript).*?</\1>", " ", h)
    h = re.sub(r"(?i)<br\s*/?>|</p>|</div>|</h[1-6]>|</li>", "\n", h)
    h = re.sub(r"<[^>]+>", " ", h)
    return re.sub(r"\n\s*\n+", "\n\n", re.sub(r"[ \t]+", " ", html.unescape(h))).strip()

seen, rows = {}, []
try:
    homepage, final = fetch(base)
except Exception as e:
    print(f"FAILED {base}: {e}"); sys.exit(1)
seen[final] = homepage
links = {urllib.parse.urljoin(final, m) for m in re.findall(r'href=["\']([^"\'#]+)', homepage)}
for u in sorted(links):
    pu = urllib.parse.urlparse(u)
    if pu.netloc.replace("www.", "") != domain.replace("www.", "") or pu.scheme not in ("http", "https"):
        continue
    if len(seen) >= 25 or u in seen: continue
    try: seen[u], _ = fetch(u)
    except Exception as e: rows.append([u, f"ERROR {e}"]); continue

for url, body in seen.items():
    s = slug(url)
    (out / f"{s}.html").write_text(body)
    (out / f"{s}.txt").write_text(to_text(body))
    title = re.search(r"(?is)<title[^>]*>(.*?)</title>", body)
    rows.append([url, html.unescape(title.group(1)).strip() if title else ""])

with open(out / "url-inventory.csv", "w") as f:
    w = csv.writer(f); w.writerow(["url", "title_or_error"]); w.writerows(rows)
print(f"{domain}: {len(seen)} pages mined -> {out}")
