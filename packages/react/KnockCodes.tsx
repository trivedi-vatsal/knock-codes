"use client";

import { useState, type ReactNode } from "react";
import { useKnockCodes } from "./useKnockCodes.ts";
import { PinInput } from "./PinInput.tsx";
import { GateWrapper, type GateWrapperVariant } from "./GateWrapper.tsx";
import { DEFAULT_LABELS, type KnockCodesConfig, type KnockCodesLabels } from "./types.ts";
import { cx } from "./cx.ts";

export interface KnockCodesProps extends KnockCodesConfig {
  children: ReactNode;
  labels?: KnockCodesLabels;
  /** Visual shell around the PIN prompt. @default "page" */
  variant?: GateWrapperVariant;
  autoFocus?: boolean;
  className?: string;
}

/**
 * Wrapper component. Renders `children` only when a valid session exists;
 * otherwise renders the PIN entry UI. There is no separate "mount loading"
 * state — the PIN entry UI covers it.
 */
export function KnockCodes({ children, labels, variant = "page", autoFocus = true, className, ...config }: KnockCodesProps) {
  const { state, error, submit } = useKnockCodes(config);
  const [code, setCode] = useState("");

  if (state === "unlocked") return <>{children}</>;

  const merged = { ...DEFAULT_LABELS, ...labels };
  const modeLabel = config.verify ? "SERVER VERIFY" : "LOCAL HASH";

  const handleSubmit = async () => {
    await submit(code);
    setCode(""); // clearing after every attempt is an implementation detail, not a contract
  };

  return (
    <GateWrapper variant={variant} className={className}>
      <div
        style={{ fontFamily: "var(--ag-font, inherit)" }}
        className="w-full max-w-sm rounded-[var(--ag-radius,0.75rem)] border border-[var(--ag-border,#e5e7eb)] bg-[var(--ag-card,#ffffff)] p-7 shadow-sm dark:border-[var(--ag-border-dark,#1f2937)] dark:bg-[var(--ag-card-dark,#030712)]"
      >
        <div className="mb-5 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium tracking-wider text-red-600 uppercase dark:text-red-400">
            <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-600 dark:bg-red-400" />
            Locked
          </span>
          <span className="rounded-full border border-gray-200 px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider text-gray-500 uppercase dark:border-gray-800 dark:text-gray-400">
            {modeLabel}
          </span>
        </div>

        <div className="mb-5 space-y-1">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{merged.heading}</h1>
          {merged.subcopy && <p className="text-sm text-gray-500 dark:text-gray-400">{merged.subcopy}</p>}
        </div>

        <PinInput
          value={code}
          onChange={setCode}
          onSubmit={handleSubmit}
          submitting={state === "submitting"}
          error={error}
          labels={labels}
          autoFocus={autoFocus}
        />
      </div>
    </GateWrapper>
  );
}
