import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RelatedItem {
  slug: string;
  title: string;
  description: string;
}

/** Renders links to either blocks or templates — pass `basePath` for the target section. Shared because a block and a template are structurally identical here (slug/title/description). */
export function RelatedContent({ items, basePath = "/blocks" }: { items: RelatedItem[]; basePath?: string }) {
  if (items.length === 0) return null;

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.slug}>
          <Link
            href={`${basePath}/${item.slug}`}
            className="group flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-sm hover:border-primary/40 hover:bg-accent"
          >
            <span>
              <span className="font-medium text-foreground">{item.title}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{item.description}</span>
            </span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
