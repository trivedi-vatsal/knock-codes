"use client";

import type { ReactNode } from "react";
import { useKnockCodes } from "./useKnockCodes.ts";
import { KnockCodes, type KnockCodesProps } from "./KnockCodes.tsx";

export interface ProtectedRouteProps extends KnockCodesProps {
  /**
   * Rendered instead of the default PIN prompt while locked — e.g. a
   * redirect notice paired with your router's own navigation. When omitted,
   * behaves exactly like `<KnockCodes>`.
   */
  unauthorizedFallback?: ReactNode;
}

function FallbackGate({ unauthorizedFallback, children, labels: _labels, variant: _variant, className: _className, ...config }: ProtectedRouteProps) {
  const { state } = useKnockCodes(config);
  return <>{state === "unlocked" ? children : unauthorizedFallback}</>;
}

/**
 * `<KnockCodes>` for route-level guarding — a React Router `element`, a
 * layout-level redirect guard — with one addition: an optional
 * `unauthorizedFallback` for routes that should show something other than
 * an inline PIN prompt while locked (e.g. a "redirecting…" notice).
 */
export function ProtectedRoute({ unauthorizedFallback, ...props }: ProtectedRouteProps) {
  if (unauthorizedFallback === undefined) return <KnockCodes {...props} />;
  return <FallbackGate {...props} unauthorizedFallback={unauthorizedFallback} />;
}
