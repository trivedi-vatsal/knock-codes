import type { ReactNode } from "react";
import { cx } from "./cx.ts";

/** Outer positioning only — "page" centers full-height, "inline" flows in place. Visual treatment (borders/padding/shadow) is each block's own concern, not this wrapper's. */
export type GateWrapperVariant = "page" | "inline";

export interface GateWrapperProps {
  children: ReactNode;
  /** @default "page" */
  variant?: GateWrapperVariant;
  className?: string;
}

const VARIANT_CLASSES: Record<GateWrapperVariant, string> = {
  page: "flex min-h-[100dvh] w-full items-center justify-center p-6",
  inline: "flex w-full items-start",
};

/**
 * The shared outer-positioning primitive every visible block composes on —
 * a plain container, not a verification strategy. Kept separate from
 * `<KnockCodes>` so blocks like `<ProtectedRoute>`/`<EmbeddedGate>` can reuse
 * the same page-vs-inline placement without re-deriving it, while each block
 * still owns its own inner card/border/spacing styling.
 */
export function GateWrapper({ children, variant = "page", className }: GateWrapperProps) {
  return <div className={cx(VARIANT_CLASSES[variant], className)}>{children}</div>;
}
