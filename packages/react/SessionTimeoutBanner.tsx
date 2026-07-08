"use client";

import { useEffect, useState } from "react";
import { useAccessGateContext } from "./AccessGateProvider.tsx";
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
 * Warns before the shared session (from `<AccessGateProvider>`) expires,
 * with a one-click way to log out immediately instead of waiting for the
 * automatic expiry. Renders nothing outside the warning window or with no
 * active session — requires a provider, since a banner needs a session to
 * watch that something else already established.
 */
export function SessionTimeoutBanner({ warnBeforeMs = 60_000, criticalBeforeMs = 10_000, className }: SessionTimeoutBannerProps) {
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
  const critical = remainingMs <= criticalBeforeMs;

  return (
    <div
      role="alert"
      style={{ fontFamily: "var(--ag-font, inherit)" }}
      className={cx(
        "flex items-center justify-between gap-4 rounded-[var(--ag-radius,0.375rem)] border px-4 py-2 text-sm",
        critical
          ? "border-[#e5484d]/40 bg-[#e5484d]/10 text-[#a5262b] dark:border-[#ff6169]/40 dark:bg-[#ff6169]/10 dark:text-[#ffb3b6]"
          : "border-[#ffb020]/40 bg-[#ffb020]/10 text-[#7a4f0d] dark:border-[#ffb020]/40 dark:bg-[#ffb020]/10 dark:text-[#ffd18a]",
        className
      )}
    >
      <span className="inline-flex items-center gap-2 font-medium">
        <span
          aria-hidden="true"
          className={cx(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            critical ? "animate-pulse bg-[#e5484d] dark:bg-[#ff6169]" : "bg-[#ffb020]"
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
