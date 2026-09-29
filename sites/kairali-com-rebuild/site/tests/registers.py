#!/usr/bin/env python3
"""Source-to-render register and metadata-change register (evidence/)."""
import collections, csv, json, os, re
HERE = os.path.dirname(os.path.abspath(__file__)); SITE = os.path.dirname(HERE); REPO = os.path.dirname(SITE)
EVID = os.path.join(REPO, "evidence")
pages = json.load(open(os.path.join(SITE, "content", "pages.json")))
rep = json.load(open(os.path.join(EVID, "verify-report.json")))
seo = {r["route"]: r for r in rep["seo"]}
par = {r["route"]: r for r in rep["parity"]}
status = {r["route"]: r for r in rep["routes"]}
mapping = json.load(open(os.path.join(REPO, "reference", "route-family-mapping.json")))
def reason(t):
    t = t.lower()
    if "security code" in t: return "CAPTCHA replaced (anti-spam integration pending)"
    if re.search(r"please (enter|select|provide|present)|enter only numbers|valid email|mandatory", t): return "form validation message (shown on error in rebuilt form)"
    if t.strip().startswith(("gender", "address")) or "enter age" in t: return "field removed from general enquiry (owner Q7)"
    if t.startswith("mob:") or t.startswith("tel:"): return "empty phone stub removed (R-11)"
    if "courtesy: whyayurveda" in t: return "hidden popup shell in source (not content)"
    if "i have read and agree" in t: return "consent label rebuilt with links"
    if t.startswith("hospitality kairali"): return "application industry/company checkboxes (rendered as field options)"
    if "search results" in t or "minimise the load" in t: return "old AJAX search shell (search rebuilt)"
    if "awards & accrediations" in t: return "old section heading replaced by 'Awards and accreditations' (source typo)"
    if "download brochure" in t or "visit website" in t or "current opening" in t: return "rendered as opener action buttons (screen-reader text interleaved)"
    return "REVIEW"
# Cross-page check: a block "missing" here may be rendered elsewhere (e.g. Group Profile award records now live on
# the awards page). Only text actually present in another page's content counts as moved.
def _n(t): return re.sub(r"\W+", " ", t).lower().strip()
from html import unescape as _u
_elsewhere = {rt: _n(_u(re.sub(r"<[^>]+>", " ", " ".join(x["html"] for x in p["sections"] if not x.get("form"))))) for rt, p in pages.items()}
_awards = json.load(open(os.path.join(SITE, "content", "awards-browse.json")))
_elsewhere["/kairali-group-awards.aspx"] += " " + " ".join(_n(r["title"] + " " + r["summary"]) for r in _awards["records"])
def moved_to(text, route):
    n = _n(text)
    if len(n) < 12: return None
    for rt, body in _elsewhere.items():
        if rt != route and n in body: return rt
    return None
rows = []
for r in mapping["routes"]:
    rt = r["route"]; p = pages.get(rt); s = status.get(rt, {}); pr = par.get(rt, {})
    miss = pr.get("missing", [])
    for m in miss:
        m["moved"] = moved_to(m["text"], rt)
    rows.append({"route": rt, "classification": r["classification"], "family": r["wf_family"], "template": r["template"], "disposition": r["action"],
                 "http_status": s.get("status"), "redirect_to": s.get("location", ""), "source_url": p["sourceUrl"] if p else "", "source_sha256": p["sourceSha256"] if p else "",
                 "rendered_words": p["words"] if p else "", "source_blocks": pr.get("blocks", ""), "unmatched_blocks": len(miss),
                 "unmatched_reasons": "; ".join(sorted({(f"rendered on {m['moved']}" if m.get("moved") else reason(m["text"])) for m in miss})), "owner_fact": r.get("owner_fact", "")})
for o in mapping["observations_not_in_215"]:
    rt = o["route"]; s = status.get(rt, {}); p = pages.get(rt)
    rows.append({"route": rt, "classification": "Observation: " + o["triage"], "family": "", "template": (p or {}).get("template") or "", "disposition": "discovered route (outside the 215)",
                 "http_status": s.get("status"), "redirect_to": s.get("location", ""), "source_url": (p or {}).get("sourceUrl", ""), "source_sha256": (p or {}).get("sourceSha256", ""),
                 "rendered_words": (p or {}).get("words", ""), "source_blocks": "", "unmatched_blocks": "", "unmatched_reasons": "", "owner_fact": ""})
with open(os.path.join(EVID, "source-to-render.csv"), "w", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
review = [(r["route"], r["unmatched_reasons"]) for r in rows if "REVIEW" in str(r["unmatched_reasons"])]
meta = []
for rt, p in pages.items():
    s = seo.get(rt) or seo.get(rt.replace("&", "&")) or {}
    meta.append({"route": rt, "live_title": p["title"], "new_title": s.get("title", ""), "title_changed": p["title"] != s.get("title"),
                 "live_description": p["description"], "new_description": s.get("description", ""), "description_changed": p["description"] != s.get("description"),
                 "canonical": s.get("canonical", ""), "og_image": s.get("og_image", ""), "jsonld": ",".join(x for x in s.get("jsonld", []) if x)})
with open(os.path.join(EVID, "metadata-register.csv"), "w", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=list(meta[0].keys())); w.writeheader(); w.writerows(meta)
unm = [(r["route"], m) for r in rows for m in (par.get(r["route"], {}).get("missing", []))]
buckets = collections.Counter("moved" if m.get("moved") else reason(m["text"]) for _, m in unm)
words = collections.Counter()
for _, m in unm: words["moved" if m.get("moved") else reason(m["text"])] += m["words"]
with open(os.path.join(EVID, "parity-classification.csv"), "w", newline="") as fh:
    w = csv.writer(fh); w.writerow(["route", "unmatched_text", "words", "classification"])
    for rt, m in unm: w.writerow([rt, m["text"], m["words"], f"rendered on {m['moved']}" if m.get("moved") else reason(m["text"])])
print("parity buckets (blocks):", dict(buckets)); print("parity buckets (words):", dict(words))
print("routes", len(rows), "| review-needed unmatched:", review[:10])
print("titles changed", sum(m["title_changed"] for m in meta), "| descriptions changed", sum(m["description_changed"] for m in meta), "of", len(meta))
