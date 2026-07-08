// Builds the React registry into apps/web/public/r/react so the site can
// serve it at a stable URL (`shadcn add <site-url>/r/react/<name>`).
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");

const result = spawnSync(
  "npx",
  ["shadcn@latest", "build", "registry/react/registry.json", "-o", "apps/web/public/r/react"],
  { stdio: "inherit", shell: true }
);

if (result.status !== 0) process.exit(result.status ?? 1);

// A thin, path-only root registry.json — required for the GitHub
// `owner/repo/item` shorthand (`npx shadcn add trivedi-vatsal/knock-codes/<item>`),
// which only reads a registry.json at the repo root. `include` can't be used
// here since registry/react/registry.json's paths are repo-root-relative and
// `include` resolves paths relative to the *included* file's own directory,
// with no parent-traversal escape hatch — so this is a generated copy, not
// hand-maintained, to avoid drift. Keep in sync via `pnpm registry:check`.
const sourceRegistry = JSON.parse(readFileSync(path.join(REPO_ROOT, "registry/react/registry.json"), "utf8"));
const rootRegistry = { ...sourceRegistry, name: "knock-codes" };
writeFileSync(path.join(REPO_ROOT, "registry.json"), JSON.stringify(rootRegistry, null, 2) + "\n");
