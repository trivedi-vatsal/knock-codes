// Verifies apps/web/public/r/react (the committed, built registry) and the
// root registry.json (for GitHub owner/repo/item addressing) are both
// byte-for-byte what `node scripts/build-registry.mjs` would produce right
// now from registry/react/registry.json. Run this in CI, or locally after
// editing the registry, instead of trusting that build-registry.mjs was
// re-run and the result was committed.
import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC_DIR = path.resolve(REPO_ROOT, "apps/web/public/r/react");
const ROOT_REGISTRY_PATH = path.join(REPO_ROOT, "registry.json");
const tempDir = mkdtempSync(path.join(tmpdir(), "knock-codes-registry-"));

let failed = false;

try {
  const result = spawnSync("npx", ["shadcn@latest", "build", "registry/react/registry.json", "-o", tempDir], {
    stdio: ["ignore", "ignore", "inherit"],
    shell: true,
  });

  if (result.status !== 0) {
    console.error("✖ shadcn build failed — see output above.");
    process.exit(1);
  }

  const expected = readdirSync(tempDir).sort();
  const actual = readdirSync(PUBLIC_DIR).sort();

  const missing = expected.filter((f) => !actual.includes(f));
  const orphaned = actual.filter((f) => !expected.includes(f));
  const mismatched = expected
    .filter((f) => actual.includes(f))
    .filter((f) => readFileSync(path.join(tempDir, f), "utf8") !== readFileSync(path.join(PUBLIC_DIR, f), "utf8"));

  if (missing.length === 0 && orphaned.length === 0 && mismatched.length === 0) {
    console.log(`✔ Registry is in sync (${expected.length} files).`);
  } else {
    failed = true;
    console.error("✖ apps/web/public/r/react is out of sync with registry/react/registry.json.");
    if (missing.length) console.error(`  Missing (run the build): ${missing.join(", ")}`);
    if (orphaned.length) console.error(`  Orphaned (no longer in registry.json): ${orphaned.join(", ")}`);
    if (mismatched.length) console.error(`  Stale content (rebuild and recommit): ${mismatched.join(", ")}`);
  }

  const sourceRegistry = JSON.parse(readFileSync(path.join(REPO_ROOT, "registry/react/registry.json"), "utf8"));
  const expectedRoot = JSON.stringify({ ...sourceRegistry, name: "knock-codes" }, null, 2) + "\n";
  const actualRoot = readFileSync(ROOT_REGISTRY_PATH, "utf8");

  if (expectedRoot === actualRoot) {
    console.log("✔ Root registry.json is in sync.");
  } else {
    failed = true;
    console.error("✖ registry.json (repo root) is out of sync with registry/react/registry.json.");
  }

  if (failed) {
    console.error("\nRun: node scripts/build-registry.mjs");
    process.exit(1);
  }
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}
