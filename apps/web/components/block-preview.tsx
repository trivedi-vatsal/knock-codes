"use client";

import { useEffect, useState, type ReactNode } from "react";
import { sha256Hex } from "@access-gate/core";
import {
  AccessGate,
  AccessDeniedScreen,
  AccessGateProvider,
  EmbeddedGate,
  GateWrapper,
  LogoutButton,
  PinInput,
  ProtectedCard,
  ProtectedLayout,
  ProtectedModal,
  ProtectedRoute,
  SessionTimeoutBanner,
  StandaloneGate,
  UnlockDialog,
  VerificationLoader,
  useAccessGate,
  useAccessGateContext,
} from "@access-gate/react";

const DEMO_PIN = "demo1234";

function useDemoHash() {
  const [hash, setHash] = useState<string | null>(null);
  useEffect(() => {
    sha256Hex(DEMO_PIN).then(setHash);
  }, []);
  return hash;
}

function DemoUnlockedPanel({ note }: { note?: string }) {
  return (
    <div className="flex h-full min-h-32 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border bg-muted/40 p-6 text-center">
      <p className="text-sm font-medium text-foreground">Unlocked</p>
      <p className="text-xs text-muted-foreground">{note ?? "This is the protected content."}</p>
    </div>
  );
}

/** For blocks that keep children mounted at all times (Protected Modal, Protected Card) — the heading can't claim "Unlocked" here, since this same content is visible (blurred) while still locked. */
function DemoContentPanel({ note }: { note?: string }) {
  return (
    <div className="flex h-full min-h-32 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border bg-muted/40 p-6 text-center">
      <p className="text-sm font-medium text-foreground">Protected content</p>
      <p className="text-xs text-muted-foreground">{note ?? "Stays mounted; visibility/blur changes with lock state."}</p>
    </div>
  );
}

function PreviewFrame({ children }: { children: ReactNode }) {
  return (
    // `transform` gives this element a CSS containing block, so any
    // position:fixed overlay rendered inside (Unlock Dialog / Protected
    // Modal) stays contained in the preview canvas instead of covering the
    // whole gallery page. Centered with generous min-height so the actual
    // gate reads as a real screen, not a cramped little window. Resetting
    // the demo is handled by PreviewPanel (it remounts this whole subtree),
    // not by anything in here.
    <div className="relative isolate flex min-h-[36rem] w-full transform items-center justify-center overflow-hidden">
      {children}
    </div>
  );
}

function Hint() {
  return <p className="label-mono mb-3 text-muted-foreground">Demo code: {DEMO_PIN}</p>;
}

export function BlockPreview({ slug }: { slug: string }) {
  const hash = useDemoHash();

  if (!hash) {
    return (
      <div className="flex h-56 items-center justify-center">
        <VerificationLoader label="Loading preview…" />
      </div>
    );
  }

  const common = { expectedHash: hash, storage: "memory" as const };

  switch (slug) {
    case "access-gate":
      return (
        <div>
          <Hint />
          <PreviewFrame>
            <div className="mx-auto w-full max-w-sm">
              <AccessGate {...common} variant="inline">
                <DemoUnlockedPanel />
              </AccessGate>
            </div>
          </PreviewFrame>
        </div>
      );

    case "pin-input":
      return <PinInputPreview />;

    case "protected-route":
      return (
        <div>
          <Hint />
          <PreviewFrame>
            <div className="mx-auto w-full max-w-sm">
              <ProtectedRoute {...common} variant="inline">
                <DemoUnlockedPanel note="The route's real content." />
              </ProtectedRoute>
            </div>
          </PreviewFrame>
        </div>
      );

    case "protected-layout":
      return (
        <div>
          <Hint />
          <PreviewFrame>
            <div className="mx-auto w-full max-w-sm">
              <ProtectedLayout
                {...common}
                variant="inline"
                header={<div className="label-mono mb-2 text-muted-foreground">Site header (always visible)</div>}
                footer={<div className="label-mono mt-2 text-muted-foreground">Site footer (always visible)</div>}
              >
                <DemoUnlockedPanel />
              </ProtectedLayout>
            </div>
          </PreviewFrame>
        </div>
      );

    case "unlock-dialog":
      return <UnlockDialogPreview hash={hash} />;

    case "protected-modal":
      return (
        <div>
          <Hint />
          <PreviewFrame>
            <ProtectedModal {...common}>
              <DemoContentPanel note="Blurred behind the dialog while locked." />
            </ProtectedModal>
          </PreviewFrame>
        </div>
      );

    case "session-provider":
      return (
        <div>
          <Hint />
          <PreviewFrame>
            <AccessGateProvider {...common}>
              <SessionProviderDemo />
            </AccessGateProvider>
          </PreviewFrame>
        </div>
      );

    case "session-timeout-banner":
      return (
        <div>
          <p className="label-mono mb-3 text-muted-foreground">Demo code: {DEMO_PIN} — timeout set to 12s</p>
          <PreviewFrame>
            <AccessGateProvider expectedHash={hash} storage="memory" timeout={12_000}>
              <SessionTimeoutBannerDemo />
            </AccessGateProvider>
          </PreviewFrame>
        </div>
      );

    case "access-denied-screen":
      return (
        <PreviewFrame>
          <AccessDeniedScreen variant="inline" message="You don't have permission to view this page." />
        </PreviewFrame>
      );

    case "verification-loader":
      return (
        <PreviewFrame>
          <div className="flex h-40 items-center justify-center">
            <VerificationLoader />
          </div>
        </PreviewFrame>
      );

    case "logout-button":
      return (
        <div>
          <Hint />
          <PreviewFrame>
            <AccessGateProvider {...common}>
              <LogoutButtonDemo />
            </AccessGateProvider>
          </PreviewFrame>
        </div>
      );

    case "protected-card":
      return (
        <div>
          <Hint />
          <PreviewFrame>
            <div className="flex justify-center py-4">
              <ProtectedCard {...common}>
                <DemoContentPanel note="Card content — blurred until unlocked." />
              </ProtectedCard>
            </div>
          </PreviewFrame>
        </div>
      );

    case "gate-wrapper":
      return (
        <PreviewFrame>
          <GateWrapper variant="inline">
            <div className="w-full max-w-sm rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Your own custom gate UI goes here — Gate Wrapper only handles outer positioning.
            </div>
          </GateWrapper>
        </PreviewFrame>
      );

    case "standalone-gate":
      return (
        <div>
          <Hint />
          <PreviewFrame>
            <div className="mx-auto w-full max-w-sm">
              <StandaloneGate expectedHash={hash} variant="inline">
                <DemoUnlockedPanel />
              </StandaloneGate>
            </div>
          </PreviewFrame>
        </div>
      );

    case "embedded-gate":
      return (
        <div>
          <Hint />
          <PreviewFrame>
            <div className="p-4">
              <p className="mb-2 text-xs text-muted-foreground">Sits inline inside existing layout:</p>
              <EmbeddedGate {...common}>
                <DemoUnlockedPanel />
              </EmbeddedGate>
            </div>
          </PreviewFrame>
        </div>
      );

    default:
      return (
        <div className="flex h-56 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-center">
          <p className="text-sm font-medium text-foreground">No live preview for &ldquo;{slug}&rdquo;</p>
          <p className="max-w-xs text-xs text-muted-foreground">
            Check the Code tab above, or the Props and Notes sections below, for how this one behaves.
          </p>
        </div>
      );
  }
}

