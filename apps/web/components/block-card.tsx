import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Block } from "@/lib/blocks";

export function BlockCard({ block }: { block: Block }) {
  return (
    <Link
      href={`/blocks/${block.slug}`}
      className="group flex flex-col justify-between rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-accent"
    >
      <div>
        <p className="label-mono mb-2 text-muted-foreground">→ {block.category}</p>
        <h3 className="text-base font-semibold text-foreground">{block.title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{block.description}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {block.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="label-mono rounded border border-border px-1.5 py-0.5 text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
    </Link>
  );
}
