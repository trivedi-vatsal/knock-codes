import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@access-gate/core", "@access-gate/react"],
  turbopack: {
    // Repo root is two levels up (apps/web -> apps -> access-gate) — pin it
    // explicitly so Turbopack doesn't have to guess across the workspace.
    root: path.resolve(import.meta.dirname, "../.."),
  },
};

export default nextConfig;
