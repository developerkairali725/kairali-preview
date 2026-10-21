#!/usr/bin/env python3
"""Automated acceptance checks against the running local preview (default http://127.0.0.1:8774).

Checks every disposition in the 215-route mapping, discovered extra routes, query routes, all legacy
documents (byte-level SHA-256 against the owner's legacy manifest), content parity against the audit's
page-copy blocks, rendered media, internal links, sitemap/robots/canonical/OG/Twitter/JSON-LD and
third-party font requests. Writes evidence/verify-report.json and evidence/verify-summary.md.
"""
import base64, concurrent.futures as cf, copy, hashlib, json, os, re, sys, unicodedata, urllib.request, urllib.error
import xml.etree.ElementTree as ET
from urllib.parse import urlsplit, unquote, quote
from html import unescape

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE = os.environ.get("BASE", "http://127.0.0.1:8774")
PROD = "https://www.kairali.com"
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
REF = os.path.join(REPO, "reference")  # bundled, portable copies of the audit/handoff reference data
PUBLIC_DOCS = os.path.join(REPO, "site", "public", "download")
EVID = os.path.join(REPO, "evidence")
os.makedirs(EVID, exist_ok=True)

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k): return None
opener = urllib.request.build_opener(NoRedirect)

def get(path, body=True):
    url = BASE + path
    try:
        r = opener.open(urllib.request.Request(url, method="GET" if body else "HEAD"), timeout=60)
        return r.status, dict(r.headers), (r.read() if body else b"")
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers), (e.read() if body else b"")

def enc(route):
    """Encode a legacy route for the request line (keep ?, =, & and existing escapes)."""
    return quote(route, safe="/?=&%.-_~:@!$'()*+,;")

results = {"routes": [], "docs": [], "parity": [], "media": {}, "links": {}, "seo": [], "fonts": [], "sitemap": {}, "failures": []}
def fail(kind, detail): results["failures"].append({"kind": kind, "detail": detail})

# ------------------------------------------------------------------ 1. dispositions
mapping = json.load(open(os.path.join(REF, "route-family-mapping.json"), encoding="utf-8"))
expect = []
for r in mapping["routes"]:
    rt = r["route"]
    if r["classification"] == "Document":
        continue
    if rt == "/default.aspx": expect.append((rt, 301, "/", "mapped"))
    elif rt.startswith("/namastedwaar"): expect.append((rt, 301, "/our-partner-resorts", "mapped"))
    elif rt.endswith(".aspx"): expect.append((rt, 301, rt[:-5], "mapped"))
    else: expect.append((rt, 200, None, "mapped"))
for o in mapping["observations_not_in_215"]:
    rt, tri = o["route"], o["triage"]
    if tri == "Candidate award record": expect.append((rt, 200, None, "observation"))
    elif rt in ("/kairali-blog.aspx?page=1", "/apply-now.aspx?id=999", "/search-results.aspx", "/search-results.aspx?q=ayurveda"): expect.append((rt, 200, None, "observation"))
    elif rt == "/sitemap.xml": expect.append((rt, 200, None, "observation"))
    else: expect.append((rt, 404, None, "observation"))
expect += [("/Default.aspx", 301, "/", "case"), ("/ABOUT-US.aspx", 301, "/about-us", "case"), ("/kairali-blog.aspx?page=3", 404, None, "pagination-out-of-range"),
           ("/x/award/abc", 404, None, "internal-guard"), ("/robots.txt", 200, None, "utility")]

pages_html = {}
def check_route(item):
    rt, want, loc, origin = item
    st, hd, body = get(enc(rt))
    ok = st == want
    location = hd.get("Location") or hd.get("location") or ""
    followed_body = body if st == 200 else None
    # Public URLs are extensionless. A legacy route that used to render directly is accepted only
    # when it performs one permanent redirect to an extensionless 200 target.
    clean_redirect = want == 200 and st in (301, 308) and location and ".aspx" not in urlsplit(location).path.lower()
    if clean_redirect:
        target = urlsplit(location).path + (("?" + urlsplit(location).query) if urlsplit(location).query else "")
        st2, _, followed_body = get(target)
        ok = st2 == 200
    if ok and loc:
        ok = urlsplit(location).path == loc
        if ok:  # single hop: the target itself must be 200
            st2, _, _ = get(urlsplit(location).path, body=False)
            ok = st2 == 200
    return {"route": rt, "origin": origin, "status": st, "expected": want, "location": location, "clean_redirect": bool(clean_redirect), "ok": ok}, (rt, followed_body)

