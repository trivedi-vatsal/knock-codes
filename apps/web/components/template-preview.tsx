"use client";

import { useEffect, useState } from "react";
import { sha256Hex } from "@access-gate/core";
import { AccessGateTemplate, VerificationLoader } from "@access-gate/react";
import { usePreviewDark } from "@/components/preview-panel";

const DEMO_PIN = "demo1234";

function DemoUnlockedPanel() {
  return (
    <div className="flex h-full min-h-32 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border bg-muted/40 p-6 text-center">
      <p className="text-sm font-medium text-foreground">Unlocked</p>
      <p className="text-xs text-muted-foreground">This is the protected content.</p>
    </div>
  );
}

export function TemplatePreview({ slug }: { slug: string }) {
  const dark = usePreviewDark();
  const [hash, setHash] = useState<string | null>(null);

  useEffect(() => {
    sha256Hex(DEMO_PIN).then(setHash);
  }, []);

  if (!hash) {
    return (
      <div className="flex h-56 items-center justify-center">
        <VerificationLoader label="Loading preview…" />
      </div>
    );
  }

  if (slug !== "access-gate-template") {
    return <p className="text-sm text-muted-foreground">No live preview available for &ldquo;{slug}&rdquo;.</p>;
  }

  return (
    <div className="relative flex h-full min-h-[44rem] flex-col">
      <p className="label-mono absolute top-3 left-3 z-10 text-gray-500 dark:text-white/50">Demo code: {DEMO_PIN}</p>
      <div className="relative isolate min-h-0 w-full flex-1 transform overflow-hidden">
        <AccessGateTemplate
          expectedHash={hash}
          storage="memory"
          fullPage={false}
          theme={dark ? "dark" : "light"}
          logo={<span className="text-lg font-bold text-gray-900 dark:text-gray-50">Acme Inc.</span>}
          supportHref="#"
        >
          <DemoUnlockedPanel />
        </AccessGateTemplate>
      </div>
    </div>
  );
}
