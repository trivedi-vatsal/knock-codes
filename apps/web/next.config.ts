import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@knock-codes/core", "@knock-codes/react"],
  turbopack: {
    // Repo root is two levels up (apps/web -> apps -> knock-codes) — pin it
    // explicitly so Turbopack doesn't have to guess across the workspace.
    root: path.resolve(import.meta.dirname, "../.."),
  },
};

export default nextConfig;
