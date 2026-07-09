"use client";

import { useId, useState, type FormEvent } from "react";
import { DEFAULT_LABELS, type KnockCodesError, type KnockCodesLabels } from "./types.ts";
import { cx } from "./cx.ts";

/**
 * Presentational PIN/OTP input — no verification logic of its own. It's a
 * single masked text field (native paste support comes for free), not a
 * segmented per-character box grid — the product encourages arbitrary-length
 * passphrases, which a fixed-length box UI can't host.
 */
export interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  error: KnockCodesError | null;
  labels?: KnockCodesLabels;
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
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <div>
        <label htmlFor={inputId} className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
          {merged.inputLabel}
        </label>
        <div className="relative">
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
              "h-10 w-full rounded-[var(--ag-radius,0.5rem)] border px-3 pr-16 text-sm text-gray-900 focus:outline-none focus:ring-2 disabled:opacity-60 dark:bg-[var(--ag-card-dark,#111827)] dark:text-gray-50",
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/25 dark:border-red-400"
                : "border-[var(--ag-border,#d1d5db)] focus:border-[var(--ag-primary,#3b82f6)] focus:ring-[var(--ag-primary,#3b82f6)]/30 dark:border-[var(--ag-border-dark,#374151)]"
            )}
          />
          <button
            type="button"
            onClick={() => setRevealed((current) => !current)}
            aria-label={revealed ? merged.hideCodeLabel : merged.showCodeLabel}
            title={revealed ? merged.hideCodeLabel : merged.showCodeLabel}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {revealed ? merged.hideCodeLabel : merged.showCodeLabel}
          </button>
        </div>
        <div
          role="status"
          aria-live="polite"
          id={statusId}
          className={cx(
            "mt-2 min-h-[1.1rem] text-xs",
            errorMessage ? "font-medium text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
          )}
        >
          {submitting ? merged.submittingLabel : (errorMessage ?? helperText ?? "")}
        </div>
      </div>
      <button
        type="submit"
        disabled={submitting || value.length === 0}
        className="mt-3 w-full rounded-[var(--ag-radius,0.5rem)] bg-[var(--ag-primary,#111827)] px-4 py-2.5 text-sm font-semibold text-[var(--ag-primary-fg,#ffffff)] transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[var(--ag-primary-dark,#f9fafb)] dark:text-[var(--ag-primary-fg-dark,#111827)]"
      >
        {submitting ? merged.submittingLabel : merged.submitLabel}
      </button>
    </form>
  );
}
