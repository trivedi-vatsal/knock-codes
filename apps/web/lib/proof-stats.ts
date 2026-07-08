import { statSync } from "node:fs";
import path from "node:path";

// process.cwd() is apps/web when running via `next dev`/`next build` from
// there — see lib/templates.ts for why this isn't import.meta.dirname.
const FLAGSHIP_TEMPLATE_PATH = path.resolve(process.cwd(), "../../packages/react/KnockCodesTemplate.tsx");

/** KB size of the flagship template file, for the homepage proof strip. */
export function getFlagshipTemplateKb(): string {
  const bytes = statSync(FLAGSHIP_TEMPLATE_PATH).size;
  return (bytes / 1024).toFixed(1);
}
