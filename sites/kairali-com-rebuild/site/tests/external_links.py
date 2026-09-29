#!/usr/bin/env python3
"""Checks every off-site link rendered on the local preview (GET, 4 parallel, 20s timeout). Report only."""
import concurrent.futures as cf, json, os, re, urllib.request, urllib.error
from html import unescape
BASE = "http://127.0.0.1:8774"
EVID = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "evidence")
rep = json.load(open(os.path.join(EVID, "verify-report.json")))
routes = [r["route"] for r in rep["routes"] if r["status"] == 200 and not r["route"].endswith((".xml", ".txt"))]
links = {}
for rt in routes:
    from urllib.parse import quote
    html = urllib.request.urlopen(BASE + quote(rt, safe="/?=&%.-_~:@!$'()*+,;"), timeout=60).read().decode("utf-8", "replace")
    for h in re.findall(r'<a\b[^>]*href="(https?://[^"]+)"', html):
        h = unescape(h)
        if "127.0.0.1" in h or "kairali.com/" in h and "www.kairali.com" in h: continue
        links.setdefault(h, set()).add(rt)
def check(u):
    try:
        r = urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0 (Kairali local link check)"}), timeout=20)
        return u, r.status, r.geturl()
    except urllib.error.HTTPError as e: return u, e.code, ""
    except Exception as e: return u, "ERR " + type(e).__name__, ""
out = []
with cf.ThreadPoolExecutor(4) as ex:
    for u, st, final in ex.map(check, sorted(links)):
        out.append({"url": u, "status": st, "final": final, "from": sorted(links[u])[:5]})
json.dump(out, open(os.path.join(EVID, "external-links.json"), "w"), indent=1)
ok = sum(1 for o in out if o["status"] == 200)
print(f"{ok}/{len(out)} external links return 200")
for o in out:
    if o["status"] != 200: print(o["status"], o["url"][:100], "<-", o["from"][0])
