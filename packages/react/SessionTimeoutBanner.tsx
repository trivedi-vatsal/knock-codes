"use client";

import { useEffect, useState } from "react";
import { useKnockCodesContext } from "./KnockCodesProvider.tsx";
import { EXPIRY_POLL_INTERVAL_MS } from "./types.ts";
import { cx } from "./cx.ts";

export interface SessionTimeoutBannerProps {
  /** Show the banner once this many ms remain before expiry. @default 60_000 */
  warnBeforeMs?: number;
  /** Switches to the stronger "about to expire" styling once this many ms remain. @default 10_000 */
  criticalBeforeMs?: number;
  className?: string;
}

/**
 * Warns before the shared session (from `<KnockCodesProvider>`) expires,
 * with a one-click way to log out immediately instead of waiting for the
 * automatic expiry. Renders nothing outside the warning window or with no
 * active session — requires a provider, since a banner needs a session to
 * watch that something else already established.
 */
export function SessionTimeoutBanner({ warnBeforeMs = 60_000, criticalBeforeMs = 10_000, className }: SessionTimeoutBannerProps) {
  const { session, logout } = useKnockCodesContext();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => setNow(Date.now()), EXPIRY_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [session]);

  if (!session) return null;
  const remainingMs = session.expiresAt - now;
  if (remainingMs > warnBeforeMs || remainingMs <= 0) return null;

  const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const critical = remainingMs <= criticalBeforeMs;

  return (
    <div
      role="alert"
      style={{ fontFamily: "var(--ag-font, inherit)" }}
      className={cx(
        "flex items-center justify-between gap-4 rounded-[var(--ag-radius,0.5rem)] border px-4 py-2.5 text-sm",
        critical
          ? "border-red-500/40 bg-red-500/10 text-red-900 dark:border-red-400/40 dark:bg-red-400/10 dark:text-red-200"
          : "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-200",
        className
      )}
    >
      <span className="inline-flex items-center gap-2 font-medium">
        <span
          aria-hidden="true"
          className={cx(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            critical ? "animate-pulse bg-red-500 dark:bg-red-400" : "bg-amber-500 dark:bg-amber-400"
          )}
        />
        {critical ? "Expiring now" : "Expires soon"} — session ends in {remainingSeconds}s.
      </span>
      <button type="button" onClick={logout} className="font-medium underline underline-offset-2 hover:no-underline">
        Log out now
      </button>
    </div>
  );
}
