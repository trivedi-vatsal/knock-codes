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
import { ThemeLabRoot } from "@/components/customizer/theme-lab-root";
import { CodeBrowser } from "@/components/code-browser";
import { TemplatePreview } from "@/components/template-preview";
import { HashGenerator } from "@/components/hash-generator";
import { getAllTemplates, getTemplateBySlug } from "@/lib/templates";
import { getBlockBySlug } from "@/lib/blocks";
import { getRegistryItemSource, resolveRegistryDependencies } from "@/lib/registry";
import { getHtmlTemplateSource } from "@/lib/html-templates";
import { getServerTemplates } from "@/lib/server-templates";
import { THREAT_MODEL_COPY } from "@/lib/copy";
import { CopyButton } from "@/components/copy-button";
import { pageMetadata } from "@/lib/seo";

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

  return (
    <ThemeLabRoot>
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 space-y-3">
        <p className="label-mono text-primary">→ Template</p>
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

      <div className="mb-10">
        <HashGenerator />
      </div>

      <section className="mb-10">
        <BlueprintFrame label="Installation">
          {isHtml ? (
            <>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">Add this file to your project</h2>
              <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
                No CLI, no npm install, no build step — copy the file below (or use the Code tab in the preview above)
                into your project as a plain <code className="rounded bg-muted px-1 py-0.5 text-xs">.html</code> file
                and open it directly.
              </p>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
                <code className="flex-1 text-xs text-foreground">{template.registryName}.html</code>
                <CopyButton text={htmlSource ?? ""} />
              </div>
            </>
          ) : (
            <>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
                Add this template to your project
              </h2>
              <InstallationPanel
                registryName={template.registryName}
                ownFiles={source.map((f) => ({ path: f.path, target: f.target, type: "registry:file" }))}
                dependencyItems={dependencies}
              />
            </>
          )}

          <div className="mt-6 border-t border-border pt-6">
            <p className="label-mono mb-1.5 text-muted-foreground">Installing via an AI agent?</p>
            <p className="mb-3 text-sm text-muted-foreground">
              Drop <code className="rounded bg-muted px-1 py-0.5 text-xs">AGENTS.md</code> into your project root — it
              instructs any coding agent to hash the code locally, write only the hash, and confirm the plaintext never
              touched a file. Thin pointer files exist for tools that read a different filename.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <a href="/agent-specs/AGENTS.md" target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">
                AGENTS.md
              </a>
              <a href="/agent-specs/CLAUDE.md" target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">
                CLAUDE.md
              </a>
              <a href="/agent-specs/GEMINI.md" target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">
                GEMINI.md
              </a>
              <a href="/agent-specs/cursor/knock-codes.mdc" target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">
                .cursor/rules/knock-codes.mdc
              </a>
              <a
                href="/agent-specs/github/copilot-instructions.md"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary hover:underline"
              >
                .github/copilot-instructions.md
              </a>
            </div>
          </div>
        </BlueprintFrame>
      </section>

      {template.props.length > 0 && (
        <section className="mb-10 space-y-4">
          <SectionHeader label="Props" title="API reference" />
          <PropsTable props={template.props} />
        </section>
      )}

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

      <section className="mb-10">
        <BlueprintFrame label="Threat model">
          <h2 className="mb-3 text-xl font-semibold tracking-tight text-foreground">The honest version</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">{THREAT_MODEL_COPY}</p>
        </BlueprintFrame>
      </section>

      <section className="mb-10">
        <BlueprintFrame label="Server mode">
          <h2 className="mb-2 text-xl font-semibold tracking-tight text-foreground">Need real protection?</h2>
          <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
            {isHtml ? (
              <>
                Local mode is deterrence — the hash lives right in the script tag. Point the form&apos;s fetch call
                at one of these endpoints instead of comparing hashes in the browser, and the code is checked
                server-side — same markup, no local hash to read.
              </>
            ) : (
              <>
                Local mode is deterrence — the hash ships in your client bundle by design. Swap the{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">expectedHash</code> prop for a{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">verify</code> function pointing at one of
                these, and the code is checked server-side instead — same markup, same component, one prop
                different.
              </>
            )}{" "}
            Each template rate-limits attempts and returns a short-lived signed token on success.
          </p>
          <CodeBrowser files={serverTemplates.map((t) => ({ path: t.filename, content: t.code }))} />
        </BlueprintFrame>
      </section>

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
