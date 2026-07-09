"use client";

import { useKnockCodesContext } from "./KnockCodesProvider.tsx";
import type { StorageMode } from "../core/storage.ts";
import { DEFAULT_TIMEOUT_MS } from "./types.ts";
import { cx } from "./cx.ts";

export interface AccessReceiptProps {
  /** Storage backend the active session used. @default "localStorage" */
  storageMode?: StorageMode;
  /** Session lifetime in ms, for the "Timeout" line. @default 1_800_000 (30 minutes) */
  timeout?: number;
  /** Whether this session came from the default local hash check or a custom `verify` function. @default "local-hash" */
  verificationStrategy?: "local-hash" | "server-verify";
  className?: string;
}

function formatDuration(ms: number): string {
  const minutes = Math.round(ms / 60_000);
  if (minutes < 1) return `${Math.round(ms / 1000)}s`;
  if (minutes < 60) return `${minutes}m`;
  return `${Math.round(minutes / 60)}h`;
}

function formatTimestamp(epochMs: number): string {
  return new Date(epochMs).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "medium" });
}

/**
 * A small "receipt" shown after unlock — a session audit strip, not a
 * verification surface of its own. Requires an `<KnockCodesProvider>`
 * ancestor and renders nothing while locked, since there's no session yet
 * to report on.
 */
export function AccessReceipt({
  storageMode = "localStorage",
  timeout = DEFAULT_TIMEOUT_MS,
  verificationStrategy = "local-hash",
  className,
}: AccessReceiptProps) {
  const { session } = useKnockCodesContext();
  if (!session) return null;

  const rows = [
    { label: "Unlocked at", value: formatTimestamp(session.unlockedAt) },
    { label: "Storage", value: storageMode },
    { label: "Timeout", value: formatDuration(timeout) },
    { label: "Verification", value: verificationStrategy === "server-verify" ? "Server verify" : "Local hash" },
  ];

  return (
    <div
      style={{ fontFamily: "var(--ag-font, inherit)" }}
      className={cx(
        "w-full max-w-sm rounded-[var(--ag-radius,0.5rem)] border border-[var(--ag-border,#e5e7eb)] bg-[var(--ag-card,#ffffff)] shadow-sm dark:border-[var(--ag-border-dark,#1f2937)] dark:bg-[var(--ag-card-dark,#030712)]",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-dashed border-[var(--ag-border,#e5e7eb)] px-4 py-2 dark:border-[var(--ag-border-dark,#1f2937)]">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
          <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600 dark:bg-emerald-400" />
          Session active
        </span>
        <span className="font-mono text-[10px] text-gray-400 dark:text-gray-500">
          #{session.unlockedAt.toString(36).toUpperCase()}
        </span>
      </div>
      <dl className="divide-y divide-dashed divide-gray-200 px-4 dark:divide-gray-800">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-2 text-sm">
            <dt className="text-gray-500 dark:text-gray-400">{row.label}</dt>
            <dd className="font-mono text-gray-900 dark:text-gray-100">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
