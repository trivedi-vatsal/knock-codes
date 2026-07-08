"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Shuffle } from "lucide-react";
import { sha256Hex } from "@knock-codes/core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { BlueprintFrame } from "@/components/blueprint-frame";
import { generatePin, weaknessWarning, buildSnippets } from "@/lib/pin-generator";

function SnippetRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="label-mono w-16 shrink-0 text-muted-foreground">{label}</span>
      <code className="min-w-0 flex-1 truncate rounded-md border border-border bg-muted/40 px-2.5 py-1.5 text-xs text-foreground">
        {value}
      </code>
      <CopyButton text={value} />
    </div>
  );
}

/**
 * The site's own code → hash tool, embedded directly on each template page —
 * generate or type a code, get its hash, copy the env line. Nothing here
 * leaves the browser; hashing goes through the same `sha256Hex` every
 * template and block verifies against.
 */
export function HashGenerator() {
  const [pin, setPin] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [hash, setHash] = useState("");

  useEffect(() => {
    if (!pin) {
      setHash("");
      return;
    }
    let cancelled = false;
    sha256Hex(pin).then((value) => {
      if (!cancelled) setHash(value);
    });
    return () => {
      cancelled = true;
    };
  }, [pin]);

  const warning = weaknessWarning(pin);
  const snippets = hash ? buildSnippets(hash) : null;

  return (
    <BlueprintFrame label="Hash your code">
      <h2 className="mb-1.5 text-xl font-semibold tracking-tight text-foreground">Generate a hash</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Fully client-side — the plaintext code never leaves this page, and never touches a file. Only the
        hash below gets pasted into your project.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Input
            type={revealed ? "text" : "password"}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Type a code (PIN or passphrase)…"
            autoComplete="off"
            aria-label="Access code"
            className="pr-9"
          />
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            aria-label={revealed ? "Hide code" : "Show code"}
            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>
        <Button type="button" variant="outline" onClick={() => setPin(generatePin())}>
          <Shuffle className="h-3.5 w-3.5" /> Generate one
        </Button>
      </div>

      {warning && (
        <p role="status" className="mt-2 text-xs text-amber-600 dark:text-amber-400">
          {warning}
        </p>
      )}

      {hash && snippets && (
        <div className="mt-5 space-y-2 border-t border-border pt-4">
          <SnippetRow label="Hash" value={hash} />
          <SnippetRow label=".env" value={snippets.generic} />
          <SnippetRow label="Vite" value={snippets.vite} />
          <SnippetRow label="Next.js" value={snippets.nextjs} />
        </div>
      )}
    </BlueprintFrame>
  );
}
