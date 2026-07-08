import { CopyButton } from "./copy-button";
import type { RegistryFile, RegistryItem } from "@/lib/registry";

export function InstallationPanel({
  registryName,
  ownFiles,
  dependencyItems,
}: {
  registryName: string;
  ownFiles: RegistryFile[];
  dependencyItems: RegistryItem[];
}) {
  const command = `npx shadcn@latest add http://localhost:3000/r/react/${registryName}.json`;
  const allFiles = [...dependencyItems.flatMap((item) => item.files), ...ownFiles];

  return (
    <div className="space-y-4">
      <div>
        <p className="label-mono mb-2 text-muted-foreground">CLI (run against your local dev server)</p>
        <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-[#0b1220] px-3 py-2">
          <code className="overflow-x-auto text-xs whitespace-nowrap text-[#e5eaf3]">{command}</code>
          <CopyButton text={command} className="shrink-0 border-white/15 text-white/70 hover:bg-white/10 hover:text-white" />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Replace the host with your deployed Access Gate URL once published. Not running the site locally?
          Use the manual copy below instead.
        </p>
      </div>

      {dependencyItems.length > 0 && (
        <div>
          <p className="label-mono mb-2 text-muted-foreground">Also installs</p>
          <ul className="flex flex-wrap gap-1.5">
            {dependencyItems.map((item) => (
              <li key={item.name} className="label-mono rounded border border-border px-2 py-1 text-muted-foreground">
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="label-mono mb-2 text-muted-foreground">Files created ({allFiles.length})</p>
        <ul className="space-y-1 font-mono text-xs text-muted-foreground">
          {allFiles.map((file) => (
            <li key={file.target}>{file.target}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
