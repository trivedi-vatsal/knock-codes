import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

export function CodeViewer({
  code,
  filename,
  wrap = false,
  showCopy = true,
}: {
  code: string;
  filename?: string;
  wrap?: boolean;
  /** Set false when an ancestor (e.g. PreviewPanel) already renders a consolidated copy button. */
  showCopy?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {filename && (
        <div className="label-mono flex items-center justify-between border-b border-border bg-muted/50 px-3 py-1.5 text-muted-foreground">
          {filename}
        </div>
      )}
      <div className="relative access-scanlines bg-[#0e1311]">
        {showCopy && (
          <CopyButton text={code} className="absolute top-2 right-2 border-white/15 text-white/70 hover:bg-white/10 hover:text-white" />
        )}
        <pre
          className={cn(
            "max-h-[32rem] overflow-auto p-4 text-xs leading-relaxed text-[#edeae0]",
            wrap && "whitespace-pre-wrap break-words"
          )}
        >
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
