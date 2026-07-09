"use client";

import type { ReactNode } from "react";
import { ThemeLabProvider } from "./theme-lab-context";
import { CustomizerLauncher } from "./customizer-launcher";

/** Mounts the Access Theme Lab (state + optional floating launcher + drawer) around a page's content. */
export function ThemeLabRoot({ children, showLauncher = true }: { children: ReactNode; showLauncher?: boolean }) {
  return (
    <ThemeLabProvider>
      {children}
      {showLauncher && <CustomizerLauncher />}
    </ThemeLabProvider>
  );
}
