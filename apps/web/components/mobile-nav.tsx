"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { isCurrentPath } from "@/components/primary-nav";
import { cn } from "@/lib/utils";

export function MobileNav({
  links,
  repoUrl,
  version,
}: {
  links: { href: string; label: string }[];
  repoUrl: string;
  version: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const root = rootRef.current;
    const focusables = () =>
      Array.from(root?.querySelectorAll<HTMLElement>("a[href], button") ?? []).filter(
        (el) => !el.hasAttribute("disabled")
      );

    focusables()[1]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground transition-colors hover:bg-white/[0.03]"
      >
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
      </button>
      {open && (
        <nav id={panelId} className="absolute inset-x-0 top-full border-t border-border bg-background px-8 py-4">
          <ul className="flex flex-col gap-4">
            {links.map((link) => {
              const current = isCurrentPath(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "block text-sm transition-colors hover:text-foreground",
                      current ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/changelog"
                onClick={() => setOpen(false)}
                aria-current={pathname === "/changelog" ? "page" : undefined}
                className={cn(
                  "block text-sm transition-colors hover:text-foreground",
                  pathname === "/changelog" ? "text-foreground" : "text-muted-foreground"
                )}
              >
                Changelog · v{version}
              </Link>
            </li>
            <li>
              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
