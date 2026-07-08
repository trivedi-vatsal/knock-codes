import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Template } from "@/lib/templates";
import { AccessPanelCard } from "@/components/access-panel-card";
import { TemplateCardPreview } from "@/components/template-card-preview";
import { getHtmlTemplateSource } from "@/lib/html-templates";

const MODE_LABEL: Record<NonNullable<Template["mode"]>, string> = {
  local: "Local mode",
  server: "Server mode",
  both: "Local or server",
};

const PREVIEW_HEIGHT = 208;

export function TemplateCard({ template }: { template: Template }) {
  return (
    <Link href={`/templates/${template.slug}`} className="block">
      <AccessPanelCard serial={template.registryName} className="h-full hover:border-primary/40 hover:bg-accent/30">
        <div>
          {template.language === "html" ? (
            <div
              aria-hidden="true"
              className="pointer-events-none relative mb-4 select-none overflow-hidden rounded-md border border-border bg-muted/20"
              style={{ height: PREVIEW_HEIGHT }}
            >
              <iframe
                srcDoc={getHtmlTemplateSource(template.registryName)}
                title={`${template.title} preview`}
                tabIndex={-1}
                className="h-full w-full border-0"
              />
            </div>
          ) : (
            <TemplateCardPreview slug={template.slug} />
          )}
          <h3 className="text-base font-semibold text-foreground">{template.title}</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">{template.description}</p>
          {(template.useCase || template.complexity || template.mode) && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {template.useCase && (
                <span className="label-mono rounded border border-primary/30 bg-primary/5 px-1.5 py-0.5 text-primary">
                  {template.useCase}
                </span>
              )}
              {template.complexity && (
                <span className="label-mono rounded border border-border px-1.5 py-0.5 text-muted-foreground">
                  {template.complexity}
                </span>
              )}
              {template.mode && (
                <span className="label-mono rounded border border-border px-1.5 py-0.5 text-muted-foreground">
                  {MODE_LABEL[template.mode]}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {template.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="label-mono rounded border border-border px-1.5 py-0.5 text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
      </AccessPanelCard>
    </Link>
  );
}
