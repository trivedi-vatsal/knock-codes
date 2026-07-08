import type { Metadata } from "next";
import { SectionHeader } from "@/components/section-header";
import { TemplateCard } from "@/components/template-card";
import { getAllTemplates } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Templates — Access Gate",
  description: "Complete, single-file restricted-access screens, ready to copy.",
};

export default function TemplatesPage() {
  const templates = getAllTemplates();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <SectionHeader
        label="Templates"
        title="Complete screens, one file each"
        description="Where Blocks are small composable primitives, Templates are the whole experience — background, card, form, support link, footer — in a single component. Copy it, wire a hash, ship it."
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
