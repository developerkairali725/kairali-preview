#!/usr/bin/env python3
"""Route table consumed by site/proxy.ts (legacy query routes, case-insensitive canonical paths, documents)."""
import base64, json, os
from urllib.parse import unquote
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
C = os.path.join(REPO, "site", "content")
pages = json.load(open(os.path.join(C, "pages.json")))
docs = [d["path"] for d in json.load(open(os.path.join(C, "legacy-docs.json")))]
plain = sorted([r for r in pages if "?" not in r] + ["/search-results.aspx"])
awards = {}
for r in pages:
    if r.startswith("/detail.aspx?page="):
        v = unquote(r[len("/detail.aspx?page="):])
        awards[v] = base64.urlsafe_b64encode(v.encode()).decode().rstrip("=")
table = {
    "plain": {p.lower(): p for p in plain},
    "docs": {d.lower(): d for d in docs},
    "awards": awards,
    "apply": sorted(r.split("=")[1] for r in pages if r.startswith("/apply-now.aspx?id=")),
    "blog": sorted(r.split("=")[1] for r in pages if r.startswith("/kairali-blog.aspx?page=")),
    "redirects": {"/default.aspx": "/", "/namastedwaar-mansurpur-muzaffarnagar-up-india.aspx": "/our-partner-resorts.aspx"},
}
json.dump(table, open(os.path.join(C, "route-table.json"), "w"), ensure_ascii=False)
print(len(table["plain"]), "plain", len(awards), "awards", table["apply"], table["blog"], len(docs), "docs")
