#!/usr/bin/env python3
"""Convert the completed kairali.com source capture into structured build data.

Inputs (read-only): the audit capture in kairali-com-content-reconciliation-20260929 and
the design handoff (route mapping v4, owner decisions).
Outputs: site/content/*.json, site/public/media/** (optimised WebP), site/public/download/**
(legacy documents, byte-identical), pipeline/out/*.csv provenance and change logs.

No network access. Every page body is derived from the captured raw HTML, so each render
is traceable to its source capture (sourceUrl + sourceSha256 on every page record).
"""
import csv, hashlib, json, os, re, shutil, sys
from urllib.parse import urlsplit, unquote, quote
from bs4 import BeautifulSoup, NavigableString, Comment, Tag
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)                      # repo root (main checkout or worktree)
PROJ = HERE
while PROJ != "/" and not os.path.isdir(os.path.join(PROJ, "kairali-com-content-reconciliation-20260929")):
    PROJ = os.path.dirname(PROJ)
LOCAL_BUILD = os.path.join(PROJ, "local-build")
AUDIT = os.path.join(PROJ, "kairali-com-content-reconciliation-20260929")
HANDOFF = os.path.join(PROJ, "Kairali-Claude-Design-Handoff")
SITE = os.path.join(REPO, "site")
CONTENT = os.path.join(SITE, "content")
PUBLIC = os.path.join(SITE, "public")
OUT = os.path.join(HERE, "out")
sys.path.insert(0, os.path.join(AUDIT, "scripts"))
from extract import top_sections, role_of, is_hidden  # the audit's own section classifier

for d in (CONTENT, OUT, os.path.join(PUBLIC, "media"), os.path.join(PUBLIC, "download")):
    os.makedirs(d, exist_ok=True)

HOST = "https://www.kairali.com"
EXTRA_ASSETS = {  # verified during this build; the audit summary marked it "not attempted"
    "/pic/Dining .jpg": os.path.join(LOCAL_BUILD, "_work", "fetch", "verify-Dining_20.jpg"),
}

# --------------------------------------------------------------------------- inputs
routes_live = list(csv.DictReader(open(os.path.join(AUDIT, "output", "routes.csv"))))
mapping = json.load(open(os.path.join(HANDOFF, "01-DESIGN-RETURN", "route-family-mapping.json")))
seo_list = json.load(open(os.path.join(AUDIT, "output", "seo.json")))
seo_rows = {r.get("url"): r for r in seo_list}
assets = json.load(open(os.path.join(AUDIT, "output", "assets_dedup.json")))
occ = json.load(open(os.path.join(AUDIT, "output", "asset_occurrences.json")))
videos = json.load(open(os.path.join(AUDIT, "output", "videos.json")))
forms = json.load(open(os.path.join(AUDIT, "output", "forms_journeys.json")))
downloads = json.load(open(os.path.join(AUDIT, "output", "downloads_reconciliation.json")))

asset_local = {}
for a in assets:
    if str(a.get("captured")) == "True" and a.get("local_path"):
        asset_local[unquote(urlsplit(a["asset_url"]).path)] = os.path.join(AUDIT, a["local_path"])
for p, f in EXTRA_ASSETS.items():
    asset_local[p] = f
ADMIN_DIR = os.path.join(LOCAL_BUILD, "_work", "admin-assets")   # company CMS images fetched during this build
if os.path.isdir(ADMIN_DIR):
    for dp, _, fns in os.walk(ADMIN_DIR):
        for fn in fns:
            if not fn.startswith("_"):
                full = os.path.join(dp, fn)
                asset_local["admin:/" + os.path.relpath(full, ADMIN_DIR)] = full
asset_local_ci = {k.lower(): v for k, v in asset_local.items()}

def route_of(url):
    s = urlsplit(url)
    return s.path + (("?" + s.query) if s.query else "")

live_pages = {}
for r in routes_live:
    if r["live_status"] == "200" and r["content_type"].startswith("text/html") and r["raw_path"]:
        live_pages[route_of(r["url"])] = r

# --------------------------------------------------------------------------- media
media_log = {}

