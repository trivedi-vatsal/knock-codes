"use client";

import { useState, type ReactNode } from "react";
import { useAccessGate } from "./useAccessGate.ts";
import { PinInput } from "./PinInput.tsx";
import { GateWrapper, type GateWrapperVariant } from "./GateWrapper.tsx";
import { DEFAULT_LABELS, type AccessGateConfig, type AccessGateLabels } from "./types.ts";

export interface AccessGateProps extends AccessGateConfig {
  children: ReactNode;
  labels?: AccessGateLabels;
  /** Visual shell around the PIN prompt. @default "page" */
  variant?: GateWrapperVariant;
  className?: string;
}

/**
 * Wrapper component — docs/architecture/overview.md § Component
 * Architecture. Renders `children` only when a valid session exists;
 * otherwise renders the PIN entry UI. Matches the state machine in
 * docs/ux/flows.md § Unlock Flow exactly: no separate "mount loading" state
 * (per that doc's Loading States section) — the PIN entry UI covers it.
 */
export function AccessGate({ children, labels, variant = "page", className, ...config }: AccessGateProps) {
  const { state, error, submit } = useAccessGate(config);
  const [code, setCode] = useState("");

  if (state === "unlocked") return <>{children}</>;

  const merged = { ...DEFAULT_LABELS, ...labels };

  const handleSubmit = async () => {
    await submit(code);
    setCode(""); // clearing after every attempt is an implementation detail, not a contract — docs/ux/flows.md § Unlock Flow step 5
  };

  return (
    <GateWrapper variant={variant} className={className}>
      <div className="w-full max-w-sm space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{merged.heading}</h1>
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
