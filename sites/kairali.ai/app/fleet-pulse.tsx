// ---- FLEET PULSE v2 — calm mission control (schema-2) ---------------------
// D-20260719-32: "better-looking dashboard … statuses of all the websites
// being monitored or built or to be built."
//
// Design intent: dark ink surface, ONE restrained accent family sampled from
// the Kairali brand anchors (forest #006038 / leaf #8E9D35 for "good",
// marigold-300 #F0BF3E for "waiting" — the manual's own accent-on-dark step,
// bronze #C1882C for the warm display voice). No card-shadow soup, no
// gradients. Numbers and headers speak in one display face (Fraunces via
// next/font); data speaks in the system mono. Reads at a glance on a phone;
// rewards a longer look on desktop.
//
// HARD GATE 6: everything rendered is machine-derived from status-data.json.
// A missing fact renders as its honest absence ("—", "unarmed", "none"),
// never a guess. STATUS.yaml is the truth; this board is a generated view.

import { Fraunces } from "next/font/google";
import type { CSSProperties } from "react";
import type { Evidence, FrontGate, OsMilestone, Site2, Snapshot2 } from "./schema";

const fraunces = Fraunces({ subsets: ["latin"], weight: ["500", "600", "700"], display: "swap" });

// ---- palette (internal-dashboard look; brand accents sampled, not imported)
const BG = "#0E1410"; // ink surface
const CARD = "#161F19";
const CARD_UP = "#1B2620";
const LINE = "rgba(247,244,234,0.11)";
const TEXT = "#F2F0E6"; // ivory on ink — ~15:1
const MUTED = "#A9B4A6"; // ~7:1 on CARD
const FAINT = "#7E8A7C"; // ~4.6:1 on CARD — smallest text stays AA
const GREEN = "#8E9D35"; // leaf-500 — approved / done
const FOREST = "#006038"; // forest-500 — fills, live
const AMBER = "#F0BF3E"; // marigold-300 — pending / waiting
const BRONZE = "#C88F35"; // bronze family, lifted one step for dark ground
const CHANGES = "#E06A4A"; // changes-requested (internal semantic, not brand)

// ---- lanes ----------------------------------------------------------------
const LANES: { id: string; label: string; hint: string; stages: string[] }[] = [
  { id: "to-build", label: "To build", hint: "ideation · research", stages: ["ideation", "research"] },
  { id: "building", label: "Building", hint: "build", stages: ["build"] },
  { id: "in-gates", label: "In gates", hint: "gates · preview", stages: ["gates", "preview"] },
  { id: "human-audit", label: "Human audit", hint: "human_audit · ok_to_publish", stages: ["human_audit", "ok_to_publish"] },
  { id: "live", label: "Live", hint: "live", stages: ["live"] },
  { id: "monitoring", label: "Monitoring", hint: "monitoring", stages: ["monitoring"] },
];

const STAGE_LABEL: Record<string, string> = {
  ideation: "ideation",
  research: "research",
  build: "build",
  gates: "gates",
  preview: "preview",
  human_audit: "human audit",
  ok_to_publish: "ok to publish",
  live: "live",
  monitoring: "monitoring",
};

const GATE_COLOR: Record<FrontGate["status"], string> = {
  approved: GREEN,
  pending: AMBER,
  changes: CHANGES,
  none: "transparent",
};

const dash = (v: unknown) => (v === null || v === undefined || v === "" ? "—" : String(v));

// ---- OS header strip ------------------------------------------------------

function MilestoneStep({ m }: { m: OsMilestone }) {
  const style: Record<OsMilestone["state"], CSSProperties> = {
    done: { background: FOREST, borderColor: FOREST, color: "#EAF3EA" },
    "in-review": { background: "transparent", borderColor: AMBER, color: AMBER },
    next: { background: "transparent", borderColor: BRONZE, color: BRONZE, borderStyle: "dashed" },
    pending: { background: "transparent", borderColor: LINE, color: FAINT },
  };
  return (
    <li className="mstep" aria-label={`${m.id} ${m.label}: ${m.state}`}>
      <span className={`mdot ${fraunces.className}`} style={style[m.state]}>
        {m.id}
      </span>
      <span className="mlabel">{m.label}</span>
      <span className="mstate" style={{ color: m.state === "done" ? GREEN : m.state === "in-review" ? AMBER : m.state === "next" ? BRONZE : FAINT }}>
        {m.state}
      </span>
    </li>
  );
}

