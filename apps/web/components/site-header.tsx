import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const NAV_LINKS = [
  { href: "/templates", label: "Templates" },
  { href: "/blocks", label: "Blocks" },
  { href: "/security", label: "Security" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-[#26302b] bg-[#0e1311] text-[#edeae0]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="label-mono flex items-center gap-2 text-[#edeae0]">
          <span aria-hidden="true" className="status-dot" data-tone="signal" />
          Knock Codes
        </Link>
        <nav className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="label-mono text-[#edeae0]/70 hover:text-[#edeae0]">
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
