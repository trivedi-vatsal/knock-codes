import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  label,
  number,
  title,
  description,
  className,
}: {
  label?: string;
  /** Zero-padded section number, e.g. "01" — renders `01 › Label`. Omit for an unnumbered eyebrow. */
  number?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <p className="label-mono text-primary">
          {number && <span className="text-muted-foreground">{number} › </span>}
          {label}
        </p>
      )}
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
      {description && <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
