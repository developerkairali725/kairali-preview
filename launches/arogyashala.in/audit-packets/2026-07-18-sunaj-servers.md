# Human-audit packet — SUNAJ, SERVERS/DNS (Gate E) · arogyashala.in

**Prepared: 2026-07-18 16:15:30 IST · roadmap PROMPT 4 single-pager pilot · packet owner: Sunaj (sysadmin@kairali.com) — tech lead, DNS/registrar/infra · CC director@kairali.com**
**Status: PACKET ONLY — nothing has been emailed; sending is a separate owner-approved step. NO DNS ACTION IS REQUESTED NOW — cutover happens only on Abilash's explicit go.**

## The one link you need

**Preview URL: https://kairali-web-factory-arogyashala-in.vercel.app**
(Vercel-hosted static build. Custom domain NOT attached; that is the flip, and it is a human action.)

## The domain picture for this site

- **arogyashala.in** — the NEW domain this site will live on. Currently no site serves on it.
- **arogyashala.co.in** — the LEGACY live site (14 .aspx pages, mined). It keeps serving until the flip. At cutover it becomes a forward: the plan of record is a **forward HOLD lift** — .co.in 301s to the new .in (the new site already absorbs the 14 legacy .aspx paths internally, single-hop, incl. the real-world typo path `/pirvacy-policy.aspx`).

## Your checks (reply per item, short bullets)

1. **DNS control** — confirm where arogyashala.in and arogyashala.co.in DNS/registrar are managed and that we can edit records quickly on flip day. Flag NOW if access to either is uncertain. (Target setup at flip: Cloudflare, grey-cloud for the Vercel record per the two-plane rule.)
2. **Current-host inventory (arogyashala.co.in)** — what runs on that host today besides the website: mailboxes/MX, subdomains, cron/webhooks, FTP users. Anything that must be preserved or archived before pointing away — MX above all, so the flip cannot break mail.
3. **SSL** — Vercel auto-issues certs at domain-attach. From your side: any HSTS preload, CAA records, or wildcard-cert dependencies on either domain that could interfere.
4. **Redirect plan** — at flip: (i) arogyashala.in → Vercel (A/CNAME per Vercel's attach instructions), (ii) arogyashala.co.in → 301 everything to https://arogyashala.in (host-level redirect at Cloudflare or the old host — your call which), old host then retired or archived. Confirm which of retire-vs-301 you'd run for the .co.in origin.
5. **Monitoring note (FYI, agent-side task)** — arogyashala.in is not yet in the uptime monitor (`scripts/uptime/sites.json`); it gets added the day it goes live. Nothing for you to do, listed so nothing hides.

## What to reply with

Per-item bullets. Item 1 (access certainty) is the only one that can block scheduling — flag it first if there is any doubt.
