# Server audit — Sunaj's Phase-0 answers (2026-07-14 16:35:00 IST)

**Source: Sunaj's point-wise reply to "Priority asap" (Gmail thread 19f5fc4f1afdabc0, 15:59 IST) + independent verification. Screenshots windowstatus.jpeg + windowupdate.jpeg attached to the thread.**

## The two origin servers
| | Linux | Windows |
|---|---|---|
| IP | 165.22.220.165 | 162.241.139.5 |
| rDNS (verified) | **ktahv.redhoney.in** | kairaliayurveda.com |
| Provider | DigitalOcean range; hostname reveals **RedHoney (redhoney.in) = the managing IT vendor** — "the Linux server" and "the DigitalOcean droplet" are the SAME box (resolves the blush-lounge hosting confusion) | Unified Layer/Bluehost range |
| Panel | — | **Plesk** |
| Backups | "RedHoney, weekly" — i.e. the vendor runs weekly backups | same claim |
| Internet-exposed | **SSH: YES** | **RDP: YES** |

## Verified fixes (curl/dig, 16:30 IST)
- **theblushlounge.com: RESTORED — HTTP 200** ("Its Resolved" confirmed). Sneha's live site is back.
- **arogyashala.in: DNS RESTORED** — now resolves (3.33.130.190 / 15.197.148.33 = GoDaddy parking infra); no HTTPS site served yet. Registrar = GoDaddy; DNS managed via **Cloudflare**. Forward-farm row for arogyashala.co.in stays HELD until .in serves real content (still a parking target).
- **Cloudflare admin access granted to director@kairali.com** (Sunaj) — the control plane is now reachable; bulk-redirect upload becomes a human dashboard action.

## FINDINGS — hardening recommendations (prepare-only; Sunaj executes, per rules)
1. **RDP open to the internet on the production Windows box = highest-priority hardening item.** Recommend: restrict RDP to an IP allowlist (office + Sunaj) or move behind VPN/Cloudflare Access; enable NLA + account lockout. SSH on the Linux box: keys-only, disable password auth, fail2ban.
2. **Two credentials transited WhatsApp** (read-only Linux login + KTAHV WP application password) — against the stated handling rule. Actions: (a) store both into env via terminal (never chat/git), (b) ROTATE both — the WP application password is 30 seconds to delete + regenerate; the Linux user likewise. Pattern reminder sent.
3. **Backups**: tool/destination unverified — "RedHoney weekly" is a vendor claim with no status screenshot. Ask: where do backups live (offsite?), retention, last successful restore test. A backup never restore-tested is a hope, not a backup.
4. Windows Update status: screenshots received (windowstatus.jpeg, windowupdate.jpeg in the thread) — review pending.

## Still open from the audit ask
- Backup status screenshot · DB inventory per site (the sheet's "hosted" column covers sites, not databases) · Plesk version/patch level.
