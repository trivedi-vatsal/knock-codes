import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/section-header";
import { PropsTable } from "@/components/props-table";
import { InstallationPanel } from "@/components/installation-panel";
import { RelatedContent } from "@/components/related-content";
import { BlockPreview } from "@/components/block-preview";
import { PreviewPanel } from "@/components/preview-panel";
import { BlueprintFrame } from "@/components/blueprint-frame";
import { getAllBlocks, getBlockBySlug } from "@/lib/blocks";
import { getRegistryItemSource, resolveRegistryDependencies } from "@/lib/registry";

export function generateStaticParams() {
  return getAllBlocks().map((block) => ({ slug: block.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const block = getBlockBySlug(slug);
  if (!block) return {};
  return { title: `${block.title} — Access Gate`, description: block.description };
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

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 space-y-3">
        <p className="label-mono text-primary">→ {block.category}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{block.title}</h1>
        <p className="max-w-2xl text-muted-foreground">{block.description}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {block.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {block.content && (
        <div className="prose prose-sm dark:prose-invert mb-8 max-w-none">
          <MDXRemote source={block.content} />
        </div>
      )}

      <div className="mb-10">
        <PreviewPanel preview={<BlockPreview slug={block.slug} />} files={allFiles} badge={block.registryName} />
      </div>

      <section className="mb-10">
        <BlueprintFrame label="Installation">
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
            Add this block to your project
          </h2>
          <InstallationPanel
            registryName={block.registryName}
            ownFiles={source.map((f) => ({ path: f.path, target: f.target, type: "registry:file" }))}
            dependencyItems={dependencies}
          />
        </BlueprintFrame>
      </section>

      <section className="mb-10 space-y-4">
        <SectionHeader label="Props" title="API reference" />
        <PropsTable props={block.props} />
      </section>

      <section className="mb-10">
        <BlueprintFrame label="Notes" className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="label-mono text-muted-foreground">Accessibility</p>
            <p className="text-sm text-muted-foreground">{block.accessibility}</p>
          </div>
          <div className="space-y-2">
            <p className="label-mono text-muted-foreground">Customization</p>
            <p className="text-sm text-muted-foreground">{block.customization}</p>
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
