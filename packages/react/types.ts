import type { VerifyFn } from "../core/verify.ts";
import type { StorageMode } from "../core/storage.ts";
import type { KnockCodesSession } from "../core/session.ts";

/** Unset-prop defaults — change deliberately, they're part of the public contract. */
export const DEFAULT_TIMEOUT_MS = 1_800_000; // 30 minutes
export const ACTIVITY_WRITE_THROTTLE_MS = 1_000;
export const EXPIRY_POLL_INTERVAL_MS = 1_000;

/** Configuration shared by `<KnockCodes>` and `useKnockCodes`. */
export interface KnockCodesConfig {
  expectedHash?: string;
  verify?: VerifyFn;
  /** @default "localStorage" */
  storage?: StorageMode;
  /** @default "knock-codes:session" (src/core/storage.ts DEFAULT_STORAGE_KEY) */
  storageKey?: string;
  /** Session lifetime in ms. @default 1_800_000 (30 minutes) */
  timeout?: number;
  /** Sliding-timeout model: interaction rewrites expiry instead of a fixed TTL. @default false */
  activityTracking?: boolean;
}

/**
 * `"unknown"`/omitted `VerifyResult` reasons collapse into `"invalid"` here —
 * the UI never distinguishes them from a plain wrong-code case.
 */
export type KnockCodesErrorReason = "invalid" | "network";

export interface KnockCodesError {
  reason: KnockCodesErrorReason;
}

/** The unlock flow's state machine — `error` is an annotation on `idle`, not a fifth state. */
export type KnockCodesState = "idle" | "submitting" | "unlocked";

export interface UseKnockCodesResult {
  state: KnockCodesState;
  error: KnockCodesError | null;
  session: KnockCodesSession | null;
  /** No-ops (returns without calling the verify strategy) for an empty code. */
  submit: (code: string) => Promise<void>;
  logout: () => void;
}

/**
 * Every user-facing string, overridable for localization.
 * `<KnockCodes labels={...}>` merges these over `DEFAULT_LABELS`;
 * `useKnockCodes` is headless and never touches this type, since it
 * renders no strings itself.
 */
export interface KnockCodesLabels {
  heading?: string;
  subcopy?: string;
  inputLabel?: string;
  placeholder?: string;
  submitLabel?: string;
  submittingLabel?: string;
  invalidErrorMessage?: string;
  networkErrorMessage?: string;
  showCodeLabel?: string;
  hideCodeLabel?: string;
}

export const DEFAULT_LABELS: Required<KnockCodesLabels> = {
  heading: "This page is protected",
  subcopy: "Enter the access code to continue.",
  inputLabel: "Access code",
  placeholder: "Enter access code",
  submitLabel: "Unlock",
  submittingLabel: "Checking...",
  invalidErrorMessage: "That code didn't work. Try again.",
  networkErrorMessage: "Couldn't reach the server. Try again.",
  showCodeLabel: "Show code",
  hideCodeLabel: "Hide code",
};
