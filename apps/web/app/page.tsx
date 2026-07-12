import { WorkspaceSimulator } from "@/components/workspace-simulator";
import { HomeCtaButton } from "@/components/home-cta-button";
import { ProofTicker } from "@/components/proof-ticker";
import { HomeSectionHead } from "@/components/home-section-head";
import { HowItWorksSteps } from "@/components/how-it-works-section";
import { ProblemCards } from "@/components/problem-section";
import { BentoGrid } from "@/components/bento-section";
import { ModeComparisonTable } from "@/components/mode-comparison-table";
import { TemplatesGallery } from "@/components/templates-gallery-section";
import { StatsBand } from "@/components/stats-band";
import { FaqSection } from "@/components/faq-section";
import { CodeViewer } from "@/components/code-viewer";
import { Reveal } from "@/components/reveal";
import Link from "next/link";

const HERO_SNIPPET = `<KnockCodes expectedHash={process.env.NEXT_PUBLIC_KNOCK_HASH}>
  <YourApp />
</KnockCodes>`;

export default function Home() {
  return (
    <div>
      <header className="relative overflow-hidden px-8 pt-24 pb-28 text-center">
        {/* Background Grid and Glowing Mesh */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          {/* Dots grid with radial fade mask */}
          <div className="absolute inset-0 access-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
          {/* Accent mesh glows for ultimate premium dark mode */}
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 h-[600px] w-[1000px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.12)_0%,rgba(245,158,11,0.02)_50%,transparent_100%)] blur-[70px]" />
          <div className="absolute top-[30%] left-[calc(50%-400px)] h-[400px] w-[800px] rounded-full bg-primary/[0.04] blur-[90px] animate-pulse" style={{ animationDuration: "14s" }} />
          <div className="absolute top-[40%] left-[calc(50%+200px)] h-[350px] w-[600px] rounded-full bg-success/[0.02] blur-[80px] animate-pulse" style={{ animationDuration: "18s" }} />
        </div>

        <div className="relative mx-auto max-w-[1120px]">
          {/* Top Pill Badge */}
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/[0.04] backdrop-blur-md px-4 py-1.5 shadow-[0_2px_16px_rgba(245,158,11,0.06)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            <span className="font-mono text-[10.5px] font-semibold tracking-[0.16em] text-primary uppercase">
              // Zero runtime dependencies. One single file.
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-[clamp(44px,7.5vw,96px)] font-extrabold leading-[0.95] tracking-[-0.035em] max-w-[960px] mx-auto">
            <span className="bg-gradient-to-b from-foreground via-foreground to-muted-foreground/70 bg-clip-text text-transparent">
              Knock, knock.
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-primary to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              Private previews, secured.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-7 max-w-[640px] text-[17px] sm:text-[18.5px] text-muted-foreground/90 leading-relaxed">
            A password screen for anything you deploy — one React file you paste into your project. No backend, no npm install, no platform upgrade. Set an env var and ship.
          </p>

          {/* Audience anchor */}
          <p className="mx-auto mt-3 max-w-[560px] font-mono text-[11px] font-medium tracking-[0.14em] text-fg-faint uppercase">
            For freelancers, agencies, and teams shipping previews to clients
          </p>

          {/* Call-to-action buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <HomeCtaButton href="/getting-started">Get started →</HomeCtaButton>
            <HomeCtaButton href="#templates" variant="ghost">
              Browse templates
            </HomeCtaButton>
          </div>
          <div className="mt-3">
            <Link
              href="/security"
              className="font-mono text-xs font-medium tracking-[0.1em] text-muted-foreground uppercase transition-colors hover:text-primary"
            >
              Read the security model →
            </Link>
          </div>

          {/* Canonical usage snippet */}
          <div className="mx-auto mt-6 mb-16 max-w-[480px] w-full text-left">
            <CodeViewer code={HERO_SNIPPET} filename="app.tsx" />
          </div>

          {/* Workspace Simulator Mockup */}
          <div className="relative mx-auto max-w-[850px] w-full z-10">
            <WorkspaceSimulator />
          </div>

          {/* Monospace Quick Features under mockup */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3.5 border-t border-border/40 pt-8 max-w-[700px] mx-auto select-none">
            <div className="flex items-center gap-2 font-mono text-[11px] text-fg-faint uppercase tracking-wider">
              <span className="text-primary font-bold">✓</span> No database needed
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-fg-faint uppercase tracking-wider">
              <span className="text-primary font-bold">✓</span> Under 100 lines of code
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-fg-faint uppercase tracking-wider">
              <span className="text-primary font-bold">✓</span> SSR & Edge compatible
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-fg-faint uppercase tracking-wider">
              <span className="text-primary font-bold">✓</span> Local SHA-256 signatures
            </div>
          </div>
        </div>
      </header>

      <ProofTicker />

      <section className="border-t border-border px-8 py-[120px]">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <HomeSectionHead
              number="01"
              label="How it works"
              title="Three steps, no infrastructure."
              description="Copy a file, generate a hash, wrap your app. Ship it."
            />
          </Reveal>
          <Reveal>
            <HowItWorksSteps />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border px-8 py-[120px]">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <HomeSectionHead
              number="02"
              label="The problem"
              title={<>&ldquo;Just don&rsquo;t share the link&rdquo; is not a plan.</>}
              description="Unfinished work leaks in boring, predictable ways. None of them require a hacker."
            />
          </Reveal>
          <Reveal>
            <div className="mb-10 max-w-[640px] rounded-lg border border-border/60 bg-surface-2/40 px-5 py-4 text-sm leading-relaxed text-muted-foreground">
              <span className="font-mono text-[10px] font-semibold tracking-[0.14em] text-primary uppercase">Before you reach for this — </span>
              If your host already has password protection and it fits, use that. Knock Codes is for when it doesn&rsquo;t exist, costs a plan upgrade, or the gate needs to live in your own code.
            </div>
          </Reveal>
          <Reveal>
            <ProblemCards />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border px-8 py-[120px]">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <HomeSectionHead
              number="03"
              label="The answer"
              title="The whole product, in one file."
              description="Background, card, form, and verification logic — nothing to install, nothing to maintain, nothing phoning home."
            />
          </Reveal>
          <Reveal>
            <BentoGrid />
          </Reveal>
          <Reveal>
            <div className="mt-16">
              <p className="mb-4 font-mono text-[11px] font-medium tracking-[0.14em] text-fg-faint uppercase">
                Local mode vs. server mode, in brief
              </p>
              <ModeComparisonTable />
            </div>
          </Reveal>
        </div>
      </section>

      <section id="templates" className="border-t border-border px-8 py-[120px]">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <HomeSectionHead
              number="04"
              label="Templates"
              title="Multiple looks, one contract."
              description="Pick the screen, wire a hash, ship it. Every template speaks the same props."
            />
          </Reveal>
          <Reveal>
            <TemplatesGallery />
          </Reveal>
          <Reveal>
            <div className="mt-7">
              <Link
                href="/templates"
                className="font-mono text-xs font-medium tracking-[0.1em] text-muted-foreground uppercase transition-colors hover:text-primary"
              >
                View all templates →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="numbers" className="border-t border-border px-8 py-[120px]">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <HomeSectionHead number="05" label="By the numbers" title="Small enough to audit over coffee." />
          </Reveal>
          <Reveal>
            <StatsBand />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border px-8 py-[120px]">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <HomeSectionHead number="06" label="FAQ" title="Common questions" />
          </Reveal>
          <Reveal>
            <FaqSection />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border px-8 py-[120px] text-center">
        <Reveal className="mx-auto max-w-[1120px]">
          <span className="mb-5 block font-mono text-[11px] font-medium tracking-[0.14em] uppercase">
            <b className="font-medium text-primary">07</b>
            <span className="text-fg-faint"> / Ship it</span>
          </span>
          <h2 className="text-[clamp(34px,5vw,56px)] leading-[1.1] font-medium tracking-[-0.025em]">Ready to lock something down?</h2>
          <p className="mx-auto mt-4 max-w-[420px] text-muted-foreground">Pick a template, copy the file, wire a hash. Ship it in minutes.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <HomeCtaButton href="#templates">Browse templates</HomeCtaButton>
            <HomeCtaButton href="/security" variant="ghost">
              Read the security model
            </HomeCtaButton>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
