"use client";

import { useEffect } from "react";

// /llms.txt is a Route Handler, not a page — it can't be reached via Next's
// client router (redirects()/next/link soft-navigation only resolve app
// pages), and next.config.ts's static export (GitHub Pages) has no server to
// run redirects() at request time either. A hard browser navigation is the
// one thing that works in both the dev server and the exported static build.
export default function LlmsRedirectPage() {
  useEffect(() => {
    window.location.replace("/llms.txt");
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 text-sm text-muted-foreground">
      Redirecting to{" "}
      <a href="/llms.txt" className="text-foreground underline underline-offset-4">
        /llms.txt
      </a>
      …
    </div>
  );
}
