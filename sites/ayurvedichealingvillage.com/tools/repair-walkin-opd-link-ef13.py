"""EF-13 (owner feedback, 26 Sep 2026): /walk-in-ayurveda-treatment/ lists therapy durations (checked:
Abhyangam 45, Shirodhara 55, Takradhara 55, Pizhichil 55, Yoga 60 min — equal to the approved OPD
edition 20260925-R1) but never pointed to the approved OPD rate sheet. Adds one line after the table
linking the approved EN-INR PDF (the locale build maps it to each language's own edition). Idempotent."""
import json
f = "public/ahv/assets/enquiry-family-data.js"
PDF = "/documents/pdf/outpatient-day-treatment-rates/en/KTAHV-Outpatient-Day-Treatment-Rates-EN-INR_20260925-R1.pdf"
t = open(f, encoding="utf-8").read(); i = t.index("{"); j = t.rstrip().rfind("}"); body = t[i:j + 1]
d = json.loads(body)
seps = next(s for s in [(",", ":"), (", ", ": ")] if json.dumps(d, ensure_ascii=False, separators=s) == body)
done = False
def walk(o):
    global done
    if isinstance(o, list):
        for k, x in enumerate(o):
            if isinstance(x, dict) and x.get("kind") == "table" and "Abhyangam (Four-Handed Massage)" in json.dumps(x, ensure_ascii=False):
                nxt = o[k + 1] if k + 1 < len(o) else None
                if not (isinstance(nxt, dict) and nxt.get("ptr") == "/ef13/opd-rates"):
                    o.insert(k + 1, {"kind": "para", "ptr": "/ef13/opd-rates", "tree": [
                        {"k": "e", "tag": "a", "attrs": {"href": PDF}, "c": [{"k": "t", "v": "Outpatient treatment rates and durations (PDF)"}]}],
                        "text": "Outpatient treatment rates and durations (PDF)", "ef13": "26 Sep 2026: link to the approved OPD rate sheet"})
                done = True; return
            walk(x)
    elif isinstance(o, dict):
        for v in o.values(): walk(v)
walk(d)
new = t[:i] + json.dumps(d, ensure_ascii=False, separators=seps) + t[j + 1:]
if new != t: open(f, "w", encoding="utf-8").write(new)
print("table found", done, "changed", new != t)
