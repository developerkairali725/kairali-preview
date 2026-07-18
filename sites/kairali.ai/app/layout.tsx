import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Kairali — Fleet Pulse & Playbook",
  description: "Internal status surface + the team Playbook for the Kairali web factory.",
  robots: { index: false, follow: false },
};

// One link for everything: the dashboard and the whole Playbook live on this
// site. The nav is deliberately tiny — five destinations, no dropdowns.
const nav: [string, string][] = [
  ["/", "Fleet Pulse"],
  ["/playbook", "Playbook"],
  ["/guide/access", "Access & Day 0"],
  ["/guide/voices", "Voices"],
  ["/guide/deepu", "For Deepu"],
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
        <nav
          style={{
            position: "sticky", top: 0, zIndex: 50, background: "#003720", color: "#EAF3EA",
            display: "flex", alignItems: "center", gap: 6, padding: "11px 20px",
            boxShadow: "0 2px 10px rgba(0,0,0,.15)", flexWrap: "wrap",
          }}
        >
          <span style={{ fontWeight: 800, letterSpacing: ".04em", marginRight: 10, fontSize: 14 }}>Kairali</span>
          {nav.map(([href, label]) => (
            <a key={href} href={href} style={{ color: "#EAF3EA", textDecoration: "none", fontSize: 13.5, fontWeight: 600, padding: "4px 10px", borderRadius: 8, opacity: 0.9 }}>
              {label}
            </a>
          ))}
        </nav>
        {children}
      </body>
    </html>
  );
}
