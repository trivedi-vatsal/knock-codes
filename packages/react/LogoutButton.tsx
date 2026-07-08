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
        "rounded-[var(--ag-radius,0.375rem)] border border-[var(--ag-border,#d9d2c2)] px-3 py-1.5 text-sm text-[#191a18] hover:border-[var(--ag-primary,#187c74)]/40 hover:bg-[var(--ag-primary,#187c74)]/5 dark:border-[var(--ag-border-dark,#26302b)] dark:text-[#edeae0] dark:hover:border-[var(--ag-primary-dark,#4fd1c5)]/40 dark:hover:bg-[var(--ag-primary-dark,#4fd1c5)]/10",
        className
      )}
    >
      {children}
    </button>
  );
}
