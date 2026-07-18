// Access & Day 0 — who gets what permission, how Abilash grants it (no tech
// knowledge assumed), where the image bank & brand docs live, and how work is
// assigned via the existing delegation system. Source of truth for the links:
// docs/sops/ + the Drive folder. Content authored 18 Jul 2026 (v4 branch).
export const metadata = { title: "Access & Day 0 — Kairali Playbook" };

const INK = "#1A2E1A";
const LINE = "#E6E0CF";
const FOREST = "#003720";

const S = {
  card: { background: "#fff", border: `1px solid ${LINE}`, borderRadius: 14, padding: "16px 22px", margin: "14px 0" } as const,
  warn: { background: "#F3D9C7", border: "1px solid #E0B89A", borderRadius: 12, padding: "13px 18px", margin: "14px 0", fontSize: 15 } as const,
  ok: { background: "#DBE2C1", border: "1px solid #C4D4A2", borderRadius: 12, padding: "13px 18px", margin: "14px 0", fontSize: 15 } as const,
  h2: { fontSize: 23, letterSpacing: "-.3px", margin: "44px 0 8px", paddingTop: 14, borderTop: `1px solid ${LINE}` } as const,
  th: { background: "#DBE2C1", color: "#38471A", fontWeight: 700, border: `1px solid ${LINE}`, padding: "9px 12px", textAlign: "left" } as const,
  td: { border: `1px solid ${LINE}`, padding: "9px 12px", verticalAlign: "top" } as const,
};

