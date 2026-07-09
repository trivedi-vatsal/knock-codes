"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { VerifyFn } from "@knock-codes/core";
import { useKnockCodes, PinInput } from "@knock-codes/react";
import { FigureLabel } from "@/components/figure-label";
import { AccessPanelCard } from "@/components/access-panel-card";
import { DEMO_CODE, DEMO_HASH } from "@/lib/demo-hash";
import { cn } from "@/lib/utils";

// A real ~1.2s async delay before resolving — the "Checking…" state below is
// a genuine wait on this promise, not a hardcoded visual, so it demonstrates
// what `submitting` actually looks like when `verify` hits a real endpoint.
const DELAYED_SERVER_VERIFY: VerifyFn = (code) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(code === DEMO_CODE ? { ok: true } : { ok: false, reason: "invalid" }), 1200);
  });

function FeatureCard({
  index,
  title,
  description,
  snippet,
  children,
}: {
  index: number;
  title: string;
  description: string;
  snippet: string;
  children: ReactNode;
}) {
  return (
    <AccessPanelCard className="gap-3">
      <div>
        <FigureLabel index={index} title={title} className="mb-2 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">{description}</p>
        <code className="mt-2 block truncate rounded-md border border-border bg-muted/40 px-2.5 py-1.5 font-mono text-[11px] text-foreground">
          {snippet}
        </code>
      </div>
      <div className="flex min-h-[9rem] flex-col justify-center rounded-md border border-dashed border-border bg-muted/20 p-4">
        {children}
      </div>
    </AccessPanelCard>
  );
}

function MiniUnlocked({ note }: { note?: string }) {
  return (
    <div className="text-center">
      <p className="text-sm font-medium text-foreground">Unlocked</p>
      {note && <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}

function LocalModeCard() {
  const { state, error, submit } = useKnockCodes({
    expectedHash: DEMO_HASH,
    storage: "memory",
    storageKey: "kc-demo-local",
  });
  const [code, setCode] = useState("");

  return (
    <FeatureCard
      index={1}
      title="Local mode"
      description="The hash is compared entirely client-side — no server round trip."
      snippet={`expectedHash={hash}`}
    >
      {state === "unlocked" ? (
        <MiniUnlocked />
      ) : (
        <PinInput
          value={code}
          onChange={setCode}
          onSubmit={async () => {
            await submit(code);
            setCode("");
          }}
          submitting={state === "submitting"}
          error={error}
          autoFocus={false}
          helperText={`Try ${DEMO_CODE}`}
        />
      )}
    </FeatureCard>
  );
}

function ServerModeCard() {
  const { state, error, submit } = useKnockCodes({ verify: DELAYED_SERVER_VERIFY, storage: "memory", storageKey: "kc-demo-server" });
  const [code, setCode] = useState("");

  return (
    <FeatureCard
      index={2}
      title="Server mode"
      description="Swap expectedHash for verify — an async function, checked wherever you decide."
      snippet={`verify={verifyFn}`}
    >
      {state === "unlocked" ? (
        <MiniUnlocked />
      ) : (
        <PinInput
          value={code}
          onChange={setCode}
          onSubmit={async () => {
            await submit(code);
            setCode("");
          }}
          submitting={state === "submitting"}
          error={error}
          autoFocus={false}
          helperText={state === "submitting" ? undefined : `Try ${DEMO_CODE} — has a ~1.2s delay`}
        />
      )}
    </FeatureCard>
  );
}

function SessionMemoryInner({ remember }: { remember: boolean }) {
  const { state, error, submit } = useKnockCodes({
    expectedHash: DEMO_HASH,
    storage: remember ? "sessionStorage" : "memory",
    storageKey: "kc-demo-session-memory",
  });
  const [code, setCode] = useState("");

  if (state === "unlocked") {
    return <MiniUnlocked note={remember ? "Still unlocked after reload." : "Reset on reload."} />;
  }
  return (
    <PinInput
      value={code}
      onChange={setCode}
      onSubmit={async () => {
        await submit(code);
        setCode("");
      }}
      submitting={state === "submitting"}
      error={error}
      autoFocus={false}
      helperText={`Try ${DEMO_CODE}, then simulate a reload`}
    />
  );
}

function SessionMemoryCard() {
  const [remember, setRemember] = useState(false);
  const [instanceKey, setInstanceKey] = useState(0);

  return (
    <FeatureCard
      index={3}
      title="Session memory"
      description="Off by default. Unlock, then simulate a reload to see the difference."
      snippet={`remember="session"`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <label className="flex items-center gap-1.5 text-xs text-foreground">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            className="h-3.5 w-3.5 accent-primary"
          />
          Remember
        </label>
        <button
          type="button"
          onClick={() => setInstanceKey((k) => k + 1)}
          className="label-mono text-primary hover:underline"
        >
          Simulate reload
        </button>
      </div>
      <SessionMemoryInner key={instanceKey} remember={remember} />
    </FeatureCard>
  );
}

function TimeoutCard() {
  const { state, error, submit, session } = useKnockCodes({
    expectedHash: DEMO_HASH,
    storage: "memory",
    storageKey: "kc-demo-timeout",
    timeout: 8_000,
  });
  const [code, setCode] = useState("");
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!session) return;
    const tick = () => setRemaining(Math.max(0, Math.ceil((session.expiresAt - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [session]);

  return (
    <FeatureCard
      index={4}
      title="Timeout"
      description="The session self-expires; no reload needed to see it lock again."
      snippet={`timeout={8000} // ms`}
    >
      {state === "unlocked" ? (
        <MiniUnlocked note={`Expires in ${remaining}s`} />
      ) : (
        <PinInput
          value={code}
          onChange={setCode}
          onSubmit={async () => {
            await submit(code);
            setCode("");
          }}
          submitting={state === "submitting"}
          error={error}
          autoFocus={false}
          helperText={`Try ${DEMO_CODE} — 8s session`}
        />
      )}
    </FeatureCard>
  );
}

function WrongKnockCard() {
  const { state, error, submit } = useKnockCodes({
    expectedHash: DEMO_HASH,
    storage: "memory",
    storageKey: "kc-demo-wrong",
  });
  const [shakeSeed, setShakeSeed] = useState(0);

  useEffect(() => {
    if (error) setShakeSeed((seed) => seed + 1);
  }, [error]);

  return (
    <FeatureCard
      index={5}
      title="Wrong knock"
      description="A failed attempt returns the real error shape — reason and default copy, nothing invented."
      snippet={`error?.reason // "invalid"`}
    >
      {state === "unlocked" ? (
        <MiniUnlocked />
      ) : (
        <div key={shakeSeed} className={cn("space-y-2", shakeSeed > 0 && "animate-kc-shake")}>
          <button
            type="button"
            onClick={() => submit("0000")}
            disabled={state === "submitting"}
            className="w-full rounded-md bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50"
          >
            Knock wrong code
          </button>
          <p role="status" aria-live="polite" className="min-h-[1rem] text-center text-xs font-medium text-destructive">
            {error ? "That code didn't work. Try again." : " "}
          </p>
        </div>
      )}
    </FeatureCard>
  );
}

/**
 * "How it works," lived in — each card is a real `useKnockCodes` instance,
 * not a screenshot, paired with the one real prop that drives it. Every
 * card uses its own `storage: "memory"` (or a scoped sessionStorage key),
 * so none of these demos ever touch a real session.
 */
export function FeatureGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <LocalModeCard />
      <ServerModeCard />
      <SessionMemoryCard />
      <TimeoutCard />
      <WrongKnockCard />
    </div>
  );
}
