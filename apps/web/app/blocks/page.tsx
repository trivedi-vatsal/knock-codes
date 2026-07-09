import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { SectionHeader } from "@/components/section-header";
import { BlocksGallery } from "@/components/blocks-gallery";
import { Reveal } from "@/components/reveal";
import { HomeCtaButton } from "@/components/home-cta-button";
import { ThemeLabRoot } from "@/components/customizer/theme-lab-root";
import { getAllBlocks, getBlockCategories } from "@/lib/blocks";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Blocks — Knock Codes",
  "Composable access-control primitives for React, for building something custom."
);

export default function BlocksPage() {
  const blocks = getAllBlocks();
  const categories = getBlockCategories();

  return (
    <div>
      <PageHeader
        eyebrow="Composable React primitives"
        title={
          <>
            Building something <span className="text-primary">custom?</span>
          </>
        }
        description="A Template gets you shipped in one file. If you'd rather assemble your own layout, these are the 16 tested React primitives our templates are built from — preview live, copy source, or install via shadcn CLI."
      >
        <HomeCtaButton href="#gallery">Explore primitives</HomeCtaButton>
        <HomeCtaButton href="/templates" variant="ghost">
          Single-file templates
        </HomeCtaButton>
      </PageHeader>

      <section id="gallery" className="px-8 py-20">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <SectionHeader
              number="01"
              label="Primitive blocks"
              title="16 building blocks"
              description="From access gates and PIN inputs to layout wrappers, modals, and session indicators — built on packages/core and ready for shadcn add."
              className="mb-12"
            />
          </Reveal>
          <Reveal>
            <ThemeLabRoot showLauncher={false}>
              <BlocksGallery blocks={blocks} categories={categories} />
            </ThemeLabRoot>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border px-8 py-24 text-center">
        <Reveal className="mx-auto max-w-[1120px]">
          <span className="mb-5 block font-mono text-[11px] font-medium tracking-[0.14em] uppercase">
            <b className="font-medium text-primary">02</b>
            <span className="text-fg-faint"> / Fast path</span>
          </span>
          <h2 className="text-[clamp(30px,4.5vw,48px)] leading-[1.1] font-medium tracking-[-0.025em]">
            Want the whole screen in one file?
          </h2>
          <p className="mx-auto mt-4 max-w-[480px] text-muted-foreground">
            Skip block assembly and drop a complete, ready-to-ship access screen into your codebase with one file.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <HomeCtaButton href="/templates">Browse templates</HomeCtaButton>
            <HomeCtaButton href="/security" variant="ghost">
              Security model
            </HomeCtaButton>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