function PinInputPreview() {
  const [value, setValue] = useState("");
  const [submitCount, setSubmitCount] = useState(0);
  return (
    <PreviewFrame>
      <div className="mx-auto max-w-xs p-4">
        <PinInput
          value={value}
          onChange={setValue}
          onSubmit={() => setSubmitCount((n) => n + 1)}
          submitting={false}
          error={null}
          autoFocus={false}
        />
        {submitCount > 0 && <p className="mt-2 text-xs text-muted-foreground">Submitted {submitCount}×</p>}
      </div>
    </PreviewFrame>
  );
}

function UnlockDialogPreview({ hash }: { hash: string }) {
  const { state, error, submit } = useAccessGate({ expectedHash: hash, storage: "memory" });
  const [code, setCode] = useState("");

  return (
    <>
      <Hint />
      <PreviewFrame>
        {state === "unlocked" ? (
          <DemoUnlockedPanel />
        ) : (
          <div className="flex h-56 items-center justify-center text-xs text-muted-foreground">
            Dialog open below (contained to this preview frame).
          </div>
        )}
        <UnlockDialog
          open={state !== "unlocked"}
          value={code}
          onChange={setCode}
          onSubmit={async () => {
            await submit(code);
            setCode("");
          }}
          submitting={state === "submitting"}
          error={error}
        />
      </PreviewFrame>
    </>
  );
}

/** Shared locked-state UI for the context-based demos below — `<AccessGateProvider>` shares session state but renders no UI of its own, so each consumer wires its own prompt to the same context. */
function ContextPinPrompt() {
  const { error, state, submit } = useAccessGateContext();
  const [code, setCode] = useState("");
  return (
    <div className="mx-auto max-w-xs p-4">
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
      />
    </div>
  );
}

function SessionProviderDemo() {
  const { state } = useAccessGateContext();
  if (state !== "unlocked") return <ContextPinPrompt />;
  return (
    <div className="flex h-full min-h-32 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-muted/40 p-6 text-center">
      <p className="text-sm font-medium text-foreground">Unlocked (shared session)</p>
      <LogoutButton>Log out</LogoutButton>
    </div>
  );
}

function SessionTimeoutBannerDemo() {
  const { state } = useAccessGateContext();
  if (state !== "unlocked") return <ContextPinPrompt />;
  return (
    <div className="space-y-3 p-4">
      <SessionTimeoutBanner warnBeforeMs={12_000} />
      <DemoUnlockedPanel note="Session expires 12s after unlock." />
    </div>
  );
}

function LogoutButtonDemo() {
  const { state } = useAccessGateContext();
  if (state !== "unlocked") return <ContextPinPrompt />;
  return (
    <div className="flex h-full min-h-32 flex-col items-center justify-center gap-3 p-6">
      <p className="text-sm text-muted-foreground">Unlocked.</p>
      <LogoutButton />
    </div>
  );
}
