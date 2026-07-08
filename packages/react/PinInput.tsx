"use client";

import { useId, useState, type FormEvent } from "react";
import { DEFAULT_LABELS, type AccessGateError, type AccessGateLabels } from "./types.ts";

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
}

export function PinInput({ value, onChange, onSubmit, submitting, error, labels, autoFocus }: PinInputProps) {
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
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {merged.inputLabel}
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          type={revealed ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={merged.placeholder}
          disabled={submitting}
          autoFocus={autoFocus}
          autoComplete="off"
          aria-describedby={statusId}
          aria-invalid={error ? true : undefined}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 dark:focus:ring-gray-800"
        />
        <button
          type="button"
          onClick={() => setRevealed((current) => !current)}
          aria-label={revealed ? merged.hideCodeLabel : merged.showCodeLabel}
          className="shrink-0 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-900"
        >
          {revealed ? merged.hideCodeLabel : merged.showCodeLabel}
        </button>
      </div>
      <button
        type="submit"
        disabled={submitting || value.length === 0}
        className="w-full rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
      >
        {submitting ? merged.submittingLabel : merged.submitLabel}
      </button>
      {/* Announces loading and error states — docs/ux/flows.md § Accessibility Requirements */}
      <div role="status" aria-live="polite" id={statusId} className="min-h-[1.25rem] text-sm text-red-600 dark:text-red-400">
        {submitting ? merged.submittingLabel : (errorMessage ?? "")}
      </div>
    </form>
  );
}
