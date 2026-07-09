import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { REPO_URL } from "@/lib/site";
import { getTemplateSetVersion } from "@/lib/version";

const NAV_LINKS = [
  { href: "/getting-started", label: "Getting Started" },
  { href: "/templates", label: "Templates" },
  { href: "/blocks", label: "Blocks" },
  { href: "/security", label: "Security" },
];

export function SiteHeader() {
  const version = getTemplateSetVersion();

  return (
    <header className="border-b border-[#26302b] bg-[#0e1311] text-[#edeae0]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="label-mono flex items-center gap-2 text-[#edeae0]">
          <span aria-hidden="true" className="status-dot" data-tone="signal" />
          Knock Codes
        </Link>
        <nav className="flex items-center gap-6">
          <span className="label-mono hidden text-[#edeae0]/40 lg:inline">// Open Source // MIT</span>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="label-mono text-[#edeae0]/70 hover:text-[#edeae0]">
              {link.label}
            </Link>
          ))}
          <a href={REPO_URL} target="_blank" rel="noreferrer" className="label-mono text-[#edeae0]/70 hover:text-[#edeae0]">
            GitHub
          </a>
          <Link
            href="/changelog"
            className="label-mono rounded border border-[#26302b] px-1.5 py-0.5 text-[#edeae0]/70 hover:border-[#4fd1c5]/40 hover:text-[#edeae0]"
          >
            v{version}
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
