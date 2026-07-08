import { readFileSync } from "node:fs";
import path from "node:path";

// process.cwd() is apps/web when running via `next dev`/`next build` from
// there — see lib/templates.ts for why this isn't import.meta.dirname.
const CONTENT_DIR = path.resolve(process.cwd(), "../../content/html-templates");

/** Reads a plain HTML template's full source off disk — always the real, current file, never a copy staged elsewhere. */
export function getHtmlTemplateSource(registryName: string): string {
  return readFileSync(path.join(CONTENT_DIR, `${registryName}.html`), "utf8");
}
