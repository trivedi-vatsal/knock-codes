"use client";

import { useEffect, useState } from "react";
import { sha256Hex } from "@access-gate/core";
import { AccessGateTemplate, VerificationLoader } from "@access-gate/react";

const DEMO_PIN = "demo1234";

function DemoUnlockedPanel() {
  return (
    <div className="flex h-full min-h-32 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-white/20 bg-white/5 p-6 text-center">
      <p className="text-sm font-medium text-white">Unlocked</p>
      <p className="text-xs text-white/60">This is the protected content.</p>
    </div>
  );
}

/** The homepage hero's live, typeable demo — the flagship template itself is the pitch. */
export function HeroPreview() {
  const [hash, setHash] = useState<string | null>(null);

  useEffect(() => {
    sha256Hex(DEMO_PIN).then(setHash);
  }, []);

  if (!hash) {
    return (
      <div className="flex h-full min-h-[26rem] items-center justify-center rounded-xl border border-white/10 bg-white/5">
        <VerificationLoader label="Loading preview…" />
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-[26rem] flex-col overflow-hidden rounded-xl border border-white/10 shadow-2xl">
      <p className="label-mono absolute top-3 left-3 z-10 text-white/50">Try it — code: {DEMO_PIN}</p>
      <div className="relative isolate min-h-0 w-full flex-1">
        <AccessGateTemplate
          expectedHash={hash}
          storage="memory"
          fullPage={false}
          theme="dark"
          logo={<span className="text-lg font-bold text-gray-50">Acme Inc.</span>}
        >
          <DemoUnlockedPanel />
        </AccessGateTemplate>
      </div>
    </div>
  );
}