with cf.ThreadPoolExecutor(8) as ex:
    for res, (rt, body) in ex.map(check_route, expect):
        results["routes"].append(res)
        if body is not None and not rt.endswith((".xml", ".txt")): pages_html[rt] = body.decode("utf-8", "replace")
        if not res["ok"]: fail("route", res)

# ------------------------------------------------------------------ 2. documents (byte-exact)
manifest = json.load(open(os.path.join(REF, "legacy-document-manifest.json"), encoding="utf-8"))
audit_docs = {unquote(urlsplit(d["document_url"]).path): d for d in json.load(open(os.path.join(REF, "downloads-reconciliation.json"), encoding="utf-8"))}
DOCS_PRESENT = os.path.isdir(PUBLIC_DOCS) and len(os.listdir(PUBLIC_DOCS)) > 0
doc_paths = {unquote(urlsplit(m["legacy_url"]).path): m["sha256"] for m in manifest}
for p, d in audit_docs.items():
    if str(d.get("live_status")) == "200":  # ads.txt/humans.txt/llms.txt were live 404 probes
        doc_paths.setdefault(p, d.get("sha256"))
def check_doc(item):
    p, sha = item
    st, hd, body = get(quote(p))
    got = hashlib.sha256(body).hexdigest() if st == 200 else None
    return {"path": p, "status": st, "sha256_expected": sha, "sha256_served": got, "bytes": len(body), "in_owner_manifest": p in {unquote(urlsplit(m["legacy_url"]).path) for m in manifest},
            "ok": st == 200 and (sha is None or got == sha)}
if DOCS_PRESENT:
    with cf.ThreadPoolExecutor(6) as ex:
        for r in ex.map(check_doc, sorted(doc_paths.items())):
            results["docs"].append(r)
            if not r["ok"]: fail("document", r)
else:
    results["docs_skipped"] = "site/public/download is absent: restore the legacy documents (see DEEPU-HANDOFF.md) to run this check"

# ------------------------------------------------------------------ 3. content parity vs audit page-copy blocks
def norm(t):
    t = unicodedata.normalize("NFKC", unescape(t)).lower()
    t = re.sub(r"[‘’“”\"'`´]", "", t)
    t = re.sub(r"[–—\-]", " ", t)
    return re.sub(r"\s+", " ", re.sub(r"[^\w\s]", " ", t)).strip()
def visible_text(html):
    html = re.sub(r"<(script|style|noscript)[^>]*>.*?</\1>", " ", html, flags=re.S | re.I)
    m = re.search(r'<main[^>]*>(.*)</main>', html, re.S)
    main = m.group(1) if m else html
    main = re.sub(r"<[^>]+>", " ", main)
    return norm(main)
blocks = json.load(open(os.path.join(REPO, "..", "..", "audits", "kairali-com-rebuild", "audit-page-copy-blocks.json"), encoding="utf-8"))
by_url = {}
for b in blocks:
    if b["classification"] != "page-copy": continue
    by_url.setdefault(b["url"], []).append(b)
missing_total = words_total = 0
for url, bl in sorted(by_url.items()):
    s = urlsplit(url); rt = s.path + ("?" + s.query if s.query else "")
    if rt not in pages_html:
        alt = next((k for k in pages_html if unquote(k) == unquote(rt)), None)
        if not alt: continue
        rt = alt
    text = visible_text(pages_html[rt])
    miss = []
    seen = set()
    for b in bl:
        n = norm(b["text"])
        if not n or n in seen: continue
        seen.add(n)
        words_total += len(n.split())
        if n in text: continue
        # tolerate column splits: every 8-word shingle present
        w = n.split()
        sh = [" ".join(w[i:i + 8]) for i in range(0, max(1, len(w) - 7), 4)]
        if len(w) >= 8 and sum(1 for x in sh if x in text) / len(sh) >= 0.9: continue
        miss.append({"text": b["text"][:200], "words": len(w), "hidden_in_source": b.get("hidden"), "section": b.get("section_heading", "")[:60]})
        missing_total += len(w)
    results["parity"].append({"route": rt, "blocks": len(seen), "missing_blocks": len(miss), "missing": miss})

