import Link from "next/link";
import { MobileNav } from "@/components/mobile-nav";
import { REPO_URL } from "@/lib/site";
import { getTemplateSetVersion } from "@/lib/version";

const NAV_LINKS = [
  { href: "/templates", label: "Templates" },
  { href: "/blocks", label: "Blocks" },
  { href: "/getting-started", label: "Getting Started" },
  { href: "/security", label: "Security" },
];

export function SiteHeader() {
  const version = getTemplateSetVersion();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/[0.82] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-8">
        <Link href="/" className="flex items-center gap-2.5 font-mono text-sm font-medium tracking-tight text-foreground">
          <span aria-hidden="true" className="h-2 w-2 rounded-sm bg-primary shadow-[0_0_12px_rgba(245,158,11,0.5)]" />
          knock.codes
        </Link>
        <nav className="hidden items-center gap-7 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-[13.5px] text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-5">
          <Link
            href="/changelog"
            className="hidden font-mono text-[11px] font-medium tracking-[0.14em] text-fg-faint uppercase transition-colors hover:text-muted-foreground sm:inline"
          >
            v{version} // MIT
          </Link>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-md border border-border-strong px-3.5 py-[7px] text-[13px] font-medium text-foreground transition-colors hover:border-white/30 hover:bg-white/[0.03] sm:inline-flex"
          >
            GitHub
          </a>
          <MobileNav links={NAV_LINKS} repoUrl={REPO_URL} />
        </div>
      </div>
    </header>
  );
}
