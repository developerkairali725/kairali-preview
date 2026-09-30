/** Resolve a fleet site's Next application without changing its gate identity. */
import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const inside = (parent, child) => {
  const rel = relative(parent, child);
  return rel === "" || (!isAbsolute(rel) && rel !== ".." && !rel.startsWith(`..${sep}`));
};

/**
 * Config/approvals/matrix identity stays sites/<id>; only execution and source
 * lookup use appRoot. Reject invalid configuration, traversal, and symlink
 * escapes rather than silently testing a different site's application.
 * @param {string} siteDir
 * @param {{root?: string}} options
 * @returns {string} absolute application directory
 */
export function resolveSiteAppRoot(siteDir, { root = REPO_ROOT } = {}) {
  if (typeof siteDir !== "string" || !/^sites\/[A-Za-z0-9][A-Za-z0-9._-]*$/.test(siteDir)) {
    throw new Error(`Invalid fleet site path: ${siteDir}`);
  }
  const repoRoot = realpathSync(root);
  const sitePath = join(repoRoot, siteDir);
  const siteRoot = realpathSync(sitePath);
  if (siteRoot !== sitePath) throw new Error(`${siteDir}: site directory must not be a symlink`);
  const config = JSON.parse(readFileSync(join(siteRoot, "site.config.json"), "utf8"));
  const appRoot = config.appRoot === undefined ? "." : config.appRoot;
  if (typeof appRoot !== "string" || !appRoot || isAbsolute(appRoot) || appRoot.includes("\\") ||
      (appRoot !== "." && appRoot.split("/").some((part) => !part || part === "." || part === ".."))) {
    throw new Error(`${siteDir}: appRoot must be "." or a relative child directory`);
  }
  const appPath = resolve(siteRoot, appRoot);
  if (!inside(siteRoot, appPath) || !existsSync(appPath)) {
    throw new Error(`${siteDir}: appRoot directory does not exist inside this site`);
  }
  const appDir = realpathSync(appPath);
  if (!inside(siteRoot, appDir) || !statSync(appDir).isDirectory()) {
    throw new Error(`${siteDir}: appRoot must resolve to a directory inside this site`);
  }
  if (!existsSync(join(appDir, "package.json"))) {
    throw new Error(`${siteDir}: appRoot has no package.json`);
  }
  return appDir;
}
