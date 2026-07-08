import { KnockCodesTemplate } from "@knock-codes/react";

const DEMO_CODE = "4242";
// Precomputed sha256Hex("4242") (packages/core/hash.ts) — hardcoded so the
// hero renders the real, working demo on first paint instead of gating it
// behind an async hash computed after hydration.
const DEMO_HASH = "0315b4020af3eccab7706679580ac87a710d82970733b8719e70af9b57e7b9e6";

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
  return (
    <div className="relative flex h-full min-h-[26rem] flex-col overflow-hidden rounded-xl border border-white/10 shadow-2xl">
      <p className="label-mono absolute top-3 left-3 z-10 text-white/50">Try code {DEMO_CODE}</p>
      <div className="relative isolate min-h-0 w-full flex-1">
        <KnockCodesTemplate
          expectedHash={DEMO_HASH}
          storage="memory"
          fullPage={false}
          codeLength={4}
          groupSize={4}
          theme="dark"
          logo={<span className="text-lg font-bold text-gray-50">Acme Inc.</span>}
        >
          <DemoUnlockedPanel />
        </KnockCodesTemplate>
      </div>
    </div>
  );
}
