import path from "node:path";
import type { NextConfig } from "next";

const repoName = "knock-codes";
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  transpilePackages: ["@knock-codes/core", "@knock-codes/react"],
  turbopack: {
    // Repo root is two levels up (apps/web -> apps -> knock-codes) — pin it
    // explicitly so Turbopack doesn't have to guess across the workspace.
    root: path.resolve(import.meta.dirname, "../.."),
  },
  ...(isGithubPages && {
    output: "export",
    basePath: `/${repoName}`,
    images: { unoptimized: true },
  }),
};

export default nextConfig;
