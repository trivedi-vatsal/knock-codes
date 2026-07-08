"use client";

import { useState, type ReactNode } from "react";
import { useKnockCodes } from "./useKnockCodes.ts";
import { PinInput } from "./PinInput.tsx";
import { GateWrapper } from "./GateWrapper.tsx";
import type { KnockCodesConfig } from "./types.ts";
import { cx } from "./cx.ts";

export interface ProtectedCardProps extends KnockCodesConfig {
  children: ReactNode;
  className?: string;
}

function StatusBadge({ unlocked }: { unlocked: boolean }) {
  return (
    <span
      className={cx(
        "absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider uppercase",
        unlocked
          ? "border-[#187c74]/30 bg-[#187c74]/10 text-[#187c74] dark:border-[#4fd1c5]/30 dark:bg-[#4fd1c5]/10 dark:text-[#4fd1c5]"
          : "border-[#e5484d]/30 bg-[#e5484d]/10 text-[#e5484d] dark:border-[#ff6169]/30 dark:bg-[#ff6169]/10 dark:text-[#ff6169]"
      )}
    >
      <span
        aria-hidden="true"
        className={cx("h-1.5 w-1.5 shrink-0 rounded-full", unlocked ? "bg-[#187c74] dark:bg-[#4fd1c5]" : "bg-[#e5484d] dark:bg-[#ff6169]")}
      />
      {unlocked ? "Unlocked" : "Locked"}
    </span>
  );
}

/**
 * A card-shaped gate for protecting one section of a page rather than the
 * whole viewport — locked content stays mounted and blurred behind an
 * "Unlock" button instead of being replaced outright, so the card's size
 * and position never jump between locked and unlocked.
 */
export function ProtectedCard({ children, className, ...config }: ProtectedCardProps) {
  const { state, error, submit } = useKnockCodes(config);
  const [expanded, setExpanded] = useState(false);
  const [code, setCode] = useState("");

  const cardClassName = cx(
    "relative w-full max-w-sm rounded-[var(--ag-radius,0.5rem)] border border-[var(--ag-border,#d9d2c2)] bg-[var(--ag-card,#fbf8f1)] shadow-sm dark:border-[var(--ag-border-dark,#26302b)] dark:bg-[var(--ag-card-dark,#171d1a)]",
    className
  );

  if (state === "unlocked") {
    return (
      <GateWrapper variant="inline">
        <div style={{ fontFamily: "var(--ag-font, inherit)" }} className={cx(cardClassName, "p-6")}>
          <StatusBadge unlocked />
          <div className="pt-5">{children}</div>
        </div>
      </GateWrapper>
    );
  }

  const handleSubmit = async () => {
    await submit(code);
    setCode("");
  };

  return (
    <GateWrapper variant="inline">
      <div style={{ fontFamily: "var(--ag-font, inherit)" }} className={cx(cardClassName, "overflow-hidden p-6")}>
        <StatusBadge unlocked={false} />
        <div aria-hidden="true" className="pointer-events-none pt-5 select-none blur-sm">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--ag-card,#fbf8f1)]/85 p-4 dark:bg-[var(--ag-card-dark,#171d1a)]/85">
          {expanded ? (
            <div className="w-full max-w-xs">
              <PinInput
                value={code}
                onChange={setCode}
                onSubmit={handleSubmit}
                submitting={state === "submitting"}
                error={error}
                autoFocus
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="rounded-[var(--ag-radius,0.375rem)] bg-[var(--ag-primary,#187c74)] px-4 py-2 text-sm font-medium text-[var(--ag-primary-fg,#f7f3ea)] transition-colors hover:opacity-90 dark:bg-[var(--ag-primary-dark,#4fd1c5)] dark:text-[var(--ag-primary-fg-dark,#0e1311)]"
            >
              Unlock
            </button>
          )}
        </div>
      </div>
    </GateWrapper>
  );
}
