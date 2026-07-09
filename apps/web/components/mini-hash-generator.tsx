"use client";

import { useState } from "react";
import { sha256Hex } from "@knock-codes/core";
import { CopyButton } from "@/components/copy-button";

/** The bento's FIG.04 cell — reference's lean "type a code, get its hash" tool, using the same sha256Hex every template verifies against. */
export function MiniHashGenerator() {
  const [value, setValue] = useState("");
  const [hash, setHash] = useState("");

  const run = async () => {
    if (!value.trim()) return;
    setHash(await sha256Hex(value));
  };

  return (
    <div className="flex flex-col">
      <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-fg-faint uppercase">Fig.04 — Hash generator</span>
      <h3 className="mt-4 text-base font-semibold tracking-[-0.01em]">Make a hash right here</h3>
      <div className="mt-4 flex gap-2.5">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") void run();
          }}
          placeholder="Type a code (PIN or passphrase)…"
          aria-label="Code to hash"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-md border border-border bg-surface-2 px-3 py-2.5 font-mono text-[13px] text-foreground outline-none transition-colors focus:border-primary"
        />
        <button
          type="button"
          onClick={() => void run()}
          className="shrink-0 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-[#FBB02D]"
        >
          Hash it
        </button>
      </div>
      {hash && (
        <div className="mt-3 flex items-center justify-between gap-2.5 overflow-hidden rounded-md border border-success/20 bg-success-dim px-3 py-2.5">
          <span className="overflow-hidden font-mono text-xs text-ellipsis whitespace-nowrap text-success">{hash}</span>
          <CopyButton text={hash} className="shrink-0 border-success/35 text-success hover:bg-success/10 hover:text-success" />
        </div>
      )}
      <p className="mt-2.5 text-xs text-fg-faint">Runs entirely in your browser. Nothing is sent anywhere.</p>
    </div>
  );
}
