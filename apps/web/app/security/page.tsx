import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { SectionHeader } from "@/components/section-header";
import { BlueprintFrame } from "@/components/blueprint-frame";
import { CodeBrowser } from "@/components/code-browser";
import { Reveal } from "@/components/reveal";
import { HomeCtaButton } from "@/components/home-cta-button";
import { getServerTemplates } from "@/lib/server-templates";
import { THREAT_MODEL_COPY } from "@/lib/copy";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Security model — Knock Codes",
  "The honest threat model behind Knock Codes: what local mode does and doesn't protect against, when to upgrade to server mode, and what belongs behind real auth instead."
);

const COMPARISON_ROWS = [
  {
    label: "Where the check happens",
    local: "In the visitor's browser, against a hash you shipped in the client bundle.",
    server: "On your server or edge function, against a hash that never reaches the browser.",
  },
  {
    label: "What a curious visitor can see",
    local: "The full SHA-256 hash, in DevTools → Sources/Network, for anyone who looks.",
    server: "Nothing — only a pass/fail response and a short-lived token on success.",
  },
  {
    label: "Can it be brute-forced offline?",
    local: "Yes — the hash is public, so guessing is only limited by compute, not by your app.",
    server: "No — guesses have to go through your endpoint, where you can rate-limit them.",
  },
  {
    label: "Rate limiting",
    local: "Not possible — there's no request to limit.",
    server: "Yes — the reference templates cap attempts per identifier per time window.",
  },
  {
    label: "Setup",
    local: "None. Paste a template, drop in a hash.",
    server: "One prop swap (`expectedHash` → `verify`) plus a small endpoint you deploy.",
  },
  {
    label: "Best for",
    local: "Keeping casual visitors, crawlers, and forwarded links off a preview.",
    server: "Anywhere a determined visitor bypassing the gate would actually matter.",
  },
];

const APPROPRIATE = [
  "A client preview or staging deploy you don't want indexed or casually forwarded.",
  "A private beta or \"coming soon\" screen with no real per-user permissions.",
  "An internal dashboard or tool where everyone with the code is already trusted.",
  "A launch checklist or demo you want gone in minutes, not wired into your auth system.",
];

const INAPPROPRIATE = [
  "Paid content — a shared code has no concept of \"did this visitor pay.\"",
  "Private user data — anything scoped to one person needs real accounts, not a shared code.",
  "Admin authorization or any real write path — pair with your actual auth system instead.",
  "Compliance-sensitive data (health, financial, PII at rest) — local mode's hash is public by design.",
];

const RECOMMENDATIONS = [
  "Rate-limit by a stable identifier (IP, or a header your edge/CDN sets) — every reference template below caps attempts per window and returns the same response shape for \"rate-limited\" and \"errored\" so neither is distinguishable to a client.",
  "Use a shared store for the counter the moment you run more than one instance — an in-memory Map (as in the Next.js/Express/Hono/Azure examples) only works for a single-instance deployment; swap in Redis, Vercel KV, or the equivalent before scaling out.",
  "Log failed attempts with a timestamp and identifier, never the submitted code or its hash — you want to notice a spike, not build a wordlist of your own visitors' guesses.",
  "Keep issued tokens short-lived and signed (the templates default to 5 minutes) — a long-lived token turns one successful guess into indefinite access.",
  "Rotate KNOCK_CODES_SERVER_HASH and KNOCK_CODES_TOKEN_SECRET the same way you'd rotate any other secret if either might have leaked.",
];

