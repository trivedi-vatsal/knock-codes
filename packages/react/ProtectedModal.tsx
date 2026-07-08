"use client";

import { useState, type ReactNode } from "react";
import { useAccessGate } from "./useAccessGate.ts";
import { UnlockDialog } from "./UnlockDialog.tsx";
import type { AccessGateConfig, AccessGateLabels } from "./types.ts";
import { cx } from "./cx.ts";

export interface ProtectedModalProps extends AccessGateConfig {
  children: ReactNode;
  labels?: AccessGateLabels;
  className?: string;
}

/**
 * Content stays mounted (blurred and inert) behind a modal `<UnlockDialog>`
 * instead of being replaced outright — useful when the protected content's
 * layout should stay stable underneath the prompt rather than collapsing to
 * a bare PIN screen.
 */
export function ProtectedModal({ children, labels, className, ...config }: ProtectedModalProps) {
  const { state, error, submit } = useAccessGate(config);
  const [code, setCode] = useState("");
  const locked = state !== "unlocked";

  const handleSubmit = async () => {
    await submit(code);
    setCode("");
  };

  return (
    <div className={cx("relative", className)}>
      <div aria-hidden={locked} className={cx(locked && "pointer-events-none select-none blur-sm")}>
        {children}
      </div>
      <UnlockDialog
        open={locked}
        value={code}
        onChange={setCode}
        onSubmit={handleSubmit}
        submitting={state === "submitting"}
        error={error}
        labels={labels}
      />
    </div>
  );
}
