import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared page hero header matching the homepage's high-end lighting and typography,
 * giving subsequent pages a cohesive entrance experience.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "relative overflow-hidden border-b border-border px-6 pt-16 pb-16 text-center md:px-8 md:pt-24 md:pb-20",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[-100px] left-1/2 h-[480px] w-[800px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.06)_0%,rgba(250,250,250,0.015)_40%,transparent_70%)]"
      />
      <div className="relative mx-auto max-w-[960px]">
        {eyebrow && (
          <div className="mb-5">
            <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-fg-faint uppercase">
              {eyebrow}
            </span>
          </div>
        )}
        <h1 className="text-[clamp(36px,5.5vw,64px)] font-medium leading-[1.04] tracking-[-0.03em] text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-5 max-w-[640px] text-[16px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
        {children && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {children}
          </div>
        )}
      </div>
    </header>
  );
}
