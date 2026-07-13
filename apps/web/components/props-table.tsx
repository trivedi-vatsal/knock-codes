import type { BlockProp } from "@/lib/blocks";

export function PropsTable({ props }: { props: BlockProp[] }) {
  if (props.length === 0) {
    return <p className="text-sm text-muted-foreground">This block takes no props.</p>;
  }

  const hasEitherOr = props.some((p) => p.name === "expectedHash") && props.some((p) => p.name === "verify");

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="label-mono border-b border-border bg-muted/50 text-muted-foreground">
              <th className="px-3 py-2 font-medium">Prop</th>
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Default</th>
              <th className="px-3 py-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {props.map((prop) => (
              <tr key={prop.name} className="border-b border-border last:border-0">
                <td className="px-3 py-2 align-top font-mono text-xs">
                  {prop.name}
                  {prop.required && <span className="text-primary"> *</span>}
                </td>
                <td className="px-3 py-2 align-top font-mono text-xs text-muted-foreground">{prop.type}</td>
                <td className="px-3 py-2 align-top font-mono text-xs text-muted-foreground">{prop.default ?? "—"}</td>
                <td className="px-3 py-2 align-top text-muted-foreground">{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasEitherOr && (
        <p className="mt-2 text-xs text-muted-foreground">
          Exactly one of <code className="rounded bg-muted px-1 py-0.5">expectedHash</code> or{" "}
          <code className="rounded bg-muted px-1 py-0.5">verify</code> is required.
        </p>
      )}
    </div>
  );
}
