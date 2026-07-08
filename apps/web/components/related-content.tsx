import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Block } from "@/lib/blocks";

export function RelatedContent({ blocks }: { blocks: Block[] }) {
  if (blocks.length === 0) return null;

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {blocks.map((block) => (
        <li key={block.slug}>
          <Link
            href={`/blocks/${block.slug}`}
            className="group flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-sm hover:border-primary/40 hover:bg-accent"
          >
            <span>
              <span className="font-medium text-foreground">{block.title}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{block.description}</span>
            </span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
