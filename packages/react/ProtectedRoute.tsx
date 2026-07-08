"use client";

import type { ReactNode } from "react";
import { useAccessGate } from "./useAccessGate.ts";
import { AccessGate, type AccessGateProps } from "./AccessGate.tsx";

export interface ProtectedRouteProps extends AccessGateProps {
  /**
   * Rendered instead of the default PIN prompt while locked — e.g. a
   * redirect notice paired with your router's own navigation. When omitted,
   * behaves exactly like `<AccessGate>`.
   */
  unauthorizedFallback?: ReactNode;
}

function FallbackGate({ unauthorizedFallback, children, labels: _labels, variant: _variant, className: _className, ...config }: ProtectedRouteProps) {
  const { state } = useAccessGate(config);
  return <>{state === "unlocked" ? children : unauthorizedFallback}</>;
}

/**
 * `<AccessGate>` for route-level guarding — a React Router `element`, a
 * layout-level redirect guard — with one addition: an optional
 * `unauthorizedFallback` for routes that should show something other than
 * an inline PIN prompt while locked (e.g. a "redirecting…" notice).
 */
export function ProtectedRoute({ unauthorizedFallback, ...props }: ProtectedRouteProps) {
  if (unauthorizedFallback === undefined) return <AccessGate {...props} />;
  return <FallbackGate {...props} unauthorizedFallback={unauthorizedFallback} />;
}
