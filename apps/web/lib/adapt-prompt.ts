import type { Template } from "./templates";
import type { Block } from "./blocks";

/**
 * The "Adapt with AI" copy-button text on each template detail page. Built
 * from the same `Template` frontmatter the props table and installation
 * panel already read — so it can't list a prop that isn't real — and stays
 * explicit that the verification logic and threat model aren't up for
 * reinterpretation, only the branding around them is.
 */
export function buildAdaptPrompt(template: Template, primaryPath: string): string {
  const propNames = template.props.map((prop) => `${prop.name}${prop.required ? "" : "?"}`).join(", ") || "children only";

  return [
    `Adapt the "${template.title}" access-gate template (source: ${primaryPath}) for this project.`,
    "",
    `If ${primaryPath} doesn't exist in this project yet, install it first:`,
    "",
    `    npx shadcn@latest add https://knock.codes/r/react/${template.registryName}.json`,
    "",
    "If that site is unreachable, use the GitHub owner/repo/item shorthand instead — no site required:",
    "",
    `    npx shadcn@latest add trivedi-vatsal/knock-codes/${template.registryName}`,
    "",
    "Keep unchanged:",
    "- The verification logic exactly as written: it resolves either `expectedHash` (a local SHA-256 comparison, done client-side) or `verify` (an async function pointed at a server you control) — never both, never neither, never a third option.",
    "- The session/storage contract (`storage`, `storageKey`, `timeout`, and `remember` where present) — don't add state outside what the template already tracks.",
    "- Don't invent props that aren't in the source file. In particular, there is no client-side `attempts` or rate-limit prop — rate limiting only exists in the reference server templates, server-side.",
    "",
    "Free to change:",
    "- Colors, spacing, typography, logo, copy/labels, and framework-specific wiring (env var name, import paths) to match this project's branding and stack.",
    "",
    `Real props on this component: ${propNames}.`,
    "",
    "This is a shared-secret gate, not authentication — there is no per-user identity or account system. Don't describe it as more secure than that in any copy you write for it.",
  ].join("\n");
}

export function buildBlockAdaptPrompt(block: Block, primaryPath: string): string {
  const propNames = block.props.map((prop) => `${prop.name}${prop.required ? "" : "?"}`).join(", ") || "children only";

  return [
    `Adapt the "${block.title}" access-gate React block (source: ${primaryPath}) for this project.`,
    "",
    `If ${primaryPath} doesn't exist in this project yet, install it first:`,
    "",
    `    npx shadcn@latest add https://knock.codes/r/react/${block.registryName}.json`,
    "",
    "If that site is unreachable, use the GitHub owner/repo/item shorthand instead — no site required:",
    "",
    `    npx shadcn@latest add trivedi-vatsal/knock-codes/${block.registryName}`,
    "",
    "Keep unchanged:",
    "- The verification and session logic exactly as written — it integrates with useKnockCodes or KnockCodes core primitives.",
    "- Don't invent props that aren't in the source file. In particular, there is no client-side `attempts` or rate-limit prop.",
    "",
    "Free to change:",
    "- Colors, spacing, typography, copy/labels, and visual layout to match this project's branding and stack.",
    "",
    `Real props on this component: ${propNames}.`,
    "",
    "This is a shared-secret gate, not authentication — there is no per-user identity or account system.",
  ].join("\n");
}
