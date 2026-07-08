import { readFileSync } from "node:fs";
import path from "node:path";

export interface RegistryFile {
  path: string;
  type: string;
  target: string;
}

export interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  registryDependencies?: string[];
  files: RegistryFile[];
  docs?: string;
}

interface RegistryJson {
  name: string;
  items: RegistryItem[];
}

// process.cwd() is apps/web when running via `next dev`/`next build` from
// there — `import.meta.dirname` is unreliable under Turbopack's bundling, so
// don't use it for a path that needs to survive both dev and build.
const REPO_ROOT = path.resolve(process.cwd(), "../..");

let cachedRegistry: RegistryJson | null = null;

function loadRegistry(): RegistryJson {
  if (cachedRegistry) return cachedRegistry;
  const raw = readFileSync(path.join(REPO_ROOT, "registry/react/registry.json"), "utf8");
  cachedRegistry = JSON.parse(raw) as RegistryJson;
  return cachedRegistry;
}

export function getRegistryItem(name: string): RegistryItem | undefined {
  return loadRegistry().items.find((item) => item.name === name);
}

/** Reads a registry item's own file source directly off disk — always the real, current implementation, never a copy staged in content. */
export function getRegistryItemSource(name: string): { path: string; target: string; content: string }[] {
  const item = getRegistryItem(name);
  if (!item) return [];
  return item.files.map((file) => ({
    path: file.path,
    target: file.target,
    content: readFileSync(path.join(REPO_ROOT, file.path), "utf8"),
  }));
}

/** Resolves an item's registryDependencies transitively into a flat, de-duplicated, dependency-first list (excluding the item itself). */
export function resolveRegistryDependencies(name: string): RegistryItem[] {
  const registry = loadRegistry();
  const seen = new Set<string>([name]);
  const resolved: RegistryItem[] = [];

  function visit(depName: string) {
    if (seen.has(depName)) return;
    seen.add(depName);
    const item = registry.items.find((candidate) => candidate.name === depName);
    if (!item) return;
    for (const dep of item.registryDependencies ?? []) visit(dep);
    resolved.push(item);
  }

  const root = registry.items.find((candidate) => candidate.name === name);
  for (const dep of root?.registryDependencies ?? []) visit(dep);

  return resolved;
}
