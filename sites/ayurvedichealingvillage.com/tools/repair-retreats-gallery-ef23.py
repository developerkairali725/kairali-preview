"""EF-23 (owner feedback, 26 Sep 2026): the last two /retreats-gallery/ tiles were two frames of the
same hammock shot. Drops grounds-people-woman-rests-white-12 (the wider -13 stays) from the served
dataset, its overlay copy and the galleries-2026 manifest (counts.after adjusted). The generator
excludes the same sha256 (NEAR_DUPLICATES in tools/build-galleries-2026.mjs). Idempotent."""
import json
DROP = "grounds-people-woman-rests-white-12"

def strip(o):
    n = 0
    if isinstance(o, dict):
        for k, v in list(o.items()):
            if isinstance(v, list):
                keep = [x for x in v if not (isinstance(x, dict) and DROP in str(x.get("src", "")) )]
                n += len(v) - len(keep); o[k] = keep
                for x in keep: n += strip(x)
            else:
                n += strip(v)
    elif isinstance(o, list):
        for x in o: n += strip(x)
    return n

for f in ["public/ahv/assets/photo-collections-data.js", "english-candidate/package-overlay/assets/photo-collections-data.js"]:
    t = open(f, encoding="utf-8").read(); i = t.index("{"); j = t.rstrip().rfind("}"); body = t[i:j + 1]
    d = json.loads(body); dumps = lambda o: json.dumps(o, ensure_ascii=False, separators=(",", ":"))
    assert dumps(d) == body
    r = next(x for x in d["routes"] if x["path"] == "/retreats-gallery/")
    n = strip(r)
    if n:
        open(f, "w", encoding="utf-8").write(t[:i] + dumps(d) + t[j + 1:])
    print(f, "removed", n, "photos now", len(r.get("photos", [])), "chapter sizes", [len(c["images"]) for c in r["chapters"]])

m = "english-candidate/galleries-2026.json"; mt = open(m, encoding="utf-8").read(); md = json.loads(mt)
ind = 2 if mt.startswith('{\n  "') else 1
r = next(x for x in md["routes"] if x["path"] == "/retreats-gallery/")
n = strip(r)
if n:
    r["counts"]["after"] -= n
    r.setdefault("ef23", "26 Sep 2026: near-duplicate hammock frame (-12) removed; -13 kept (owner feedback EF-23).")
    open(m, "w", encoding="utf-8").write(json.dumps(md, ensure_ascii=False, indent=ind) + ("\n" if mt.endswith("\n") else ""))
print(m, "removed", n, "counts", r["counts"])
