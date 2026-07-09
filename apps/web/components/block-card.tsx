import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Block } from "@/lib/blocks";
import { AccessPanelCard } from "@/components/access-panel-card";
import { BlockCardPreview } from "@/components/block-card-preview";

const TEMPLATE_CORE_SLUGS = new Set([
  "knock-codes",
  "pin-input",
  "protected-layout",
  "standalone-gate",
  "protected-modal",
  "protected-card",
  "unlock-dialog",
]);

const PREVIEW_HEIGHT = 240;

export function BlockCard({ block }: { block: Block }) {
  const isTemplateCore = TEMPLATE_CORE_SLUGS.has(block.slug);
  const filename = `${block.registryName}.tsx`;

  return (
    <Link href={`/blocks/${block.slug}`} className="group block h-full">
      <AccessPanelCard className="h-full hover:border-primary/50 hover:bg-card">
        <div>
          {/* Framed Window Preview with Mini IDE Chrome */}
          <div className="mb-5 overflow-hidden rounded-lg border border-border/80 bg-muted/20 shadow-sm transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-md">
            <div className="flex items-center justify-between border-b border-border/60 bg-muted/60 px-3.5 py-2 font-mono text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-400/80 dark:bg-red-500/80" />
                  <span className="h-2 w-2 rounded-full bg-amber-400/80 dark:bg-amber-500/80" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400/80 dark:bg-emerald-500/80" />
                </div>
                <span className="ml-1 truncate font-medium text-foreground/85">{filename}</span>
              </div>
              {isTemplateCore ? (
                <span className="rounded border border-border/60 bg-background/80 px-1.5 py-0.5 text-[9px] font-medium tracking-wider uppercase text-primary">
                  TEMPLATE CORE
                </span>
              ) : block.tier === "alias" ? (
                <span className="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-medium tracking-wider uppercase text-amber-600 dark:text-amber-400">
                  WRAPPER ALIAS
                </span>
              ) : block.tier === "utility" ? (
                <span className="rounded border border-border/60 bg-muted/60 px-1.5 py-0.5 text-[9px] font-medium tracking-wider uppercase text-muted-foreground">
                  UTILITY
                </span>
              ) : null}
            </div>

            <div
              className="pointer-events-none relative w-full select-none overflow-hidden transition-transform duration-300 group-hover:scale-[1.015] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              style={{ height: PREVIEW_HEIGHT }}
            >
              <BlockCardPreview slug={block.slug} />
            </div>
          </div>

          <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {block.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {block.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-xs font-medium text-primary">
              {block.category}
            </span>
            <span className="inline-flex items-center rounded-md border border-border/80 bg-muted/50 px-2 py-0.5 font-mono text-xs text-muted-foreground">
              {block.tier === "primary" ? "Core Primitive" : block.tier === "alias" ? "Wrapper Alias" : "Utility"}
            </span>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
          <div className="flex flex-wrap gap-1.5">
            {block.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded border border-border/70 bg-muted/30 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
            View block
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </AccessPanelCard>
    </Link>
  );
}
