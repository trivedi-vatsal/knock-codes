"use client";

import { useId, type ReactNode } from "react";
import { PinInput } from "./PinInput.tsx";
import { DEFAULT_LABELS, type KnockCodesError, type KnockCodesLabels } from "./types.ts";

export interface UnlockDialogProps {
  open: boolean;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  error: KnockCodesError | null;
  labels?: KnockCodesLabels;
  /** Extra content under the form, e.g. help text or a support link. */
  footer?: ReactNode;
}

/**
 * The modal shell `<ProtectedModal>` renders — also usable standalone when
 * you want to trigger an unlock prompt from your own button or menu item
 * instead of gating content directly. Deliberately not dismissable (no
 * backdrop click, no Escape-to-close): the point of a gate is that closing
 * the dialog can't be how you get past it.
 */
export function UnlockDialog({ open, value, onChange, onSubmit, submitting, error, labels, footer }: UnlockDialogProps) {
  const merged = { ...DEFAULT_LABELS, ...labels };
  const headingId = useId();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="w-full max-w-sm space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-lg outline-none dark:border-gray-800 dark:bg-gray-950"
      >
        <h2 id={headingId} className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          {merged.heading}
        </h2>
        <PinInput
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
          submitting={submitting}
          error={error}
          labels={labels}
          autoFocus
        />
        {footer}
      </div>
    </div>
  );
}