export default function SecurityPage() {
  const serverTemplates = getServerTemplates();

  return (
    <div>
      <PageHeader
        eyebrow="Threat model & defense"
        title={
          <>
            The honest <span className="text-primary">security model.</span>
          </>
        }
        description={THREAT_MODEL_COPY}
      >
        <HomeCtaButton href="#comparison">Compare modes</HomeCtaButton>
        <HomeCtaButton href="#recommendations" variant="ghost">
          Rate limiting & logging
        </HomeCtaButton>
      </PageHeader>

      <section className="px-8 py-20">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <SectionHeader
              number="01"
              label="Local mode"
              title="What local mode actually does"
              description="Client-side SHA-256 verification and session storage trade-offs."
              className="mb-10"
            />
          </Reveal>
          <Reveal>
            <BlueprintFrame label="Local mode details">
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Every default template and block verifies a code against a SHA-256 hash you pass as{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">expectedHash</code>. That comparison runs entirely
                in the visitor&apos;s browser — there&apos;s no server, no network round trip, nothing to stand up. The
                trade-off: the hash itself ships in your client JavaScript bundle. Anyone who opens DevTools can read it,
                copy it, and run it through an offline cracker at their leisure. Local mode was never designed to survive
                that — it&apos;s a velvet rope for people who won&apos;t open DevTools in the first place, which is most
                visitors, most of the time.
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                The optional <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">remember=&quot;session&quot;</code> prop
                works the same way: it stores an unlock marker in sessionStorage so a reload skips the gate for the rest
                of that tab&apos;s session. It&apos;s client-side persistence, clearable from DevTools or a private
                window — not a security boundary, just a convenience on top of the same trust model.
              </p>
            </BlueprintFrame>
          </Reveal>
        </div>
      </section>

      <section id="comparison" className="border-t border-border px-8 py-20">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <SectionHeader
              number="02"
              label="Compare"
              title="Local mode vs. server mode"
              description="A side-by-side breakdown of verification location, visibility, brute-force protection, and setup."
              className="mb-10"
            />
          </Reveal>
          <Reveal>
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 font-mono text-xs text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Dimension</th>
                    <th className="px-4 py-3 font-medium">Local mode</th>
                    <th className="px-4 py-3 font-medium">Server mode</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row) => (
                    <tr key={row.label} className="border-b border-border last:border-0 align-top">
                      <td className="px-4 py-3 font-medium text-foreground">{row.label}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.local}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.server}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border px-8 py-20">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <SectionHeader
              number="03"
              label="Use cases"
              title="Where Knock Codes belongs"
              description="When a shared restricted access screen fits your use case, and when to require user accounts."
              className="mb-10"
            />
          </Reveal>
          <Reveal>
            <BlueprintFrame label="Evaluation matrix" className="grid gap-8 sm:grid-cols-2">
              <div className="space-y-3">
                <p className="font-mono text-xs font-medium tracking-wider text-primary uppercase">Appropriate</p>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  {APPROPRIATE.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true" className="text-primary font-bold">
                        +
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <p className="font-mono text-xs font-medium tracking-wider text-destructive uppercase">Not appropriate</p>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  {INAPPROPRIATE.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true" className="text-destructive font-bold">
                        −
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </BlueprintFrame>
          </Reveal>
        </div>
      </section>

      <section id="reference-server-code" className="border-t border-border px-8 py-20 scroll-mt-20">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <SectionHeader
              number="04"
              label="Server mode"
              title="Upgrading to server verification"
              description="Swap expectedHash for a verify function pointing at one of these reference endpoints — same markup, same component, one prop different."
              className="mb-10"
            />
          </Reveal>
          <Reveal>
            <BlueprintFrame label="Reference implementation">
              <CodeBrowser files={serverTemplates.map((t) => ({ path: t.filename, content: t.code }))} />
            </BlueprintFrame>
          </Reveal>
        </div>
      </section>

      <section id="recommendations" className="border-t border-border px-8 py-20">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <SectionHeader
              number="05"
              label="Recommendations"
              title="Rate limiting and logging"
              description="Best practices for running server-mode verification endpoints in production."
              className="mb-10"
            />
          </Reveal>
          <Reveal>
            <div className="rounded-lg border border-border bg-card p-6">
              <ul className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                {RECOMMENDATIONS.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="text-primary font-bold">
                      →
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border px-8 py-24 text-center">
        <Reveal className="mx-auto max-w-[1120px]">
          <span className="mb-5 block font-mono text-[11px] font-medium tracking-[0.14em] uppercase">
            <b className="font-medium text-primary">06</b>
            <span className="text-fg-faint"> / Ship securely</span>
          </span>
          <h2 className="text-[clamp(30px,4.5vw,48px)] leading-[1.1] font-medium tracking-[-0.025em]">
            Ready to set up server verification?
          </h2>
          <p className="mx-auto mt-4 max-w-[480px] text-muted-foreground">
            Follow our 5-minute quickstart or pick a complete reference template.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <HomeCtaButton href="/getting-started">Setup guide</HomeCtaButton>
            <HomeCtaButton href="/templates" variant="ghost">
              Browse templates
            </HomeCtaButton>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

