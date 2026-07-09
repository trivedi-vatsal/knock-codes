"use client";

import type { ReactNode } from "react";
import {
  KnockCodesTemplate,
  MinimalAccessTemplate,
  BrandedAccessTemplate,
  ModalAccessTemplate,
} from "@knock-codes/react";
import { DEMO_HASH } from "@/lib/demo-hash";

const LOGO = <span className="text-sm font-bold text-gray-900 dark:text-gray-50">Acme Inc.</span>;

function DemoPanel() {
  return (
    <div className="flex h-full min-h-24 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border bg-muted/40 p-4 text-center">
      <p className="text-xs font-medium text-foreground">Protected content</p>
    </div>
  );
}

// Rendered at a fixed natural size, then scaled down with a CSS transform —
// not resized via props — so each card shows the template's real layout
// (including lg: split-panel behavior on wide viewports) rather than a
// cramped, differently-wrapped version of it.
const NATURAL_WIDTH = 640;
const NATURAL_HEIGHT = 420;
const PREVIEW_HEIGHT = 240;
const SCALE = PREVIEW_HEIGHT / NATURAL_HEIGHT;

const FACTORIES: Record<string, () => ReactNode> = {
  "knock-codes": () => (
    <KnockCodesTemplate expectedHash={DEMO_HASH} storage="memory" fullPage={false} codeLength={4} groupSize={4} logo={LOGO} autoFocus={false}>
      <DemoPanel />
    </KnockCodesTemplate>
  ),
  "knock-codes-template": () => (
    <KnockCodesTemplate expectedHash={DEMO_HASH} storage="memory" fullPage={false} codeLength={4} groupSize={4} logo={LOGO} autoFocus={false}>
      <DemoPanel />
    </KnockCodesTemplate>
  ),
  "minimal-access": () => (
    <MinimalAccessTemplate expectedHash={DEMO_HASH} storage="memory" fullPage={false} logo={LOGO} autoFocus={false}>
      <DemoPanel />
    </MinimalAccessTemplate>
  ),
  "minimal-access-template": () => (
    <MinimalAccessTemplate expectedHash={DEMO_HASH} storage="memory" fullPage={false} logo={LOGO} autoFocus={false}>
      <DemoPanel />
    </MinimalAccessTemplate>
  ),
  "branded-access": () => (
    <BrandedAccessTemplate
      expectedHash={DEMO_HASH}
      storage="memory"
      fullPage={false}
      logo={LOGO}
      tagline="Kept off search engines and forwarded links."
      autoFocus={false}
    >
      <DemoPanel />
    </BrandedAccessTemplate>
  ),
  "branded-access-template": () => (
    <BrandedAccessTemplate
      expectedHash={DEMO_HASH}
      storage="memory"
      fullPage={false}
      logo={LOGO}
      tagline="Kept off search engines and forwarded links."
      autoFocus={false}
    >
      <DemoPanel />
    </BrandedAccessTemplate>
  ),
  "modal-access": () => (
    <ModalAccessTemplate expectedHash={DEMO_HASH} storage="memory" fullPage={false} logo={LOGO} autoFocus={false}>
      <DemoPanel />
    </ModalAccessTemplate>
  ),
  "modal-access-template": () => (
    <ModalAccessTemplate expectedHash={DEMO_HASH} storage="memory" fullPage={false} logo={LOGO} autoFocus={false}>
      <DemoPanel />
    </ModalAccessTemplate>
  ),
};

/**
 * A frozen, non-interactive live render of the real template component — the
 * gallery-card thumbnail. Live-rendered rather than a screenshot so it can
 * never drift from what actually ships. `pointer-events-none` + `aria-hidden`
 * because the whole card is already a `<Link>`; this is decorative, not a
 * second, nested interactive surface.
 */
export function TemplateCardPreview({ slug }: { slug: string }) {
  const factory = FACTORIES[slug];
  if (!factory) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative w-full select-none overflow-hidden"
      style={{ height: PREVIEW_HEIGHT }}
    >
      <div
        className="absolute top-0 left-1/2"
        style={{
          width: NATURAL_WIDTH,
          height: NATURAL_HEIGHT,
          transform: `translateX(-50%) scale(${SCALE})`,
          transformOrigin: "top center",
        }}
      >
        {factory()}
      </div>
    </div>
  );
}

