import path from "node:path";
import type { NextConfig } from "next";
import { resolveSiteUrl } from "./lib/site-url.ts";

const isGithubPages = process.env.GITHUB_PAGES === "true";

// A misconfigured production deploy previously shipped localhost install
// commands to real visitors (NEXT_PUBLIC_SITE_URL unset, no fallback). Fail
// the build outright rather than let that regress silently again.
if (process.env.NODE_ENV === "production" && resolveSiteUrl().includes("localhost")) {
  throw new Error(
    `NEXT_PUBLIC_SITE_URL resolves to "${resolveSiteUrl()}" for a production build. Unset it to use the ` +
      `https://knock.codes default, or point it at the real deployed origin — never localhost.`
  );
}

const nextConfig: NextConfig = {
  transpilePackages: ["@knock-codes/core", "@knock-codes/react"],
  turbopack: {
    // Repo root is two levels up (apps/web -> apps -> knock-codes) — pin it
    // explicitly so Turbopack doesn't have to guess across the workspace.
    root: path.resolve(import.meta.dirname, "../.."),
  },
  ...(isGithubPages && {
    // Custom domain (knock.codes) serves the site from the domain root,
    // not a /knock-codes subpath — no basePath needed.
    output: "export",
    images: { unoptimized: true },
  }),
};

export default nextConfig;