function Tile({ n, label, sub }: { n: string; label: string; sub?: string }) {
  return (
    <div className="tile">
      <span className={`tilenum ${fraunces.className}`}>{n}</span>
      <span className="tilelabel">{label}</span>
      {sub ? <span className="tilesub">{sub}</span> : null}
    </div>
  );
}

function OsStrip({ os }: { os: Snapshot2["os"] }) {
  return (
    <section className="osstrip" aria-label="OS status">
      <ol className="msteps">
        {os.milestones.map((m) => (
          <MilestoneStep key={m.id} m={m} />
        ))}
      </ol>
      <div className="tiles">
        <Tile n={String(os.strict_residues)} label="strict residues" />
        <Tile n={String(os.unacked_directives)} label="unacked directives" />
        <Tile n={String(os.open_questions)} label="open questions" />
        <Tile n={String(os.decisions)} label="decisions" />
        <Tile
          n={os.tests ? `${os.tests.pass}/${os.tests.total}` : "—"}
          label="tests"
          sub={os.tests ? undefined : "no run recorded"}
        />
      </div>
    </section>
  );
}

// ---- site card pieces -----------------------------------------------------

function GateDots({ gates }: { gates: FrontGate[] }) {
  if (gates.length === 0) {
    // No approvals.yaml ledger — the front gate is UNARMED for this site.
    // Four hollow dashed dots (the standard gate count) + an explicit hint:
    // the dots are presentation; "unarmed" is the fact.
    return (
      <span className="gates" title="no approvals.yaml ledger — front gates unarmed">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="dot unarmed" aria-hidden="true" />
        ))}
        <span className="gatesnote">unarmed</span>
      </span>
    );
  }
  const approved = gates.filter((g) => g.status === "approved").length;
  return (
    <span className="gates" role="img" aria-label={`front gates: ${gates.map((g) => `${g.gate} ${g.status}`).join(", ")}`}>
      {gates.map((g) => (
        <span
          key={g.gate}
          className={`dot ${g.status === "none" ? "hollow" : ""}`}
          style={g.status === "none" ? undefined : { background: GATE_COLOR[g.status], borderColor: GATE_COLOR[g.status] }}
          title={`${g.gate}: ${g.status}`}
        />
      ))}
      <span className="gatesnote">
        {approved}/{gates.length} approved
      </span>
    </span>
  );
}

function EvidencePips({ e }: { e: Evidence }) {
  const pips: { label: string; title: string; value: string; zero: boolean }[] = [
    { label: "go", title: `go-science evidence files: ${e.go_science}`, value: String(e.go_science), zero: e.go_science === 0 },
    { label: "beauty", title: `beauty evidence files: ${e.beauty}`, value: String(e.beauty), zero: e.beauty === 0 },
    {
      label: "dr",
      title: `design review passes — pre-content: ${e.design_review_pre}, post-build: ${e.design_review_post}`,
      value: `${e.design_review_pre}·${e.design_review_post}`,
      zero: e.design_review_pre === 0 && e.design_review_post === 0,
    },
    { label: "audits", title: `audit files: ${e.audits}`, value: String(e.audits), zero: e.audits === 0 },
    { label: "checklists", title: e.checklists ? "filled launch checklists present" : "no filled launch checklists", value: e.checklists ? "✓" : "—", zero: !e.checklists },
  ];
  return (
    <span className="pips">
      {pips.map((p) => (
        <span key={p.label} className={`pip ${p.zero ? "pipzero" : ""}`} title={p.title}>
          {p.label}&thinsp;{p.value}
        </span>
      ))}
    </span>
  );
}

function SiteLinks({ site }: { site: Site2 }) {
  const live = site.live_url ?? null;
  const preview = site.preview_url ?? null;
  return (
    <span className="links">
      {live ? (
        <a className="lnk lnklive" href={live} target="_blank" rel="noopener noreferrer">
          live&nbsp;↗
        </a>
      ) : null}
      {preview ? (
        <a className="lnk" href={preview} target="_blank" rel="noopener noreferrer">
          preview&nbsp;↗
        </a>
      ) : null}
      {!live && !preview ? <span className="localonly">local only</span> : null}
    </span>
  );
}

