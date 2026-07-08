import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  label,
  title,
  description,
  className,
}: {
  label?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <p className="label-mono text-primary">→ {label}</p>}
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
      {description && <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
