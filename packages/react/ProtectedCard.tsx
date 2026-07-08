"use client";

import { useState, type ReactNode } from "react";
import { useAccessGate } from "./useAccessGate.ts";
import { PinInput } from "./PinInput.tsx";
import { GateWrapper } from "./GateWrapper.tsx";
import type { AccessGateConfig } from "./types.ts";
import { cx } from "./cx.ts";

export interface ProtectedCardProps extends AccessGateConfig {
  children: ReactNode;
  className?: string;
}

/**
 * A card-shaped gate for protecting one section of a page rather than the
 * whole viewport — locked content stays mounted and blurred behind an
 * "Unlock" button instead of being replaced outright, so the card's size
 * and position never jump between locked and unlocked.
 */
export function ProtectedCard({ children, className, ...config }: ProtectedCardProps) {
  const { state, error, submit } = useAccessGate(config);
  const [expanded, setExpanded] = useState(false);
  const [code, setCode] = useState("");

  const cardClassName = cx(
    "w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950",
    className
  );

  if (state === "unlocked") {
    return (
      <GateWrapper variant="inline">
        <div className={cx(cardClassName, "p-6")}>{children}</div>
      </GateWrapper>
    );
  }

  const handleSubmit = async () => {
    await submit(code);
    setCode("");
  };

  return (
    <GateWrapper variant="inline">
      <div className={cx(cardClassName, "relative overflow-hidden p-6")}>
        <div aria-hidden="true" className="pointer-events-none select-none blur-sm">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 p-4 dark:bg-gray-950/80">
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
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
            >
              Unlock
            </button>
          )}
        </div>
      </div>
    </GateWrapper>
  );
}
