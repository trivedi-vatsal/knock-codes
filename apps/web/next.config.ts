import path from "node:path";
import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

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
