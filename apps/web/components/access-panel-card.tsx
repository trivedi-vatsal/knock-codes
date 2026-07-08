import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The gallery-card version of the "access panel" motif — corner ticks and a
 * signal dot, scaled down from `BlueprintFrame`'s section-level treatment to
 * something that reads at card density without competing with card content.
 */
export function AccessPanelCard({
  serial,
  children,
  className,
}: {
  /** Small uppercase code shown top-right, e.g. a category or mode label. */
  serial?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("group relative flex flex-col justify-between rounded-lg border border-border bg-card p-5 transition-colors", className)}>
      <span aria-hidden="true" className="absolute -top-px -left-px h-2 w-2 border-t border-l border-foreground/25 transition-colors group-hover:border-primary/60" />
      <span aria-hidden="true" className="absolute -top-px -right-px h-2 w-2 border-t border-r border-foreground/25 transition-colors group-hover:border-primary/60" />
      <span aria-hidden="true" className="absolute -bottom-px -left-px h-2 w-2 border-b border-l border-foreground/25 transition-colors group-hover:border-primary/60" />
      <span aria-hidden="true" className="absolute -bottom-px -right-px h-2 w-2 border-b border-r border-foreground/25 transition-colors group-hover:border-primary/60" />
      {serial && (
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 font-mono text-[9px] font-medium tracking-wider text-muted-foreground/70 uppercase">
          <span aria-hidden="true" className="status-dot" data-tone="muted" />
          {serial}
        </span>
      )}
      {children}
    </div>
  );
}
