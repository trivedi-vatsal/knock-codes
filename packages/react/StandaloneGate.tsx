"use client";

import type { ReactNode } from "react";
import { AccessGate } from "./AccessGate.tsx";
import type { GateWrapperVariant } from "./GateWrapper.tsx";
import type { AccessGateConfig } from "./types.ts";

export interface StandaloneGateProps extends Pick<AccessGateConfig, "expectedHash" | "verify"> {
  children: ReactNode;
  /** @default "This page is protected" */
  heading?: string;
  /** Escape hatch for embedding a Standalone Gate somewhere other than a real app root (a demo, a docs page). @default "page" */
  variant?: GateWrapperVariant;
}

/**
 * The fastest path to a working gate: wrap your app, pass a hash, done.
 * Deliberately exposes a smaller surface than `<AccessGate>` — no storage,
 * timeout, or activity-tracking props — reach for `<AccessGate>` directly
 * once you need those.
 */
export function StandaloneGate({ children, heading, expectedHash, verify, variant }: StandaloneGateProps) {
  return (
    <AccessGate expectedHash={expectedHash} verify={verify} labels={heading ? { heading } : undefined} variant={variant}>
      {children}
    </AccessGate>
  );
}
