import Link from "next/link";
import { REPO_URL, AUTHOR_SITE_URL, AUTHOR_GITHUB_URL } from "@/lib/site";
import { getTemplateSetVersion } from "@/lib/version";

const COLUMNS: { heading: string; links: { href: string; label: string; external?: boolean }[] }[] = [
  {
    heading: "Product",
    links: [
      { href: "/templates", label: "Templates" },
      { href: "/blocks", label: "Blocks" },
      { href: "/getting-started", label: "Getting Started" },
      { href: "/security", label: "Security" },
      { href: "/changelog", label: "Changelog" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { href: "/llms.txt", label: "llms.txt" },
      { href: REPO_URL, label: "GitHub", external: true },
      { href: `${REPO_URL}/blob/main/LICENSE`, label: "MIT license", external: true },
    ],
  },
  {
    heading: "Author",
    links: [
      { href: AUTHOR_SITE_URL, label: "vatsal.xyz", external: true },
      { href: AUTHOR_GITHUB_URL, label: "Author on GitHub", external: true },
    ],
  },
];

export function SiteFooter() {
  const version = getTemplateSetVersion();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <p className="max-w-md text-sm text-muted-foreground">
          Knock Codes is copy-owned, dependency-free access control. Local mode is deterrence, not
          protection — server mode is one prop away.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-3">
          {COLUMNS.map((column) => (
            <div key={column.heading}>
              <p className="label-mono mb-3 text-muted-foreground">{column.heading}</p>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noreferrer" className="label-mono text-primary hover:underline">
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="label-mono text-primary hover:underline">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
          <p className="label-mono text-muted-foreground">
            © {year} Vatsal Trivedi · MIT licensed
          </p>
          <Link href="/changelog" className="label-mono text-muted-foreground hover:text-foreground">
            v{version}
          </Link>
        </div>
      </div>
    </footer>
  );
}
