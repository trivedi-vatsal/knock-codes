"use client";

import type { ReactNode } from "react";
import {
  KnockCodesTemplate,
  MinimalAccessTemplate,
  BrandedAccessTemplate,
  ModalAccessTemplate,
} from "@knock-codes/react";
import { usePreviewDark } from "@/components/preview-panel";
import { FigureLabel } from "@/components/figure-label";

const DEMO_CODE = "demo1234";
// sha256Hex(DEMO_CODE) — precomputed so the preview renders on first paint
// instead of waiting on an async Web Crypto round trip for a hash of a fixed string.
const DEMO_CODE_HASH = "0ead2060b65992dca4769af601a1b3a35ef38cfad2c2c465bb160ea764157c5d";
const LOGO = <span className="text-lg font-bold text-gray-900 dark:text-gray-50">Acme Inc.</span>;

function DemoUnlockedPanel() {
  return (
    <div className="flex h-full min-h-32 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border bg-muted/40 p-6 text-center">
      <p className="text-sm font-medium text-foreground">Unlocked</p>
      <p className="text-xs text-muted-foreground">This is the protected content.</p>
    </div>
  );
}

function DemoSection() {
  return (
    <div className="grid h-full min-h-[28rem] grid-cols-2 gap-4 bg-muted/20 p-6">
      <div className="rounded-md border border-border bg-card p-4">
        <p className="text-sm font-medium text-foreground">Q3 revenue</p>
        <p className="mt-2 text-2xl font-semibold text-foreground">$482,190</p>
      </div>
      <div className="rounded-md border border-border bg-card p-4">
        <p className="text-sm font-medium text-foreground">Active users</p>
        <p className="mt-2 text-2xl font-semibold text-foreground">12,044</p>
      </div>
    </div>
  );
}

type PreviewFactory = (hash: string, theme: "light" | "dark") => ReactNode;

const PREVIEWS: Record<string, PreviewFactory> = {
  "knock-codes": (hash, theme) => (
    <KnockCodesTemplate expectedHash={hash} storage="memory" fullPage={false} theme={theme} logo={LOGO} supportHref="/security" autoFocus={false}>
      <DemoUnlockedPanel />
    </KnockCodesTemplate>
  ),
  "knock-codes-template": (hash, theme) => (
    <KnockCodesTemplate expectedHash={hash} storage="memory" fullPage={false} theme={theme} logo={LOGO} supportHref="/security" autoFocus={false}>
      <DemoUnlockedPanel />
    </KnockCodesTemplate>
  ),
  "minimal-access": (hash, theme) => (
    <MinimalAccessTemplate expectedHash={hash} storage="memory" fullPage={false} theme={theme} logo={LOGO} supportHref="/security" autoFocus={false}>
      <DemoUnlockedPanel />
    </MinimalAccessTemplate>
  ),
  "minimal-access-template": (hash, theme) => (
    <MinimalAccessTemplate expectedHash={hash} storage="memory" fullPage={false} theme={theme} logo={LOGO} supportHref="/security" autoFocus={false}>
      <DemoUnlockedPanel />
    </MinimalAccessTemplate>
  ),
  "branded-access": (hash, theme) => (
    <BrandedAccessTemplate
      expectedHash={hash}
      storage="memory"
      fullPage={false}
      theme={theme}
      logo={LOGO}
      tagline="Your staging environment, kept off search engines and forwarded links."
      supportHref="/security"
      autoFocus={false}
    >
      <DemoUnlockedPanel />
    </BrandedAccessTemplate>
  ),
  "branded-access-template": (hash, theme) => (
    <BrandedAccessTemplate
      expectedHash={hash}
      storage="memory"
      fullPage={false}
      theme={theme}
      logo={LOGO}
      tagline="Your staging environment, kept off search engines and forwarded links."
      supportHref="/security"
      autoFocus={false}
    >
      <DemoUnlockedPanel />
    </BrandedAccessTemplate>
  ),
  "modal-access": (hash, theme) => (
    <ModalAccessTemplate expectedHash={hash} storage="memory" fullPage theme={theme} logo={LOGO} supportHref="/security" autoFocus={false}>
      <DemoSection />
    </ModalAccessTemplate>
  ),
  "modal-access-template": (hash, theme) => (
    <ModalAccessTemplate expectedHash={hash} storage="memory" fullPage theme={theme} logo={LOGO} supportHref="/security" autoFocus={false}>
      <DemoSection />
    </ModalAccessTemplate>
  ),
};

export function TemplatePreview({ slug }: { slug: string }) {
  const dark = usePreviewDark();
  const hash = DEMO_CODE_HASH;

  const factory = PREVIEWS[slug];
  if (!factory) {
    return (
      <div className="flex h-56 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-center">
        <p className="text-sm font-medium text-foreground">No live preview for &ldquo;{slug}&rdquo;</p>
        <p className="max-w-xs text-xs text-muted-foreground">
          Check the Code tab above for the full source of this template.
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-[44rem] flex-col">
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 text-gray-500 dark:text-white/50">
        <FigureLabel index={1} />
        <span className="label-mono">Demo code: {DEMO_CODE}</span>
      </div>
      <div
        style={{ transform: "translate(0, 0)" }}
        className="relative isolate min-h-0 w-full flex-1 transform overflow-hidden"
      >
        {factory(hash, dark ? "dark" : "light")}
      </div>
    </div>
  );
}
