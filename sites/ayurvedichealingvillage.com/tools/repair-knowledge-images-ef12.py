"""EF-12 (owner feedback, 26 Sep 2026): five knowledge-centre articles showed only the shared aerial
banner — no image of what they discuss. Each gets ONE relevant image, inserted after the article's first
paragraph, from the Palakkad library only (ahv-edited/…PALAK KAD…, provenance certain — see the EF-19
contact sheet for why other folders are not used), 768px variants, alt as recorded in the gallery
manifest. Idempotent (block ptr /ef12/img)."""
import json
IMG = {
    "/what-is-panchkarma/": ("reader25a-family-data.js", "article", "/ahv/assets/img/gallery-2026/treatments/sweda-steam-patient-stepping-traditional-02-768.webp", 511, 768,
        "Patient stepping into a traditional wooden steam chamber with doors open and steam rising"),
    "/what-is-yoga/": ("reader25a-family-data.js", "article", "/ahv/assets/img/gallery-2026/photo/yoga-side-female-patient-02-768.webp", 768, 511,
        "Side view of female patient in crescent lunge with arms extended overhead on a teal mat in a bright glass-walled hall"),
    "/why-pick-a-yoga-or-yoga-retreat/": ("reader25a-family-data.js", "article", "/ahv/assets/img/gallery-2026/yoga/hall-yoga-female-patient-senior-02-768.webp", 768, 511,
        "Female patient and senior yoga instructor facing each other in namaste greeting inside a bright yoga hall with large windows"),
    "/retreats-for-everyone/": ("reader6c-family-data.js", "article", "/ahv/assets/img/gallery-2026/retreats/grounds-people-rear-woman-walking-11-768.webp", 768, 511,
        "Rear view of a woman walking away along a paved garden path lined with lawns"),
    "/yoga-retreats-for-everyone/": ("seven-informational-data.js", "section-3", "/ahv/assets/img/gallery-2026/photo/yoga-large-hall-exposed-03-768.webp", 768, 512,
        "Large yoga hall with exposed timber trussed roof and clerestory glazing"),
}
files = {}
for route, (fname, comp, src, w, h, alt) in IMG.items():
    f = "public/ahv/assets/" + fname
    if f not in files:
        t = open(f, encoding="utf-8").read(); i = t.index("{"); j = t.rstrip().rfind("}"); body = t[i:j + 1]
        d = json.loads(body); seps = next(s for s in [(",", ":"), (", ", ": ")] if json.dumps(d, ensure_ascii=False, separators=s) == body)
        files[f] = [t, i, j, d, seps, 0]
    d = files[f][3]
    rec = next(r for r in d["routes"] if r["path"] == route)
    c = next(x for x in rec["components"] if x["component"] == comp)
    if any(b.get("ptr") == "/ef12/img" for b in c["blocks"]): continue
    k = next((n for n, b in enumerate(c["blocks"]) if b.get("kind") == "para"), 0)
    c["blocks"].insert(k + 1, {"kind": "image", "ptr": "/ef12/img", "src": src, "alt": alt, "width": w, "height": h, "sourceUrl": src,
                               "external": False, "ef12": "26 Sep 2026: relevant Palakkad-library image (article had only the shared banner)"})
    files[f][5] += 1
for f, (t, i, j, d, seps, n) in files.items():
    if n: open(f, "w", encoding="utf-8").write(t[:i] + json.dumps(d, ensure_ascii=False, separators=seps) + t[j + 1:])
    print(f.split("/")[-1], "inserted", n)
