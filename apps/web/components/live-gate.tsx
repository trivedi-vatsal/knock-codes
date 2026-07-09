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
        "mx-auto mt-13 max-w-[420px] rounded-xl border border-border bg-card px-7 pt-7 pb-6 transition-colors",
        unlocked && "border-success/35",
        error && shakeSeed > 0 && "animate-kc-shake border-destructive/40"
      )}
    >
      <div className="mb-[18px] flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-fg-faint uppercase">Fig.00 — The front door</span>
        {!unlocked && (
          <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-primary uppercase">Psst — the code is {DEMO_CODE}</span>
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
                className="h-16 w-14 rounded-lg border border-border bg-surface-2 text-center font-mono text-2xl font-medium text-foreground caret-primary outline-none transition-colors focus:border-primary focus:bg-[#1C1C1F] disabled:opacity-60"
              />
            ))}
          </div>
          <div
            role="status"
            aria-live="polite"
            className="mt-3.5 min-h-[18px] font-mono text-[11px] font-medium tracking-[0.1em] text-destructive uppercase"
          >
            {error ? "Wrong knock — try again" : state === "submitting" ? "Checking…" : ""}
          </div>
        </>
      ) : (
        <div className="animate-kc-rise text-left">
          <p className="mb-2.5 font-mono text-[11px] font-medium tracking-[0.1em] text-success uppercase">Access granted — come on in</p>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-2 px-3.5 py-3">
            <code className="overflow-x-auto font-mono text-[12.5px] whitespace-nowrap text-muted-foreground">{INSTALL_COMMAND}</code>
            <CopyButton text={INSTALL_COMMAND} className="shrink-0 border-border-strong text-muted-foreground hover:bg-white/10 hover:text-foreground" />
          </div>
          <p className="mt-2.5 text-center text-[13px] text-fg-faint">That&rsquo;s the whole install.</p>
        </div>
      )}
    </div>
  );
}
