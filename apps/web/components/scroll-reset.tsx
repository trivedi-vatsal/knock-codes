"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } else {
      const id = window.location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "instant" });
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleHashClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      }
    };

    document.addEventListener("click", handleHashClick);
    return () => document.removeEventListener("click", handleHashClick);
  }, []);

  return null;
}
