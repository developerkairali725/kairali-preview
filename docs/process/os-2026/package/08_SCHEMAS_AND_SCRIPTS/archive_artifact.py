#!/usr/bin/env python3
"""Archive one or more report files and emit a SHA-256 evidence manifest."""
import argparse, hashlib, json, mimetypes, shutil
from pathlib import Path
from datetime import datetime, timezone

def sha256(p):
    h=hashlib.sha256()
    with p.open('rb') as f:
        for b in iter(lambda:f.read(1024*1024),b''): h.update(b)
    return h.hexdigest()

ap=argparse.ArgumentParser()
ap.add_argument('--project-id',required=True); ap.add_argument('--run-id',required=True); ap.add_argument('--artifact-id',required=True)
ap.add_argument('--source-tool',required=True); ap.add_argument('--tool-version',default='unknown'); ap.add_argument('--operator',required=True)
ap.add_argument('--out-dir',required=True); ap.add_argument('files',nargs='+')
a=ap.parse_args(); out=Path(a.out_dir); out.mkdir(parents=True,exist_ok=True)
items=[]
for srcs in a.files:
    src=Path(srcs); dst=out/src.name; shutil.copy2(src,dst)
    items.append({'path':dst.name,'sha256':sha256(dst),'bytes':dst.stat().st_size,'mime_type':mimetypes.guess_type(dst.name)[0] or 'application/octet-stream'})
manifest={'artifact_id':a.artifact_id,'run_id':a.run_id,'project_id':a.project_id,'source_tool':a.source_tool,'tool_version':a.tool_version,'collected_at_utc':datetime.now(timezone.utc).isoformat(),'operator_agent':a.operator,'known_gaps':[],'files':items}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
print(out/'manifest.json')
