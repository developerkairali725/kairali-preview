"""EF-11 (owner feedback, 26 Sep 2026): /village-facilities/ — only verifiable corrections.
  · tiles that link: the image now links to the same page as the caption;
  · 'Beauty Therapy': a programme-rename sweep had replaced the facility caption with the eye
    programme's register name ('Vision Health & Eye Rejuvenation Therapy', /beauty-care-and-eye-care/),
    a wrong destination for a beauty-therapy facility. The facility caption is restored as text; no
    beauty-therapy page exists to link.
Facility facts (Charm Science Experts, Conference Hall, Recreation & Business Centre, Amphitheatre image)
are NOT edited: they need owner verification (EF-11 disposition). Idempotent."""
import json
f = "public/ahv/assets/collection-family-data.js"
t = open(f, encoding="utf-8").read(); i = t.index("{"); j = t.rstrip().rfind("}"); body = t[i:j + 1]
d = json.loads(body); dumps = lambda o: json.dumps(o, ensure_ascii=False, separators=(",", ":"))
assert dumps(d) == body
r = next(x for x in d["routes"] if x["path"] == "/village-facilities/")
out = []
def walk(o):
    if isinstance(o, dict):
        if o.get("kind") == "card": out.append(o)
        for v in o.values(): walk(v)
    elif isinstance(o, list):
        for v in o: walk(v)
walk(r)
n = 0
for c in out:
    img = next((b for b in c["blocks"] if b["kind"] == "image"), None)
    para = next((b for b in c["blocks"] if b["kind"] == "para"), None)
    if not img or not para: continue
    if img.get("alt") == "Beauty Therapy" and "Vision Health" in json.dumps(para["tree"]):
        para["tree"] = [{"k": "t", "v": "Beauty Therapy"}]; img.pop("linkHref", None); n += 1; continue
    a = next((x for x in para["tree"] if x.get("tag") == "a"), None)
    if a and img.get("linkHref") != a["attrs"]["href"]:
        img["linkHref"] = a["attrs"]["href"]; n += 1
new = t[:i] + dumps(d) + t[j + 1:]
if new != t: open(f, "w", encoding="utf-8").write(new)
print("changes", n)
