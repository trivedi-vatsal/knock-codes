"use client";

import { useEffect, useState, type ReactNode } from "react";
import { sha256Hex } from "@access-gate/core";
import {
  AccessGateTemplate,
  MinimalAccessTemplate,
  BrandedAccessTemplate,
  ModalAccessTemplate,
  VerificationLoader,
} from "@access-gate/react";
import { usePreviewDark } from "@/components/preview-panel";

const DEMO_CODE = "demo1234";
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
  "access-gate-template": (hash, theme) => (
    <AccessGateTemplate expectedHash={hash} storage="memory" fullPage={false} theme={theme} logo={LOGO} supportHref="#">
      <DemoUnlockedPanel />
    </AccessGateTemplate>
  ),
  "minimal-access-template": (hash, theme) => (
    <MinimalAccessTemplate expectedHash={hash} storage="memory" fullPage={false} theme={theme} logo={LOGO} supportHref="#">
      <DemoUnlockedPanel />
    </MinimalAccessTemplate>
  ),
  "branded-access-template": (hash, theme) => (
    <BrandedAccessTemplate
      expectedHash={hash}
      storage="memory"
      fullPage={false}
      theme={theme}
      logo={LOGO}
      tagline="Your staging environment, kept off search engines and forwarded links."
      supportHref="#"
    >
      <DemoUnlockedPanel />
    </BrandedAccessTemplate>
  ),
  "modal-access-template": (hash, theme) => (
    <ModalAccessTemplate expectedHash={hash} storage="memory" fullPage theme={theme} logo={LOGO} supportHref="#">
      <DemoSection />
    </ModalAccessTemplate>
  ),
};

export function TemplatePreview({ slug }: { slug: string }) {
  const dark = usePreviewDark();
  const [hash, setHash] = useState<string | null>(null);

  useEffect(() => {
    sha256Hex(DEMO_CODE).then(setHash);
  }, []);

  if (!hash) {
    return (
      <div className="flex h-56 items-center justify-center">
        <VerificationLoader label="Loading preview…" />
      </div>
    );
  }

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
      <p className="label-mono absolute top-3 left-3 z-10 text-gray-500 dark:text-white/50">Demo code: {DEMO_CODE}</p>
      <div className="relative isolate min-h-0 w-full flex-1 transform overflow-hidden">{factory(hash, dark ? "dark" : "light")}</div>
    </div>
  );
}
