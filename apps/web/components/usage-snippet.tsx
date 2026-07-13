import { SectionHeader } from "@/components/section-header";
import { CodeViewer } from "@/components/code-viewer";

/** The minimal composition example shown above the source viewer on every detail page — this item's actual wiring, not the full file dump. */
export function UsageSnippet({ code }: { code: string }) {
  return (
    <section className="mb-10 space-y-4">
      <SectionHeader label="Usage" title="Minimal setup" />
      <CodeViewer code={code} />
    </section>
  );
}
