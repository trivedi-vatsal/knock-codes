import { LiveGate } from "@/components/live-gate";
import { HomeCtaButton } from "@/components/home-cta-button";
import { ProofTicker } from "@/components/proof-ticker";
import { HomeSectionHead } from "@/components/home-section-head";
import { ProblemCards } from "@/components/problem-section";
import { BentoGrid } from "@/components/bento-section";
import { ModeComparisonTable } from "@/components/mode-comparison-table";
import { TemplatesGallery } from "@/components/templates-gallery-section";
import { Reveal } from "@/components/reveal";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <header className="relative px-8 pt-[108px] pb-24 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[-120px] left-1/2 h-[560px] w-[900px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.07)_0%,rgba(250,250,250,0.02)_40%,transparent_70%)]"
        />
        <div className="relative mx-auto max-w-[1120px]">
          <div className="mb-7">
            <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-fg-faint uppercase">
              // Copy-paste access screens for private previews
            </span>
          </div>
          <h1 className="text-[clamp(56px,9.5vw,132px)] font-medium leading-[0.98] tracking-[-0.035em]">
            Knock,
            <br />
            <span className="text-primary">knock.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-[480px] text-[17px] text-muted-foreground">
            A single-file &ldquo;enter a code to continue&rdquo; screen with verification built in. Copy it into
            your project, set one env var, ship.
          </p>

          <LiveGate />

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <HomeCtaButton href="#templates">Browse templates</HomeCtaButton>
            <HomeCtaButton href="/security" variant="ghost">
              Read the security model
            </HomeCtaButton>
          </div>
        </div>
      </header>

      <ProofTicker />

      <section className="border-t border-border px-8 py-[120px]">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <HomeSectionHead
              number="01"
              label="The problem"
              title={<>&ldquo;Just don&rsquo;t share the link&rdquo; is not a plan.</>}
              description="Unfinished work leaks in boring, predictable ways. None of them require a hacker."
            />
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
              number="02"
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
              number="03"
              label="Templates"
              title="Four looks, one contract."
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
    </div>
  );
}
