"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Fade-up-once section entrance. Adds `.kc-in-view` (see globals.css'
 * `.kc-reveal`) the first time the wrapped element crosses the viewport,
 * then disconnects — no repeat/ambient replay on re-scroll. Under
 * `prefers-reduced-motion: reduce` the CSS itself renders the element fully
 * visible regardless of `.kc-in-view`, so skipping the observer there isn't
 * necessary for correctness, only for saving the (trivial) work.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      // threshold 0 fires as soon as any part of the target is visible — a
      // percentage-of-target threshold (e.g. 0.15) breaks for tall targets
      // like a full card grid, since a short viewport can never show enough
      // of it at once to cross that fraction.
      { threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("kc-reveal", inView && "kc-in-view", className)}>
      {children}
    </div>
  );
}