def optimise_image(src_path):
    """Copy a captured image into /media as WebP (max 1600px wide) and return its record."""
    key = unquote(src_path)
    if key in media_log:
        return media_log[key]
    local = asset_local.get(key) or asset_local_ci.get(key.lower())
    if not local or not os.path.exists(local):
        media_log[key] = None
        return None
    base = re.sub(r"[^A-Za-z0-9/_.-]+", "-", key.replace("admin:/", "cms/").strip("/"))
    base = re.sub(r"\.[A-Za-z0-9]+$", "", base).lower().strip("-")
    out_rel = f"/media/{base}.webp"
    out_abs = os.path.join(PUBLIC, out_rel.lstrip("/"))
    try:
        im = Image.open(local)
        im.load()
    except Exception:
        media_log[key] = None
        return None
    w, h = im.size
    nw, nh = (1600, round(h * 1600 / w)) if w > 1600 else (w, h)
    if not os.path.exists(out_abs):
        os.makedirs(os.path.dirname(out_abs), exist_ok=True)
        im = im.convert("RGBA") if im.mode in ("P", "LA", "RGBA") else im.convert("RGB")
        if (nw, nh) != (w, h):
            im = im.resize((nw, nh), Image.LANCZOS)
        im.save(out_abs, "WEBP", quality=80, method=5)
    src_url = ("https://admin.kairali.com/" + quote(key[7:])) if key.startswith("admin:/") else HOST + quote(key)
    rec = {"src": out_rel, "w": nw, "h": nh, "source": src_url,
           "sha256": hashlib.sha256(open(local, "rb").read()).hexdigest()}
    media_log[key] = rec
    return rec

# --------------------------------------------------------------------------- documents
doc_map = {}      # lower-cased unquoted legacy path -> exact legacy path (served identically)
doc_rows = []
for d in downloads:
    u = d.get("document_url") or ""
    local = d.get("local_path")
    if not u or not local:
        continue
    p = unquote(urlsplit(u).path)
    src = os.path.join(AUDIT, local)
    if not os.path.exists(src):
        continue
    dst = os.path.join(PUBLIC, p.lstrip("/"))
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    if not os.path.exists(dst) or os.path.getsize(dst) != os.path.getsize(src):
        shutil.copy2(src, dst)
    doc_map[p.lower()] = p
    doc_rows.append({"path": p, "bytes": os.path.getsize(src), "sha256": d.get("sha256") or "",
                     "linkedFrom": d.get("linked_from_pages") or [], "reviewFlag": d.get("review") or "", "status": d.get("live_status")})

# --------------------------------------------------------------------------- links
MAIL_RE = re.compile(r"^[\w.+-]+@[\w-]+(\.[\w-]+)+$")
changes = []   # deliberate source-to-render changes, logged per route

def rewrite_href(href, page_route):
    if href is None:
        return None
    h = href.strip()
    if not h or h == "#" or h.lower().startswith("javascript:"):
        return None
    if h.lower().startswith(("mailto:", "tel:")):
        return h
    if MAIL_RE.match(h.lstrip("/")):
        changes.append((page_route, "relative e-mail link corrected to mailto: (live 404 defect R-10)", h))
        return "mailto:" + h.lstrip("/")
    if h.startswith("#"):
        return h
    s = urlsplit(h if ("://" in h or h.startswith("//")) else HOST + "/" + h.lstrip("/"))
    host = (s.netloc or "").lower()
    if host == "admin.kairali.com":
        # old CMS image lightbox links -> the self-hosted copy (no dependency on the old site)
        rec = optimise_image("admin:" + unquote(s.path))
        if rec:
            return rec["src"]
        changes.append((page_route, "old CMS link kept (no local copy)", h))
    if host and host not in ("www.kairali.com", "kairali.com"):
        # Owner Q8: link the confirmed canonical sub-brand sites (each checked 29 Sep 2026).
        if host in ("ktahv.com", "www.ktahv.com", "ayurvedichealingvillage.com", "www.ayurvedichealingvillage.com"):
            if host.endswith("ktahv.com"):
                changes.append((page_route, "retired ktahv.com link pointed at its redirect target ayurvedichealingvillage.com", h))
            return "https://ayurvedichealingvillage.com/"
        if host in ("kairalicenters.com", "www.kairalicenters.com", "kairalicentres.com", "www.kairalicentres.com"):
            if s.path.lower().startswith("/location/") or host.endswith("kairalicentres.com"):
                changes.append((page_route, "retired kairalicenters.com/location/*.aspx deep link (404) pointed at kairalicenters.com/locations/", h))
                return "https://kairalicenters.com/locations/"
            return "https://kairalicenters.com" + (s.path or "/")
        return h if "://" in h else "https:" + h
    p = unquote(s.path) or "/"
    if p.lower() in ("/default.aspx", "/index.aspx"):
        p = "/"
    if p.lower() in doc_map:
        return quote(doc_map[p.lower()])
    if p.lower().startswith("/namastedwaar"):
        changes.append((page_route, "Namaste Dwaar link retargeted to Partner Resorts (owner Q2)", h))
        return "/our-partner-resorts.aspx"
    return quote(p) + (("?" + s.query) if s.query else "") + (("#" + s.fragment) if s.fragment else "")

