import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Template } from "@/lib/templates";
import { AccessPanelCard } from "@/components/access-panel-card";
import { TemplateCardPreview } from "@/components/template-card-preview";
import { getHtmlTemplateSource } from "@/lib/html-templates";

const MODE_LABEL: Record<NonNullable<Template["mode"]>, string> = {
  local: "Local mode",
  server: "Server mode",
  both: "Local / Server",
};

const PREVIEW_HEIGHT = 240;

export function TemplateCard({ template }: { template: Template }) {
  const extension = template.language === "html" ? "html" : "tsx";
  const filename = `${template.registryName}.${extension}`;

  return (
    <Link href={`/templates/${template.slug}`} className="group block h-full">
      <AccessPanelCard className="h-full hover:border-primary/50 hover:bg-card">
        <div>
          {/* Framed Window Preview with Mini IDE Chrome */}
          <div className="mb-5 overflow-hidden rounded-lg border border-border/80 bg-muted/20 shadow-sm transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-md">
            <div className="flex items-center justify-between border-b border-border/60 bg-muted/60 px-3.5 py-2 font-mono text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-400/80 dark:bg-red-500/80" />
                  <span className="h-2 w-2 rounded-full bg-amber-400/80 dark:bg-amber-500/80" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400/80 dark:bg-emerald-500/80" />
                </div>
                <span className="ml-1 truncate font-medium text-foreground/85">{filename}</span>
              </div>
              {template.mode && (
                <span className="rounded border border-border/60 bg-background/80 px-1.5 py-0.5 text-[9px] font-medium tracking-wider uppercase text-muted-foreground">
                  {MODE_LABEL[template.mode]}
                </span>
              )}
            </div>

            <div
              className="pointer-events-none relative w-full select-none overflow-hidden transition-transform duration-300 group-hover:scale-[1.015] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              style={{ height: PREVIEW_HEIGHT }}
            >
              {template.language === "html" ? (
                <iframe
                  srcDoc={getHtmlTemplateSource(template.registryName)}
                  title={`${template.title} preview`}
                  tabIndex={-1}
                  className="h-full w-full border-0"
                />
              ) : (
                <TemplateCardPreview slug={template.slug} />
              )}
            </div>
          </div>

          {/* Title & Description */}
          <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {template.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {template.description}
          </p>

          {/* Badges */}
          {(template.useCase || template.complexity) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {template.useCase && (
                <span className="inline-flex items-center rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-xs font-medium text-primary">
                  {template.useCase}
                </span>
              )}
              {template.complexity && (
                <span className="inline-flex items-center rounded-md border border-border/80 bg-muted/50 px-2 py-0.5 font-mono text-xs text-muted-foreground">
                  {template.complexity}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
          <div className="flex flex-wrap gap-1.5">
            {template.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded border border-border/70 bg-muted/30 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
            View template
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </AccessPanelCard>
    </Link>
  );
}

