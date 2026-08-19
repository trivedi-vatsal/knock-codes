import { LiveGate } from "@/components/live-gate";
import { HomeCtaButton } from "@/components/home-cta-button";
import { ProofTicker } from "@/components/proof-ticker";
import { HomeSectionHead } from "@/components/home-section-head";
import { HowItWorksSteps } from "@/components/how-it-works-section";
import { HashGenerator } from "@/components/hash-generator";
import { ModeComparisonTable } from "@/components/mode-comparison-table";
import { TemplatesGallery } from "@/components/templates-gallery-section";
import { FaqSection } from "@/components/faq-section";
import { Reveal } from "@/components/reveal";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <header className="relative overflow-hidden px-8 pt-24 pb-20 text-center">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 access-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
          <div className="absolute top-[-10%] left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.12)_0%,rgba(245,158,11,0.02)_50%,transparent_100%)] blur-[70px]" />
        </div>

        <div className="relative mx-auto max-w-[1120px]">
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-primary/[0.04] px-4 py-1.5 shadow-[0_2px_16px_rgba(245,158,11,0.06)] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="font-mono text-[10.5px] font-semibold tracking-[0.16em] text-primary uppercase">
              // Copy-paste. Zero runtime dependencies.
            </span>
          </div>

          <h1 className="mx-auto max-w-[960px] text-[clamp(44px,7.5vw,96px)] leading-[0.95] font-extrabold tracking-[-0.035em]">
            <span className="bg-gradient-to-b from-foreground via-foreground to-muted-foreground/70 bg-clip-text text-transparent">
              Knock, knock.
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-400 via-primary to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              Private previews, secured.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-[640px] text-[17px] leading-relaxed text-muted-foreground/90 sm:text-[18.5px]">
            A password screen you paste into your project. No backend, no npm install, no platform upgrade.
            Set an env var and ship.
          </p>

          <p className="mx-auto mt-3 max-w-[560px] font-mono text-[11px] font-medium tracking-[0.14em] text-fg-faint uppercase">
            For freelancers, agencies, and teams shipping previews to clients
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <HomeCtaButton href="/getting-started">Get started →</HomeCtaButton>
            <HomeCtaButton href="#templates" variant="ghost">
              Browse templates
            </HomeCtaButton>
          </div>

          <div className="relative z-10 mx-auto mt-14 w-full max-w-[480px]">
            <LiveGate />
          </div>
        </div>
      </header>

      <ProofTicker />

      <section className="border-t border-border px-8 py-[96px]">
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
          <Reveal>
            <div id="generator" className="mt-12 scroll-mt-20">
              <HashGenerator />
            </div>
          </Reveal>
        </div>
      </section>

      <section id="templates" className="border-t border-border px-8 py-[96px]">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <HomeSectionHead
              number="02"
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

      <section id="modes" className="border-t border-border px-8 py-[96px]">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <HomeSectionHead
              number="03"
              label="Local vs. server"
              title="Hides the hash, not the children."
              description="Server mode keeps the hash off the client. Anything you already bundled is still in the JavaScript."
            />
          </Reveal>
          <Reveal>
            <ModeComparisonTable />
          </Reveal>
          <Reveal>
            <div className="mt-7">
              <Link
                href="/security"
                className="font-mono text-xs font-medium tracking-[0.1em] text-muted-foreground uppercase transition-colors hover:text-primary"
              >
                Read the security model →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border px-8 py-[96px]">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <HomeSectionHead number="04" label="FAQ" title="Common questions" />
          </Reveal>
          <Reveal>
            <FaqSection />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border px-8 py-[96px] text-center">
        <Reveal className="mx-auto max-w-[1120px]">
          <span className="mb-5 block font-mono text-[11px] font-medium tracking-[0.14em] uppercase">
            <b className="font-medium text-primary">05</b>
            <span className="text-fg-faint"> / Ship it</span>
          </span>
          <h2 className="text-[clamp(34px,5vw,56px)] leading-[1.1] font-medium tracking-[-0.025em]">Ready to lock something down?</h2>
          <p className="mx-auto mt-4 max-w-[420px] text-muted-foreground">Pick a template, copy the file, wire a hash. Ship it in minutes.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <HomeCtaButton href="/getting-started">Get started</HomeCtaButton>
            <HomeCtaButton href="#templates" variant="ghost">
              Browse templates
            </HomeCtaButton>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
