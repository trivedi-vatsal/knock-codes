import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Access Gate is copy-owned, dependency-free access control. Local mode is deterrence, not
          protection — server mode is one prop away.
        </p>
        <div className="flex shrink-0 items-center gap-4">
          <Link href="/getting-started" className="label-mono text-primary hover:underline">
            How it works
          </Link>
          <Link href="/security" className="label-mono text-primary hover:underline">
            Security model
          </Link>
        </div>
      </div>
    </footer>
  );
}