# --------------------------------------------------------------------------- sanitiser
KEEP = {"h2", "h3", "h4", "h5", "h6", "p", "ul", "ol", "li", "table", "thead", "tbody", "tfoot", "tr", "td", "th",
        "blockquote", "strong", "em", "br", "sup", "sub", "hr", "caption", "dl", "dt", "dd"}
RENAME = {"b": "strong", "i": "em", "h1": "h2"}
DROP = {"script", "style", "noscript", "form", "input", "select", "textarea", "button", "label", "svg",
        "object", "embed", "video", "audio", "link", "meta", "option", "template"}
INLINE_WRAP = {"span", "font", "u", "small", "big", "strong", "em", "abbr", "cite", "q", "mark", "time"}
YT_RE = re.compile(r"(?:youtube(?:-nocookie)?\.com/(?:embed/|watch\?v=|v/)|youtu\.be/)([A-Za-z0-9_-]{11})")

def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")

def clean_text(t):
    return re.sub(r"[ \t\r\n ]+", " ", t)

class Ctx:
    def __init__(self, route):
        self.route, self.images, self.videos, self.docs, self.links = route, [], [], [], []

def is_accordion(el):
    c = set(x.lower() for x in (el.get("class") or []))
    return bool(c & {"faqs-list", "panel"}) and el.find(class_=re.compile("faqs-title|panel-heading")) is not None

def conv(el, ctx):
    out = []
    for c in el.children:
        if isinstance(c, Comment):
            continue
        if isinstance(c, NavigableString):
            t = clean_text(str(c))
            if t.strip() or (t == " " and out):
                out.append(esc(t))
            continue
        if not isinstance(c, Tag):
            continue
        name = c.name.lower()
        cls = set(x.lower() for x in (c.get("class") or []))
        if "buttons-interlinks" in cls:
            parts = []
            for a in c.find_all("a"):
                href = rewrite_href(a.get("href"), ctx.route)
                label = clean_text(a.get_text(" ", strip=True)).strip()
                if href and label:
                    parts.append(f'<a href="{esc(href)}">{esc(label)}</a>')
                elif label:
                    # source "Enquire Now" popups (href="#") become a link to the enquiry form
                    parts.append(f'<a href="/enquiry-form.aspx">{esc(label)}</a>')
            if parts:
                out.append('<p class="cta-inline">' + " ".join(parts) + "</p>")
            continue
        if name == "iframe":
            src = c.get("src") or c.get("data-src") or ""
            m = YT_RE.search(src)
            if m:
                ctx.videos.append(m.group(1))
                out.append(f'<div data-yt="{m.group(1)}" data-title="{esc(c.get("title") or "")}"></div>')
            elif "google.com/maps" in src or "maps.google." in src:
                out.append(f'<div data-map="{esc(src)}"></div>')
            continue
        if name in DROP:
            continue
        if is_accordion(c):
            head = c.find(class_=re.compile("faqs-title|panel-heading"))
            body = c.find(class_=re.compile("faqs-answer|panel-collapse|panel-body"))
            ht = clean_text(head.get_text(" ", strip=True)).strip() if head else ""
            inner = normalise(tidy(conv(body, ctx)), {i["src"] for i in ctx.images}) if body else ""
            out.append(f'<details><summary>{esc(ht)}</summary><div class="details-body">{inner}</div></details>')
            continue
        if name == "img":
            src = (c.get("data-src") or c.get("src") or "").strip()
            if not src or src.startswith("data:"):
                continue
            s = urlsplit(src if "://" in src else HOST + "/" + src.lstrip("/"))
            if s.netloc.lower() == "admin.kairali.com":
                rec = optimise_image("admin:" + unquote(s.path))
            elif s.netloc and s.netloc.lower() not in ("www.kairali.com", "kairali.com"):
                continue
            else:
                rec = optimise_image(s.path)
            alt = clean_text(c.get("alt") or "").strip()
            if rec is None:
                changes.append((ctx.route, "image unavailable in capture (live 404) — omitted", src))
                continue
            ctx.images.append({**rec, "alt": alt})
            out.append(f'<img src="{rec["src"]}" width="{rec["w"]}" height="{rec["h"]}" alt="{esc(alt)}" loading="lazy" decoding="async">')
            continue
        if name == "a":
            href = rewrite_href(c.get("href"), ctx.route)
            inner = conv(c, ctx)
            if not inner.strip():
                continue
            m = YT_RE.search(c.get("href") or "")
            if m:
                ctx.videos.append(m.group(1))
            if href:
                ctx.links.append(href)
                if href.startswith("/download/"):
                    ctx.docs.append(href)
                rel = ' rel="noopener"' if href.startswith("http") else ""
                out.append(f'<a href="{esc(href)}"{rel}>{inner}</a>')
            else:
                out.append(inner)
            continue
        if name in RENAME:
            n2 = RENAME[name]
            inner = conv(c, ctx)
            if inner.strip():
                out.append(f"<{n2}>{inner}</{n2}>")
            continue
        if name in ("h2", "h3", "h4", "h5", "h6"):
            inner = conv(c, ctx).strip()
            if inner:
                out.append(f"<{name}>{inner}</{name}>")
            continue
        if name in KEEP:
            if name in ("br", "hr"):
                out.append(f"<{name}>")
                continue
            inner = conv(c, ctx)
            if name in ("td", "th"):
                attrs = "".join(f' {k}="{esc(str(c.get(k)))}"' for k in ("colspan", "rowspan") if c.get(k))
                out.append(f"<{name}{attrs}>{inner.strip()}</{name}>")
                continue
            if name in ("p", "li", "blockquote", "caption", "dt", "dd") and not inner.strip():
                continue
            out.append(f"<{name}>{inner}</{name}>")
            continue
        inner = conv(c, ctx)
        if not inner.strip():
            continue
        if name in INLINE_WRAP:
            out.append(inner)
        elif re.search(r"<(p|h\d|ul|ol|table|details|div|img|blockquote|dl)\b", inner):
            out.append(f"<div>{inner}</div>")
        else:
            out.append(f"<p>{inner.strip()}</p>")
    return "".join(out)

