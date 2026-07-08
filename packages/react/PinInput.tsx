"use client";

import { useId, useState, type FormEvent } from "react";
import { DEFAULT_LABELS, type AccessGateError, type AccessGateLabels } from "./types.ts";
import { cx } from "./cx.ts";

/**
 * Presentational PIN/OTP input — docs/architecture/overview.md § Component
 * Architecture ("no verification logic of its own"). Per ADR-0011 this is a
 * single masked text field (native paste support comes for free), not a
 * segmented per-character box grid — the product encourages arbitrary-length
 * passphrases, which a fixed-length box UI can't host.
 */
export interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  error: AccessGateError | null;
  labels?: AccessGateLabels;
  autoFocus?: boolean;
  /** Shown under the field while there's no error yet. */
  helperText?: string;
  /** @default "access-code" */
  name?: string;
  /** @default "off" */
  autoComplete?: string;
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-4 w-4" aria-hidden="true">
      <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7-10.5-7-10.5-7Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-4 w-4" aria-hidden="true">
      <path
        d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M6.7 6.7C4.5 8.1 3 10.2 1.5 12c0 0 3.5 7 10.5 7 2.1 0 3.87-.62 5.31-1.53M9.9 4.24A11.6 11.6 0 0 1 12 4c7 0 10.5 8 10.5 8a17.9 17.9 0 0 1-2.16 3.19"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PinInput({
  value,
  onChange,
  onSubmit,
  submitting,
  error,
  labels,
  autoFocus,
  helperText,
  name = "access-code",
  autoComplete = "off",
}: PinInputProps) {
  const merged = { ...DEFAULT_LABELS, ...labels };
  const [revealed, setRevealed] = useState(false);
  const inputId = useId();
  const statusId = useId();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (submitting || value.length === 0) return;
    onSubmit();
  };

  const errorMessage = error
    ? error.reason === "network"
      ? merged.networkErrorMessage
      : merged.invalidErrorMessage
    : null;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-2">
      <label htmlFor={inputId} className="block text-xs font-medium tracking-wide text-[#6b6456] uppercase dark:text-[#9aa39c]">
        {merged.inputLabel}
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          name={name}
          type={revealed ? "text" : "password"}
          inputMode="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={merged.placeholder}
          disabled={submitting}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          aria-describedby={statusId}
          aria-invalid={error ? true : undefined}
          className={cx(
            "w-full rounded-[var(--ag-radius,0.375rem)] border bg-[var(--ag-card,#fbf8f1)] px-3 py-2 font-mono text-sm tracking-wide text-[#191a18] placeholder:font-sans placeholder:text-[#6b6456]/70 focus:outline-none focus:ring-2 disabled:opacity-60",
            "dark:bg-[var(--ag-card-dark,#171d1a)] dark:text-[#edeae0] dark:placeholder:text-[#9aa39c]/70",
            error
              ? "border-[#e5484d] focus:ring-[#e5484d]/25 dark:border-[#ff6169] dark:focus:ring-[#ff6169]/25"
              : "border-[var(--ag-border,#d9d2c2)] focus:border-[var(--ag-primary,#187c74)] focus:ring-[var(--ag-primary,#187c74)]/20 dark:border-[var(--ag-border-dark,#26302b)] dark:focus:border-[var(--ag-primary-dark,#4fd1c5)] dark:focus:ring-[var(--ag-primary-dark,#4fd1c5)]/20"
          )}
        />
        <button
          type="button"
          onClick={() => setRevealed((current) => !current)}
          aria-label={revealed ? merged.hideCodeLabel : merged.showCodeLabel}
          title={revealed ? merged.hideCodeLabel : merged.showCodeLabel}
          className="shrink-0 rounded-[var(--ag-radius,0.375rem)] border border-[var(--ag-border,#d9d2c2)] px-2.5 text-[#6b6456] hover:border-[var(--ag-primary,#187c74)]/40 hover:text-[var(--ag-primary,#187c74)] dark:border-[var(--ag-border-dark,#26302b)] dark:text-[#9aa39c] dark:hover:border-[var(--ag-primary-dark,#4fd1c5)]/40 dark:hover:text-[var(--ag-primary-dark,#4fd1c5)]"
        >
          {revealed ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      <button
        type="submit"
        disabled={submitting || value.length === 0}
        className="w-full rounded-[var(--ag-radius,0.375rem)] bg-[var(--ag-primary,#187c74)] px-3 py-2 text-sm font-medium text-[var(--ag-primary-fg,#f7f3ea)] transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[var(--ag-primary-dark,#4fd1c5)] dark:text-[var(--ag-primary-fg-dark,#0e1311)]"
      >
        {submitting ? merged.submittingLabel : merged.submitLabel}
      </button>
      {/* Announces loading and error states — docs/ux/flows.md § Accessibility Requirements */}
      <div
        role="status"
        aria-live="polite"
        id={statusId}
        className={cx(
          "min-h-[1.25rem] text-xs",
          errorMessage ? "font-medium text-[#e5484d] dark:text-[#ff6169]" : "text-[#6b6456] dark:text-[#9aa39c]"
        )}
      >
        {submitting ? merged.submittingLabel : (errorMessage ?? helperText ?? "")}
      </div>
    </form>
  );
}
