# Cloudflare two-plane rule
Cloudflare = control plane for ALL domains (DNS + registrar consolidation target).
- Factory sites on Vercel → DNS-only (grey cloud) — Vercel provides its own edge; never proxy.
- Legacy/WP on our origins → proxied (orange cloud) + WAF + caching + bot rules.
- DNS flips are FOREVER-HUMAN (Abilash/Ambuj). The agent prepares records, never applies them. guard.sh hard-blocks DNS API calls.
