import type { ReactNode } from "react";

/** The reference's `01 / Label` section eyebrow — homepage-only, distinct from the shared `SectionHeader` used on other pages. */
export function HomeSectionHead({
  number,
  label,
  title,
  description,
}: {
  number: string;
  label: string;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div className="mb-14">
      <span className="mb-4 block font-mono text-[11px] font-medium tracking-[0.14em] uppercase">
        <b className="font-medium text-primary">{number}</b>
        <span className="text-fg-faint"> / {label}</span>
      </span>
      <h2 className="text-[clamp(30px,4vw,44px)] leading-[1.1] font-medium tracking-[-0.025em]">{title}</h2>
      {description && <p className="mt-3.5 max-w-[520px] text-muted-foreground">{description}</p>}
    </div>
  );
}
