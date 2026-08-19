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
  "Composable React blocks for building custom access screens."
);

export default function BlocksPage() {
  const blocks = getAllBlocks();
  const categories = getBlockCategories();

  return (
    <div>
      <PageHeader
        eyebrow="Composable React blocks"
        title={
          <>
            Building something <span className="text-primary">custom?</span>
          </>
        }
        description="A Template gets you shipped in one file. If you'd rather assemble your own layout, these are the 16 tested React blocks our templates are built from — preview live, copy source, or install via shadcn CLI."
      >
        <HomeCtaButton href="#gallery">Explore blocks</HomeCtaButton>
        <HomeCtaButton href="/templates" variant="ghost">
          Single-file templates
        </HomeCtaButton>
      </PageHeader>

      <section id="gallery" className="px-8 py-20">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <SectionHeader
              number="01"
              label="Blocks"
              title="16 building blocks"
              description="From access screens and PIN inputs to layout wrappers, modals, and session indicators — built on the same tiny core as the templates, installable via the shadcn CLI or copy-paste."
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
    </div>
  );
}
