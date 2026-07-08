import { CopyButton } from "./copy-button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { RegistryFile, RegistryItem } from "@/lib/registry";

function CommandBlock({ command }: { command: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-[#0e1311] px-3 py-2">
      <code className="overflow-x-auto text-xs whitespace-nowrap text-[#edeae0]">{command}</code>
      <CopyButton text={command} className="shrink-0 border-white/15 text-white/70 hover:bg-white/10 hover:text-white" />
    </div>
  );
}

export function InstallationPanel({
  registryName,
  ownFiles,
  dependencyItems,
}: {
  registryName: string;
  ownFiles: RegistryFile[];
  dependencyItems: RegistryItem[];
}) {
  const deployedOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const localCommand = `npx shadcn@latest add http://localhost:3000/r/react/${registryName}.json`;
  const deployedCommand = deployedOrigin ? `npx shadcn@latest add ${deployedOrigin}/r/react/${registryName}.json` : null;
  const allFiles = [...dependencyItems.flatMap((item) => item.files), ...ownFiles];

  return (
    <div className="space-y-4">
      <div>
        <p className="label-mono mb-2 text-muted-foreground">CLI</p>
        {deployedCommand ? (
          <Tabs defaultValue="deployed">
            <TabsList>
              <TabsTrigger value="deployed">Deployed docs site</TabsTrigger>
              <TabsTrigger value="local">Local dev</TabsTrigger>
            </TabsList>
            <TabsContent value="deployed">
              <CommandBlock command={deployedCommand} />
            </TabsContent>
            <TabsContent value="local">
              <CommandBlock command={localCommand} />
            </TabsContent>
          </Tabs>
        ) : (
          <>
            <CommandBlock command={localCommand} />
            <p className="mt-2 text-xs text-muted-foreground">
              Running this site somewhere other than localhost? Set{" "}
              <code className="rounded bg-muted px-1 py-0.5">NEXT_PUBLIC_SITE_URL</code> and this command switches to
              that host automatically.
            </p>
          </>
        )}
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

      <div className="rounded-lg border border-dashed border-border p-3">
        <p className="label-mono mb-1.5 text-muted-foreground">No CLI? Copy the files by hand</p>
        <ol className="list-decimal space-y-1 pl-4 text-xs text-muted-foreground">
          <li>Open the Code tab in the preview above.</li>
          <li>Create each path listed below in your project and paste its contents in.</li>
          <li>Do the same for anything listed under &ldquo;Also installs&rdquo;, if present.</li>
        </ol>
      </div>
    </div>
  );
}
