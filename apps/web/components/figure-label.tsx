import { cn } from "@/lib/utils";

/**
 * Technical-editorial annotation for live demos — "FIG.01" straddling the
 * top-left corner of a preview canvas, motion.dev-style. Purely a label;
 * carries no numbering logic of its own beyond zero-padding `index`.
 */
export function FigureLabel({
  index,
  title,
  className,
}: {
  index: number;
  title?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "label-mono pointer-events-none inline-flex items-center gap-1.5 text-[10px] text-current opacity-70",
        className
      )}
    >
      FIG.{String(index).padStart(2, "0")}
      {title && <span className="opacity-70">— {title}</span>}
    </span>
  );
}
