import Link from "next/link";
import { REPO_URL, AUTHOR_SITE_URL, AUTHOR_GITHUB_URL } from "@/lib/site";
import { getTemplateSetVersion } from "@/lib/version";

const COLUMNS: {
  heading: string;
  links: { href: string; label: string; external?: boolean }[];
}[] = [
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
      { href: REPO_URL, label: "GitHub", external: true },
      { href: "/llms.txt", label: "llms.txt" },
      {
        href: `${REPO_URL}/blob/main/LICENSE`,
        label: "MIT License",
        external: true,
      },
    ],
  },
  {
    heading: "Author",
    links: [
      { href: AUTHOR_SITE_URL, label: "vatsal.xyz", external: true },
      { href: AUTHOR_GITHUB_URL, label: "GitHub profile", external: true },
    ],
  },
];

export function SiteFooter() {
  const version = getTemplateSetVersion();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border pt-20">
      <div className="mx-auto max-w-[1120px] px-8">
        <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-12 pb-[72px] max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-9">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2.5 font-mono text-sm font-medium tracking-tight text-foreground"
            >
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-sm bg-primary shadow-[0_0_12px_rgba(245,158,11,0.5)]"
              />
              knock.codes
            </Link>
            <p className="mt-4 max-w-[300px] text-[13.5px] leading-[1.6] text-muted-foreground">
              Copy-owned, dependency-free access screens. Local mode is
              deterrence, not protection — server mode is one prop away.
            </p>
          </div>
          {COLUMNS.map((column) => (
            <div key={column.heading}>
              <span className="mb-[18px] block font-mono text-[11px] font-medium tracking-[0.14em] text-fg-faint uppercase">
                {column.heading}
              </span>
              {column.links.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block py-[5px] text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block py-[5px] text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-[1] mx-auto max-w-[1120px] px-8">
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-border py-[22px]">
          <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-fg-faint uppercase">
            © {year} Vatsal Trivedi — MIT licensed
          </span>
          <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-fg-faint uppercase">
            <span
              aria-hidden="true"
              className="mr-2 inline-block h-[7px] w-[7px] rounded-full bg-success shadow-[0_0_8px_rgba(74,222,128,0.6)] align-[1px]"
            />
            All systems local · v{version}
          </span>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="text-center font-mono text-[clamp(80px,16vw,220px)] leading-[0.8] font-medium tracking-[-0.04em] text-transparent select-none [-webkit-text-stroke:1px_rgba(250,250,250,0.06)]"
      >
        knock.codes
      </div>
    </footer>
  );
}
