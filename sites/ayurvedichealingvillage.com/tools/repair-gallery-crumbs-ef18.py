"""EF-18 (owner feedback, 26 Sep 2026): gallery children must return to the Gallery family.
The photo-collection template draws no section rail, so public/design/section-nav.js never
rewrites its visible breadcrumb; the dataset still carried pre-tree chains (e.g. retreats under
News & Past Events, product under About Us) while the BreadcrumbList JSON-LD (schema.ts) is built
from the site tree. This writes the SAME tree chain — Home → section hub → tree ancestors → self,
tree labels — into the visible crumbs of every photo collection. Idempotent."""
import json

tree = json.load(open("english-candidate/site-tree.json", encoding="utf-8"))
title, hub_of = {}, {}
for s in tree["sections"]:
    hub_of[s["id"]] = s.get("hub")
    if s.get("hub"): title[s["hub"]] = s["title"]
    def walk(ns):
        for n in ns:
            if n.get("path"): title[n["path"]] = n["title"]
            walk(n.get("children", []))
    walk(s["children"])

def chain(path):
    placed = tree["index"][path]
    hub = hub_of.get(placed["section"])
    mids = ([hub] if hub and hub != path else []) + [a for a in placed["ancestors"] if a != hub]
    return [{"label": "Home", "path": "/"}] + [{"label": title[a], "path": a} for a in mids] + [{"label": title[path], "path": path}]

for f in ["public/ahv/assets/photo-collections-data.js", "english-candidate/package-overlay/assets/photo-collections-data.js"]:
    t = open(f, encoding="utf-8").read(); i = t.index("{"); j = t.rstrip().rfind("}"); body = t[i:j + 1]
    d = json.loads(body); dumps = lambda o: json.dumps(o, ensure_ascii=False, separators=(",", ":"))
    assert dumps(d) == body
    changed = []
    for r in d["routes"]:
        keys = set().union(*[c.keys() for c in r["crumbs"]])
        new = chain(r["path"])
        # keep the record's own crumb key names (label/path) and any extra keys it carries
        if [(c.get("label"), c.get("path")) for c in r["crumbs"]] != [(c["label"], c["path"]) for c in new]:
            r["crumbs"] = new; changed.append(r["path"])
    if changed:
        open(f, "w", encoding="utf-8").write(t[:i] + dumps(d) + t[j + 1:])
    print(f.split("/")[-2], "changed", changed)
for r in d["routes"]: print(" ", r["path"].ljust(24), " / ".join(c["label"] for c in r["crumbs"]))
