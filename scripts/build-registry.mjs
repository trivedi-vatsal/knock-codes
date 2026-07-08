// Builds the React registry into apps/web/public/r/react so the site can
// serve it at a stable URL (`shadcn add <site-url>/r/react/<name>`).
import { spawnSync } from "node:child_process";

const result = spawnSync(
  "npx",
  ["shadcn@latest", "build", "registry/react/registry.json", "-o", "apps/web/public/r/react"],
  { stdio: "inherit", shell: true }
);

process.exit(result.status ?? 1);
