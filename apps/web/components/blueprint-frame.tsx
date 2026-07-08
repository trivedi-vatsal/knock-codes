import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Dashed-border section framing with small corner registration marks and an
 * optional label tag straddling the top edge — the asktori.ai "technical
 * blueprint" motif (arrow-prefixed monospace tags, dashed section
 * boundaries) applied to real layout, not just the color/type choices.
 */
export function BlueprintFrame({
  label,
  children,
  className,
}: {
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative rounded-md border border-dashed border-border p-6 sm:p-8", className)}>
      {label && (
        <span className="label-mono absolute -top-3 left-6 bg-background px-2 text-primary">→ {label}</span>
      )}
      <span aria-hidden="true" className="absolute -top-px -left-px h-2.5 w-2.5 border-t border-l border-foreground/30" />
      <span aria-hidden="true" className="absolute -top-px -right-px h-2.5 w-2.5 border-t border-r border-foreground/30" />
      <span aria-hidden="true" className="absolute -bottom-px -left-px h-2.5 w-2.5 border-b border-l border-foreground/30" />
      <span aria-hidden="true" className="absolute -bottom-px -right-px h-2.5 w-2.5 border-b border-r border-foreground/30" />
      {children}
    </div>
  );
}
