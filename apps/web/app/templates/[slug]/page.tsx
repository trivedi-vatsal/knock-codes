import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/section-header";
import { PropsTable } from "@/components/props-table";
import { InstallationPanel } from "@/components/installation-panel";
import { RelatedContent } from "@/components/related-content";
import { PreviewPanel } from "@/components/preview-panel";
import { BlueprintFrame } from "@/components/blueprint-frame";
import { TemplatePreview } from "@/components/template-preview";
import { getAllTemplates, getTemplateBySlug } from "@/lib/templates";
import { getBlockBySlug } from "@/lib/blocks";
import { getRegistryItemSource, resolveRegistryDependencies } from "@/lib/registry";

export function generateStaticParams() {
  return getAllTemplates().map((template) => ({ slug: template.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template) return {};
  return { title: `${template.title} — Access Gate`, description: template.description };
}

export default async function TemplateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template) notFound();

  const source = getRegistryItemSource(template.registryName);
  const dependencies = resolveRegistryDependencies(template.registryName);
  const ownPaths = new Set(source.map((f) => f.target));
  const allFiles = [
    ...dependencies.flatMap((item) => getRegistryItemSource(item.name)),
    ...source,
  ].map((f) => ({ path: f.target, content: f.content, primary: ownPaths.has(f.target) }));
  const related = (template.relatedBlocks ?? [])
    .map((blockSlug) => getBlockBySlug(blockSlug))
    .filter((b) => b !== undefined);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 space-y-3">
        <p className="label-mono text-primary">→ Template</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{template.title}</h1>
        <p className="max-w-2xl text-muted-foreground">{template.description}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {template.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {template.content && (
        <div className="prose prose-sm dark:prose-invert mb-8 max-w-none">
          <MDXRemote source={template.content} />
        </div>
      )}

      <div className="mb-10">
        <PreviewPanel
          preview={<TemplatePreview slug={template.slug} />}
          files={allFiles}
          badge={template.registryName}
          fillCanvas
        />
      </div>

      <section className="mb-10">
        <BlueprintFrame label="Installation">
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
            Add this template to your project
          </h2>
          <InstallationPanel
            registryName={template.registryName}
            ownFiles={source.map((f) => ({ path: f.path, target: f.target, type: "registry:file" }))}
            dependencyItems={dependencies}
          />
        </BlueprintFrame>
      </section>

      <section className="mb-10 space-y-4">
        <SectionHeader label="Props" title="API reference" />
        <PropsTable props={template.props} />
      </section>

      <section className="mb-10">
        <BlueprintFrame label="Notes" className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="label-mono text-muted-foreground">Accessibility</p>
            <p className="text-sm text-muted-foreground">{template.accessibility}</p>
          </div>
          <div className="space-y-2">
            <p className="label-mono text-muted-foreground">Customization</p>
            <p className="text-sm text-muted-foreground">{template.customization}</p>
          </div>
        </BlueprintFrame>
      </section>

      {related.length > 0 && (
        <section className="space-y-4">
          <SectionHeader label="Related" title="Related blocks" />
          <RelatedContent blocks={related} />
        </section>
      )}
    </div>
  );
}