function SiteCard({ site }: { site: Site2 }) {
  const v = site.vector;
  return (
    <article className="site">
      <header className="siterow">
        <h4 className="sitename">{site.name}</h4>
        {site.phase !== null ? (
          <span className={`phase ${fraunces.className}`} title={`lifecycle phase ${site.phase} of 0–8`}>
            P{site.phase}
            <span className="phaseof">/8</span>
          </span>
        ) : null}
      </header>

      <div className="chiprow">
        <span className="chip entity">{site.entity}</span>
        <span className="chip stage">{STAGE_LABEL[site.stage] ?? site.stage}</span>
      </div>

      <GateDots gates={site.front_gates} />
      <EvidencePips e={site.evidence} />

      {site.waiting_on.length > 0 ? (
        <div className="waitrow">
          <span className="waitlabel">waiting on</span>
          {site.waiting_on.map((w) => (
            <span key={w} className="waitchip">
              {w}
            </span>
          ))}
        </div>
      ) : null}

      <footer className="sitefoot">
        <span className="upd" title="last updated in STATUS.yaml">
          upd {dash(site.updated)}
        </span>
        <SiteLinks site={site} />
      </footer>

      <details className="detail">
        <summary>details</summary>
        <dl className="dl">
          <dt>owner</dt>
          <dd>{dash(site.owner)}</dd>
          <dt>vector</dt>
          <dd>
            {v ? (
              <>
                {v.site_class} · {v.business_model} · {v.asset_situation} · {v.entity_register} · {v.platform}
              </>
            ) : (
              "— not classified yet"
            )}
          </dd>
          <dt>phase</dt>
          <dd>{site.phase !== null ? `${site.phase} of 0–8` : "—"}</dd>
          <dt>evidence</dt>
          <dd>
            go-science {site.evidence.go_science} · beauty {site.evidence.beauty} · design review {site.evidence.design_review_pre} pre /{" "}
            {site.evidence.design_review_post} post · audits {site.evidence.audits} · checklists {site.evidence.checklists ? "present" : "absent"}
          </dd>
          <dt>blocker</dt>
          <dd className="blocker">{site.blocker ?? "none"}</dd>
        </dl>
      </details>
    </article>
  );
}

// ---- the board ------------------------------------------------------------

export default function FleetPulse({ data }: { data: Snapshot2 }) {
  const { os, sites } = data;

  const laneOf = (s: Site2) => LANES.find((l) => l.stages.includes(s.stage));
  const unmapped = sites.filter((s) => !laneOf(s));

  const stageIndex = (stage: string) => {
    for (const l of LANES) {
      const i = l.stages.indexOf(stage);
      if (i !== -1) return i;
    }
    return 99;
  };
  const sortSites = (list: Site2[]) =>
    [...list].sort((a, b) => {
      const d = stageIndex(a.stage) - stageIndex(b.stage);
      if (d !== 0) return d;
      return String(b.updated ?? "").localeCompare(String(a.updated ?? ""));
    });

  return (
    <main className="fp">
      <style>{CSS}</style>

      <header className="hd">
        <div>
          <p className="eyebrow">Kairali Web Factory · internal</p>
          <h1 className={fraunces.className}>Fleet Pulse</h1>
        </div>
        <p className="hdmeta">
          <span className="hdnow">
            now: <b>{os.milestone}</b>
          </span>
          <span className="hdstamp">generated {data.generated}</span>
        </p>
      </header>

      <OsStrip os={os} />

      <section aria-label="pipeline board">
        {LANES.map((lane) => {
          const laneSites = sortSites(sites.filter((s) => lane.stages.includes(s.stage)));
          return (
            <section key={lane.id} className="lane" aria-label={`${lane.label} — ${laneSites.length} sites`}>
              <header className="lanehd">
                <h2 className={fraunces.className}>{lane.label}</h2>
                <span className={`lanecount ${fraunces.className}`}>{laneSites.length}</span>
                <span className="lanehint">{lane.hint}</span>
              </header>
              {laneSites.length > 0 ? (
                <div className="lanegrid">
                  {laneSites.map((s) => (
                    <SiteCard key={s.name} site={s} />
                  ))}
                </div>
              ) : (
                <p className="laneempty">none</p>
              )}
            </section>
          );
        })}

        {unmapped.length > 0 ? (
          <section className="lane" aria-label={`Unmapped stage — ${unmapped.length} sites`}>
            <header className="lanehd">
              <h2 className={fraunces.className}>Unmapped stage</h2>
              <span className={`lanecount ${fraunces.className}`}>{unmapped.length}</span>
              <span className="lanehint">stage value not in the lane map — shown, not hidden</span>
            </header>
            <div className="lanegrid">
              {unmapped.map((s) => (
                <SiteCard key={s.name} site={s} />
              ))}
            </div>
          </section>
        ) : null}
      </section>

      <footer className="pgfoot">
        <p>
          generated {data.generated} <span className="sep">·</span> {data.generated_utc} UTC
        </p>
        <p>
          <code>STATUS.yaml</code> is the truth; this board is a generated view. Internal · noindex.
        </p>
      </footer>
    </main>
  );
}

