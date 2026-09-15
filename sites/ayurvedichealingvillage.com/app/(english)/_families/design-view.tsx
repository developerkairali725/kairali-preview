/**
 * AHV English candidate — the shared route component.
 *
 * All 252 approved routes render through this ONE server component. It emits:
 *   · the route's boot config (which family view to mount, and for which path);
 *   · the mount point the approved design renders into;
 *   · variant-scoped preloads so the right payload is already in flight;
 *   · a no-JS notice, because the approved design is a client-side runtime.
 *
 * It deliberately adds no markup of its own inside the design root: whatever
 * the page shows is the approved view, unchanged.
 */
import type { CandidateRoute } from "./registry";
import { BREAKPOINT } from "./registry";
import { BOOT_SCRIPT, DESIGN_ROOT_ID, ROUTE_CONFIG_ID, type BootConfig } from "./boot";
import componentMap from "../../../english-candidate/component-map.json";
import analyticsConfig from "../../../analytics.config.json";

/**
 * Measurement ids reach the browser ONLY when the build asks for them.
 * AHV_ANALYTICS is unset on staging by the owner's 15 Sep 2026 ruling, so a
 * preview reviewer accepting cookies still sends nothing to the production
 * GA4 and Clarity properties. Switching it on is a go-live step, recorded in
 * docs/reports/2026-09-15-ahv-go-live-checklist.md.
 */
function measurementForBuild(): BootConfig["measurement"] {
  const a = analyticsConfig.activation;
  if (process.env[a.env] !== a.enabledWhen) return undefined;
  const m = analyticsConfig.measurement;
  return { ga4: m.ga4.id, clarity: m.clarity.id, metaPixel: m.metaPixel.id };
}

const PAYLOAD_BASE = "/ahv/views/";
const SUPPORT_SRC = "/ahv/support.js";
/** The package's own accepted preview layer, carried over unchanged. */
const PREVIEW_SRC = "/ahv/preview/portable-preview.js";

export function buildBootConfig(route: CandidateRoute): BootConfig {
  return {
    path: route.path,
    desktopView: route.desktopView,
    mobileView: route.mobileView,
    breakpoint: BREAKPOINT,
    payloadBase: PAYLOAD_BASE,
    supportSrc: SUPPORT_SRC,
    previewSrc: PREVIEW_SRC,
    resources: componentMap.resources as Record<string, string>,
    measurement: measurementForBuild(),
  };
}

export function DesignView({ route }: { route: CandidateRoute }) {
  const cfg = buildBootConfig(route);
  const narrowMedia = `(max-width: ${BREAKPOINT - 1}px)`;
  const wideMedia = `(min-width: ${BREAKPOINT}px)`;

  return (
    <>
      {/* Get the right family payload in flight before the boot script runs.
          Media-scoped so a phone never downloads the desktop view. */}
      {route.mobileView ? (
        <link
          rel="preload"
          as="fetch"
          crossOrigin="anonymous"
          media={narrowMedia}
          href={`${PAYLOAD_BASE}${route.mobileView}.json`}
        />
      ) : null}
      {route.desktopView ? (
        <link
          rel="preload"
          as="fetch"
          crossOrigin="anonymous"
          media={wideMedia}
          href={`${PAYLOAD_BASE}${route.desktopView}.json`}
        />
      ) : null}
      <link rel="preload" as="script" href={SUPPORT_SRC} />
      <link rel="preload" as="script" href={PREVIEW_SRC} />
      <link rel="preload" as="style" href="/ahv/preview/english-responsive-override.css" />

      {/* dangerouslySetInnerHTML with an empty string is load-bearing, not
          decoration: it tells React this subtree is not its own, so React
          neither hydrates nor reconciles what the boot script mounts here.
          Without it, hydration threw #418 and React's recovery render wiped
          the approved design off the page. */}
      <div
        id={DESIGN_ROOT_ID}
        data-ahv-route={route.path}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: "" }}
      />

      <noscript>
        <p style={{ font: "17px/1.6 system-ui, sans-serif", margin: "40px auto", maxWidth: "62ch", padding: "0 20px" }}>
          This page renders the approved Kairali design with JavaScript. Please
          enable JavaScript, or contact us at info@kairali.com.
        </p>
      </noscript>

      <script
        id={ROUTE_CONFIG_ID}
        type="application/json"
        // Config only — no markup. JSON.stringify output is escaped for a
        // <script> text node below.
        dangerouslySetInnerHTML={{ __html: jsonForScript(cfg) }}
      />
      <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
    </>
  );
}

/**
 * Make a JSON string safe inside a <script type="application/json"> text node.
 * Only "<" matters: it is what could close the element early (</script). The
 * block is read with textContent and JSON.parse, never evaluated as JS, so the
 * JS line separators need no escaping here.
 */
function jsonForScript(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