# ------------------------------------------------------------------ 4. media + 5. links + 6. SEO per page
img_re = re.compile(r"<img\b[^>]*>", re.I)
attr = lambda tag, a: (re.search(rf'\b{a}="([^"]*)"', tag) or [None, None])[1]
all_imgs, all_links = {}, {}
for rt, html in pages_html.items():
    main = re.search(r'<main[^>]*>(.*)</main>', html, re.S)
    for tag in img_re.findall(main.group(1) if main else html):
        src = attr(tag, "src")
        if not src or src.startswith("http"): continue
        all_imgs.setdefault(src, []).append({"route": rt, "alt": attr(tag, "alt") is not None, "dims": bool(attr(tag, "width") and attr(tag, "height"))})
    for href in re.findall(r'<a\b[^>]*href="([^"]+)"', html):
        href = unescape(href)
        if href.startswith(("/", "#")) and not href.startswith("//") and not href.startswith("#"):
            all_links.setdefault(href.split("#")[0], set()).add(rt)
    # SEO
    head = html.split("</head>")[0]
    def meta(name, prop=False):
        m = re.search(rf'<meta[^>]*{"property" if prop else "name"}="{re.escape(name)}"[^>]*content="([^"]*)"', head)
        return unescape(m.group(1)) if m else None
    title = unescape((re.search(r"<title>(.*?)</title>", head, re.S) or [None, ""])[1])
    canon = (re.search(r'<link rel="canonical" href="([^"]+)"', head) or [None, None])[1]
    h1s = re.findall(r"<h1[^>]*>(.*?)</h1>", html, re.S)
    ld = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)
    ld_types = []
    for j in ld:
        try:
            d = json.loads(j)
            for x in d.get("@graph", [d]): ld_types.append(x.get("@type"))
        except Exception: ld_types.append("INVALID")
    rec = {"route": rt, "title": title, "description": meta("description"), "canonical": unescape(canon) if canon else None, "h1": len(h1s),
           "robots": meta("robots"), "og_title": meta("og:title", True), "og_image": meta("og:image", True), "og_image_alt": meta("og:image:alt", True),
           "og_url": meta("og:url", True), "og_type": meta("og:type", True), "og_site": meta("og:site_name", True), "tw_card": meta("twitter:card"),
           "jsonld": ld_types, "localhost_leak": "127.0.0.1" in head or "localhost" in head}
    results["seo"].append(rec)
    if "fonts.googleapis.com" in html or "fonts.gstatic.com" in html: results["fonts"].append(rt)

def check_img(src):
    st, hd, body = get(quote(unquote(src), safe="/%"), body=False)
    return src, st
with cf.ThreadPoolExecutor(8) as ex:
    for src, st in ex.map(check_img, list(all_imgs)):
        uses = all_imgs[src]
        results["media"][src] = {"status": st, "uses": len(uses), "missing_alt_attr": sum(1 for u in uses if not u["alt"]), "missing_dims": sum(1 for u in uses if not u["dims"])}
        if st != 200: fail("image", {"src": src, "status": st})
def check_link(href):
    st, hd, _ = get(enc(unquote(href)) if "%" not in href else href, body=False)
    loc = hd.get("Location") or hd.get("location")
    final = st
    if st in (301, 302, 307, 308) and loc:
        final, _, _ = get(urlsplit(loc).path + (("?" + urlsplit(loc).query) if urlsplit(loc).query else ""), body=False)
    return href, st, final
with cf.ThreadPoolExecutor(8) as ex:
    for href, st, final in ex.map(check_link, list(all_links)):
        results["links"][href] = {"status": st, "final": final, "from": sorted(all_links[href])[:5]}
        if final != 200: fail("internal-link", {"href": href, "status": st, "final": final, "from": sorted(all_links[href])[:3]})

# SEO assertions for indexable pages
titles, descs = {}, {}
for r in results["seo"]:
    rt = r["route"]
    utility = rt.startswith("/search-results") or rt in ("/kairali-blog.aspx?page=1", "/apply-now.aspx?id=999")
    if r["h1"] != 1: fail("seo-h1", {"route": rt, "h1": r["h1"]})
    if r["localhost_leak"]: fail("seo-localhost", rt)
    for k in ("title", "description", "og_title", "og_image", "og_url", "og_type", "og_site", "tw_card", "og_image_alt"):
        if not r.get(k): fail("seo-missing-" + k, rt)
    if r["og_image"] and not r["og_image"].startswith(PROD): fail("seo-og-image-not-absolute", rt)
    if "BreadcrumbList" not in r["jsonld"] and rt != "/": fail("seo-no-breadcrumb", rt)
    if "Organization" not in r["jsonld"]: fail("seo-no-organization", rt)
    if "noindex" not in (r["robots"] or ""): fail("seo-local-not-noindex", rt)
    if utility: continue
    route_check = next((x for x in results["routes"] if x["route"] == rt), None)
    public_rt = rt
    if route_check and route_check.get("clean_redirect") and route_check.get("location"):
        parsed_location = urlsplit(route_check["location"])
        public_rt = parsed_location.path + (("?" + parsed_location.query) if parsed_location.query else "")
    exp = PROD + ("/" if public_rt == "/" else public_rt)
    if rt == "/" and r["canonical"] == PROD: exp = PROD  # live canonical form, no trailing slash
    if rt.endswith("congress="): continue  # alias of the sitemap URL; canonicalises to it
    if r["canonical"] != exp and r["route"] != "/kairali-blog.aspx?page=1": fail("seo-canonical", {"route": rt, "canonical": r["canonical"], "expected": exp})
    titles.setdefault(r["title"], []).append(rt); descs.setdefault(r["description"], []).append(rt)
