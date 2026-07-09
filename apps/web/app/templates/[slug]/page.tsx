import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/section-header";
import { PropsTable } from "@/components/props-table";
import { RelatedContent } from "@/components/related-content";
import { PreviewPanel } from "@/components/preview-panel";
import { ThemeLabRoot } from "@/components/customizer/theme-lab-root";
import { TemplatePreview } from "@/components/template-preview";
import { TemplateInstallationSection } from "@/components/template-installation-section";
import { TemplateNotesSection } from "@/components/template-notes-section";
import { TemplateSecuritySection } from "@/components/template-security-section";
import { getAllTemplates, getTemplateBySlug } from "@/lib/templates";
import { getBlockBySlug } from "@/lib/blocks";
import { getRegistryItemSource, resolveRegistryDependencies } from "@/lib/registry";
import { getHtmlTemplateSource } from "@/lib/html-templates";
import { getServerTemplates } from "@/lib/server-templates";
import { AdaptWithAiButton } from "@/components/adapt-with-ai-button";
import { pageMetadata } from "@/lib/seo";
import { buildAdaptPrompt } from "@/lib/adapt-prompt";

export function generateStaticParams() {
  return getAllTemplates().map((template) => ({ slug: template.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template) return {};
  return pageMetadata(`${template.title} — Knock Codes`, template.description);
}

export default async function TemplateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template) notFound();

  const isHtml = template.language === "html";
  const htmlSource = isHtml ? getHtmlTemplateSource(template.registryName) : null;
  const source = isHtml ? [] : getRegistryItemSource(template.registryName);
  const dependencies = isHtml ? [] : resolveRegistryDependencies(template.registryName);
  const ownPaths = new Set(source.map((f) => f.target));
  const allFiles = isHtml
    ? [{ path: `${template.registryName}.html`, content: htmlSource ?? "", primary: true }]
    : [...dependencies.flatMap((item) => getRegistryItemSource(item.name)), ...source].map((f) => ({
        path: f.target,
        content: f.content,
        primary: ownPaths.has(f.target),
      }));
  const related = (template.relatedBlocks ?? [])
    .map((blockSlug) => getBlockBySlug(blockSlug))
    .filter((b) => b !== undefined);
  const serverTemplates = getServerTemplates();
  const primaryPath = allFiles.find((f) => f.primary)?.path ?? `packages/react/${template.registryName}`;
  const adaptPrompt = buildAdaptPrompt(template, primaryPath);

  return (
    <ThemeLabRoot>
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <Link href="/templates" className="label-mono text-primary transition-colors hover:underline">
            ← Templates
          </Link>
          <AdaptWithAiButton prompt={adaptPrompt} />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{template.title}</h1>
        <p className="max-w-2xl text-muted-foreground">{template.description}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {template.useCase && <Badge>{template.useCase}</Badge>}
          {template.complexity && <Badge variant="secondary">{template.complexity}</Badge>}
          {template.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
          <Badge variant="outline" className="font-mono">
            v{template.version}
          </Badge>
        </div>
        {template.bestUsedFor && (
          <p className="max-w-2xl border-l-2 border-primary pl-3 text-sm text-muted-foreground">
            <span className="label-mono text-primary">Best used for </span>
            {template.bestUsedFor}
          </p>
        )}
      </div>

      {template.content && (
        <div className="prose prose-sm dark:prose-invert mb-8 max-w-none">
          <MDXRemote source={template.content} />
        </div>
      )}

      <div className="mb-10">
        <PreviewPanel
          preview={
            isHtml ? (
              <iframe srcDoc={htmlSource ?? ""} title={template.title} className="h-full w-full border-0" />
            ) : (
              <TemplatePreview slug={template.slug} />
            )
          }
          files={allFiles}
          badge={template.registryName}
          fillCanvas
        />
      </div>

      <TemplateInstallationSection
        template={template}
        isHtml={isHtml}
        htmlSource={htmlSource}
        source={source}
        dependencies={dependencies}
      />

      {template.props.length > 0 && (
        <section className="mb-10 space-y-4">
          <SectionHeader label="Props" title="API reference" />
          <PropsTable props={template.props} />
        </section>
      )}

      <TemplateNotesSection
        accessibility={template.accessibility}
        customization={template.customization}
      />

      <TemplateSecuritySection
        isHtml={isHtml}
        serverTemplates={serverTemplates}
      />

      {related.length > 0 && (
        <section className="space-y-4">
          <SectionHeader
            label="Compose with"
            title="Blocks this template is built from"
            description="Drop down to these directly once you need more control than the single-file template gives you."
          />
          <RelatedContent blocks={related} />
        </section>
      )}
    </div>
    </ThemeLabRoot>
  );
}
