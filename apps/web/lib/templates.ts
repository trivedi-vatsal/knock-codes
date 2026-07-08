import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { BlockProp } from "./blocks.ts";

export interface TemplateFrontmatter {
  title: string;
  description: string;
  category: string;
  tags: string[];
  registryName: string;
  relatedBlocks?: string[];
  props: BlockProp[];
  accessibility: string;
  customization: string;
  bestUsedFor?: string;
  useCase?: string;
  complexity?: "Simple" | "Standard" | "Advanced";
  mode?: "local" | "server" | "both";
  /** @default "react" — "html" templates are a single static .html file with no build step, rendered/handled differently on the detail page. */
  language?: "react" | "html";
}

export interface Template extends TemplateFrontmatter {
  slug: string;
  content: string;
}

// process.cwd() is apps/web when running via `next dev`/`next build` from
// there — see lib/blocks.ts for why this isn't import.meta.dirname.
const CONTENT_DIR = path.resolve(process.cwd(), "../../content/templates");

let cachedTemplates: Template[] | null = null;

export function getAllTemplates(): Template[] {
  if (cachedTemplates) return cachedTemplates;

  const files = readdirSync(CONTENT_DIR).filter((file) => file.endsWith(".mdx"));
  cachedTemplates = files
    .map((file) => {
      const raw = readFileSync(path.join(CONTENT_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.mdx$/, "");
      return { slug, content: content.trim(), ...(data as TemplateFrontmatter) };
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  return cachedTemplates;
}

export function getTemplateBySlug(slug: string): Template | undefined {
  return getAllTemplates().find((template) => template.slug === slug);
}
