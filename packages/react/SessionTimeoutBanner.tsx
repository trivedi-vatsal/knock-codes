"use client";

import { useEffect, useState } from "react";
import { useAccessGateContext } from "./AccessGateProvider.tsx";
import { EXPIRY_POLL_INTERVAL_MS } from "./types.ts";
import { cx } from "./cx.ts";

export interface SessionTimeoutBannerProps {
  /** Show the banner once this many ms remain before expiry. @default 60_000 */
  warnBeforeMs?: number;
  className?: string;
}

/**
 * Warns before the shared session (from `<AccessGateProvider>`) expires,
 * with a one-click way to log out immediately instead of waiting for the
 * automatic expiry. Renders nothing outside the warning window or with no
 * active session — requires a provider, since a banner needs a session to
 * watch that something else already established.
 */
export function SessionTimeoutBanner({ warnBeforeMs = 60_000, className }: SessionTimeoutBannerProps) {
  const { session, logout } = useAccessGateContext();
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

  return (
    <div
      role="alert"
      className={cx(
        "flex items-center justify-between gap-4 rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
        className
      )}
    >
      <span>Your session expires in {remainingSeconds}s.</span>
      <button type="button" onClick={logout} className="font-medium underline underline-offset-2">
        Log out now
      </button>
    </div>
  );
}
