"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useKnockCodes } from "./useKnockCodes.ts";
import { DEFAULT_LABELS, type KnockCodesConfig, type KnockCodesLabels } from "./types.ts";
import { cx } from "./cx.ts";

export interface MinimalAccessTemplateLabels extends KnockCodesLabels {
  description?: string;
  supportLabel?: string;
  footerText?: ReactNode;
}

export interface MinimalAccessTemplateProps extends KnockCodesConfig {
  children: ReactNode;
  /** Rendered above the heading — your own logo/wordmark. Omitted entirely if not passed. */
  logo?: ReactNode;
  labels?: MinimalAccessTemplateLabels;
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

const TEMPLATE_LABELS: Required<MinimalAccessTemplateLabels> = {
  ...DEFAULT_LABELS,
  heading: "Enter access code",
  description: "This page is private.",
  supportLabel: "Contact support",
  footerText: "",
};

/**
 * The leanest possible restricted-access screen — a single masked field, a
 * small plain card, no segmented boxes and no default footer copy. Same
 * `useKnockCodes` contract as every other block, just the smallest possible
 * presentation. For segmented code entry, use `<KnockCodesTemplate>` instead.
 */
export function MinimalAccessTemplate({
  children,
  logo,
  labels,
  supportHref,
  onContactSupport,
  fullPage = true,
  theme,
  className,
  ...config
}: MinimalAccessTemplateProps) {
  const merged = { ...TEMPLATE_LABELS, ...labels };
  const { state, error, submit } = useKnockCodes(config);
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
    <div
      className={cx(
        "flex w-full items-center justify-center bg-gray-50 p-6 dark:bg-[#0b1220]",
        fullPage ? "min-h-[100dvh]" : "h-full",
        className
      )}
    >
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-7 dark:border-gray-800 dark:bg-gray-950">
        {logo && <div className="mb-5">{logo}</div>}

        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{merged.heading}</h1>
        {merged.description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{merged.description}</p>}

        <div className="mt-5">
          <label htmlFor="minimal-access-code" className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
            {merged.inputLabel}
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              id="minimal-access-code"
              type={revealed ? "text" : "password"}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder={merged.placeholder}
              autoComplete="off"
              autoFocus
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
          className="mt-3 w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          {state === "submitting" ? merged.submittingLabel : merged.submitLabel}
        </button>

        {(supportHref || onContactSupport) && (
          <div className="mt-3 text-center">
            {onContactSupport ? (
              <button type="button" onClick={onContactSupport} className="text-xs font-medium text-gray-500 hover:underline dark:text-gray-400">
                {merged.supportLabel}
              </button>
            ) : (
              <a href={supportHref} className="text-xs font-medium text-gray-500 hover:underline dark:text-gray-400">
                {merged.supportLabel}
              </a>
            )}
          </div>
        )}

        {merged.footerText && <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">{merged.footerText}</p>}
      </div>
    </div>
  );

  return theme === "dark" ? <div className="dark h-full w-full">{content}</div> : content;
}
