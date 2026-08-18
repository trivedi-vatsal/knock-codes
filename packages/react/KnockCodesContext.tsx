"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useKnockCodes } from "./useKnockCodes.ts";
import type { KnockCodesConfig, UseKnockCodesResult } from "./types.ts";

export const KnockCodesContext = createContext<UseKnockCodesResult | null>(null);

/** Returns the shared session, or `null` outside a provider. */
export function useOptionalKnockCodesContext(): UseKnockCodesResult | null {
  return useContext(KnockCodesContext);
}

/** Throws outside a `<KnockCodesProvider>` — there is no meaningful standalone default. */
export function useKnockCodesContext(): UseKnockCodesResult {
  const context = useContext(KnockCodesContext);
  if (!context) {
    throw new Error("Knock Codes: useKnockCodesContext must be used within an <KnockCodesProvider>.");
  }
  return context;
}

/**
 * Uses the provider session when one exists so a gate and a `<LogoutButton>`
 * share one hook instance (same-tab logout actually relocks). Standalone
 * otherwise. Split into two components so `useKnockCodes` is never called
 * conditionally in the same component.
 */
export function GateSession({
  config,
  children,
}: {
  config: KnockCodesConfig;
  children: (session: UseKnockCodesResult) => ReactNode;
}) {
  const ctx = useOptionalKnockCodesContext();
  if (ctx) return <>{children(ctx)}</>;
  return <StandaloneGateSession config={config}>{children}</StandaloneGateSession>;
}

function StandaloneGateSession({
  config,
  children,
}: {
  config: KnockCodesConfig;
  children: (session: UseKnockCodesResult) => ReactNode;
}) {
  const session = useKnockCodes(config);
  return <>{children(session)}</>;
}
