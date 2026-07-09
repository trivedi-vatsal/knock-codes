import { BlueprintFrame } from "@/components/blueprint-frame";

interface TemplateNotesSectionProps {
  accessibility: string;
  customization: string;
}

export function TemplateNotesSection({ accessibility, customization }: TemplateNotesSectionProps) {
  return (
    <section className="mb-10">
      <BlueprintFrame label="Notes" className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="label-mono text-muted-foreground">Accessibility</p>
          <p className="text-sm text-muted-foreground">{accessibility}</p>
        </div>
        <div className="space-y-2">
          <p className="label-mono text-muted-foreground">Customization</p>
          <p className="text-sm text-muted-foreground">{customization}</p>
        </div>
      </BlueprintFrame>
    </section>
  );
}
