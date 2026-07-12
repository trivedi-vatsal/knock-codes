// Builds the React registry into apps/web/public/r/react so the site can
// serve it at a stable URL (`shadcn add <site-url>/r/react/<name>`).
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PRODUCTION_REGISTRY_BASE_URL, resolveRegistryDependencies } from "./registry-dependencies.mjs";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");

// --base-url overrides the URL baked into cross-item registryDependencies —
// use it for local testing against a dev server, e.g.:
//   node scripts/build-registry.mjs --base-url=http://localhost:3000
// This writes into the same apps/web/public/r/react the production build
// uses, so revert before committing: git checkout apps/web/public/r/react
const baseUrlFlag = process.argv.find((arg) => arg.startsWith("--base-url="));
const baseUrl = baseUrlFlag ? baseUrlFlag.slice("--base-url=".length) : PRODUCTION_REGISTRY_BASE_URL;

const sourceText = readFileSync(path.join(REPO_ROOT, "registry/react/registry.json"), "utf8");
const sourceRegistry = JSON.parse(sourceText);
const itemNames = new Set(sourceRegistry.items.map((item) => item.name));
const resolvedText = resolveRegistryDependencies(sourceText, itemNames, baseUrl);

const tmpDir = path.join(REPO_ROOT, ".tmp");
mkdirSync(tmpDir, { recursive: true });
const tempRegistryPath = path.join(tmpDir, "registry.build.json");
writeFileSync(tempRegistryPath, resolvedText);

const result = spawnSync("npx", ["shadcn@latest", "build", tempRegistryPath, "-o", "apps/web/public/r/react"], {
  stdio: "inherit",
  shell: true,
  cwd: REPO_ROOT,
});
rmSync(tempRegistryPath, { force: true });

if (result.status !== 0) process.exit(result.status ?? 1);

// A thin, path-only root registry.json — required for the GitHub
// `owner/repo/item` shorthand (`npx shadcn add trivedi-vatsal/knock-codes/<item>`),
// which only reads a registry.json at the repo root. `include` can't be used
// here since registry/react/registry.json's paths are repo-root-relative and
// `include` resolves paths relative to the *included* file's own directory,
// with no parent-traversal escape hatch — so this is a generated copy, not
// hand-maintained, to avoid drift. Keep in sync via `pnpm registry:check`.
const rootRegistry = { ...sourceRegistry, name: "knock-codes" };
writeFileSync(path.join(REPO_ROOT, "registry.json"), JSON.stringify(rootRegistry, null, 2) + "\n");

if (baseUrl !== PRODUCTION_REGISTRY_BASE_URL) {
  console.log(
    `\n⚠ Built with --base-url=${baseUrl} — apps/web/public/r/react now points cross-item deps at that host. ` +
      "Don't commit this. Revert with: git checkout apps/web/public/r/react"
  );
}
