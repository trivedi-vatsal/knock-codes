"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAccessGate } from "./useAccessGate.ts";
import type { AccessGateConfig, UseAccessGateResult } from "./types.ts";

const AccessGateContext = createContext<UseAccessGateResult | null>(null);

export interface AccessGateProviderProps extends AccessGateConfig {
  children: ReactNode;
}

/**
 * Shares one `useAccessGate` session across a whole tree, so multiple
 * components — a gate, a `LogoutButton`, a `SessionTimeoutBanner` — read and
 * act on the same unlock state instead of each running an independent
 * verification/session lifecycle. Optional: `useAccessGate` or `<AccessGate>`
 * work standalone with no provider; reach for this only when two or more
 * components need to share one session.
 */
export function AccessGateProvider({ children, ...config }: AccessGateProviderProps) {
  const state = useAccessGate(config);
  return <AccessGateContext.Provider value={state}>{children}</AccessGateContext.Provider>;
}

/** Throws outside an `<AccessGateProvider>` — there is no meaningful standalone default. */
export function useAccessGateContext(): UseAccessGateResult {
  const context = useContext(AccessGateContext);
  if (!context) {
    throw new Error("Access Gate: useAccessGateContext must be used within an <AccessGateProvider>.");
  }
  return context;
}
