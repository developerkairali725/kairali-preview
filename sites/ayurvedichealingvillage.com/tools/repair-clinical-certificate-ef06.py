"""EF-06 (owner feedback, 26 Sep 2026): replace the provisional clinical-establishment registration
(T32563AY1145, issued 04-11-2023) with the latest issued certificate, verified from the source file
'Clinical Establishment Permanent Registration certificate.pdf' (Kerala State Council for Clinical
Establishments, Palakkad DRA, Form 7): Permanent Registration No P32563AY4104, issued 12-05-2025,
valid up to 10-05-2030; establishment at Olassery PO, Kodumba, Palakkad; person in charge Deepu John;
Ayurveda; single specialty hospital. Same 32563AY series as the provisional number. Image rendered
from the certificate PDF (Quick Look 1272x1800 → WebP); the PDF is served as a download with 22 stray
leading bytes before %PDF- removed (portal artefact), content otherwise unchanged. Idempotent."""
import json, hashlib
NEW = {
    "label": "Clinical establishment permanent registration — 2025–2030",
    "printedEvidence": {"number": "P32563AY4104", "printedIssueDate": "12-05-2025", "printedValidThrough": "10-05-2030",
                        "scope": "Permanent registration; Ayurveda; single specialty hospital; Palakkad District Registration Authority"},
    "src": "/ahv/assets/img/AHV-Clinical-Establishment-Permanent-Registration-2025.webp",
    "sourceUrl": None,
    "sourceSha256": hashlib.sha256(open("public/ahv/assets/doc/KTAHV-Clinical-Establishment-Permanent-Registration-P32563AY4104.pdf", "rb").read()).hexdigest(),
    "width": 1272, "height": 1800,
    "visualObservation": "Kerala clinical establishment permanent registration certificate (Form 7), P32563AY4104, valid to 10-05-2030",
    "document": "/ahv/assets/doc/KTAHV-Clinical-Establishment-Permanent-Registration-P32563AY4104.pdf",
    "ef06": "26 Sep 2026: replaces provisional T32563AY1145 (04-11-2023) with the latest issued permanent registration",
}
for f in ["public/ahv/assets/about-us-data.js", "public/ahv/assets/accreditations-data.js"]:
    t = open(f, encoding="utf-8").read(); i = t.index("{"); j = t.rstrip().rfind("}"); body = t[i:j + 1]
    d = json.loads(body)
    seps = next(s for s in [(",", ":"), (", ", ": ")] if json.dumps(d, ensure_ascii=False, separators=s) == body)
    n = 0
    def walk(o):
        global n
        if isinstance(o, dict):
            if o.get("label") in ("Clinical establishment provisional registration",) or (o.get("printedEvidence") or {}).get("number") in ("T32563AY1145", "P32563AY4104"):
                o.update(NEW); n += 1
            for v in o.values(): walk(v)
        elif isinstance(o, list):
            for v in o: walk(v)
    walk(d)
    if n: open(f, "w", encoding="utf-8").write(t[:i] + json.dumps(d, ensure_ascii=False, separators=seps) + t[j + 1:])
    print(f, "updated", n)
