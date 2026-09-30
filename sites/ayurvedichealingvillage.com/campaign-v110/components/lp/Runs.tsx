import { Fragment } from "react";
import type { Run } from "./types";

// Renders staging's inline runs (text, links, emphasis, line breaks).
export default function Runs({ runs }: { runs: Run[] }) {
  return (
    <>
      {runs.map((r, i) => {
        if (typeof r === "string") return <Fragment key={i}>{r}</Fragment>;
        if ("a" in r) return <a key={i} href={r.href}>{r.a}</a>;
        if ("em" in r) return <em key={i}>{r.em}</em>;
        if ("strong" in r) return <strong key={i}>{r.strong}</strong>;
        return <br key={i} />;
      })}
    </>
  );
}
