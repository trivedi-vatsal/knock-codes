import { getAllTemplates } from "@/lib/templates";
import { getAllBlocks, type BlockProp } from "@/lib/blocks";
import { THREAT_MODEL_COPY } from "@/lib/copy";
import { getTemplateSetVersion } from "@/lib/version";

// Static-renders at build time — the site conditionally builds with
// `output: "export"` (see next.config.ts), which requires GET route
// handlers with no dynamic segments to opt into force-static explicitly,
// same as opengraph-image.tsx does for the same reason.
export const dynamic = "force-static";

function formatProps(props: BlockProp[]): string {
  if (props.length === 0) return "  (no props beyond children)";
  return props
    .map((prop) => `  - ${prop.name}${prop.required ? "" : "?"}: ${prop.type}${prop.default ? ` (default: ${prop.default})` : ""} — ${prop.description}`)
    .join("\n");
}

export function GET() {
  const templates = getAllTemplates();
  const blocks = getAllBlocks();
  const version = getTemplateSetVersion();

  const lines: string[] = [
    "# Knock Codes",
    "",
    `> Copy-paste "enter a code to continue" access screens. Single-file templates, zero runtime dependencies, MIT licensed. Template set version: ${version}.`,
    "",
    "## What this is",
    "A shared-secret gate, not authentication. Everyone who has the code gets the same access — there is no per-user identity, no accounts, no permissions. Local mode hashes the code client-side (SHA-256) and compares in the browser; server mode swaps the `expectedHash` prop for a `verify` function so the comparison happens on a server instead. Neither mode invents rate limiting or an `attempts` prop on the client — rate limiting exists only in the reference server templates.",
    "",
    "## Security model",
    THREAT_MODEL_COPY,
    "",
    "## Templates (content/templates/*.mdx, packages/react/*.tsx)",
    "",
  ];

  for (const template of templates) {
    lines.push(`### ${template.title} — ${template.registryName} (v${template.version})`);
    lines.push(template.description);
    lines.push(`Detail page: /templates/${template.slug}`);
    lines.push("Props:");
    lines.push(formatProps(template.props));
    lines.push("");
  }

  lines.push("## Blocks (content/blocks/*.mdx, packages/react/*.tsx)", "");
  for (const block of blocks) {
    lines.push(`### ${block.title} — ${block.registryName}`);
    lines.push(block.description);
    lines.push(`Detail page: /blocks/${block.slug}`);
    lines.push("Props:");
    lines.push(formatProps(block.props));
    lines.push("");
  }

  lines.push(
    "## Install",
    "Copy a template file directly from its detail page, or:",
    "  npx shadcn add https://knock.codes/r/react/<registryName>.json",
    "  npx shadcn add trivedi-vatsal/knock-codes/<registryName>",
    "",
    "## Adapting a template with an AI agent",
    "Each template detail page has an \"Adapt with AI\" button that copies a ready prompt for this exact purpose — it names the template's real props and explicitly asks the agent to preserve the expectedHash/verify verification logic rather than inventing new fields.",
    "",
    "## Links",
    "- Templates: /templates",
    "- Blocks: /blocks",
    "- Getting started: /getting-started",
    "- Security model: /security",
    "- Changelog: /changelog"
  );

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