def tidy(html):
    html = re.sub(r"<div>\s*</div>", "", html)
    for _ in range(20):
        n = re.sub(r"<div>\s*(<div>(?:(?!<div>).)*?</div>)\s*</div>", r"\1", html, flags=re.S)
        if n == html:
            break
        html = n
    html = re.sub(r"(<br>\s*){3,}", "<br><br>", html)
    html = re.sub(r"<p>\s*(<br>\s*)+", "<p>", html)
    html = re.sub(r"(<br>\s*)+</p>", "</p>", html)
    html = re.sub(r"<p>\s*</p>", "", html)
    return html.strip()

DECOR_RE = re.compile(r"/([a-z]*-background|twin-leaf[^/]*|leaf-icon[^/]*|arrow[^/]*|line[^/]*|dot[^/]*)\.webp$", re.I)
END_PUNCT = re.compile(r"[.!?:;\u201d\"')\]]\s*$")

def normalise(html, page_imgs):
    """Flatten wrapper divs, merge column-split paragraphs, group images, drop mobile/decor duplicates."""
    soup = BeautifulSoup(f"<root>{html}</root>", "lxml").find("root")
    for img in list(soup.find_all("img")):
        src = img.get("src", "")
        if DECOR_RE.search(src) or (int(img.get("width") or 0) < 60 and int(img.get("height") or 0) < 60):
            img.decompose(); continue
        if src.endswith("-mobile.webp") and src.replace("-mobile.webp", ".webp") in page_imgs:
            img.decompose(); continue
    for d in list(soup.find_all("div")):
        if d.get("class") and "details-body" in d.get("class"):
            continue
        if d.has_attr("data-yt") or d.has_attr("data-map"):
            continue
        d.unwrap()
    # merge paragraphs split by source columns ("...the highest" + "standards of ...")
    for p in list(soup.find_all("p")):
        nxt = p.find_next_sibling()
        if nxt is None or nxt.name != "p" or p.parent is None:
            continue
        a = p.get_text(" ", strip=True); b = nxt.get_text(" ", strip=True)
        if a and b and not END_PUNCT.search(a) and b[:1].islower() and not p.find("a") :
            p.append(" ")
            for c in list(nxt.contents):
                p.append(c)
            nxt.decompose()
    # wrap loose inline runs at the root into paragraphs
    INLINE = {"a", "strong", "em", "br", "sup", "sub", "span"}
    run = []
    def wrap_run():
        if run and any((isinstance(n, NavigableString) and n.strip()) or (isinstance(n, Tag) and n.get_text(strip=True)) for n in run):
            pnew = soup.new_tag("p")
            run[0].insert_before(pnew)
            for n in run:
                pnew.append(n.extract())
        run.clear()
    for k in list(soup.contents):
        if isinstance(k, NavigableString) or (isinstance(k, Tag) and k.name in INLINE and not k.find("img")):
            run.append(k)
        else:
            wrap_run()
    wrap_run()
    # group runs of consecutive images (ignoring whitespace) into a gallery
    kids = [k for k in soup.contents]
    run = []
    def flush():
        if len(run) >= 2:
            g = soup.new_tag("div", attrs={"class": "gallery"})
            run[0].insert_before(g)
            for im in run:
                g.append(im.extract())
        run.clear()
    for k in kids:
        if isinstance(k, NavigableString):
            if k.strip():
                flush()
            continue
        if k.name == "img" or (k.name == "a" and k.find("img") and not k.get_text(strip=True)):
            run.append(k)
        else:
            flush()
    flush()
    for p in list(soup.find_all("p")):
        t = p.get_text(" ", strip=True)
        if re.fullmatch(r"(Tel|Mob|Phone|Fax)\s*:\s*\+?\d{0,3}\s*-?\s*", t):
            changes.append(("*", "empty phone stub removed (R-11)", t))
            p.decompose()
    out = "".join(str(c) for c in soup.contents)
    out = re.sub(r">\s+<", "> <", out)
    out = re.sub(r"<p>\s*</p>", "", out)
    return out.strip()

