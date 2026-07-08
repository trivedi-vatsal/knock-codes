"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ClipboardEvent, type ReactNode } from "react";
import { useAccessGate } from "./useAccessGate.ts";
import { DEFAULT_LABELS, type AccessGateConfig, type AccessGateLabels } from "./types.ts";
import { cx } from "./cx.ts";

export interface AccessGateTemplateLabels extends AccessGateLabels {
  description?: string;
  accessCodeLabel?: string;
  supportLabel?: string;
  footerText?: ReactNode;
}

export interface AccessGateTemplateProps extends AccessGateConfig {
  children: ReactNode;
  /** Rendered above the heading — your own logo/wordmark. Omitted entirely if not passed. */
  logo?: ReactNode;
  labels?: AccessGateTemplateLabels;
  /** Total code length, split into groups of `groupSize` with a dash between. @default 8 */
  codeLength?: number;
  /** @default 4 */
  groupSize?: number;
  /** Renders "Contact Support" as a link. Ignored if `onContactSupport` is also set. */
  supportHref?: string;
  /** Renders "Contact Support" as a button instead of a link. */
  onContactSupport?: () => void;
  /** Set false to embed this somewhere other than a real page root (a demo, a docs preview) — drops the full-viewport (100dvh) sizing. @default true */
  fullPage?: boolean;
  /**
   * Forces light or dark presentation on its own, independent of any
   * ancestor ".dark" class — this is a single, standalone file, and
   * shouldn't need the host app to already have dark-mode wiring (e.g.
   * next-themes) in place just to show its dark variant. Omit to follow
   * the nearest ".dark" ancestor if one happens to exist.
   */
  theme?: "light" | "dark";
  className?: string;
}

const TEMPLATE_LABELS: Required<AccessGateTemplateLabels> = {
  ...DEFAULT_LABELS,
  heading: "Restricted Access",
  submitLabel: "Unlock Access",
  description: "This feature is currently protected. Enter your access code to continue.",
  accessCodeLabel: "Access code",
  supportLabel: "Contact Support",
  footerText: "Don't have an access code? Contact your administrator or support team for assistance.",
};

/**
 * A complete, single-drop-in "restricted access" screen — full-page dark
 * backdrop, centered card, segmented code entry, support link, and footer
 * help text, all in one file. Built on the same `useAccessGate`
 * session/verification contract as every other block, just with a
 * different presentation (segmented boxes instead of a masked text field —
 * for that, use `<AccessGate>` + `<PinInput>` instead).
 */
export function AccessGateTemplate({
  children,
  logo,
  labels,
  codeLength = 8,
  groupSize = 4,
  supportHref,
  onContactSupport,
  fullPage = true,
  theme,
  className,
  ...config
}: AccessGateTemplateProps) {
  const merged = { ...TEMPLATE_LABELS, ...labels };
  const { state, error, submit } = useAccessGate(config);
  const [digits, setDigits] = useState<string[]>(() => Array(codeLength).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (state === "idle" && error) inputRefs.current[0]?.focus();
  }, [error, state]);

  if (state === "unlocked") return <>{children}</>;

  const code = digits.join("");
  const filled = code.length === codeLength && digits.every((d) => d !== "");

  const setDigit = (index: number, value: string) => {
    setDigits((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!filled || state === "submitting") return;
    await submit(code);
    setDigits(Array(codeLength).fill(""));
    inputRefs.current[0]?.focus();
  };

  const handleChange = (index: number, value: string) => {
    const char = value.slice(-1);
    setDigit(index, char);
    if (char && index < codeLength - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setDigit(index - 1, "");
    } else if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (event.key === "Enter") {
      void handleSubmit();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text").trim().slice(0, codeLength);
    if (!pasted) return;
    event.preventDefault();
    const next = Array(codeLength).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, codeLength - 1)]?.focus();
  };

  const errorMessage = error ? (error.reason === "network" ? merged.networkErrorMessage : merged.invalidErrorMessage) : null;

  // Tailwind's `dark:` utilities only activate for descendants of a ".dark"
  // ancestor — never for the element carrying that class itself — so
  // forcing a theme needs this extra wrapper, not just a class on the root
  // below. Omitting `theme` renders exactly as before (whatever ambient
  // ".dark" ancestor happens to exist, or none).
  const content = (
    <div
      className={cx(
        "flex w-full items-center justify-center bg-gray-100 p-6 dark:bg-[#0b1220]",
        // Real page-root usage wants the full viewport; embedded usage
        // (a demo, a docs preview) wants to fill whatever height its own
        // container was given instead — the container providing a real,
        // definite height is that container's job, not this component's.
        fullPage ? "min-h-[100dvh]" : "h-full",
        className
      )}
    >
      <div className="w-full max-w-[27rem] rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-950">
        {logo && <div className="mb-6">{logo}</div>}

        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{merged.heading}</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{merged.description}</p>

        <div className="mt-6">
          <span className="mb-2 block text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
            {merged.accessCodeLabel}
          </span>
          <div role="group" aria-label={merged.accessCodeLabel} className="flex items-center gap-1.5">
            {Array.from({ length: codeLength }, (_, index) => (
              <div key={index} className="flex items-center gap-1.5">
                {index > 0 && index % groupSize === 0 && <span className="text-gray-300">–</span>}
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  value={digits[index]}
                  onChange={(event) => handleChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onPaste={handlePaste}
                  disabled={state === "submitting"}
                  maxLength={1}
                  autoComplete="off"
                  aria-label={`${merged.accessCodeLabel} character ${index + 1} of ${codeLength}`}
                  aria-invalid={error ? true : undefined}
                  className="h-11 w-10 rounded-lg border border-gray-300 text-center text-sm font-medium text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50"
                />
              </div>
            ))}
          </div>
          <div role="status" aria-live="polite" className="mt-2 min-h-[1.1rem] text-xs text-red-600 dark:text-red-400">
            {state === "submitting" ? merged.submittingLabel : (errorMessage ?? "")}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!filled || state === "submitting"}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state === "submitting" ? merged.submittingLabel : merged.submitLabel} →
        </button>

        {(supportHref || onContactSupport) && (
          <div className="mt-3 text-center">
            {onContactSupport ? (
              <button
                type="button"
                onClick={onContactSupport}
                className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
              >
                {merged.supportLabel}
              </button>
            ) : (
              <a href={supportHref} className="text-sm font-medium text-red-600 hover:underline dark:text-red-400">
                {merged.supportLabel}
              </a>
            )}
          </div>
        )}

        <hr className="my-5 border-gray-200 dark:border-gray-800" />

        <p className="text-center text-xs text-gray-400 dark:text-gray-500">{merged.footerText}</p>
      </div>
    </div>
  );

  // A plain sized wrapper, not `display: contents` — `contents` has
  // cross-browser quirks around passing percentage sizing through to
  // children, which broke the fill-the-canvas behavior above.
  return theme === "dark" ? <div className="dark h-full w-full">{content}</div> : content;
}
