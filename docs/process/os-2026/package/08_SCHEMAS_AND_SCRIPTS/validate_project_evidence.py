#!/usr/bin/env python3
"""Basic project evidence validator. It does not replace professional QA."""
import argparse, csv, json, hashlib
from pathlib import Path
ap=argparse.ArgumentParser(); ap.add_argument('project_root'); a=ap.parse_args(); root=Path(a.project_root)
errors=[]; manifests=list(root.rglob('manifest.json'))
if not manifests: errors.append('No manifest.json files found')
for mp in manifests:
    try: m=json.loads(mp.read_text())
    except Exception as e: errors.append(f'{mp}: invalid JSON: {e}'); continue
    for k in ['artifact_id','run_id','project_id','source_tool','collected_at_utc','files']:
        if k not in m: errors.append(f'{mp}: missing {k}')
    for item in m.get('files',[]):
        p=mp.parent/item.get('path','')
        if not p.exists(): errors.append(f'{mp}: missing file {p}'); continue
        h=hashlib.sha256(p.read_bytes()).hexdigest()
        if h!=item.get('sha256'): errors.append(f'{mp}: hash mismatch {p}')
print(json.dumps({'project_root':str(root),'manifest_count':len(manifests),'errors':errors,'pass':not errors},indent=2))
raise SystemExit(1 if errors else 0)
