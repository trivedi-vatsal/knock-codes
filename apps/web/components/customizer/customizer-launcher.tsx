"use client";

import { SlidersHorizontal } from "lucide-react";
import { useThemeLab } from "./theme-lab-context";
import { ThemeCustomizer } from "./theme-customizer";

/** Floating launcher for the Access Theme Lab drawer — mount once per page that has a live preview. */
export function CustomizerLauncher() {
  const { open, setOpen } = useThemeLab();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Open Access Theme Lab"
        aria-expanded={open}
        className="label-mono fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full border border-border bg-foreground px-4 py-2.5 text-background shadow-lg transition-transform hover:scale-105"
      >
        <span aria-hidden="true" className="status-dot" data-tone="signal" />
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Theme Lab
      </button>
      <ThemeCustomizer />
    </>
  );
}
