"use client";

import type { CSSProperties, ReactNode } from "react";
import { useThemeLab } from "./theme-lab-context";
import { resolveThemeVars } from "@/lib/theme-presets";
import { usePreviewDark } from "@/components/preview-panel";

/**
 * Scopes the Theme Lab's live selection to one preview subtree via CSS
 * custom properties on a wrapper `div` — never touches `document.documentElement`,
 * so changing the customizer never affects the rest of the site, only the
 * demo it wraps. `packages/react` components read these `--ag-*` vars with a
 * literal fallback, so they render identically with or without this provider.
 */
export function PreviewThemeProvider({ children, className }: { children: ReactNode; className?: string }) {
  const { settings } = useThemeLab();
  const dark = usePreviewDark();
  const vars = resolveThemeVars(settings);

  const style: CSSProperties & Record<string, string> = {
    ...vars,
    "--ag-bg": dark ? vars["--ag-canvas-bg-dark"] : vars["--ag-canvas-bg"],
    "--ag-canvas-fg": dark ? vars["--ag-canvas-fg-dark"] : vars["--ag-canvas-fg"],
    backgroundColor: "var(--ag-bg)",
    color: "var(--ag-canvas-fg)",
    fontFamily: "var(--ag-font)",
  };

  return (
    <div data-surface={settings.surfaceStyle} data-density={settings.density} style={style} className={`access-theme-scope h-full w-full ${className ?? ""}`}>
      {children}
    </div>
  );
}
