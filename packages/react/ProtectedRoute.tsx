"use client";

import type { ReactNode } from "react";
import { KnockCodes, type KnockCodesProps } from "./KnockCodes.tsx";
import { GateSession } from "./KnockCodesContext.tsx";

export interface ProtectedRouteProps extends KnockCodesProps {
  /**
   * Rendered instead of the default PIN prompt while locked — e.g. a
   * redirect notice paired with your router's own navigation. When omitted,
   * behaves exactly like `<KnockCodes>`.
   */
  unauthorizedFallback?: ReactNode;
}

function FallbackGate({ unauthorizedFallback, children, labels: _labels, variant: _variant, className: _className, ...config }: ProtectedRouteProps) {
  return (
    <GateSession config={config}>
      {({ ready, state }) => {
        if (!ready) return null;
        return <>{state === "unlocked" ? children : unauthorizedFallback}</>;
      }}
    </GateSession>
  );
}

/**
 * `<KnockCodes>` for route-level guarding — a React Router `element`, a
 * layout-level redirect guard — with one addition: an optional
 * `unauthorizedFallback` for routes that should show something other than
 * an inline PIN prompt while locked (e.g. a "redirecting…" notice).
 *
 * Inside a `<KnockCodesProvider>`, shares that session rather than creating
 * a second hook instance.
 */
export function ProtectedRoute({ unauthorizedFallback, ...props }: ProtectedRouteProps) {
  if (unauthorizedFallback === undefined) return <KnockCodes {...props} />;
  return <FallbackGate {...props} unauthorizedFallback={unauthorizedFallback} />;
}
