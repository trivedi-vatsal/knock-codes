"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { resolveVerifyFn, type VerifyResult } from "../core/verify.ts";
import { createSession, isExpired, touchExpiry, type AccessGateSession } from "../core/session.ts";
import { createSessionStore } from "../core/storage.ts";
import {
  ACTIVITY_WRITE_THROTTLE_MS,
  DEFAULT_TIMEOUT_MS,
  EXPIRY_POLL_INTERVAL_MS,
  type AccessGateConfig,
  type AccessGateError,
  type AccessGateState,
  type UseAccessGateResult,
} from "./types.ts";

const ACTIVITY_EVENTS = ["pointerdown", "keydown", "scroll"] as const;

/**
 * Headless session/verification hook. `<AccessGate>` is a thin renderer
 * over this; a host app can call it directly to build a fully custom PIN
 * UI while the session contract stays identical either way.
 */
export function useAccessGate(config: AccessGateConfig): UseAccessGateResult {
  const {
    expectedHash,
    verify,
    storage = "localStorage",
    storageKey,
    timeout = DEFAULT_TIMEOUT_MS,
    activityTracking = false,
  } = config;

  // Resolved once per config identity; throws synchronously (during render)
  // on misconfiguration — no dev/prod branch here, matching verify.ts's
  // own "no dev/prod branch" stance.
  const verifyFn = useMemo(() => resolveVerifyFn({ expectedHash, verify }), [expectedHash, verify]);
  const store = useMemo(() => createSessionStore(storage, { storageKey }), [storage, storageKey]);

  const [session, setSession] = useState<AccessGateSession | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<AccessGateError | null>(null);

  // Initial read is deferred to an effect (never runs during SSR) so the
  // server-rendered/first-paint markup never depends on storage that may not
  // exist yet — storage.ts throws rather than silently no-op-ing.
  useEffect(() => {
    const current = store.get();
    setSession(current && !isExpired(current) ? current : null);
  }, [store]);

  // Expiry: checked on an interval and on tab focus.
  useEffect(() => {
    const checkExpiry = () => {
      setSession((current) => {
        if (!current || !isExpired(current)) return current;
        store.clear();
        return null;
      });
    };
    const interval = setInterval(checkExpiry, EXPIRY_POLL_INTERVAL_MS);
    window.addEventListener("focus", checkExpiry);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", checkExpiry);
    };
  }, [store]);

  // Cross-tab sync: only the localStorage-backed store ever actually calls
  // back here — sessionStorage/memory stores' subscribe is a no-op.
  useEffect(() => store.subscribe(() => {
    const current = store.get();
    setSession(current && !isExpired(current) ? current : null);
  }), [store]);

  // Activity tracking (opt-in): sliding-timeout model, throttled writes.
  const lastTouchAtRef = useRef(0);
  useEffect(() => {
    if (!activityTracking) return;
    const onActivity = () => {
      const now = Date.now();
      if (now - lastTouchAtRef.current < ACTIVITY_WRITE_THROTTLE_MS) return;
      lastTouchAtRef.current = now;
      setSession((current) => {
        if (!current || isExpired(current, now)) return current;
        const touched = touchExpiry(current, timeout, now);
        store.set(touched);
        return touched;
      });
    };
    for (const type of ACTIVITY_EVENTS) window.addEventListener(type, onActivity);
    return () => {
      for (const type of ACTIVITY_EVENTS) window.removeEventListener(type, onActivity);
    };
  }, [activityTracking, timeout, store]);

  // A ref, not the `submitting` state, guards re-entrancy: two synchronous
  // back-to-back calls to the same submit closure (e.g. a double-click before
  // React re-renders) would otherwise both read the same stale `submitting`
  // value and both proceed.
  const submittingRef = useRef(false);

  const submit = useCallback(
    async (code: string) => {
      if (code.length === 0) return; // no network/hash call for an empty submit
      if (submittingRef.current) return; // a submit already in flight — ignore re-entrant calls rather than racing two verifications
      submittingRef.current = true;
      setSubmitting(true);
      setError(null);

      let result: VerifyResult;
      try {
        result = await verifyFn(code);
      } catch {
        // A throwing VerifyFn is treated as a network failure.
        result = { ok: false, reason: "network" };
      }

      submittingRef.current = false;
      setSubmitting(false);
      if (result.ok) {
        const next = createSession(result, timeout);
        store.set(next);
        setSession(next);
      } else {
        // "unknown"/omitted collapses into "invalid".
        setError({ reason: result.reason === "network" ? "network" : "invalid" });
      }
    },
    [verifyFn, store, timeout]
  );

  const logout = useCallback(() => {
    store.clear();
    setSession(null);
  }, [store]);

  const state: AccessGateState = submitting ? "submitting" : session ? "unlocked" : "idle";

  return {
    state,
    error: state === "idle" ? error : null, // error is an annotation on idle, not its own state
    session,
    submit,
    logout,
  };
}
