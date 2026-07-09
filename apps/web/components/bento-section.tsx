import Link from "next/link";
import { MiniHashGenerator } from "@/components/mini-hash-generator";

function FigLabel({ children, className = "" }: { children: string; className?: string }) {
  return <span className={`font-mono text-[11px] font-medium tracking-[0.14em] text-fg-faint uppercase ${className}`}>{children}</span>;
}

function CodeChip({ prop, rest }: { prop: string; rest: string }) {
  return (
    <div className="mt-4 w-fit rounded-md border border-border bg-surface-2 px-3 py-2 font-mono text-[12.5px] text-muted-foreground">
      <span className="text-primary">{prop}</span>
      {rest}
    </div>
  );
}

function MiniGatePreview() {
  return (
    <div
      aria-hidden="true"
      className="w-full max-w-[340px] rounded-[10px] border border-border-strong bg-background px-[26px] pt-[26px] pb-[22px] shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
    >
      <div className="mb-[18px] flex items-center gap-2">
        <span className="h-[7px] w-[7px] rounded-sm bg-primary" />
        <span className="h-2 w-16 rounded bg-white/[0.22]" />
      </div>
      <div className="mb-2 h-3 w-[150px] rounded bg-white/[0.32]" />
      <div className="mb-[22px] h-[7px] w-[210px] rounded bg-white/[0.12]" />
      <div className="mb-[18px] flex gap-2">
        <span className="h-[46px] w-10 rounded-md border border-primary bg-surface-2" />
        <span className="h-[46px] w-10 rounded-md border border-primary bg-surface-2" />
        <span className="h-[46px] w-10 rounded-md border border-border bg-surface-2" />
        <span className="h-[46px] w-10 rounded-md border border-border bg-surface-2" />
      </div>
      <div className="flex h-9 items-center justify-center rounded-md bg-primary">
        <span className="h-[7px] w-[84px] rounded bg-[rgba(10,10,11,0.75)]" />
      </div>
    </div>
  );
}

/** The reference's 7-cell bento — a large preview cell, four prop-driven code-chip cells, the live hash generator, and the wide "honest part" quote. */
export function BentoGrid() {
  return (
    <div className="grid grid-cols-4 gap-4 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1">
      <div className="col-span-2 row-span-2 overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-border-strong max-[640px]:col-span-1">
        <div className="flex min-h-[300px] items-center justify-center border-b border-border bg-surface-2 bg-[radial-gradient(ellipse_at_30%_20%,rgba(245,158,11,0.05),transparent_60%)] px-8 py-10">
          <MiniGatePreview />
        </div>
        <div className="px-[26px] pt-[22px] pb-6">
          <FigLabel>Fig.01 — The screen itself</FigLabel>
          <h3 className="mt-5 text-base font-semibold tracking-[-0.01em]">Designed, not defaulted</h3>
          <p className="mt-1.5 text-[13.5px] leading-[1.55] text-muted-foreground">
            Each template is a complete, branded gate — not a browser auth popup or a host&rsquo;s gray password wall.
          </p>
        </div>
      </div>

      <div className="flex flex-col rounded-xl border border-border bg-card p-[26px] transition-colors hover:border-border-strong">
        <FigLabel>Fig.02 — Local mode</FigLabel>
        <CodeChip prop="expectedHash" rest="={hash}" />
        <h3 className="mt-5 text-base font-semibold tracking-[-0.01em]">No server, no round trip</h3>
        <p className="mt-1.5 text-[13.5px] leading-[1.55] text-muted-foreground">The hash is compared entirely client-side. Paste, set an env var, done.</p>
      </div>

      <div className="flex flex-col rounded-xl border border-border bg-card p-[26px] transition-colors hover:border-border-strong">
        <FigLabel>Fig.03 — Server mode</FigLabel>
        <CodeChip prop="verify" rest="={verifyFn}" />
        <h3 className="mt-5 text-base font-semibold tracking-[-0.01em]">One prop from real</h3>
        <p className="mt-1.5 text-[13.5px] leading-[1.55] text-muted-foreground">Swap the hash for an async check against your endpoint. Same markup, real lock.</p>
      </div>

      <div className="col-span-2 rounded-xl border border-border bg-card p-[26px] transition-colors hover:border-border-strong max-[640px]:col-span-1">
        <MiniHashGenerator />
      </div>

      <div className="flex flex-col rounded-xl border border-border bg-card p-[26px] transition-colors hover:border-border-strong">
        <FigLabel>Fig.05 — Session memory</FigLabel>
        <CodeChip prop="remember" rest={'="session"'} />
        <h3 className="mt-5 text-base font-semibold tracking-[-0.01em]">Knock once per visit</h3>
        <p className="mt-1.5 text-[13.5px] leading-[1.55] text-muted-foreground">
          Unlocked state can persist in memory, sessionStorage, or localStorage. Your call.
        </p>
      </div>

      <div className="flex flex-col rounded-xl border border-border bg-card p-[26px] transition-colors hover:border-border-strong">
        <FigLabel>Fig.06 — Timeout</FigLabel>
        <CodeChip prop="timeout" rest="={8000}" />
        <h3 className="mt-5 text-base font-semibold tracking-[-0.01em]">Doors close again</h3>
        <p className="mt-1.5 text-[13.5px] leading-[1.55] text-muted-foreground">Fixed or sliding expiry, so an unlocked tab does not stay unlocked forever.</p>
      </div>

      <div className="col-span-2 rounded-xl border-l-2 border-l-primary bg-[linear-gradient(90deg,var(--accent),transparent_45%),var(--card)] p-[26px] max-[640px]:col-span-1">
        <FigLabel className="text-primary">Fig.07 — The honest part</FigLabel>
        <blockquote className="mt-[18px] text-[17px] leading-[1.5] font-medium tracking-[-0.01em] text-foreground">
          Local mode is a velvet rope, with an optional real lock. It stops casual visitors, crawlers, and forwarded links — not
          anyone who opens DevTools.
        </blockquote>
        <div className="mt-3">
          <Link
            href="/security"
            className="border-b border-border-strong font-mono text-[11px] font-medium tracking-[0.14em] text-fg-faint uppercase transition-colors hover:text-foreground"
          >
            Read the full threat model →
          </Link>
        </div>
      </div>
    </div>
  );
}