for t, rs in titles.items():
    if len(rs) > 1: fail("seo-duplicate-title", {"title": t, "routes": rs})
for t, rs in descs.items():
    if len(rs) > 1: fail("seo-duplicate-description", {"description": (t or "")[:80], "routes": rs})

# sitemap
st, _, body = get("/sitemap.xml")
try:
    ET.fromstring(body)
except ET.ParseError as exc:
    fail("sitemap-invalid-xml", str(exc))
locs = re.findall(r"<loc>(.*?)</loc>", body.decode())
bad = []
for u in locs:
    p = unescape(u).replace(PROD, "") or "/"
    s2, _, _ = get(enc(p), body=False)
    if s2 != 200: bad.append((u, s2))
results["sitemap"] = {"count": len(locs), "non200": bad, "hosts_ok": all(u.startswith(PROD) for u in locs)}
for b in bad: fail("sitemap", b)
st, _, robots = get("/robots.txt")
results["robots_local"] = robots.decode()

# Persist captured source excerpts as lossless evidence data rather than plain
# publishable copy. registers.py decodes them before parity classification.
report = copy.deepcopy(results)
for parity_page in report["parity"]:
    for missing in parity_page.get("missing", []):
        missing["text_base64"] = base64.b64encode(missing.pop("text").encode("utf-8")).decode("ascii")
with open(os.path.join(EVID, "verify-report.json"), "w", encoding="utf-8") as report_file:
    json.dump(report, report_file, indent=1, default=list)
R = results
routes_ok = sum(r["ok"] for r in R["routes"])
docs_ok = sum(r["ok"] for r in R["docs"])
par_pages = [p for p in R["parity"] if p["missing_blocks"]]
summary = f"""# Automated verification — {BASE}

| Check | Result |
|---|---|
| Route dispositions (215 mapping + observations + case/guard probes) | {routes_ok}/{len(R['routes'])} as expected |
| Legacy documents served byte-identical (SHA-256) | {f"{docs_ok}/{len(R['docs'])} ({sum(d['in_owner_manifest'] for d in R['docs'])} in owner legacy manifest)" if R['docs'] else "SKIPPED — documents not restored locally"} |
| Page-copy parity vs audit blocks (not a pass/fail: classify with tests/registers.py) | {sum(p['blocks'] for p in R['parity'])} distinct blocks on {len(R['parity'])} pages; {sum(p['missing_blocks'] for p in R['parity'])} blocks not found as contiguous text on the same page ({missing_total} of {words_total} words) on {len(par_pages)} pages |
| Rendered images | {sum(1 for m in R['media'].values() if m['status'] == 200)}/{len(R['media'])} return 200; missing alt attr {sum(m['missing_alt_attr'] for m in R['media'].values())}; missing width/height {sum(m['missing_dims'] for m in R['media'].values())} |
| Internal link targets | {sum(1 for l in R['links'].values() if l['final'] == 200)}/{len(R['links'])} resolve to 200 (≤1 redirect) |
| Sitemap | {R['sitemap']['count']} URLs, non-200: {len(R['sitemap']['non200'])}, production host only: {R['sitemap']['hosts_ok']} |
| Google Fonts references in HTML | {len(R['fonts'])} pages |
| Failures | {len(R['failures'])} |

## Failures by kind
""" + "\n".join(f"- {k}: {n}" for k, n in sorted({f['kind']: sum(1 for x in R['failures'] if x['kind'] == f['kind']) for f in R['failures']}.items())) + "\n"
open(os.path.join(EVID, "verify-summary.md"), "w", encoding="utf-8").write(summary)
print(summary)
for f in R["failures"][:40]:
    print(f["kind"], json.dumps(f["detail"], default=list)[:220])
