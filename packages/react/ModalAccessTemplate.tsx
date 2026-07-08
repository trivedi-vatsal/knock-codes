"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useAccessGate } from "./useAccessGate.ts";
import { DEFAULT_LABELS, type AccessGateConfig, type AccessGateLabels } from "./types.ts";
import { cx } from "./cx.ts";

export interface ModalAccessTemplateLabels extends AccessGateLabels {
  description?: string;
  supportLabel?: string;
}

export interface ModalAccessTemplateProps extends AccessGateConfig {
  /**
   * The section being gated. Unlike the other templates, this stays mounted
   * (blurred and inert) behind the dialog while locked, instead of being
   * swapped out entirely — for gating one section of an already-visible
   * page rather than taking over the whole screen.
   */
  children: ReactNode;
  /** Rendered above the heading — your own logo/wordmark. Omitted entirely if not passed. */
  logo?: ReactNode;
  labels?: ModalAccessTemplateLabels;
  /** Renders "Contact support" as a link. Ignored if `onContactSupport` is also set. */
  supportHref?: string;
  /** Renders "Contact support" as a button instead of a link. */
  onContactSupport?: () => void;
  /** Set true if this is the entire page, so the wrapper takes the full viewport height. @default false */
  fullPage?: boolean;
  /** Forces light or dark presentation, independent of any ancestor ".dark" class. Omit to follow one if it exists. */
  theme?: "light" | "dark";
  className?: string;
}

const TEMPLATE_LABELS: Required<ModalAccessTemplateLabels> = {
  ...DEFAULT_LABELS,
  heading: "This section is restricted",
  description: "Enter your access code to view it.",
  supportLabel: "Contact support",
};

/**
 * Gates one section of an already-visible page: the content stays mounted
 * and blurred behind a centered dialog instead of disappearing entirely.
 * For a full-page takeover instead, use `<AccessGateTemplate>` or
 * `<MinimalAccessTemplate>`. Same `useAccessGate` contract as every other
 * block.
 */
export function ModalAccessTemplate({
  children,
  logo,
  labels,
  supportHref,
  onContactSupport,
  fullPage = false,
  theme,
  className,
  ...config
}: ModalAccessTemplateProps) {
  const merged = { ...TEMPLATE_LABELS, ...labels };
  const { state, error, submit } = useAccessGate(config);
  const [code, setCode] = useState("");
  const [revealed, setRevealed] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const locked = state !== "unlocked";

  useEffect(() => {
    if (locked) inputRef.current?.focus();
  }, [locked, error]);

  const handleSubmit = async () => {
    if (!code || state === "submitting") return;
    await submit(code);
    setCode("");
  };

  const errorMessage = error ? (error.reason === "network" ? merged.networkErrorMessage : merged.invalidErrorMessage) : null;

  const content = (
    <div className={cx("relative w-full", fullPage ? "min-h-[100dvh]" : "h-full", className)}>
      <div aria-hidden={locked} inert={locked || undefined} className={cx(locked && "pointer-events-none blur-sm select-none")}>
        {children}
      </div>

      {locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[1px]">
          <div role="dialog" aria-modal="true" aria-label={merged.heading} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-950">
            {logo && <div className="mb-4">{logo}</div>}

            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{merged.heading}</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{merged.description}</p>

            <div className="mt-4">
              <label htmlFor="modal-access-code" className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                {merged.inputLabel}
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  id="modal-access-code"
                  type={revealed ? "text" : "password"}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder={merged.placeholder}
                  autoComplete="off"
                  disabled={state === "submitting"}
                  aria-invalid={error ? true : undefined}
                  className="h-10 w-full rounded-lg border border-gray-300 px-3 pr-16 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setRevealed((r) => !r)}
                  aria-label={revealed ? merged.hideCodeLabel : merged.showCodeLabel}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {revealed ? merged.hideCodeLabel : merged.showCodeLabel}
                </button>
              </div>
              <div role="status" aria-live="polite" className="mt-2 min-h-[1.1rem] text-xs text-red-600 dark:text-red-400">
                {state === "submitting" ? merged.submittingLabel : (errorMessage ?? "")}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!code || state === "submitting"}
              className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {state === "submitting" ? merged.submittingLabel : merged.submitLabel}
            </button>

            {(supportHref || onContactSupport) && (
              <div className="mt-3 text-center">
                {onContactSupport ? (
                  <button type="button" onClick={onContactSupport} className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400">
                    {merged.supportLabel}
                  </button>
                ) : (
                  <a href={supportHref} className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400">
                    {merged.supportLabel}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return theme === "dark" ? <div className="dark h-full w-full">{content}</div> : content;
}