def text_of_html(html):
    return clean_text(BeautifulSoup(html, "lxml").get_text(" ", strip=True)).strip()

# --------------------------------------------------------------------------- page parse
def parse_banner(el, ctx):
    info = {"tagline": "", "h1": "", "subtitle": [], "sublinks": [], "rest": "", "actions": []}
    for bi in el.select(".buttons-interlinks"):
        for a in bi.find_all("a"):
            label = clean_text(a.get_text(" ", strip=True)).strip()
            href = rewrite_href(a.get("href"), ctx.route)
            if label and href:
                info["actions"].append({"label": label, "href": href})
                if href.startswith("/download/"):
                    ctx.docs.append(href)
        bi.decompose()
    big = el.find(class_="bigtext")
    if big:
        info["tagline"] = clean_text(big.get_text(" ", strip=True)).strip()
        big.decompose()
    sub = el.find(class_="sublink-section")
    if sub:
        for a in sub.find_all("a"):
            t = clean_text(a.get_text(" ", strip=True)).strip()
            if t:
                href = rewrite_href(a.get("href"), ctx.route)
                info["sublinks"].append({"label": t, "href": href, "current": bool(set(a.get("class") or []) & {"current"}) or not href})
        sub.decompose()
    h1 = el.find("h1")
    if h1:
        info["h1"] = clean_text(h1.get_text(" ", strip=True)).strip()
        head = h1.find_parent(class_=re.compile("webheader|generalhead")) or h1.parent
        for p in head.find_all("p"):
            t = conv(p, ctx).strip()
            if t:
                info["subtitle"].append(t)
            p.decompose()
        h1.decompose()
    rest = normalise(tidy(conv(el, ctx)), {i["src"] for i in ctx.images})
    info["rest"] = rest if (text_of_html(rest) or "<img" in rest) else ""
    return info

def page_sections(raw_path, route):
    html = open(os.path.join(AUDIT, raw_path), encoding="utf-8", errors="replace").read()
    soup = BeautifulSoup(html, "lxml")
    root = soup.find("form") or soup.body or soup
    ctx = Ctx(route)
    banner, body, mobile_text = None, [], []
    for s in top_sections(root):
        el = s["el"]
        if role_of(el) != "main":
            continue
        cls = set(x.lower() for x in (el.get("class") or []))
        if s.get("variant") == "mobileview":
            mobile_text.append(clean_text(el.get_text(" ", strip=True)))
            continue
        if "blogwhyfull" in cls or "main-tp-slider" in cls:
            continue   # hidden popup shells (blog overlay; Svata enquiry popup rebuilt as a form)
        if banner is None and not body and ({"headersection-banner", "headersection-homepage"} & cls):
            banner = parse_banner(el, ctx)
            continue
        controls = [c for c in el.find_all(["input", "select", "textarea"]) if (c.get("type") or "").lower() not in ("hidden", "submit", "button", "image")]
        is_form = len(controls) >= 3
        h = tidy(conv(el, ctx))
        h = normalise(h, {i["src"] for i in ctx.images})
        if not text_of_html(h) and not re.search(r"<img|data-yt|data-map", h):
            continue
        body.append({"cls": " ".join(sorted(cls)), "id": el.get("id") or "", "html": h, "hidden": is_hidden(el), "form": is_form})
    return banner, body, ctx, soup

