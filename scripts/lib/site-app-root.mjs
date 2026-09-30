// One implementation serves native ESM scripts and Playwright's CommonJS config
// loader. The CJS module anchors its default root to __dirname, never process.cwd().
export { resolveSiteAppRoot } from "./site-app-root.cjs";
