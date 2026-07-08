"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Code2, Eye, Moon, RotateCcw, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeBrowser, type CodeBrowserFile } from "@/components/code-browser";
import { CopyButton } from "@/components/copy-button";

const ICON_BUTTON_CLASS =
  "inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted hover:text-foreground";

/**
 * Lets a `preview` child read the panel's current dark-toggle state without
 * PreviewPanel needing to accept a render-prop function — `preview` is
 * constructed in a Server Component page, and a Server Component can pass a
 * pre-built Client Component *element* as a prop, but never a function
 * (functions aren't serializable across that boundary). Context avoids the
 * problem entirely: the Provider and the reading component are both client
 * code, so no function ever crosses the server/client line.
 */
const PreviewDarkContext = createContext(false);

export function usePreviewDark(): boolean {
  return useContext(PreviewDarkContext);
}

export function PreviewPanel({
  preview,
  files,
  badge,
  fillCanvas = false,
}: {
  preview: ReactNode;
  files: CodeBrowserFile[];
  /** Short identifier shown top-right, e.g. the registry item name. */
  badge?: string;
  /** For previews that render their own full-bleed backdrop (e.g. a full-page template) — drops the canvas's own padding/background so the preview fills it edge to edge instead of floating inside a visible window. */
  fillCanvas?: boolean;
}) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [dark, setDark] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const allCode = files.map((f) => f.content).join("\n\n");

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-0.5 rounded-full border border-border bg-muted/40 p-1">
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                tab === "preview" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Eye className="h-3.5 w-3.5" /> Preview
            </button>
            <button
              type="button"
              onClick={() => setTab("code")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                tab === "code" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Code2 className="h-3.5 w-3.5" /> Code
            </button>
          </div>
          <button
            type="button"
            onClick={() => setPreviewKey((k) => k + 1)}
            aria-label="Reset demo"
            title="Reset demo"
            className={ICON_BUTTON_CLASS}
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {badge && (
            <span className="label-mono hidden rounded-full border border-border px-2.5 py-1 text-muted-foreground sm:inline-block">
              {badge}
            </span>
          )}
          {tab === "code" && <CopyButton text={allCode} className={ICON_BUTTON_CLASS} />}
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            aria-label={dark ? "Preview in light mode" : "Preview in dark mode"}
            title={dark ? "Preview in light mode" : "Preview in dark mode"}
            className={ICON_BUTTON_CLASS}
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div hidden={tab !== "preview"}>
        <div
          className={cn(
            "relative overflow-hidden rounded-lg border border-border",
            fillCanvas ? "h-[44rem] p-0" : "min-h-[44rem] p-8 sm:p-12",
            dark && "dark",
            !fillCanvas && (dark ? "bg-[#0b1220]" : "bg-[radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] [background-size:20px_20px]")
          )}
        >
          {/*
            `absolute inset-0` instead of `h-full` — an absolutely
            positioned box with all four insets set gets a genuinely
            *definite* computed size straight from its positioned ancestor
            (the canvas above, `relative` + a real `h-[44rem]`), which a
            plain `height: 100%` can't guarantee through several more levels
            of nested flex/block children. One robust anchor here beats
            hoping every div in the chain below resolves percentages right.
          */}
          <div key={previewKey} className={fillCanvas ? "absolute inset-0" : undefined}>
            <PreviewDarkContext.Provider value={dark}>{preview}</PreviewDarkContext.Provider>
          </div>
        </div>
      </div>
      <div hidden={tab !== "code"}>
        <CodeBrowser files={files} />
      </div>
    </div>
  );
}
