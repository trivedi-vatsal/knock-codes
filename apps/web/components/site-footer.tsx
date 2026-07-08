import Link from "next/link";

const REPO_URL = "https://github.com/trivedi-vatsal/knock-codes";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Knock Codes is copy-owned, dependency-free access control. Local mode is deterrence, not
          protection — server mode is one prop away.
        </p>
        <div className="flex shrink-0 flex-wrap items-center gap-4">
          <Link href="/getting-started" className="label-mono text-primary hover:underline">
            How it works
          </Link>
          <Link href="/security" className="label-mono text-primary hover:underline">
            Security model
          </Link>
          <Link href="/changelog" className="label-mono text-primary hover:underline">
            Changelog
          </Link>
          <a href={REPO_URL} target="_blank" rel="noreferrer" className="label-mono text-primary hover:underline">
            GitHub
          </a>
          <a href={`${REPO_URL}/blob/main/LICENSE`} target="_blank" rel="noreferrer" className="label-mono text-primary hover:underline">
            MIT license
          </a>
          <a href="https://github.com/trivedi-vatsal" target="_blank" rel="noreferrer" className="label-mono text-primary hover:underline">
            Author
          </a>
        </div>
      </div>
    </footer>
  );
}