def hero_for(page_url):
    for o in occ:
        if o.get("url") != page_url:
            continue
        p = unquote(urlsplit(o.get("asset_url") or "").path)
        if "/headerbanner/" in p.lower() and "mobile" not in p.lower():
            rec = optimise_image(p)
            if rec:
                return rec
    return None

# --------------------------------------------------------------------------- build
map_by_route = {r["route"]: r for r in mapping["routes"]}
off_sitemap_awards = [o["route"] for o in mapping["observations_not_in_215"]
                      if o["triage"] == "Candidate award record" and not o["route"].endswith("=")]
wanted = [(r["route"], "mapped-215") for r in mapping["routes"]
          if r["classification"] != "Document" and r["route"] != "/default.aspx"
          and not r["route"].startswith("/namastedwaar")]
wanted += [(rt, "discovered-off-sitemap") for rt in off_sitemap_awards]
wanted += [("/kairali-blog.aspx?page=1", "query-variant")]

pages, missing_raw = {}, []
for route, origin in wanted:
    live = live_pages.get(route)
    if not live:
        live = next((v for k, v in live_pages.items() if k.lower() == route.lower() or unquote(k) == unquote(route)), None)
    if not live:
        missing_raw.append(route)
        continue
    url = live["url"]
    banner, body, ctx, soup = page_sections(live["raw_path"], route)
    seo = seo_rows.get(url, {})
    m = map_by_route.get(route, {})
    desc_tag = soup.find("meta", attrs={"name": re.compile("^description$", re.I)})
    kw_tag = soup.find("meta", attrs={"name": re.compile("^keywords$", re.I)})
    h1s = [clean_text(h.get_text(" ", strip=True)).strip() for h in soup.find_all("h1")]
    pages[route] = {
        "route": route, "origin": origin, "sourceUrl": url, "sourceSha256": live.get("sha256"),
        "family": m.get("wf_family") or ("G" if route.startswith("/detail.aspx") else None),
        "template": m.get("template") or ("G5 Award detail" if route.startswith("/detail.aspx") else None),
        "mapTitle": m.get("title"), "group": m.get("group"), "ownerFact": m.get("owner_fact") or "",
        "title": clean_text(soup.title.get_text(" ", strip=True)).strip() if soup.title else (live.get("title") or ""),
        "description": clean_text((desc_tag.get("content") or "") if desc_tag else "").strip(),
        "keywords": clean_text((kw_tag.get("content") or "") if kw_tag else "").strip(),
        "sourceH1": h1s[0] if h1s else "",
        "banner": banner, "hero": hero_for(url), "sections": body,
        "images": ctx.images, "videos": list(dict.fromkeys(ctx.videos)),
        "docs": list(dict.fromkeys(ctx.docs)), "links": list(dict.fromkeys(ctx.links)),
    }

# awards index from the live listing pages (title, teaser, image, target) — also rebuilds the
# one record whose source detail URL is malformed (sitemap "…-&-wellness-congress", live soft-404)
awards_index = []
for lr in ("/kairali-group-awards.aspx",):
    live = live_pages[lr]
    soup = BeautifulSoup(open(os.path.join(AUDIT, live["raw_path"]), encoding="utf-8", errors="replace").read(), "lxml")
    ctx = Ctx(lr)
    for it in soup.select(".award-small-section"):
        a = it.select_one(".titleblog a") or it.find("a")
        if not a:
            continue
        img = it.find("img")
        rec = None
        if img is not None:
            src = (img.get("src") or "").strip()
            sp = urlsplit(src if "://" in src else HOST + "/" + src.lstrip("/"))
            rec = optimise_image(("admin:" + unquote(sp.path)) if sp.netloc.lower() == "admin.kairali.com" else sp.path)
        desc = it.select_one(".desctiption")
        awards_index.append({"href": rewrite_href(a.get("href"), lr), "rawHref": a.get("href"),
                             "title": clean_text(a.get_text(" ", strip=True)).strip(),
                             "teaser": clean_text(desc.get_text(" ", strip=True)).strip() if desc else "",
                             "image": ({**rec, "alt": clean_text(img.get("alt") or "").strip()} if rec else None)})
