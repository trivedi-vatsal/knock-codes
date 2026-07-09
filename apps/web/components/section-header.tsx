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
  /** Zero-padded section number, e.g. "01" — renders `01 / Label`. Omit for an unnumbered eyebrow. */
  number?: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-10", className)}>
      {label && (
        <span className="mb-3.5 block font-mono text-[11px] font-medium tracking-[0.14em] uppercase">
          {number ? (
            <>
              <b className="font-medium text-primary">{number}</b>
              <span className="text-fg-faint"> / {label}</span>
            </>
          ) : (
            <span className="text-primary">// {label}</span>
          )}
        </span>
      )}
      <h2 className="text-[clamp(24px,3.2vw,36px)] font-medium leading-[1.12] tracking-[-0.025em] text-foreground">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-[640px] text-[15px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

