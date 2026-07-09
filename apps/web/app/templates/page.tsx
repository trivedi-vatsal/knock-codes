import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { SectionHeader } from "@/components/section-header";
import { TemplateCard } from "@/components/template-card";
import { Reveal } from "@/components/reveal";
import { HomeCtaButton } from "@/components/home-cta-button";
import { getAllTemplates } from "@/lib/templates";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Templates — Knock Codes",
  "Complete, single-file restricted-access screens, ready to copy."
);

export default function TemplatesPage() {
  const templates = getAllTemplates();

  return (
    <div>
      <PageHeader
        eyebrow="Complete single-file screens"
        title={
          <>
            Four looks, <span className="text-primary">one contract.</span>
          </>
        }
        description="Every template ships as a complete, single-file restricted-access screen — background, card, form, support link, footer, and verification logic. Pick a style, copy the file, wire a hash, ship it."
      >
        <HomeCtaButton href="#gallery">Browse templates</HomeCtaButton>
        <HomeCtaButton href="/blocks" variant="ghost">
          Build from blocks
        </HomeCtaButton>
      </PageHeader>

      <section id="gallery" className="px-8 py-20">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <SectionHeader
              number="01"
              label="Reference screens"
              title="Pick your screen"
              description="Each template implements the exact same props and verification contract. Preview one live, copy the source file, or adapt it with AI."
              className="mb-12"
            />
          </Reveal>
          <Reveal>
            <div className="grid gap-8 md:grid-cols-2">
              {templates.map((template) => (
                <TemplateCard key={template.slug} template={template} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border px-8 py-24 text-center">
        <Reveal className="mx-auto max-w-[1120px]">
          <span className="mb-5 block font-mono text-[11px] font-medium tracking-[0.14em] uppercase">
            <b className="font-medium text-primary">02</b>
            <span className="text-fg-faint"> / Custom layout</span>
          </span>
          <h2 className="text-[clamp(30px,4.5vw,48px)] leading-[1.1] font-medium tracking-[-0.025em]">
            Need something custom?
          </h2>
          <p className="mx-auto mt-4 max-w-[480px] text-muted-foreground">
            If you prefer assembling your own layout instead of using a single-file template, explore our 16 composable React blocks.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <HomeCtaButton href="/blocks">Explore blocks</HomeCtaButton>
            <HomeCtaButton href="/getting-started" variant="ghost">
              Quickstart guide
            </HomeCtaButton>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

