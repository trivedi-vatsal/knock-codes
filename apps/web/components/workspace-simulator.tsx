"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  Fragment,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import { useKnockCodes } from "@knock-codes/react";
import { DEMO_CODE, DEMO_HASH } from "@/lib/demo-hash";
import {
  Lock,
  Unlock,
  Shield,
  RotateCcw,
  RefreshCw,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/copy-button";

const INSTALL_COMMAND =
  "npx shadcn@latest add trivedi-vatsal/knock-codes/knock-codes-template";

// ─── Demo phases ───
type DemoPhase =
  | "idle"
  | "typing"
  | "verifying"
  | "unlocking"
  | "unlocked"
  | "done";

const CODE_LENGTH = 4;

// ─── Mock Dashboard ───
// A miniature "protected page" that sits behind the gate overlay.
function MockDashboard({ revealed }: { revealed: boolean }) {
  return (
    <div
      className={cn(
        "absolute inset-0 transition-all duration-700",
        revealed
          ? "blur-0 scale-100 opacity-100"
          : "blur-[6px] scale-[0.98] opacity-60"
      )}
    >
      {/* Mini nav */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="h-5 w-5 rounded bg-primary/30" />
          <div className="h-2.5 w-16 rounded-full bg-white/[0.08]" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-2 w-10 rounded-full bg-white/[0.06]" />
          <div className="h-2 w-10 rounded-full bg-white/[0.06]" />
          <div className="h-2 w-10 rounded-full bg-white/[0.06]" />
          <div className="h-6 w-6 rounded-full bg-white/[0.08]" />
        </div>
      </div>

      {/* Dashboard content grid */}
      <div className="p-5 space-y-4">
        {/* Greeting row */}
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="h-3 w-32 rounded bg-white/[0.1]" />
            <div className="h-2 w-48 rounded bg-white/[0.05]" />
          </div>
          <div className="h-7 w-20 rounded-md bg-primary/20 border border-primary/15" />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { accent: "bg-primary/25", w: "w-12" },
            { accent: "bg-success/25", w: "w-14" },
            { accent: "bg-blue-500/25", w: "w-10" },
          ].map((card, i) => (
            <div
              key={i}
              className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 space-y-2"
            >
              <div className="h-2 w-10 rounded bg-white/[0.06]" />
              <div className={cn("h-4 rounded", card.w, card.accent)} />
              <div className="h-1.5 w-16 rounded bg-white/[0.04]" />
            </div>
          ))}
        </div>

        {/* Chart area + sidebar list */}
        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="h-2 w-16 rounded bg-white/[0.06] mb-3" />
            <div className="flex items-end gap-1.5 h-16">
              {[40, 65, 50, 80, 60, 90, 45, 70, 55, 85, 48, 72].map(
                (h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-primary/20 transition-all duration-500"
                    style={{
                      height: `${h}%`,
                      transitionDelay: revealed ? `${i * 40}ms` : "0ms",
                    }}
                  />
                )
              )}
            </div>
          </div>
          <div className="col-span-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 space-y-2.5">
            <div className="h-2 w-14 rounded bg-white/[0.06]" />
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-white/[0.06] shrink-0" />
                <div className="h-1.5 flex-1 rounded bg-white/[0.04]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared gate UI (digit boxes, shield, status) ───
// Used by both the auto-playing demo and the interactive mode.
function GateShell({
  children,
  phase,
  statusNode,
  isUnlocking,
}: {
  children: React.ReactNode;
  phase: DemoPhase | "interactive-idle" | "interactive-submitting" | "interactive-error";
  statusNode: React.ReactNode;
  isUnlocking?: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-20 flex flex-col items-center justify-center transition-all duration-700",
        "bg-black/60 backdrop-blur-sm",
        isUnlocking && "opacity-0 scale-105"
      )}
    >
      {/* Shield icon */}
      <div className="mb-5 relative">
        <div className="absolute -inset-3 rounded-full bg-primary/10 blur-xl animate-pulse" />
        <div className="relative flex items-center justify-center h-12 w-12 rounded-full border border-primary/30 bg-primary/[0.08]">
          <Shield className="h-5 w-5 text-primary" />
        </div>
      </div>

      {/* Title */}
      <p className="mb-1.5 font-mono text-[11px] font-semibold tracking-[0.16em] text-foreground uppercase">
        Protected Preview
      </p>
      <p className="mb-6 font-mono text-[10px] text-muted-foreground tracking-wider">
        Enter access code to continue
      </p>

      {/* Digit boxes */}
      {children}

      {/* Status line */}
      <div className="mt-4 font-mono text-[10px] font-medium tracking-[0.12em] uppercase text-center min-h-[18px]">
        {statusNode}
      </div>
    </div>
  );
}

