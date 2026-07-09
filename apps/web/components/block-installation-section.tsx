import { BlueprintFrame } from "@/components/blueprint-frame";
import { InstallationPanel } from "@/components/installation-panel";
import type { RegistryItem } from "@/lib/registry";

interface BlockInstallationSectionProps {
  registryName: string;
  source: { path: string; target: string }[];
  dependencies: RegistryItem[];
}

export function BlockInstallationSection({
  registryName,
  source,
  dependencies,
}: BlockInstallationSectionProps) {
  return (
    <section className="mb-10">
      <BlueprintFrame label="Installation">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
          Add this block to your project
        </h2>
        <InstallationPanel
          registryName={registryName}
          ownFiles={source.map((f) => ({ path: f.path, target: f.target, type: "registry:file" }))}
          dependencyItems={dependencies}
        />
      </BlueprintFrame>
    </section>
  );
}
