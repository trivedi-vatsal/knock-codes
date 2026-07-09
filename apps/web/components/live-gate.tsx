"use client";

import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { useKnockCodes } from "@knock-codes/react";
import { DEMO_CODE, DEMO_HASH } from "@/lib/demo-hash";
import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/utils";

const CODE_LENGTH = 4;
const INSTALL_COMMAND = "npx shadcn@latest add trivedi-vatsal/knock-codes/knock-codes-template";

/**
 * The homepage hero's live "front door" — real `useKnockCodes` verification
 * (expectedHash, code 4242) driving the reference's exact box-entry
 * interaction: auto-advance, backspace-retreat, paste-to-fill, shake +
 * aria-live error on a wrong knock, install command reveal on unlock.
 */
export function LiveGate() {
  const { state, error, submit } = useKnockCodes({
    expectedHash: DEMO_HASH,
    storage: "memory",
    storageKey: "kc-hero-gate",
  });
  const [digits, setDigits] = useState<string[]>(() => Array(CODE_LENGTH).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [shakeSeed, setShakeSeed] = useState(0);
  const unlocked = state === "unlocked";

  useEffect(() => {
    if (!error) return;
    setShakeSeed((seed) => seed + 1);
    setDigits(Array(CODE_LENGTH).fill(""));
  }, [error]);

  // Runs after the shake-seed remount below has committed, so it focuses
  // the newly-mounted input rather than the one it just replaced.
  useEffect(() => {
    if (shakeSeed > 0) inputRefs.current[0]?.focus();
  }, [shakeSeed]);

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

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
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

  return (
    <div
      key={shakeSeed}
      className={cn(
        "mx-auto mt-13 max-w-[430px] rounded-xl border border-border/80 bg-card/65 backdrop-blur-md px-6 pt-4 pb-6 transition-all duration-300 shadow-2xl",
        unlocked ? "border-success/30 shadow-[0_0_32px_rgba(74,222,128,0.06)]" : "focus-within:border-primary/30 focus-within:shadow-[0_0_32px_rgba(245,158,11,0.05)]",
        error && shakeSeed > 0 && "animate-kc-shake border-destructive/40 shadow-[0_0_32px_rgba(248,113,113,0.05)]"
      )}
    >
      {/* Console Top Window Controls & Label */}
      <div className="mb-4 flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#FF5F56]/80" />
          <span className="h-2 w-2 rounded-full bg-[#FFBD2E]/80" />
          <span className="h-2 w-2 rounded-full bg-[#27C93F]/80" />
        </div>
        <span className="font-mono text-[9px] font-medium tracking-[0.1em] text-fg-faint uppercase">
          {unlocked ? "terminal: unlocked" : "console: gate"}
        </span>
        <span className="font-mono text-[9px] rounded bg-surface-2 border border-border-strong px-1.5 py-0.5 text-fg-faint font-semibold uppercase">
          SHA-256
        </span>
      </div>

      <div className="mb-3.5 flex items-center justify-between gap-3">
        <span className="font-mono text-[10.5px] font-medium tracking-[0.14em] text-fg-faint uppercase">Fig.00 // The front door</span>
        {!unlocked && (
          <span className="font-mono text-[10.5px] font-semibold tracking-[0.14em] text-primary uppercase animate-pulse">Psst — code is {DEMO_CODE}</span>
        )}
      </div>

      {!unlocked ? (
        <>
          <div role="group" aria-label="Access code" className="flex justify-center gap-2.5">
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
                onChange={(event) => handleChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={handlePaste}
                className={cn(
                  "h-16 w-14 rounded-lg border border-border bg-surface-2/70 text-center font-mono text-2xl font-bold text-foreground caret-primary outline-none transition-all duration-200",
                  "focus:scale-105 focus:border-primary focus:bg-[#1C1C1F] focus:shadow-[0_0_12px_rgba(245,158,11,0.15)]",
                  "disabled:opacity-60"
                )}
              />
            ))}
          </div>
          <div
            role="status"
            aria-live="polite"
            className="mt-4 min-h-[18px] font-mono text-[10.5px] font-medium tracking-[0.12em] text-destructive uppercase"
          >
            {error ? (
              <span className="flex items-center justify-center gap-1.5">
                <span className="status-dot" data-tone="danger" />
                Wrong knock — try again
              </span>
            ) : state === "submitting" ? (
              <span className="flex items-center justify-center gap-1.5 text-primary">
                <span className="status-dot animate-ping" data-tone="signal" />
                Verifying signature…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5 text-fg-faint">
                <span className="status-dot" data-tone="muted" />
                Awaiting input
              </span>
            )}
          </div>
        </>
      ) : (
        <div className="animate-kc-rise text-left">
          <div className="mb-3.5 flex items-center gap-2">
            <span className="status-dot" data-tone="warning" style={{ backgroundColor: "#4ADE80", boxShadow: "0 0 0 3px rgba(74,222,128,0.2)" }} />
            <p className="font-mono text-[10.5px] font-semibold tracking-[0.1em] text-success uppercase">
              Access granted — Session verified
            </p>
          </div>
          <div className="rounded-lg border border-border bg-[#0B0B0C] p-3 shadow-inner">
            <div className="mb-2 flex items-center justify-between border-b border-border/30 pb-1.5">
              <span className="font-mono text-[9px] text-fg-faint">bash // install command</span>
              <span className="font-mono text-[8px] text-success/80 tracking-wider">OK // CONNECTED</span>
            </div>
            <div className="flex items-center justify-between gap-3 font-mono">
              <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-[12.5px] scrollbar-none">
                <span className="text-primary font-bold select-none">$</span>
                <code className="text-muted-foreground">{INSTALL_COMMAND}</code>
              </div>
              <CopyButton text={INSTALL_COMMAND} className="shrink-0 border-border-strong text-muted-foreground hover:bg-white/10 hover:text-foreground" />
            </div>
          </div>
          <p className="mt-3 text-center font-mono text-[10px] text-fg-faint">That&rsquo;s the whole install.</p>
        </div>
      )}
    </div>
  );
}