// ─── Demo Gate Overlay (auto-playing) ───
function DemoGateOverlay({
  phase,
  digits,
  activeIdx,
}: {
  phase: DemoPhase;
  digits: string[];
  activeIdx: number;
}) {
  const isUnlocking = phase === "unlocking";
  const isUnlocked = phase === "unlocked" || phase === "done";
  if (isUnlocked) return null;

  return (
    <GateShell phase={phase} isUnlocking={isUnlocking} statusNode={
      phase === "verifying" ? (
        <span className="flex items-center justify-center gap-1.5 text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
          Verifying signature…
        </span>
      ) : phase === "typing" ? (
        <span className="flex items-center justify-center gap-1.5 text-fg-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-fg-faint/50" />
          Entering access code…
        </span>
      ) : (
        <span className="flex items-center justify-center gap-1.5 text-fg-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-fg-faint/50" />
          Starting demo…
        </span>
      )
    }>
      <div className="flex gap-2.5">
        {digits.map((digit, i) => (
          <div
            key={i}
            className={cn(
              "h-12 w-11 rounded-lg border bg-white/[0.04] backdrop-blur-md flex items-center justify-center font-mono text-xl font-bold text-foreground transition-all duration-300",
              digit
                ? "border-primary/50 bg-primary/[0.08] shadow-[0_0_12px_rgba(245,158,11,0.12)] scale-105"
                : i === activeIdx && phase === "typing"
                ? "border-primary/30 animate-pulse"
                : "border-white/[0.08]"
            )}
          >
            {digit && <span className="animate-kc-rise">{digit}</span>}
          </div>
        ))}
      </div>
    </GateShell>
  );
}

// ─── Interactive Gate Overlay (real useKnockCodes) ───
function InteractiveGateOverlay({ onReplay, onUnlock }: { onReplay: () => void; onUnlock: () => void }) {
  const { state, error, submit } = useKnockCodes({
    expectedHash: DEMO_HASH,
    storage: "memory",
    storageKey: "kc-hero-interactive",
  });

  const [digits, setDigits] = useState<string[]>(() =>
    Array(CODE_LENGTH).fill("")
  );
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [shakeSeed, setShakeSeed] = useState(0);
  const unlocked = state === "unlocked";

  useEffect(() => {
    if (!error) return;
    setShakeSeed((s) => s + 1);
    setDigits(Array(CODE_LENGTH).fill(""));
  }, [error]);

  useEffect(() => {
    if (shakeSeed > 0) inputRefs.current[0]?.focus();
  }, [shakeSeed]);

  // Auto-focus first input on mount
  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, []);

  const submitIfFilled = (next: string[]) => {
    if (next.every((d) => d !== "")) void submit(next.join(""));
  };

  const handleChange = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (char && index < CODE_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    submitIfFilled(next);
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);
    if (!pasted) return;
    const next = Array(CODE_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    if (pasted.length === CODE_LENGTH) {
      submitIfFilled(next);
    } else {
      inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
    }
  };

  // Notify parent when unlocked — use a ref to fire exactly once,
  // synchronously before this component returns null and unmounts.
  const didUnlock = useRef(false);
  if (unlocked && !didUnlock.current) {
    didUnlock.current = true;
    // Schedule for after this render commits
    queueMicrotask(onUnlock);
  }

  if (unlocked) return null;

  const interactivePhase = error
    ? ("interactive-error" as const)
    : state === "submitting"
    ? ("interactive-submitting" as const)
    : ("interactive-idle" as const);

  return (
    <GateShell phase={interactivePhase} statusNode={
      <>
        {error ? (
          <span className="flex items-center justify-center gap-1.5 text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
            Wrong code — try again
          </span>
        ) : state === "submitting" ? (
          <span className="flex items-center justify-center gap-1.5 text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
            Verifying…
          </span>
        ) : (
          <span className="flex items-center justify-center gap-1.5 text-fg-faint">
            <span className="h-1.5 w-1.5 rounded-full bg-fg-faint/50" />
            Psst — code is {DEMO_CODE}
          </span>
        )}
        <button
          onClick={onReplay}
          className="mt-3 flex items-center gap-1.5 font-mono text-[10px] text-fg-faint uppercase tracking-wider hover:text-primary transition-colors mx-auto"
        >
          <RotateCcw className="h-3 w-3" />
          Replay demo
        </button>
      </>
    }>
      <div
        key={shakeSeed}
        role="group"
        aria-label="Access code"
        className={cn(
          "flex gap-2.5",
          error && shakeSeed > 0 && "animate-kc-shake"
        )}
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`Access code digit ${index + 1}`}
            value={digit}
            disabled={state === "submitting"}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={cn(
              "h-12 w-11 rounded-lg border bg-white/[0.04] backdrop-blur-md text-center font-mono text-xl font-bold text-foreground caret-primary outline-none transition-all duration-300",
              "focus:border-primary/50 focus:bg-primary/[0.08] focus:shadow-[0_0_12px_rgba(245,158,11,0.12)] focus:scale-105",
              digit
                ? "border-primary/40 bg-primary/[0.06]"
                : "border-white/[0.08]",
              "disabled:opacity-60"
            )}
          />
        ))}
      </div>
    </GateShell>
  );
}

