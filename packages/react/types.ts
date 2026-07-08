import type { VerifyFn } from "../core/verify.ts";
import type { StorageMode } from "../core/storage.ts";
import type { AccessGateSession } from "../core/session.ts";

/** Unset-prop defaults pinned by ADR-0011 — see that ADR before changing any of these. */
export const DEFAULT_TIMEOUT_MS = 1_800_000; // 30 minutes
export const ACTIVITY_WRITE_THROTTLE_MS = 1_000;
export const EXPIRY_POLL_INTERVAL_MS = 1_000;

/**
 * Configuration shared by `<AccessGate>` and `useAccessGate` — ADR-0011.
 * The vanilla JS surface (M3) exposes the same names, adjusted only for
 * binding syntax, so the two surfaces stay behaviorally comparable.
 */
export interface AccessGateConfig {
  expectedHash?: string;
  verify?: VerifyFn;
  /** @default "localStorage" */
  storage?: StorageMode;
  /** @default "access-gate:session" (src/core/storage.ts DEFAULT_STORAGE_KEY) */
  storageKey?: string;
  /** Session lifetime in ms. @default 1_800_000 (30 minutes) */
  timeout?: number;
  /** Sliding-timeout model: interaction rewrites expiry instead of a fixed TTL. @default false */
  activityTracking?: boolean;
}

/**
 * `"unknown"`/omitted `VerifyResult` reasons collapse into `"invalid"` here —
 * per ADR-0009, the UI never distinguishes them from a plain wrong-code case.
 */
export type AccessGateErrorReason = "invalid" | "network";

export interface AccessGateError {
  reason: AccessGateErrorReason;
}

/** The four-state machine from docs/ux/flows.md § Unlock Flow — `error` is an annotation on `idle`, not a fifth state. */
export type AccessGateState = "idle" | "submitting" | "unlocked";

export interface UseAccessGateResult {
  state: AccessGateState;
  error: AccessGateError | null;
  session: AccessGateSession | null;
  /** No-ops (returns without calling the verify strategy) for an empty code — docs/ux/flows.md § Error States. */
  submit: (code: string) => Promise<void>;
  logout: () => void;
}

/**
 * Every user-facing string, overridable per docs/ux/flows.md § Accessibility
 * Requirements' localization rule. `<AccessGate labels={...}>` merges these
 * over `DEFAULT_LABELS`; `useAccessGate` is headless and never touches this
 * type, since it renders no strings itself.
 */
export interface AccessGateLabels {
  heading?: string;
  inputLabel?: string;
  placeholder?: string;
  submitLabel?: string;
  submittingLabel?: string;
  invalidErrorMessage?: string;
  networkErrorMessage?: string;
  showCodeLabel?: string;
  hideCodeLabel?: string;
}

export const DEFAULT_LABELS: Required<AccessGateLabels> = {
  heading: "This page is protected",
  inputLabel: "Access code",
  placeholder: "Enter access code",
  submitLabel: "Unlock",
  submittingLabel: "Checking...",
  invalidErrorMessage: "That code didn't work. Try again.",
  networkErrorMessage: "Couldn't reach the server. Try again.",
  showCodeLabel: "Show code",
  hideCodeLabel: "Hide code",
};
