"use client";

import type { ReactNode } from "react";
import { useKnockCodesContext } from "./KnockCodesProvider.tsx";
import { cx } from "./cx.ts";

export interface LogoutButtonProps {
  children?: ReactNode;
  className?: string;
  /** Called after the shared session is cleared. */
  onLoggedOut?: () => void;
}

/**
 * Reads the shared session from `<KnockCodesProvider>` and clears it on
 * click. Requires a provider — a logout action only makes sense where a
 * session is already being shared with something else that reads it.
 */
export function LogoutButton({ children = "Log out", className, onLoggedOut }: LogoutButtonProps) {
  const { logout } = useKnockCodesContext();

  return (
    <button
      type="button"
      onClick={() => {
        logout();
        onLoggedOut?.();
      }}
      className={cx(
        "rounded-[var(--ag-radius,0.5rem)] border border-[var(--ag-border,#e5e7eb)] px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-[var(--ag-primary,#3b82f6)]/40 hover:bg-[var(--ag-primary,#3b82f6)]/5 dark:border-[var(--ag-border-dark,#1f2937)] dark:text-gray-200 dark:hover:border-[var(--ag-primary,#3b82f6)]/40 dark:hover:bg-[var(--ag-primary,#3b82f6)]/10",
        className
      )}
    >
      {children}
    </button>
  );
}
