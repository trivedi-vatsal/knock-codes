"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useAccessGate } from "./useAccessGate.ts";
import { DEFAULT_LABELS, type AccessGateConfig, type AccessGateLabels } from "./types.ts";
import { cx } from "./cx.ts";

export interface BrandedAccessTemplateLabels extends AccessGateLabels {
  description?: string;
  supportLabel?: string;
  footerText?: ReactNode;
}

export interface BrandedAccessTemplateProps extends AccessGateConfig {
  children: ReactNode;
  /** Rendered on the brand panel, above the tagline — your own logo/wordmark. */
  logo?: ReactNode;
  /** Short line under the logo on the brand panel. */
  tagline?: ReactNode;
  labels?: BrandedAccessTemplateLabels;
  /** Renders "Contact support" as a link. Ignored if `onContactSupport` is also set. */
  supportHref?: string;
  /** Renders "Contact support" as a button instead of a link. */
  onContactSupport?: () => void;
  /** Set false to embed this somewhere other than a real page root. @default true */
  fullPage?: boolean;
  /** Forces light or dark presentation, independent of any ancestor ".dark" class. Omit to follow one if it exists. */
  theme?: "light" | "dark";
  className?: string;
}

const TEMPLATE_LABELS: Required<BrandedAccessTemplateLabels> = {
  ...DEFAULT_LABELS,
  heading: "Welcome back",
  description: "Enter your access code to continue to your workspace.",
  submitLabel: "Continue",
  supportLabel: "Contact support",
  footerText: "Don't have a code? Contact your administrator or support team for assistance.",
};

/**
 * A split-screen, logo-forward restricted-access screen — brand panel on
 * one side, code entry on the other. The brand panel collapses on small
 * screens so the form stays the only thing visible on mobile. Same
 * `useAccessGate` contract as every other block.
 */
export function BrandedAccessTemplate({
  children,
  logo,
  tagline,
  labels,
  supportHref,
  onContactSupport,
  fullPage = true,
  theme,
  className,
  ...config
}: BrandedAccessTemplateProps) {
  const merged = { ...TEMPLATE_LABELS, ...labels };
  const { state, error, submit } = useAccessGate(config);
  const [code, setCode] = useState("");
  const [revealed, setRevealed] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (state === "idle" && error) inputRef.current?.focus();
  }, [error, state]);

  if (state === "unlocked") return <>{children}</>;

  const handleSubmit = async () => {
    if (!code || state === "submitting") return;
    await submit(code);
    setCode("");
  };

  const errorMessage = error ? (error.reason === "network" ? merged.networkErrorMessage : merged.invalidErrorMessage) : null;

  const content = (
    <div className={cx("grid w-full lg:grid-cols-2", fullPage ? "min-h-[100dvh]" : "h-full", className)}>
      <div className="hidden flex-col justify-center bg-gradient-to-br from-blue-600 to-indigo-800 p-12 text-white lg:flex">
        {logo && <div className="mb-6">{logo}</div>}
        {tagline && <p className="max-w-sm text-lg text-white/80">{tagline}</p>}
      </div>

      <div className="flex items-center justify-center bg-white p-6 dark:bg-gray-950 lg:p-12">
        <div className="w-full max-w-sm">
          {logo && <div className="mb-6 lg:hidden">{logo}</div>}

          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{merged.heading}</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{merged.description}</p>

          <div className="mt-6">
            <label htmlFor="branded-access-code" className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
              {merged.inputLabel}
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                id="branded-access-code"
                type={revealed ? "text" : "password"}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder={merged.placeholder}
                autoComplete="off"
                autoFocus
                disabled={state === "submitting"}
                aria-invalid={error ? true : undefined}
                className="h-11 w-full rounded-lg border border-gray-300 px-3 pr-16 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50"
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
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {state === "submitting" ? merged.submittingLabel : merged.submitLabel}
          </button>

          {(supportHref || onContactSupport) && (
            <div className="mt-3 text-center">
              {onContactSupport ? (
                <button type="button" onClick={onContactSupport} className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                  {merged.supportLabel}
                </button>
              ) : (
                <a href={supportHref} className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                  {merged.supportLabel}
                </a>
              )}
            </div>
          )}

          <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">{merged.footerText}</p>
        </div>
      </div>
    </div>
  );

  return theme === "dark" ? <div className="dark h-full w-full">{content}</div> : content;
}
