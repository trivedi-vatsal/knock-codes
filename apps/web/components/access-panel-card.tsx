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
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-card hover:shadow-[0_16px_40px_-12px_rgba(245,158,11,0.16)]",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] rounded-t-xl bg-gradient-to-r from-transparent via-primary/0 to-transparent transition-all duration-300 group-hover:via-primary"
      />
      <span aria-hidden="true" className="absolute -top-px -left-px h-2.5 w-2.5 border-t-2 border-l-2 border-foreground/30 transition-all duration-200 group-hover:scale-110 group-hover:border-primary" />
      <span aria-hidden="true" className="absolute -top-px -right-px h-2.5 w-2.5 border-t-2 border-r-2 border-foreground/30 transition-all duration-200 group-hover:scale-110 group-hover:border-primary" />
      <span aria-hidden="true" className="absolute -bottom-px -left-px h-2.5 w-2.5 border-b-2 border-l-2 border-foreground/30 transition-all duration-200 group-hover:scale-110 group-hover:border-primary" />
      <span aria-hidden="true" className="absolute -bottom-px -right-px h-2.5 w-2.5 border-b-2 border-r-2 border-foreground/30 transition-all duration-200 group-hover:scale-110 group-hover:border-primary" />
      {serial && (
        <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 font-mono text-[10px] font-medium tracking-wider text-muted-foreground/80 uppercase">
          <span aria-hidden="true" className="status-dot transition-transform duration-300 group-hover:scale-125" data-tone="muted" />
          {serial}
        </span>
      )}
      {children}
    </div>
  );
}