// ─── Main component ───
export function WorkspaceSimulator() {
  const [phase, setPhase] = useState<DemoPhase>("idle");
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [mode, setMode] = useState<"demo" | "interactive">("demo");
  const hasRun = useRef(false);
  const demoCode = DEMO_CODE;
  const isRevealed = phase === "unlocked" || phase === "done";

  // Track whether interactive gate has been unlocked
  const [interactiveUnlocked, setInteractiveUnlocked] = useState(false);

  const runDemo = useCallback(() => {
    hasRun.current = true;
    setDigits(["", "", "", ""]);
    setActiveIdx(0);
    setPhase("idle");
    setInteractiveUnlocked(false);

    setTimeout(() => {
      setPhase("typing");

      const typeDigit = (idx: number) => {
        if (idx >= 4) {
          setTimeout(() => {
            setPhase("verifying");
            setTimeout(() => {
              setPhase("unlocking");
              setTimeout(() => {
                setPhase("unlocked");
                setTimeout(() => setPhase("done"), 1800);
              }, 600);
            }, 1400);
          }, 500);
          return;
        }

        setTimeout(
          () => {
            setDigits((prev) => {
              const next = [...prev];
              next[idx] = demoCode[idx];
              return next;
            });
            setActiveIdx(idx + 1);
            typeDigit(idx + 1);
          },
          420 + Math.random() * 180
        );
      };

      typeDigit(0);
    }, 900);
  }, [demoCode]);

  useEffect(() => {
    if (!hasRun.current) runDemo();
  }, [runDemo]);

  const handleReplay = () => {
    setMode("demo");
    hasRun.current = false;
    runDemo();
  };

  const handleTryIt = () => {
    setMode("interactive");
  };

  // Determine if the dashboard should be unblurred
  const dashboardRevealed =
    (isRevealed && mode === "demo") || (mode === "interactive" && interactiveUnlocked);

  // Determine overall "unlocked" visual state for the browser chrome
  const chromeUnlocked = dashboardRevealed;

  return (
    <div className="relative w-full max-w-[850px] mx-auto group">
      {/* Ambient glow */}
      <div
        className={cn(
          "absolute -inset-3 rounded-2xl blur-3xl transition-all duration-700 pointer-events-none",
          chromeUnlocked
            ? "bg-gradient-to-r from-success/20 via-emerald-500/15 to-primary/10 opacity-40"
            : "bg-gradient-to-r from-primary/15 via-amber-500/10 to-amber-600/10 opacity-30"
        )}
      />

      {/* Browser window frame */}
      <div
        className={cn(
          "relative rounded-xl border overflow-hidden shadow-2xl transition-all duration-500",
          chromeUnlocked
            ? "border-success/25 shadow-[0_0_40px_rgba(74,222,128,0.06)]"
            : "border-border-strong"
        )}
      >
        {/* ── Browser chrome ── */}
        <div className="flex items-center gap-3 px-4 py-2.5 bg-surface-2/40 border-b border-border/40 select-none">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]/80" />
          </div>

          {/* Nav arrows */}
          <div className="flex gap-0.5 text-fg-faint/40">
            <ChevronLeft className="h-3.5 w-3.5" />
            <ChevronRight className="h-3.5 w-3.5" />
          </div>

          {/* URL bar */}
          <div className="flex-1 flex items-center gap-2 rounded-md border border-border/60 bg-black/20 px-3 py-1">
            {chromeUnlocked ? (
              <Unlock className="h-3 w-3 text-success shrink-0" />
            ) : (
              <Lock className="h-3 w-3 text-fg-faint/60 shrink-0" />
            )}
            <span className="font-mono text-[11px] text-muted-foreground truncate">
              preview.myapp.dev
            </span>
            <button
              onClick={handleReplay}
              aria-label="Refresh demo"
              className="ml-auto shrink-0 rounded p-0.5 text-fg-faint/50 hover:text-primary hover:bg-white/[0.06] transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
            </button>
          </div>

          {/* Status badge */}
          <div
            className={cn(
              "hidden sm:inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider transition-colors",
              chromeUnlocked
                ? "bg-success-dim text-success"
                : mode === "interactive"
                ? "bg-primary/10 text-primary animate-pulse"
                : "bg-white/[0.04] text-fg-faint"
            )}
          >
            <span className="h-1 w-1 rounded-full bg-current" />
            {chromeUnlocked
              ? "unlocked"
              : mode === "interactive"
              ? "live"
              : "demo"}
          </div>
        </div>

        {/* ── Browser viewport ── */}
        <div className="relative h-[380px] md:h-[360px] bg-[#0a0a0c] overflow-hidden">
          {/* Mock dashboard (always rendered, blurred when locked) */}
          <MockDashboard revealed={dashboardRevealed} />

          {/* Demo mode: auto-playing gate animation */}
          {mode === "demo" && (
            <DemoGateOverlay
              phase={phase}
              digits={digits}
              activeIdx={activeIdx}
            />
          )}

          {/* "Try it yourself" CTA + install command after demo completes */}
          {mode === "demo" && phase === "done" && (
            <div className="absolute inset-x-0 bottom-0 z-30 animate-kc-rise flex flex-col items-center gap-3 pb-4 px-4">
              {/* Install command card */}
              <div className="w-full max-w-[480px] rounded-lg border border-success/25 bg-card/95 backdrop-blur-md p-3 shadow-xl">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Unlock className="h-3.5 w-3.5 text-success" />
                    <span className="font-mono text-[10px] font-semibold tracking-[0.1em] text-success uppercase">
                      Access granted
                    </span>
                  </div>
                  <span className="font-mono text-[8px] text-success/60 tracking-wider uppercase">
                    Ready to install
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 rounded-md border border-border bg-[#0B0B0C] px-3 py-2 font-mono">
                  <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-[11px] scrollbar-none">
                    <span className="text-primary font-bold select-none">$</span>
                    <code className="text-muted-foreground">{INSTALL_COMMAND}</code>
                  </div>
                  <CopyButton
                    text={INSTALL_COMMAND}
                    className="shrink-0 border-border-strong text-muted-foreground hover:bg-white/10 hover:text-foreground"
                  />
                </div>
              </div>
              {/* Try it button */}
              <button
                onClick={handleTryIt}
                className="group/try flex items-center gap-2 rounded-full border border-primary/30 bg-card/90 backdrop-blur-md px-5 py-2.5 font-mono text-[11px] font-semibold tracking-[0.1em] text-primary uppercase transition-all hover:bg-primary/[0.1] hover:border-primary/50 hover:shadow-[0_0_24px_rgba(245,158,11,0.12)] shadow-lg"
              >
                <Lock className="h-3.5 w-3.5 transition-transform group-hover/try:scale-110" />
                Try it yourself — code is {DEMO_CODE}
              </button>
            </div>
          )}

          {/* Interactive mode: real gate overlay (same visual style, real inputs) */}
          {mode === "interactive" && !interactiveUnlocked && (
            <InteractiveGateOverlay
              onReplay={handleReplay}
              onUnlock={() => setInteractiveUnlocked(true)}
            />
          )}

          {/* Install command after interactive unlock */}
          {mode === "interactive" && interactiveUnlocked && (
            <div className="absolute inset-x-0 bottom-0 z-30 animate-kc-rise flex flex-col items-center gap-3 pb-4 px-4">
              <div className="w-full max-w-[480px] rounded-lg border border-success/25 bg-card/95 backdrop-blur-md p-3 shadow-xl">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Unlock className="h-3.5 w-3.5 text-success" />
                    <span className="font-mono text-[10px] font-semibold tracking-[0.1em] text-success uppercase">
                      Access granted — Session verified
                    </span>
                  </div>
                  <button
                    onClick={handleReplay}
                    className="flex items-center gap-1 font-mono text-[9px] text-fg-faint uppercase tracking-wider hover:text-primary transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Replay
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2 rounded-md border border-border bg-[#0B0B0C] px-3 py-2 font-mono">
                  <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-[11px] scrollbar-none">
                    <span className="text-primary font-bold select-none">$</span>
                    <code className="text-muted-foreground">{INSTALL_COMMAND}</code>
                  </div>
                  <CopyButton
                    text={INSTALL_COMMAND}
                    className="shrink-0 border-border-strong text-muted-foreground hover:bg-white/10 hover:text-foreground"
                  />
                </div>
                <p className="mt-2 text-center font-mono text-[9px] text-fg-faint">That&rsquo;s the whole install.</p>
              </div>
              <button
                onClick={handleReplay}
                className="group/try flex items-center gap-2 rounded-full border border-border/40 bg-card/80 backdrop-blur-md px-4 py-2 font-mono text-[10px] font-semibold tracking-[0.1em] text-fg-faint uppercase transition-all hover:text-primary hover:border-primary/30 shadow-lg"
              >
                <RotateCcw className="h-3 w-3" />
                Rerun demo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

