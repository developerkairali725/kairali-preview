#!/bin/zsh
# Rebuild and restart the local preview on 127.0.0.1:8774 (local only).
cd "${0:A:h}/.."
[ -f ../logs/preview.pid ] && kill $(cat ../logs/preview.pid) 2>/dev/null
pnpm build > ../logs/build.log 2>&1 || { tail -40 ../logs/build.log; exit 1; }
grep -E "Generating static pages.*\(([0-9]+)/\1\)" ../logs/build.log | tail -1
nohup pnpm exec next start -H 127.0.0.1 -p 8774 > ../logs/preview.log 2>&1 &
echo $! > ../logs/preview.pid
for i in {1..40}; do curl -s -m 2 -o /dev/null http://127.0.0.1:8774/ && break; sleep 0.5; done
echo "preview: http://127.0.0.1:8774 (pid $(cat ../logs/preview.pid))"
