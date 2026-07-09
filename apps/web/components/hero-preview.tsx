import { KnockCodesTemplate } from "@knock-codes/react";
import { DEMO_CODE, DEMO_HASH } from "@/lib/demo-hash";
import { FigureLabel } from "@/components/figure-label";

function DemoUnlockedPanel() {
  return (
    <div className="flex h-full min-h-32 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-white/20 bg-white/5 p-6 text-center">
      <p className="text-sm font-medium text-white">Come on in.</p>
      <p className="text-xs text-white/60">This is the protected content.</p>
    </div>
  );
}

/** The homepage hero's live, typeable demo — the flagship template itself is the pitch. */
export function HeroPreview() {
  return (
    <div className="relative flex h-full min-h-[26rem] flex-col overflow-hidden rounded-xl border border-white/10 shadow-2xl">
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 text-white/50">
        <FigureLabel index={1} />
        <span className="label-mono">Try code {DEMO_CODE}</span>
      </div>
      <div className="relative isolate min-h-0 w-full flex-1">
        <KnockCodesTemplate
          expectedHash={DEMO_HASH}
          storage="memory"
          fullPage={false}
          codeLength={4}
          groupSize={4}
          theme="dark"
          logo={<span className="text-lg font-bold text-gray-50">Acme Inc.</span>}
          labels={{ invalidErrorMessage: "Wrong knock. Try again." }}
        >
          <DemoUnlockedPanel />
        </KnockCodesTemplate>
      </div>
    </div>
  );
}
