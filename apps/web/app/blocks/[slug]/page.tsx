import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/section-header";
import { PropsTable } from "@/components/props-table";
import { RelatedContent } from "@/components/related-content";
import { BlockPreview } from "@/components/block-preview";
import { PreviewPanel } from "@/components/preview-panel";
import { UsageSnippet } from "@/components/usage-snippet";
import { ThemeLabRoot } from "@/components/customizer/theme-lab-root";
import { BlockInstallationSection } from "@/components/block-installation-section";
import { TemplateNotesSection } from "@/components/template-notes-section";
import { TemplateSecuritySection } from "@/components/template-security-section";
import { getAllBlocks, getBlockBySlug } from "@/lib/blocks";
import { getTemplatesUsingBlock } from "@/lib/templates";
import { getRegistryItemSource, resolveRegistryDependencies } from "@/lib/registry";
import { getServerTemplates } from "@/lib/server-templates";
import { AdaptWithAiButton } from "@/components/adapt-with-ai-button";
import { buildBlockAdaptPrompt } from "@/lib/adapt-prompt";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getAllBlocks().map((block) => ({ slug: block.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const block = getBlockBySlug(slug);
  if (!block) return {};
  return pageMetadata(`${block.title} — Knock Codes`, block.description);
}

export default async function BlockDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const block = getBlockBySlug(slug);
  if (!block) notFound();

  const source = getRegistryItemSource(block.registryName);
  const dependencies = resolveRegistryDependencies(block.registryName);
  const ownPaths = new Set(source.map((f) => f.target));
  const allFiles = [
    ...dependencies.flatMap((item) => getRegistryItemSource(item.name)),
    ...source,
  ].map((f) => ({ path: f.target, content: f.content, primary: ownPaths.has(f.target) }));
  const related = (block.relatedBlocks ?? [])
    .map((slug) => getBlockBySlug(slug))
    .filter((b) => b !== undefined);
  const usedInTemplates = getTemplatesUsingBlock(block.slug);
  const serverTemplates = getServerTemplates();
  const primaryPath = allFiles.find((f) => f.primary)?.path ?? `packages/react/${block.registryName}`;
  const adaptPrompt = buildBlockAdaptPrompt(block, primaryPath);

  return (
    <ThemeLabRoot>
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <Link href="/blocks" className="label-mono text-primary transition-colors hover:underline">
            ← Blocks / {block.category}
          </Link>
          <AdaptWithAiButton prompt={adaptPrompt} />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{block.title}</h1>
        <p className="max-w-2xl text-muted-foreground">{block.description}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Badge>{block.category}</Badge>
          {block.tier && (
            <Badge variant="secondary">
              {block.tier === "primary"
                ? "Core Block"
                : block.tier === "alias"
                  ? "Wrapper Alias"
                  : "Utility"}
            </Badge>
          )}
          {block.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        {block.bestUsedFor && (
          <p className="max-w-2xl border-l-2 border-primary pl-3 text-sm text-muted-foreground">
            <span className="label-mono text-primary">Best used for </span>
            {block.bestUsedFor}
          </p>
        )}
      </div>

      {block.content && (
        <div className="prose prose-sm dark:prose-invert mb-8 max-w-none">
          <MDXRemote source={block.content} />
        </div>
      )}

      {block.usageSnippet && <UsageSnippet code={block.usageSnippet} />}

      <div className="mb-10">
        <PreviewPanel preview={<BlockPreview slug={block.slug} />} files={allFiles} badge={block.registryName} />
      </div>

      <BlockInstallationSection
        registryName={block.registryName}
        source={source.map((f) => ({ path: f.path, target: f.target }))}
        dependencies={dependencies}
      />

      <section className="mb-10 space-y-4">
        <SectionHeader label="Props" title="API reference" />
        <PropsTable props={block.props} />
      </section>

      <TemplateNotesSection accessibility={block.accessibility} customization={block.customization} />

      <TemplateSecuritySection isHtml={false} serverTemplates={serverTemplates} />

      {usedInTemplates.length > 0 && (
        <section className="mb-10 space-y-4">
          <SectionHeader
            label="Ready-made"
            title="Used in these templates"
            description="Want the whole screen instead of assembling it yourself? These templates already build on this block."
          />
          <RelatedContent items={usedInTemplates} basePath="/templates" />
        </section>
      )}

      {related.length > 0 && (
        <section className="space-y-4">
          <SectionHeader
            label="Compose with"
            title="Blocks that pair well with this one"
            description="These combine naturally with this block, whether as a shared shell, a shared session, or a common fallback."
          />
          <RelatedContent items={related} />
        </section>
      )}
    </div>
    </ThemeLabRoot>
  );
}
