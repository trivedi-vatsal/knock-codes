"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useKnockCodes } from "./useKnockCodes.ts";
import type { KnockCodesConfig, UseKnockCodesResult } from "./types.ts";

const KnockCodesContext = createContext<UseKnockCodesResult | null>(null);

export interface KnockCodesProviderProps extends KnockCodesConfig {
  children: ReactNode;
}

/**
 * Shares one `useKnockCodes` session across a whole tree, so multiple
 * components — a gate, a `LogoutButton`, a `SessionTimeoutBanner` — read and
 * act on the same unlock state instead of each running an independent
 * verification/session lifecycle. Optional: `useKnockCodes` or `<KnockCodes>`
 * work standalone with no provider; reach for this only when two or more
 * components need to share one session.
 */
export function KnockCodesProvider({ children, ...config }: KnockCodesProviderProps) {
  const state = useKnockCodes(config);
  return <KnockCodesContext.Provider value={state}>{children}</KnockCodesContext.Provider>;
}

/** Throws outside an `<KnockCodesProvider>` — there is no meaningful standalone default. */
export function useKnockCodesContext(): UseKnockCodesResult {
  const context = useContext(KnockCodesContext);
  if (!context) {
    throw new Error("Knock Codes: useKnockCodesContext must be used within an <KnockCodesProvider>.");
  }
  return context;
}
