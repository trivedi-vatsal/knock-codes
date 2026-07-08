/**
 * Session record schema and lifecycle — ADR-0008.
 *
 * This is the one and only shape any Access Gate surface (React hook,
 * vanilla snippet) writes. No other fields are ever added without revisiting
 * that ADR — in particular the raw PIN or hash is never part of this record
 * (ADR-0005).
 */
export type AccessGateSession = {
  /** epoch ms, set once at successful verification */
  unlockedAt: number;
  /** epoch ms; fixed at creation, or rewritten on each interaction under the sliding model */
  expiresAt: number;
  /** present only if the VerifyFn resolved one (server mode); absent in local-hash mode */
  token?: string;
};

/**
 * Creates a new session from a successful verification result. `timeoutMs`
 * sets the initial expiry; `now` is injectable for deterministic tests.
 *
 * `token` is included only when the verify result actually provided one —
 * a genuinely missing field, not a `token: undefined` key (ADR-0008).
 */
export function createSession(
  result: { token?: string },
  timeoutMs: number,
  now: number = Date.now()
): AccessGateSession {
  return {
    unlockedAt: now,
    expiresAt: now + timeoutMs,
    ...(result.token !== undefined ? { token: result.token } : {}),
  };
}

export function isExpired(session: AccessGateSession, now: number = Date.now()): boolean {
  return now >= session.expiresAt;
}

/**
 * Sliding-timeout model (opt-in activity tracking): rewrites `expiresAt`
 * relative to `now`, leaving `unlockedAt` and `token` untouched. Returns a
 * new object rather than mutating the input.
 */
export function touchExpiry(
  session: AccessGateSession,
  timeoutMs: number,
  now: number = Date.now()
): AccessGateSession {
  return { ...session, expiresAt: now + timeoutMs };
}
