import { sha256Hex } from "./hash.ts";

/**
 * Verification contract.
 *
 * Both the local-hash strategy and any custom server-mode strategy resolve
 * to this same shape. `reason` exists so the UI can distinguish "wrong
 * code" from "couldn't reach the server" without either strategy needing
 * to know about the other.
 */
export type VerifyResult =
  | { ok: true; token?: string }
  | { ok: false; reason?: "invalid" | "network" | "unknown" };

export type VerifyFn = (code: string) => Promise<VerifyResult>;

/**
 * Builds the default local-hash `VerifyFn`. Hashing follows the canonical
 * contract in hash.ts — no normalization beyond that. A local hash
 * comparison cannot fail for network reasons, so this verifier only ever
 * resolves `{ ok: true }` or `{ ok: false, reason: "invalid" }`.
 */
export function createLocalHashVerifier(expectedHash: string): VerifyFn {
  return async (code) => {
    const actualHash = await sha256Hex(code);
    return actualHash === expectedHash ? { ok: true } : { ok: false, reason: "invalid" };
  };
}

export interface VerifyConfig {
  expectedHash?: string;
  verify?: VerifyFn;
}

/**
 * Resolves a `{ expectedHash, verify }` config into the single `VerifyFn`
 * a session lifecycle actually calls. Supplying both or neither is a
 * configuration error — this always throws for either case rather than
 * silently picking a winner. Framework surfaces (e.g. `useAccessGate`)
 * decide *when* to call this — whether that's once at construction or
 * gated behind a dev-only check is a framework-layer choice, not a core
 * one; this function itself has no dev/prod branch.
 */
export function resolveVerifyFn(config: VerifyConfig): VerifyFn {
  const hasHash = config.expectedHash !== undefined;
  const hasVerify = config.verify !== undefined;

  if (hasHash === hasVerify) {
    throw new Error(
      hasHash
        ? "Access Gate: supply either `expectedHash` or `verify`, not both."
        : "Access Gate: supply either `expectedHash` or `verify` — no implicit default verification strategy."
    );
  }

  return hasHash ? createLocalHashVerifier(config.expectedHash as string) : (config.verify as VerifyFn);
}
