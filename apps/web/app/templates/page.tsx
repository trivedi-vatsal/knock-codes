import type { Metadata } from "next";
import { SectionHeader } from "@/components/section-header";
import { TemplateCard } from "@/components/template-card";
import { getAllTemplates } from "@/lib/templates";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Templates — Knock Codes",
  "Complete, single-file restricted-access screens, ready to copy."
);

export default function TemplatesPage() {
  const templates = getAllTemplates();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <SectionHeader
        label="Templates"
        title="The access screen, done for you"
        description="This is the product: a complete, single-file restricted-access screen — background, card, form, support link, footer, and the verification logic all in one component. Pick a style, copy it, wire a hash, ship it."
        className="mb-8"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {templates.map((template) => (
          <TemplateCard key={template.slug} template={template} />
        ))}
      </div>
    </div>
  );
}
