import type { ReactNode } from "react";
import { GateWrapper, type GateWrapperVariant } from "./GateWrapper.tsx";
import { cx } from "./cx.ts";

export interface AccessDeniedScreenProps {
  heading?: string;
  message?: ReactNode;
  action?: ReactNode;
  variant?: GateWrapperVariant;
  className?: string;
}

/**
 * A static "you don't have access" view — distinct from the PIN entry UI
 * `<AccessGate>` renders while locked, because it never accepts another
 * attempt. Use it as a custom `unauthorizedFallback` (e.g. on
 * `<ProtectedRoute>`) or anywhere a route/component needs a denial state
 * with no verification form in it at all.
 */
export function AccessDeniedScreen({
  heading = "Access denied",
  message = "You don't have permission to view this page.",
  action,
  variant = "page",
  className,
}: AccessDeniedScreenProps) {
  return (
    <GateWrapper variant={variant} className={className}>
      <div className={cx("w-full max-w-sm space-y-3 text-center")}>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{heading}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
        {action}
      </div>
    </GateWrapper>
  );
}
