"use client";

import type { ReactNode } from "react";
import { KnockCodes } from "./KnockCodes.tsx";
import type { GateWrapperVariant } from "./GateWrapper.tsx";
import type { KnockCodesConfig } from "./types.ts";

export interface StandaloneGateProps extends Pick<KnockCodesConfig, "expectedHash" | "verify"> {
  children: ReactNode;
  /** @default "This page is protected" */
  heading?: string;
  /** Escape hatch for embedding a Standalone Gate somewhere other than a real app root (a demo, a docs page). @default "page" */
  variant?: GateWrapperVariant;
  /** @default true */
  autoFocus?: boolean;
}

/**
 * The fastest path to a working gate: wrap your app, pass a hash, done.
 * Deliberately exposes a smaller surface than `<KnockCodes>` — no storage,
 * timeout, or activity-tracking props — reach for `<KnockCodes>` directly
 * once you need those.
 */
export function StandaloneGate({ children, heading, expectedHash, verify, variant, autoFocus }: StandaloneGateProps) {
  return (
    <KnockCodes
      expectedHash={expectedHash}
      verify={verify}
      labels={heading ? { heading } : undefined}
      variant={variant}
      autoFocus={autoFocus}
    >
      {children}
    </KnockCodes>
  );
}
