import { readFileSync } from "node:fs";
import path from "node:path";

export interface ServerTemplate {
  id: string;
  label: string;
  filename: string;
  code: string;
}

// process.cwd() is apps/web when running via `next dev`/`next build` from
// there — see lib/blocks.ts for why this isn't import.meta.dirname.
const CONTENT_DIR = path.resolve(process.cwd(), "../../content/server-templates");

const MANIFEST: Array<Pick<ServerTemplate, "id" | "label" | "filename">> = [
  { id: "nextjs", label: "Next.js route handler", filename: "nextjs-route-handler.js" },
  { id: "express", label: "Express", filename: "express.js" },
  { id: "cloudflare", label: "Cloudflare Worker", filename: "cloudflare-worker.js" },
  { id: "hono", label: "Hono", filename: "hono.js" },
  { id: "azure", label: "Azure Function", filename: "azure-function.js" },
];

let cached: ServerTemplate[] | null = null;

export function getServerTemplates(): ServerTemplate[] {
  if (cached) return cached;
  cached = MANIFEST.map((entry) => ({
    ...entry,
    code: readFileSync(path.join(CONTENT_DIR, entry.filename), "utf8").trim(),
  }));
  return cached;
}
