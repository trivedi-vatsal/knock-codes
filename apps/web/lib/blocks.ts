import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface BlockProp {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export interface BlockFrontmatter {
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
}

export interface Block extends BlockFrontmatter {
  slug: string;
  content: string;
}

// process.cwd() is apps/web when running via `next dev`/`next build` from
// there — `import.meta.dirname` is unreliable under Turbopack's bundling, so
// don't use it for a path that needs to survive both dev and build.
const CONTENT_DIR = path.resolve(process.cwd(), "../../content/blocks");

let cachedBlocks: Block[] | null = null;

export function getAllBlocks(): Block[] {
  if (cachedBlocks) return cachedBlocks;

  const files = readdirSync(CONTENT_DIR).filter((file) => file.endsWith(".mdx"));
  cachedBlocks = files
    .map((file) => {
      const raw = readFileSync(path.join(CONTENT_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.mdx$/, "");
      return { slug, content: content.trim(), ...(data as BlockFrontmatter) };
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  return cachedBlocks;
}

export function getBlockBySlug(slug: string): Block | undefined {
  return getAllBlocks().find((block) => block.slug === slug);
}

export function getBlockCategories(): string[] {
  const categories = new Set(getAllBlocks().map((block) => block.category));
  return Array.from(categories);
}
