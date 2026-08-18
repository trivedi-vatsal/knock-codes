"use client";

import type { ReactNode } from "react";
import { useKnockCodes } from "./useKnockCodes.ts";
import { KnockCodesContext } from "./KnockCodesContext.tsx";
import type { KnockCodesConfig } from "./types.ts";

export { useKnockCodesContext, useOptionalKnockCodesContext } from "./KnockCodesContext.tsx";

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
 *
 * Gates under this provider (`<KnockCodes>`, `<ProtectedCard>`, …) join the
 * shared session automatically. Put `expectedHash` / `verify` on the
 * provider; repeating them on the gate is ignored.
 */
export function KnockCodesProvider({ children, ...config }: KnockCodesProviderProps) {
  const state = useKnockCodes(config);
  return <KnockCodesContext.Provider value={state}>{children}</KnockCodesContext.Provider>;
}
