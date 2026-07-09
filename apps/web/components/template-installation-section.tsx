import { BlueprintFrame } from "@/components/blueprint-frame";
import { InstallationPanel } from "@/components/installation-panel";
import { CopyButton } from "@/components/copy-button";
import type { Template } from "@/lib/templates";
import type { RegistryItem } from "@/lib/registry";

interface TemplateInstallationSectionProps {
  template: Template;
  isHtml: boolean;
  htmlSource: string | null;
  source: { path: string; target: string }[];
  dependencies: RegistryItem[];
}

export function TemplateInstallationSection({
  template,
  isHtml,
  htmlSource,
  source,
  dependencies,
}: TemplateInstallationSectionProps) {
  return (
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
  );
}
