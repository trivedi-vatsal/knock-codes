import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The reference's `.btn`/`.btn-primary`/`.btn-ghost` — used only by the
 * homepage (hero + CTA band), which is why it isn't `buttonVariants`: those
 * variants don't have this exact hover lift / border-strong ghost treatment.
 */
export function HomeCtaButton({
  href,
  variant = "primary",
  children,
}: {
  href: string;
  variant?: "primary" | "ghost";
  children: ReactNode;
}) {
  const className = cn(
    "inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-all",
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:-translate-y-px hover:bg-[#FBB02D]"
      : "border border-border-strong bg-transparent text-foreground hover:border-white/30 hover:bg-white/[0.03]"
  );

  if (href.startsWith("#")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
