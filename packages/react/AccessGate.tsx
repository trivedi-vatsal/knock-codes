"use client";

import { useState, type ReactNode } from "react";
import { useAccessGate } from "./useAccessGate.ts";
import { PinInput } from "./PinInput.tsx";
import { GateWrapper, type GateWrapperVariant } from "./GateWrapper.tsx";
import { DEFAULT_LABELS, type AccessGateConfig, type AccessGateLabels } from "./types.ts";
import { cx } from "./cx.ts";

export interface AccessGateProps extends AccessGateConfig {
  children: ReactNode;
  labels?: AccessGateLabels;
  /** Visual shell around the PIN prompt. @default "page" */
  variant?: GateWrapperVariant;
  className?: string;
}

/**
 * Wrapper component. Renders `children` only when a valid session exists;
 * otherwise renders the PIN entry UI. There is no separate "mount loading"
 * state — the PIN entry UI covers it.
 */
export function AccessGate({ children, labels, variant = "page", className, ...config }: AccessGateProps) {
  const { state, error, submit } = useAccessGate(config);
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
        className={cx(
          "relative w-full max-w-sm space-y-4 border border-[var(--ag-border,#d9d2c2)] bg-[var(--ag-card,#fbf8f1)] p-6 shadow-sm",
          "rounded-[var(--ag-radius,0.5rem)] dark:border-[var(--ag-border-dark,#26302b)] dark:bg-[var(--ag-card-dark,#171d1a)]"
        )}
      >
        <span aria-hidden="true" className="absolute -top-px -left-px h-2.5 w-2.5 border-t border-l border-[#191a18]/25 dark:border-[#edeae0]/25" />
        <span aria-hidden="true" className="absolute -top-px -right-px h-2.5 w-2.5 border-t border-r border-[#191a18]/25 dark:border-[#edeae0]/25" />
        <span aria-hidden="true" className="absolute -bottom-px -left-px h-2.5 w-2.5 border-b border-l border-[#191a18]/25 dark:border-[#edeae0]/25" />
        <span aria-hidden="true" className="absolute -bottom-px -right-px h-2.5 w-2.5 border-b border-r border-[#191a18]/25 dark:border-[#edeae0]/25" />

        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium tracking-wider text-[#e5484d] uppercase dark:text-[#ff6169]">
            <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#e5484d] dark:bg-[#ff6169]" />
            Locked
          </span>
          <span className="rounded-full border border-[#d9d2c2] px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider text-[#6b6456] uppercase dark:border-[#26302b] dark:text-[#9aa39c]">
            {modeLabel}
          </span>
        </div>

        <div className="space-y-1">
          <h1 className="text-lg font-semibold text-[#191a18] dark:text-[#edeae0]">{merged.heading}</h1>
          {merged.subcopy && <p className="text-sm text-[#6b6456] dark:text-[#9aa39c]">{merged.subcopy}</p>}
        </div>

        <PinInput
          value={code}
          onChange={setCode}
          onSubmit={handleSubmit}
          submitting={state === "submitting"}
          error={error}
          labels={labels}
          autoFocus
        />
      </div>
    </GateWrapper>
  );
}
