import { getAllTemplates } from "./templates";

/**
 * The template set's version, shown in the nav and the changelog table.
 * Derived from each template's own frontmatter `version`
 * (content/templates/*.mdx) rather than a second, independent literal —
 * every template ships at the same version today, so this is that shared
 * value, read once, not a fourth counter to keep in sync by hand.
 */
export function getTemplateSetVersion(): string {
  const [first] = getAllTemplates();
  return first?.version ?? "0.0.0";
}
