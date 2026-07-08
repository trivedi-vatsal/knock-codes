"use client";

import type { ReactNode } from "react";
import { AccessGate, type AccessGateProps } from "./AccessGate.tsx";

export interface ProtectedLayoutProps extends AccessGateProps {
  /** Rendered above the PIN prompt even while locked — e.g. a persistent site header/logo. */
  header?: ReactNode;
  /** Rendered below the PIN prompt even while locked. */
  footer?: ReactNode;
}

/**
 * `<AccessGate>` shaped for a full-page shell (a Next.js `layout.tsx`, an
 * app root): `header`/`footer` render unconditionally, so persistent site
 * chrome (logo, footer links) survives the gate instead of disappearing
 * behind it while locked.
 */
export function ProtectedLayout({ header, footer, children, ...props }: ProtectedLayoutProps) {
  return (
    <>
      {header}
      <AccessGate {...props}>{children}</AccessGate>
      {footer}
    </>
  );
}