export default function Access() {
  return (
    <main style={{ background: "#FFFDF7", minHeight: "100vh", color: INK, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "36px 24px 100px", fontSize: 16, lineHeight: 1.66 }}>
        <p style={{ letterSpacing: ".16em", textTransform: "uppercase", fontSize: 12, fontWeight: 700, color: "#6B6350", margin: 0 }}>Kairali Playbook</p>
        <h1 style={{ fontSize: 30, margin: "6px 0 2px", letterSpacing: "-.5px" }}>Access &amp; Day 0</h1>
        <p style={{ color: "#6B6350" }}>Every account, permission, folder and link a person needs before their first task — and exactly how Abilash grants each one, click by click.</p>

        <h2 style={S.h2}>1 · Who needs what (the permission map)</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14.5, background: "#fff" }}>
            <thead><tr><th style={S.th}>Person</th><th style={S.th}>Google Drive</th><th style={S.th}>GitHub</th><th style={S.th}>WordPress</th><th style={S.th}>Vercel</th></tr></thead>
            <tbody>
              <tr><td style={S.td}><b>Marketing</b> (Anupam, Astha, Rohan, Vikash, Gaurav, Eeshal)</td><td style={S.td}>✅ The shared folder (their name folder)</td><td style={S.td}>❌ <b>None.</b> Marketing never opens GitHub — that is the design</td><td style={S.td}>❌ None</td><td style={S.td}>❌ None</td></tr>
              <tr><td style={S.td}><b>Roshni</b> (content)</td><td style={S.td}>✅ Same</td><td style={S.td}>❌ None</td><td style={S.td}>❌ None</td><td style={S.td}>❌ None</td></tr>
              <tr><td style={S.td}><b>Deepu</b> (developer)</td><td style={S.td}>✅ Whole folder</td><td style={S.td}>✅ <b>Write</b> on the repo (push branches, open PRs). Merge only if Abilash grants approver rights for content PRs</td><td style={S.td}>✅ Admin on <b>STAGING</b> sites (Novamira lives with him)</td><td style={S.td}>✅ Member of the <code>kairali</code> team</td></tr>
              <tr><td style={S.td}><b>Abilash</b></td><td style={S.td}>Owner</td><td style={S.td}>Org owner (approves &amp; merges)</td><td style={S.td}>Admin</td><td style={S.td}>Owner</td></tr>
              <tr><td style={S.td}><b>Certified member</b> (Express Lane, later)</td><td style={S.td}>✅ Same as marketing</td><td style={S.td}>✅ Write — <b>only after Abilash watches them run the full flow once and says so</b></td><td style={S.td}>❌ None</td><td style={S.td}>❌ None</td></tr>
            </tbody>
          </table>
        </div>
        <div style={S.ok}><b>The safety logic:</b> nobody below Abilash can merge to <code>main</code> (branch protection), every PR runs the machine checks, and marketing needs zero technical accounts. Giving someone &quot;Write&quot; lets them push a branch — the worst case is a red PR that never merges.</div>

        <h2 style={S.h2}>2 · How Abilash grants each one (click by click)</h2>
        <div style={S.card}>
          <p><b>Google Drive (everyone):</b> open the <a href="https://drive.google.com/drive/folders/1w89m48AKO9lhOBKKR_DRB0ra8SpXljpX" style={{ color: FOREST }}>Website - Staging - Marketing folder</a> → click the folder name → <b>Share</b> → type their @kairali.com email → role <b>Editor</b> → Send. Done. (Their personal name-folder is already inside.)</p>
          <p><b>GitHub (Deepu + certified members only):</b> go to <code>github.com/orgs/kairali-digital/people</code> → green <b>Invite member</b> button → their GitHub username or email → role <b>Member</b> → Send invite. Then open <code>github.com/kairali-digital/kairali-web-factory</code> → <b>Settings → Collaborators and teams → Add people</b> → pick them → role <b>Write</b>. That&apos;s all — branch protection does the rest.</p>
          <p><b>WordPress staging (Deepu only):</b> the hosting panel&apos;s staging copy → create him an Administrator account on <b>staging only</b>. Production stays yours.</p>
          <p><b>Vercel (Deepu only):</b> vercel.com → the <b>Kairali</b> team → Settings → Members → Invite → his email → role <b>Member</b>.</p>
        </div>
        <div style={S.warn}><b>⚠️ Never share passwords in chat or docs.</b> Every person gets their own account on every tool. If a tool asks for a password to be &quot;shared&quot;, stop and ask Abilash — sharing logins is how audits fail and accounts get lost.</div>

        <h2 style={S.h2}>3 · The image bank &amp; brand documents</h2>
        <div style={S.card}>
          <ul style={{ margin: "8px 0", paddingLeft: 22 }}>
            <li><b>Brand manuals (the law for how things look):</b> the <a href="https://drive.google.com/drive/folders/1MPR-_ncXMxf5GIi9zTBq6RCOQ4Aw8KM-" style={{ color: FOREST }}>Brand guidelines Drive folder</a> — Kairali Ayurvedic Group Brand Manual 2026 (rev. 2) and the Villa Raag Brand Manual. Read yours once; Claude also knows the rules via the repo (<code>docs/brand/</code>, <code>packages/ui/</code>).</li>
            <li><b>Image bank:</b> real photography lives in each site&apos;s image manifest (<code>docs/media/</code> + per-site <code>IMAGE_MANIFEST.md</code> — e.g. kairali.com ships only library originals). Marketing: ask Deepu/Abilash for the folder of approved originals for your site. Free stock is OK when no original exists; AI-generated images only per the register&apos;s video policy; <b>never buy an image without Abilash&apos;s click</b>.</li>
            <li><b>FACTS docs (prices, phones, addresses):</b> one per site, in the shared Drive folder — maintained by Vikash/Abilash. Facts come from there, never from memory. Locked facts: email <b>info@kairali.com</b>, WhatsApp <b>+91 92898 38797</b>.</li>
            <li><b>Migration checklists (developers):</b> repo <code>docs/checklists/</code> — the sitewide + pagewise checklists, mandatory on every site/page.</li>
            <li><b>Marketing science (GO / Akshar Yadav):</b> repo <code>docs/marketing/go-science/</code> — the MCB / MoA / KIT frameworks used in the Kitting Card. In Claude Code, type <code>/go-science</code> for help (e.g. <i>&quot;generate MCB for a Panchakarma weight-management page targeting NRI professionals&quot;</i>).</li>
          </ul>
        </div>

        <h2 style={S.h2}>4 · How work is assigned — the delegation system</h2>
        <div style={S.card}>
          <p>We already have a delegation system (the task sheet run with <b>Ritu</b>). The Playbook does not replace it — it plugs into it:</p>
          <ol style={{ paddingLeft: 22 }}>
            <li><b>A task is born</b> on the delegation sheet (Abilash assigns; Ritu logs). The task line says what the Kitting Card will say: what, for which site, by when.</li>
            <li><b>The task ID goes on your Kitting Card</b> — that&apos;s the thread that ties the sheet to the pipeline.</li>
            <li><b>You do the work through the Playbook path</b> (this site tells you every step).</li>
            <li><b>When it&apos;s live</b>, submit the response form with one clear line of proof: <b>the live URL</b> (plus &quot;CHECKED ✅ by Deepu&quot;). That specific line is what gets the task closed the same week — the AI pre-judges it, Ritu only chases unclear ones.</li>
          </ol>
          <p style={{ color: "#6B6350", fontSize: 14 }}>Questions about a task → Ritu. Questions about a step → this Playbook, then Abilash.</p>
        </div>

        <h2 style={S.h2}>5 · Day 0 checklist (once per person — owner: Deepu or Abilash)</h2>
        <div style={S.card}>
          <ol style={{ paddingLeft: 22, lineHeight: 2 }}>
            <li>Drive access granted → you can open <b>your own name folder</b> (1 — Drafts / 2 — Ready for Deepu / 3 — Published).</li>
            <li>Your build tool installed and signed in: <b>VS Code + Claude plugin</b> (recommended) or Antigravity; Claude Design works in the browser.</li>
            <li>This Playbook + the <a href="https://docs.google.com/spreadsheets/d/1mS6WzRrZmQVnWjfg631uOFSRDD1raFTSLhjlYuQZIos/edit" style={{ color: FOREST }}>Pipeline Tracker</a> bookmarked.</li>
            <li>You know where your site&apos;s <b>FACTS doc</b> and brand manual are (section 3 above).</li>
            <li><b>Smoke test:</b> build a one-line practice page with Claude, see the preview, delete it.</li>
            <li>Watch the <a href="https://www.youtube.com/watch?v=Gt8tT-xf6g4" style={{ color: FOREST }}>origin video</a> once this week.</li>
          </ol>
        </div>
        <div style={S.ok}><b>Done?</b> Go to the <a href="/playbook" style={{ color: FOREST, fontWeight: 700 }}>Playbook</a>, answer the three questions, and build your first page.</div>
      </div>
    </main>
  );
}
