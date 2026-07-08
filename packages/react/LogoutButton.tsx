"use client";

import type { ReactNode } from "react";
import { useAccessGateContext } from "./AccessGateProvider.tsx";
import { cx } from "./cx.ts";

export interface LogoutButtonProps {
  children?: ReactNode;
  className?: string;
  /** Called after the shared session is cleared. */
  onLoggedOut?: () => void;
}

/**
 * Reads the shared session from `<AccessGateProvider>` and clears it on
 * click. Requires a provider — a logout action only makes sense where a
 * session is already being shared with something else that reads it.
 */
export function LogoutButton({ children = "Log out", className, onLoggedOut }: LogoutButtonProps) {
  const { logout } = useAccessGateContext();

  return (
    <button
      type="button"
      onClick={() => {
        logout();
        onLoggedOut?.();
      }}
      className={cx(
        "rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900",
        className
      )}
    >
      {children}
    </button>
  );
}
