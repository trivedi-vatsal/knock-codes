import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const NAV_LINKS = [
  { href: "/blocks", label: "Blocks" },
  { href: "/templates", label: "Templates" },
  { href: "/getting-started", label: "Getting Started" },
];

export function SiteHeader() {
  return (
    <header className="bg-[#0b1220] text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" className="label-mono text-white">
          Access Gate
        </Link>
        <nav className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="label-mono text-white/70 hover:text-white">
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
