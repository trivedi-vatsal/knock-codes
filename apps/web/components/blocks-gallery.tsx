"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BlockCard } from "@/components/block-card";
import { cn } from "@/lib/utils";
import type { Block } from "@/lib/blocks";

export function BlocksGallery({ blocks, categories }: { blocks: Block[]; categories: string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return blocks.filter((block) => {
      if (category && block.category !== category) return false;
      if (!q) return true;
      return (
        block.title.toLowerCase().includes(q) ||
        block.description.toLowerCase().includes(q) ||
        block.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [blocks, query, category]);

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
            onClick={() => setCategory(null)}
            className={cn(
              "label-mono rounded border px-2.5 py-1.5",
              category === null ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                "label-mono rounded border px-2.5 py-1.5",
                category === cat ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No blocks match &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((block) => (
            <BlockCard key={block.slug} block={block} />
          ))}
        </div>
      )}
    </div>
  );
}
