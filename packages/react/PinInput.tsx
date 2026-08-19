"use client";

import { useEffect, useId, useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from "react";
import { DEFAULT_LABELS, type KnockCodesError, type KnockCodesLabels } from "./types.ts";
import { cx } from "./cx.ts";

const PIN_INPUT_SHAKE_KEYFRAMES = `@media (prefers-reduced-motion: no-preference) {
  @keyframes pin-input-shake {
    10%, 90% { transform: translateX(-1px); }
    20%, 80% { transform: translateX(2px); }
    30%, 50%, 70% { transform: translateX(-4px); }
    40%, 60% { transform: translateX(4px); }
  }
}`;

/**
 * Presentational access-code field — no verification logic of its own.
 * `variant="field"` (default) is a masked text input for arbitrary-length
 * codes. `variant="boxes"` is a fixed-length segmented grid.
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
  /** @default "field" */
  variant?: "field" | "boxes";
  /** Slot count when `variant="boxes"`. @default 6 */
  length?: number;
  /** Dash between groups when `variant="boxes"`. @default 4 */
  groupSize?: number;
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
  variant = "field",
  length = 6,
  groupSize = 4,
}: PinInputProps) {
  const merged = { ...DEFAULT_LABELS, ...labels };
  const [revealed, setRevealed] = useState(false);
  const [shakeSeed, setShakeSeed] = useState(0);
  const inputId = useId();
  const statusId = useId();
  const boxRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (error) setShakeSeed((seed) => seed + 1);
  }, [error]);

  const errorMessage = error
    ? error.reason === "network"
      ? merged.networkErrorMessage
      : merged.invalidErrorMessage
    : null;

  const boxesComplete = variant === "boxes" && value.length === length;
  const canSubmit = !submitting && (variant === "boxes" ? boxesComplete : value.length > 0);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    onSubmit();
  };

  const digits = Array.from({ length }, (_, index) => value[index] ?? "");

  const emitDigits = (next: string[]) => {
    onChange(next.join(""));
  };

  const handleBoxChange = (index: number, raw: string) => {
    const char = raw.slice(-1);
    const next = [...digits];
    next[index] = char;
    emitDigits(next);
    if (char && index < length - 1) boxRefs.current[index + 1]?.focus();
  };

  const handleBoxKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      boxRefs.current[index - 1]?.focus();
      const next = [...digits];
      next[index - 1] = "";
      emitDigits(next);
    } else if (event.key === "ArrowLeft" && index > 0) {
      boxRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < length - 1) {
      boxRefs.current[index + 1]?.focus();
    }
  };

  const handleBoxPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text").trim().slice(0, length);
    if (!pasted) return;
    event.preventDefault();
    const next = Array.from({ length }, () => "");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i] ?? "";
    emitDigits(next);
    boxRefs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      {variant === "boxes" && <style>{PIN_INPUT_SHAKE_KEYFRAMES}</style>}
      <div>
        {variant === "field" ? (
          <>
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
          </>
        ) : (
          <>
            <span className="mb-2 block text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
              {merged.inputLabel}
            </span>
            <div
              key={shakeSeed}
              role="group"
              aria-label={merged.inputLabel}
              className={cx("flex items-center gap-1 sm:gap-1.5", shakeSeed > 0 && "animate-[pin-input-shake_0.4s_ease-in-out]")}
            >
              {digits.map((digit, index) => (
                <div key={index} className="flex min-w-0 flex-1 items-center gap-1 sm:gap-1.5">
                  {index > 0 && index % groupSize === 0 && <span className="shrink-0 text-gray-300">–</span>}
                  <input
                    ref={(el) => {
                      boxRefs.current[index] = el;
                    }}
                    value={digit}
                    onChange={(event) => handleBoxChange(index, event.target.value)}
                    onKeyDown={(event) => handleBoxKeyDown(index, event)}
                    onPaste={handleBoxPaste}
                    disabled={submitting}
                    autoFocus={autoFocus && index === 0}
                    maxLength={1}
                    autoComplete="one-time-code"
                    inputMode="text"
                    aria-label={`${merged.inputLabel} character ${index + 1} of ${length}`}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={statusId}
                    className="h-11 w-full min-w-0 max-w-10 rounded-[var(--ag-radius,0.5rem)] border border-[var(--ag-border,#d1d5db)] text-center text-sm font-medium text-gray-900 focus:border-[var(--ag-primary,#3b82f6)] focus:ring-2 focus:ring-[var(--ag-primary,#3b82f6)]/30 focus:outline-none disabled:opacity-60 dark:border-[var(--ag-border-dark,#374151)] dark:bg-[var(--ag-card-dark,#111827)] dark:text-gray-50"
                  />
                </div>
              ))}
            </div>
          </>
        )}
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
        disabled={!canSubmit}
        className="mt-3 w-full rounded-[var(--ag-radius,0.5rem)] bg-[var(--ag-primary,#111827)] px-4 py-2.5 text-sm font-semibold text-[var(--ag-primary-fg,#ffffff)] transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[var(--ag-primary-dark,#f9fafb)] dark:text-[var(--ag-primary-fg-dark,#111827)]"
      >
        {submitting ? merged.submittingLabel : merged.submitLabel}
      </button>
    </form>
  );
}
