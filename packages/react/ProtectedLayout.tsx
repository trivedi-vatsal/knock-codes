"use client";

import type { ReactNode } from "react";
import { KnockCodes, type KnockCodesProps } from "./KnockCodes.tsx";

export interface ProtectedLayoutProps extends KnockCodesProps {
  /** Rendered above the PIN prompt even while locked — e.g. a persistent site header/logo. */
  header?: ReactNode;
  /** Rendered below the PIN prompt even while locked. */
  footer?: ReactNode;
}

/**
 * `<KnockCodes>` shaped for a full-page shell (a Next.js `layout.tsx`, an
 * app root): `header`/`footer` render unconditionally, so persistent site
 * chrome (logo, footer links) survives the gate instead of disappearing
 * behind it while locked.
 */
export function ProtectedLayout({ header, footer, children, ...props }: ProtectedLayoutProps) {
  return (
    <>
      {header}
      <KnockCodes {...props}>{children}</KnockCodes>
      {footer}
    </>
  );
}
