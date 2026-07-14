# DELEGATION PROTOCOL — how the agent hands human work to the team

**Established: Abilash directive, 2026-07-14 17:55 IST. Binding process.**

The agent constantly finds work that only a human can do — a compliance
infringement to correct, stale content, a fact to confirm, an asset to
produce. Rather than let these pile up in QUESTIONS.md where nobody outside
this session sees them, they are routed into the company's real delegation
system through Abilash's EA.

## Two channels
1. **Email → Ritu (PRIMARY — Abilash: "faster and more foolproof").** The
   mechanism below. Use this by default.
2. **Bulk-upload delegation sheet** (Google Sheet `1iG770sUhs2t54ryebH_DmNadkpiizXfcgi-eH48QskE`,
   "Delegation - Bulk Upload Sheet To Master Delegation v2") — feeds Abilash's
   master delegation list. The agent may add rows here directly; a row
   auto-submits when all required fields are filled, OR the agent fills just
   Task + Doer and the delegated person completes the blanks. Columns:
   **Doer\*** (dropdown of named people — this is the authoritative team name
   list), **Task\***, First Date, **Company** (dropdown), **Assigned By**
   (dropdown), **Task Priority\***, Ease to Implement (1–10, 10=easiest),
   Relative Impact on Result (1–10), Urgency (1–5), Importance (1–5),
   Emotional Energy (1–5), Significance (1–5). Use the sheet for bulk/batch
   delegations or where a named Doer + scoring is wanted; email for anything
   needing a written explanation. When the agent adds a sheet row, still log
   it in delegation-log.md.

## The mechanism (email channel)
1. When the agent finds a delegatable item, it **drafts an email** in
   Abilash's Gmail (director@kairali.com):
   - **TO:** the person who owns the fix (the "main person").
   - **CC:** always **Ritu — ea.abhilash@kairali.com** (Abilash's EA).
   - Subject + body: one clear ask, or a numbered list of individual points
     (each infringement / task = its own numbered point, so it can be
     assigned and tracked separately).
2. Abilash reviews the draft and **sends** it (the send is always human —
   same rule as every outward email).
3. Ritu receives the CC and **logs each point into the delegation system**;
   the main person actions it in due course.

## Rules
- **One draft, itemized** — group related infringements into a single email
  with numbered points, so Ritu can split them into individual delegations.
  Don't spam one email per tiny fix.
- **The agent drafts, never sends.** Human send-gate is absolute.
- **Every draft is also logged** here in `docs/delegation-log.md` (append
  a row: date · to · subject · points · status) so the repo has a record
  independent of the mailbox.
- **This protocol applies to ANY delegatable work**, not just compliance:
  content confirmation, asset production, data the agent can't verify —
  if a named human must act, draft-to-owner + CC-Ritu is the channel.
- The agent still uses QUESTIONS.md for things only **Abilash** decides
  (rulings, money, strategy). Delegation-to-team = this protocol; ruling
  needed = QUESTIONS.md.

## Standing routing (who owns what)
| Domain | Owner (TO) | Notes |
|---|---|---|
| Marketing copy / banned-word & register infringements | Anupam (head of marketing, mkt@ktahv.com) + the site's marketing owner | CC Ritu always |
| Product/brand marketing | Astha (ho.mkt@kairaliproducts.com) | |
| Infra / servers / DNS / domains | Sunaj (sysadmin@kairali.com) | |
| CRM / forms / dashboards | Satyam (dme@kairali.com) | |
| WP execution | Deepu (developer@kairali.com) | NOT Dr. Deepu John |
| Clinical / medical sign-off | Dr. Deepu John | never conflate with Deepu |
| EA / delegation logging | **Ritu — ea.abhilash@kairali.com** | CC on every delegation |

> OPEN: Abilash mentioned a second marketing recipient heard as "Slaget"
> for banned-word infringements — identity/email unconfirmed. Drafts route to
> Anupam + CC Ritu until Abilash confirms who to add.

## Routing addition — 2026-07-14 22:40:00 IST
| developers6@kairali.com | NEW developer (name TBD — Abilash, 14 Jul) | Website/WordPress execution fixes (KTAHV live site technical tasks). First delegation: 4-point technical fix email (consent checkboxes, Resort→Hospital schema, DE hygiene, staging confirm). Deepu remains the established WP executor; clarify division of labour when the new developer's name/role lands. |