json.dump(awards_index, open(os.path.join(CONTENT, "awards-index.json"), "w"), indent=1, ensure_ascii=False)
for rt in missing_raw[:]:
    a = next((x for x in awards_index if x["rawHref"] and unquote(("/" + x["rawHref"].lstrip("/"))) == unquote(rt)), None)
    if not a:
        continue
    img_html = f'<img src="{a["image"]["src"]}" width="{a["image"]["w"]}" height="{a["image"]["h"]}" alt="{esc(a["image"]["alt"])}" loading="lazy" decoding="async">' if a["image"] else ""
    pages[rt] = {"route": rt, "origin": "rebuilt-from-listing-teaser", "sourceUrl": HOST + "/kairali-group-awards.aspx",
                 "sourceSha256": live_pages["/kairali-group-awards.aspx"].get("sha256"), "family": "G", "template": "G5 Award detail",
                 "mapTitle": a["title"], "group": "Our Group", "ownerFact": "",
                 "title": a["title"] + " | Kairali Ayurvedic Group", "description": a["teaser"][:300], "keywords": "",
                 "sourceH1": a["title"], "banner": {"tagline": "", "h1": a["title"], "subtitle": [], "sublinks": [], "rest": ""},
                 "hero": None, "sections": [{"cls": "teaser", "id": "", "html": f"<p>{esc(a['teaser'])}</p>{img_html}", "hidden": False, "form": False}],
                 "images": [a["image"]] if a["image"] else [], "videos": [], "docs": [], "links": []}
    changes.append((rt, "award detail rebuilt from the live awards-listing teaser (source detail URL is a soft 404)", a["title"]))
    missing_raw.remove(rt)

# ---------------------------------------------------------------- natural casing (owner feedback 29 Sep 2026)
# ALL-CAPS display strings found in the source are re-cased deliberately from a reviewed map: sentence case
# for section headings and table labels, title case for proper names (awards, products, page names).
# Acronyms (NABH, ISO, INR, USD, EUR, PDF, DLX, SUP…), filenames, URLs and identifiers are untouched.
CASE_MAP = {
    "KAIRALI- THE AYURVEDIC HEALING VILLAGE NOMINATED FOR BEST SPA AND WELLNESS RESORT - SOUTH":
        "Kairali – The Ayurvedic Healing Village Nominated for Best Spa and Wellness Resort – South",
    "WHY CHOOSE VILLA RAAG": "Why choose Villa Raag",
    "LOCATION & SURROUNDINGS": "Location & surroundings",
    "EXPERIENCES & AMENITIES": "Experiences & amenities",
    "KAIRKARE OIL & KARPOORADI TAILAM": "Kairkare Oil & Karpooradi Tailam",
    "MANASAMITRAM GULIKA & KAIROIL": "Manasamitram Gulika & Kairoil",
    "LIPIDEX CAPSULE & VARANADI KASHAYAM": "Lipidex Capsule & Varanadi Kashayam",
    "NOT POSSIBLE": "Not possible",
}
DAYS_RE = re.compile(r"\b(\d{2}) DAYS EURO\b")
BUTTON_CASE = {"Download Brochure": "Download brochure", "Visit Website": "Visit website", "Current Opening": "Current opening",
               "Apply Now": "Apply now", "Enquire Now": "Enquire now", "Free Online Consultation": "Free online consultation",
               "Read more ": "Read more", "Read More": "Read more", "Book Now": "Book now", "Know More": "Know more"}
case_log = set()
def recase(text, route):
    out = text
    for k, v in CASE_MAP.items():
        for kk, vv in ((k, v), (k.replace("&", "&amp;"), v.replace("&", "&amp;"))):
            if kk in out:
                out = out.replace(kk, vv); case_log.add((route, "ALL-CAPS source text re-cased", f"{k} -> {v}"))
    n = DAYS_RE.sub(lambda m: f"{m.group(1)} days Euro", out)
    if n != out:
        case_log.add((route, "ALL-CAPS table label re-cased", "NN DAYS EURO -> NN days Euro")); out = n
    return out
