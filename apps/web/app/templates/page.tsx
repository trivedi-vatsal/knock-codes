import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { SectionHeader } from "@/components/section-header";
import { TemplateCard } from "@/components/template-card";
import { Reveal } from "@/components/reveal";
import { HomeCtaButton } from "@/components/home-cta-button";
import { CodeViewer } from "@/components/code-viewer";
import { getAllTemplates } from "@/lib/templates";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = pageMetadata(
  "Templates — Knock Codes",
  "Complete, single-file access screens, ready to copy."
);

const CONTRACT_SNIPPET = `expectedHash | verify   // exactly one required
children                // rendered when unlocked
remember, labels, className`;

export default function TemplatesPage() {
  const templates = getAllTemplates();

  return (
    <div>
      <PageHeader
        eyebrow="Complete single-file screens"
        title={
          <>
            Multiple looks, <span className="text-primary">one contract.</span>
          </>
        }
        description="Every template ships as a complete, single-file access screen — background, card, form, support link, footer, and verification logic. Pick a style, copy the file, wire a hash, ship it."
      >
        <HomeCtaButton href="#gallery">Browse templates</HomeCtaButton>
        <HomeCtaButton href="/getting-started" variant="ghost">
          Get started
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
            <p className="mb-6 text-sm text-muted-foreground">
              Four React templates and one plain-HTML file — same idea, zero build.
            </p>
          </Reveal>
          <Reveal>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {templates.map((template) => (
                <TemplateCard key={template.slug} template={template} />
              ))}
            </div>
          </Reveal>
          <Reveal>
            <p className="mt-8 text-sm text-muted-foreground">
              Prefer assembling your own layout?{" "}
              <Link href="/blocks" className="font-medium text-primary hover:underline">
                Build from blocks
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border px-8 py-14">
        <div className="mx-auto max-w-[480px] text-left">
          <p className="label-mono mb-3 text-center text-muted-foreground">The shared contract</p>
          <CodeViewer code={CONTRACT_SNIPPET} />
        </div>
      </section>
    </div>
  );
}
