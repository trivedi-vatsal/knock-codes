"use client";

import { KnockCodes, type KnockCodesProps } from "./KnockCodes.tsx";

export type EmbeddedGateProps = Omit<KnockCodesProps, "variant">;

/**
 * `<KnockCodes>` fixed to the "inline" shell — sits naturally inside an
 * existing layout (a sidebar widget, a section of a longer page) instead of
 * taking over the full viewport like the page-variant default.
 */
export function EmbeddedGate(props: EmbeddedGateProps) {
  return <KnockCodes {...props} variant="inline" />;
}