def recase_buttons(html, route):
    def fix(m):
        lab = m.group(2)
        new = BUTTON_CASE.get(lab, lab)
        if new != lab: case_log.add((route, "button label sentence case", f"{lab} -> {new}"))
        return f"{m.group(1)}{new}</a>"
    return re.sub(r'(<p class="cta-inline">(?:[^<]*<a [^>]*>[^<]*</a>\s*)*?\s*<a [^>]*>|<a [^>]*>)(Download Brochure|Visit Website|Current Opening|Apply Now|Enquire Now|Free Online Consultation|Read More|Book Now|Know More)</a>', fix, html)
for rt, pg in pages.items():
    for sct in pg["sections"]:
        sct["html"] = recase_buttons(recase(sct["html"], rt), rt)
    if pg["banner"]:
        b = pg["banner"]
        b["h1"] = recase(b["h1"], rt); b["tagline"] = recase(b["tagline"], rt)
        b["subtitle"] = [recase(x, rt) for x in b["subtitle"]]
        b["rest"] = recase_buttons(recase(b["rest"], rt), rt)
        for a in b.get("actions", []):
            new = BUTTON_CASE.get(a["label"], a["label"])
            if new != a["label"]: case_log.add((rt, "button label sentence case", f"{a['label']} -> {new}"))
            a["label"] = new
    pg["sourceH1"] = recase(pg["sourceH1"], rt); pg["mapTitle"] = recase(pg["mapTitle"] or "", rt) or pg["mapTitle"]
    pg["images"] = [{**i, "alt": recase(i.get("alt", ""), rt)} for i in pg["images"]]
for a in awards_index:
    a["title"] = recase(a["title"], "/kairali-group-awards.aspx")
    if a["image"]: a["image"]["alt"] = recase(a["image"]["alt"], "/kairali-group-awards.aspx")
json.dump(awards_index, open(os.path.join(CONTENT, "awards-index.json"), "w"), indent=1, ensure_ascii=False)
changes.extend(case_log)

# videos from the audit inventory (owl-carousel galleries are JS-built; keep ids, titles, grouping)
for v in videos:
    pu, vid = v.get("page") or v.get("page_url") or v.get("url"), v.get("video_id")
    if not pu or not vid:
        continue
    rt = route_of(pu)
    if rt in pages:
        items = pages[rt].setdefault("videoItems", [])
        if vid not in [x["id"] for x in items]:
            items.append({"id": vid, "title": clean_text(v.get("title") or v.get("anchor") or v.get("alt") or "").strip(),
                          "caption": clean_text(v.get("caption") or "").strip()})

# forms (field sets captured from live pages; used to rebuild journeys)
form_by_page = {}
for f in forms:
    fields = f["fields"]
    if isinstance(fields, str):
        try:
            import ast
            fields = ast.literal_eval(fields)
        except Exception:
            fields = []
    form_by_page[route_of(f["url"])] = {"fields": fields}
json.dump(form_by_page, open(os.path.join(CONTENT, "forms-source.json"), "w"), indent=1, ensure_ascii=False)

# Publish count-free network prose; keep the captured audit unchanged.
from release_copy import owner_rulings
pages = owner_rulings(pages)

# words + search source
for rt, p in pages.items():
    parts = []
    if p["banner"]:
        parts += [p["banner"]["tagline"], " ".join(text_of_html(x) for x in p["banner"]["subtitle"]), text_of_html(p["banner"]["rest"])]
    parts += [text_of_html(s["html"]) for s in p["sections"]]
    p["text"] = clean_text(" ".join(parts)).strip()
    p["words"] = len(p["text"].split())

json.dump(pages, open(os.path.join(CONTENT, "pages.json"), "w"), ensure_ascii=False)
json.dump(doc_rows, open(os.path.join(CONTENT, "legacy-docs.json"), "w"), indent=1, ensure_ascii=False)

with open(os.path.join(OUT, "media-log.csv"), "w", newline="") as fh:
    w = csv.writer(fh)
    w.writerow(["source_path", "public_src", "width", "height", "sha256_original", "provenance"])
    for k, v in sorted(media_log.items()):
        w.writerow([k, v["src"], v["w"], v["h"], v["sha256"], "kairali.com live capture 29 Sep 2026 (company site asset)"] if v
                   else [k, "", "", "", "", "NOT AVAILABLE in capture"])
with open(os.path.join(OUT, "deliberate-changes.csv"), "w", newline="") as fh:
    w = csv.writer(fh)
    w.writerow(["route", "change", "detail"])
    for c in sorted(set(changes)):
        w.writerow(c)

print(f"pages={len(pages)} missing_raw={missing_raw} media={sum(1 for v in media_log.values() if v)}/{len(media_log)} docs={len(doc_map)}")
