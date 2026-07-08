"use client";

import { AccessGate, type AccessGateProps } from "./AccessGate.tsx";

export type EmbeddedGateProps = Omit<AccessGateProps, "variant">;

/**
 * `<AccessGate>` fixed to the "inline" shell — sits naturally inside an
 * existing layout (a sidebar widget, a section of a longer page) instead of
 * taking over the full viewport like the page-variant default.
 */
export function EmbeddedGate(props: EmbeddedGateProps) {
  return <AccessGate {...props} variant="inline" />;
}
