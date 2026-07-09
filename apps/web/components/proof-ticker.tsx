import Link from "next/link";

const PROOFS = [
  { text: "1 file" },
  { text: "0 dependencies" },
  { text: "MIT licensed" },
  { text: "Host-agnostic" },
  { text: "Nothing phones home" },
  { text: "No backend" },
  { text: "Copy-owned" },
  { text: "No lock-in" },
  { text: "Built for AI", href: "/llms.txt" },
];

/** Full-bleed marquee of the proof props — two copies back to back, scrolled exactly one copy-width for a seamless loop. */
export function ProofTicker() {
  const track = [...PROOFS, ...PROOFS];

  return (
    <div aria-hidden="true" className="relative overflow-hidden border-t border-border py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[120px] bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[120px] bg-gradient-to-l from-background to-transparent" />
      <div className="flex w-max animate-kc-ticker gap-12">
        {track.map((proof, index) => {
          if (proof.href) {
            return (
              <Link
                key={index}
                href={proof.href}
                tabIndex={-1}
                className="group pointer-events-auto flex items-center"
              >
                <span className="flex items-center gap-12 font-mono text-[11px] font-medium tracking-[0.14em] whitespace-nowrap text-fg-faint group-hover:text-foreground transition-colors">
                  {proof.text}
                  <span className="text-primary">•</span>
                </span>
              </Link>
            );
          }

          return (
            <span
              key={index}
              className="flex items-center gap-12 font-mono text-[11px] font-medium tracking-[0.14em] whitespace-nowrap text-fg-faint"
            >
              {proof.text}
              <span className="text-primary">•</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
