"use client";

import type { ReactNode } from "react";
import { ThemeLabProvider } from "./theme-lab-context";
import { CustomizerLauncher } from "./customizer-launcher";

/** Mounts the Access Theme Lab (state + floating launcher + drawer) around a page's server-rendered content. */
export function ThemeLabRoot({ children }: { children: ReactNode }) {
  return (
    <ThemeLabProvider>
      {children}
      <CustomizerLauncher />
    </ThemeLabProvider>
  );
}