// ---- styles ---------------------------------------------------------------

const CSS = `
  body { background: ${BG}; }
  .fp { max-width: 1180px; margin: 0 auto; padding: 0 18px 72px; color: ${TEXT};
        font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        font-size: 15px; line-height: 1.5; }
  .fp code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.85em;
             background: rgba(247,244,234,0.07); padding: 1px 6px; border-radius: 4px; }
  .fp :focus-visible { outline: 2px solid ${AMBER}; outline-offset: 2px; border-radius: 3px; }

  /* header */
  .hd { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between;
        gap: 12px 24px; padding: 44px 0 26px; border-bottom: 1px solid ${LINE}; }
  .eyebrow { margin: 0; letter-spacing: 0.24em; font-size: 0.68rem; text-transform: uppercase;
             color: ${BRONZE}; }
  .hd h1 { margin: 4px 0 0; font-size: 2.6rem; font-weight: 600; letter-spacing: -0.01em; color: ${TEXT}; }
  .hdmeta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; margin: 0;
            text-align: right; }
  .hdnow { font-size: 0.85rem; color: ${MUTED}; }
  .hdnow b { color: ${AMBER}; font-weight: 650; }
  .hdstamp { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.72rem; color: ${FAINT}; }

  /* OS strip */
  .osstrip { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
             gap: 20px 32px; padding: 22px 0; border-bottom: 1px solid ${LINE}; }
  .msteps { display: flex; flex-wrap: wrap; gap: 4px 22px; list-style: none; margin: 0; padding: 0; }
  .mstep { display: flex; flex-direction: column; align-items: center; gap: 3px; min-width: 64px; }
  .mdot { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px;
          border-radius: 50%; border: 1.5px solid; font-size: 0.82rem; font-weight: 600;
          font-variant-numeric: tabular-nums; }
  .mlabel { font-size: 0.66rem; color: ${MUTED}; max-width: 110px; text-align: center; line-height: 1.25; }
  .mstate { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 0.08em; }
  .tiles { display: flex; flex-wrap: wrap; gap: 10px; }
  .tile { display: flex; flex-direction: column; gap: 1px; min-width: 96px; padding: 10px 14px;
          border: 1px solid ${LINE}; border-radius: 10px; background: ${CARD}; }
  .tilenum { font-size: 1.7rem; font-weight: 600; color: ${BRONZE}; line-height: 1.15;
             font-variant-numeric: tabular-nums; }
  .tilelabel { font-size: 0.64rem; text-transform: uppercase; letter-spacing: 0.1em; color: ${MUTED}; }
  .tilesub { font-size: 0.62rem; color: ${FAINT}; font-style: italic; }

  /* lanes */
  .lane { margin-top: 34px; }
  .lanehd { display: flex; align-items: baseline; gap: 10px; margin-bottom: 12px; }
  .lanehd h2 { margin: 0; font-size: 1.15rem; font-weight: 600; color: ${TEXT}; }
  .lanecount { font-size: 1.15rem; font-weight: 600; color: ${BRONZE}; font-variant-numeric: tabular-nums; }
  .lanehint { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.68rem; color: ${FAINT}; }
  .laneempty { margin: 0; padding: 14px 16px; border: 1px dashed ${LINE}; border-radius: 12px;
               color: ${FAINT}; font-size: 0.82rem; }
  .lanegrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 10px; }

  /* site card */
  .site { border: 1px solid ${LINE}; border-radius: 12px; padding: 14px 15px 11px; background: ${CARD}; }
  .siterow { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
  .sitename { margin: 0; font-weight: 650; font-size: 0.98rem; word-break: break-word; color: ${TEXT}; }
  .phase { flex: none; font-size: 1.05rem; font-weight: 600; color: ${BRONZE};
           font-variant-numeric: tabular-nums; }
  .phaseof { font-size: 0.7rem; color: ${FAINT}; }
  .chiprow { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .chip { display: inline-block; padding: 1px 9px; border-radius: 999px; font-size: 0.7rem;
          font-weight: 600; letter-spacing: 0.01em; white-space: nowrap; }
  .chip.entity { background: rgba(247,244,234,0.08); color: ${MUTED}; }
  .chip.stage { background: transparent; border: 1px solid rgba(142,157,53,0.55); color: ${GREEN}; }

  /* gate dots */
  .gates { display: flex; align-items: center; gap: 5px; margin-top: 11px; }
  .dot { width: 11px; height: 11px; border-radius: 50%; border: 1.5px solid ${LINE}; flex: none; }
  .dot.hollow { background: transparent; }
  .dot.unarmed { background: transparent; border-style: dashed; }
  .gatesnote { margin-left: 4px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
               font-size: 0.66rem; color: ${FAINT}; }

  /* evidence pips */
  .pips { display: flex; flex-wrap: wrap; gap: 4px 6px; margin-top: 8px; }
  .pip { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.66rem;
         padding: 1px 7px; border-radius: 6px; background: rgba(247,244,234,0.06); color: ${MUTED}; }
  .pip.pipzero { color: ${FAINT}; background: transparent; border: 1px dashed ${LINE}; }

  /* waiting-on */
  .waitrow { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; margin-top: 9px; }
  .waitlabel { font-size: 0.64rem; text-transform: uppercase; letter-spacing: 0.09em; color: ${FAINT}; }
  .waitchip { padding: 0 8px; border-radius: 999px; border: 1px solid rgba(240,191,62,0.6);
              color: ${AMBER}; font-size: 0.7rem; font-weight: 600; }

  /* card footer + links */
  .sitefoot { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center;
              gap: 6px 12px; margin-top: 11px; }
  .upd { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.68rem; color: ${FAINT}; }
  .links { display: flex; flex-wrap: wrap; gap: 6px; }
  .lnk { display: inline-block; padding: 2px 11px; border-radius: 999px; font-size: 0.7rem;
         font-weight: 600; white-space: nowrap; text-decoration: none; color: ${TEXT};
         border: 1px solid rgba(247,244,234,0.35); background: transparent; }
  .lnk:hover { background: ${TEXT}; color: ${BG}; border-color: ${TEXT}; }
  .lnklive { background: ${FOREST}; border-color: ${FOREST}; color: #EAF3EA; }
  .lnklive:hover { background: #007A48; border-color: #007A48; color: #EAF3EA; }
  .localonly { font-size: 0.7rem; font-style: italic; color: ${FAINT}; }

  /* detail disclosure */
  .detail { margin-top: 9px; border-top: 1px solid ${LINE}; }
  .detail summary { cursor: pointer; list-style: none; padding: 7px 0 4px;
                    font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.11em; color: ${FAINT}; }
  .detail summary::-webkit-details-marker { display: none; }
  .detail summary::before { content: "▸ "; color: ${BRONZE}; }
  .detail[open] summary::before { content: "▾ "; }
  .detail summary:hover { color: ${MUTED}; }
  .detail[open] { background: ${CARD_UP}; margin: 9px -15px -11px; padding: 0 15px 11px; border-radius: 0 0 12px 12px; }
  .dl { margin: 4px 0 0; display: grid; grid-template-columns: max-content 1fr; gap: 6px 12px; }
  .dl dt { font-size: 0.64rem; text-transform: uppercase; letter-spacing: 0.09em; color: ${FAINT};
           padding-top: 2px; }
  .dl dd { margin: 0; font-size: 0.8rem; color: ${MUTED}; overflow-wrap: anywhere; }
  .dl dd.blocker { white-space: pre-wrap; color: #DCC9A8; }

  /* footer */
  .pgfoot { margin-top: 52px; padding-top: 18px; border-top: 1px solid ${LINE};
            font-size: 0.75rem; color: ${FAINT}; line-height: 1.7; }
  .pgfoot p { margin: 0 0 4px; }
  .pgfoot .sep { margin: 0 6px; }

  @media (max-width: 720px) {
    .hd { padding-top: 30px; }
    .hd h1 { font-size: 2rem; }
    .hdmeta { align-items: flex-start; text-align: left; }
    .osstrip { flex-direction: column; align-items: stretch; }
    .mstep { min-width: 56px; }
    .mlabel { display: none; } /* phone: id + state carry the meaning */
    .tiles { display: grid; grid-template-columns: repeat(2, 1fr); }
    .lanegrid { grid-template-columns: 1fr; }
  }
`;
