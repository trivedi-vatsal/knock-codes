import Link from "next/link";
import { getAllTemplates } from "@/lib/templates";

const FEATURED_SLUGS = ["branded-access", "knock-codes", "minimal-access", "modal-access"] as const;

const MODE_LABEL: Record<string, string> = { local: "Local mode", server: "Server mode", both: "Local or server" };

function primaryTag(tags: string[]): string {
  const tag = tags.find((t) => t !== "template") ?? tags[0] ?? "";
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}

function Bar({ className = "" }: { className?: string }) {
  return <span className={`h-1.5 rounded-[3px] bg-white/[0.18] ${className}`} />;
}

function SplitSketch() {
  return (
    <div className="flex h-[72%] w-[78%] overflow-hidden rounded-lg border border-border-strong bg-background">
      <div className="w-[42%] border-r border-border bg-[linear-gradient(160deg,rgba(245,158,11,0.25),rgba(245,158,11,0.05))]" />
      <div className="flex flex-1 flex-col justify-center gap-1.5 p-3.5">
        <Bar className="w-2/5" />
        <Bar className="w-[70%]" />
        <Bar className="w-[55%]" />
        <span className="mt-1 h-4 w-3/5 rounded-[3px] bg-primary/70" />
      </div>
    </div>
  );
}

function SegmentedSketch() {
  return (
    <div className="flex w-[66%] flex-col items-center gap-2 rounded-lg border border-border-strong bg-background p-4">
      <Bar className="w-[55%]" />
      <div className="flex gap-1.5">
        {Array.from({ length: 4 }, (_, i) => (
          <span key={i} className="block h-5 w-4 rounded border border-border-strong bg-surface-2" />
        ))}
      </div>
      <span className="h-4 w-4/5 rounded-[3px] bg-primary/70" />
    </div>
  );
}

function MinimalSketch() {
  return (
    <div className="flex w-3/5 flex-col gap-2 rounded-lg border border-border-strong bg-background p-4">
      <Bar className="w-[55%]" />
      <span className="h-[18px] rounded border border-border-strong bg-surface-2" />
      <span className="h-4 w-full rounded-[3px] bg-primary/70" />
    </div>
  );
}

function ModalSketch() {
  return (
    <>
      <div className="absolute inset-3.5 rounded-lg bg-[repeating-linear-gradient(0deg,rgba(250,250,250,0.05)_0px,rgba(250,250,250,0.05)_2px,transparent_2px,transparent_9px)] blur-[1.5px]" />
      <div className="relative flex w-[56%] flex-col gap-1.5 rounded-lg border border-border-strong bg-background p-3.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
        <Bar className="w-[55%]" />
        <span className="h-4 rounded border border-border-strong bg-surface-2" />
        <span className="h-4 w-[70%] rounded-[3px] bg-primary/70" />
      </div>
    </>
  );
}

const SKETCHES: Record<string, () => React.ReactElement> = {
  "branded-access": SplitSketch,
  "knock-codes": SegmentedSketch,
  "minimal-access": MinimalSketch,
  "modal-access": ModalSketch,
};

/** The reference's four `.tcard`s, with real titles/descriptions/tags/routes pulled from content/templates/*.mdx instead of placeholder copy. */
export function TemplatesGallery() {
  const bySlug = new Map(getAllTemplates().map((t) => [t.slug, t]));
  const templates = FEATURED_SLUGS.map((slug) => bySlug.get(slug)).filter((t) => t !== undefined);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {templates.map((template) => {
        const Sketch = SKETCHES[template.slug];
        return (
          <Link
            key={template.slug}
            href={`/templates/${template.slug}`}
            className="flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-border-strong"
          >
            <div className="relative flex h-[170px] items-center justify-center overflow-hidden border-b border-border bg-surface-2">
              {Sketch && <Sketch />}
            </div>
            <div className="flex flex-1 flex-col px-5 pt-[18px] pb-5">
              <h3 className="text-[15px] font-semibold tracking-[-0.01em]">{template.title.replace(" Template", "")}</h3>
              <p className="my-[5px] flex-1 text-[13px] leading-[1.5] text-muted-foreground">{template.description}</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded border border-border px-2 py-[3px] font-mono text-[10px] tracking-[0.1em] text-fg-faint uppercase">
                  {primaryTag(template.tags)}
                </span>
                {template.mode && (
                  <span className="rounded border border-border px-2 py-[3px] font-mono text-[10px] tracking-[0.1em] text-fg-faint uppercase">
                    {MODE_LABEL[template.mode]}
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
