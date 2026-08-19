"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BlockCard } from "@/components/block-card";
import { cn } from "@/lib/utils";
import type { Block } from "@/lib/blocks";

const TEMPLATE_CORE_SLUGS = new Set([
  "knock-codes",
  "pin-input",
  "protected-layout",
  "protected-modal",
  "protected-card",
  "unlock-dialog",
]);

export function BlocksGallery({ blocks, categories }: { blocks: Block[]; categories: string[] }) {
  const [query, setQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"primary" | "templateCore" | "all" | string>("all");

  const catalog = useMemo(() => blocks.filter((block) => block.tier !== "alias"), [blocks]);
  const primaryCount = useMemo(() => catalog.filter((b) => b.tier === "primary").length, [catalog]);
  const templateCoreCount = useMemo(
    () => catalog.filter((b) => TEMPLATE_CORE_SLUGS.has(b.slug)).length,
    [catalog]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter((block) => {
      if (filterMode === "primary" && block.tier !== "primary") return false;
      if (filterMode === "templateCore" && !TEMPLATE_CORE_SLUGS.has(block.slug)) return false;
      if (filterMode !== "primary" && filterMode !== "templateCore" && filterMode !== "all" && block.category !== filterMode) {
        return false;
      }
      if (!q) return true;
      return (
        block.title.toLowerCase().includes(q) ||
        block.description.toLowerCase().includes(q) ||
        block.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [catalog, query, filterMode]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search blocks…"
            className="pl-8"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setFilterMode("primary")}
            className={cn(
              "label-mono rounded border px-2.5 py-1.5",
              filterMode === "primary"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            Core Blocks ({primaryCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("templateCore")}
            className={cn(
              "label-mono rounded border px-2.5 py-1.5",
              filterMode === "templateCore"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            Template Cores ({templateCoreCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className={cn(
              "label-mono rounded border px-2.5 py-1.5",
              filterMode === "all"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            All ({catalog.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterMode(cat)}
              className={cn(
                "label-mono rounded border px-2.5 py-1.5",
                filterMode === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-6 text-xs text-muted-foreground/70">
        Core Blocks, Template Cores, and category views overlap — a block can match more than one.
      </p>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No blocks match &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {filtered.map((block) => (
            <BlockCard key={block.slug} block={block} />
          ))}
        </div>
      )}
    </div>
  );
}
