import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Block } from "@/lib/blocks";
import { AccessPanelCard } from "@/components/access-panel-card";

export function BlockCard({ block }: { block: Block }) {
  return (
    <Link href={`/blocks/${block.slug}`} className="group block h-full">
      <AccessPanelCard serial={block.registryName} className="h-full hover:border-primary/50 hover:bg-card">
        <div>
          <p className="font-mono text-[11px] font-medium tracking-wider text-primary uppercase">
            → {block.category}
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {block.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {block.description}
          </p>
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
