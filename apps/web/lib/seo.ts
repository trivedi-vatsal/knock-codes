import type { Metadata } from "next";

/**
 * Every page already writes a good, specific meta description — without this,
 * og:title/og:description silently inherit the root layout's homepage copy
 * instead (Next.js only inherits `openGraph`/`twitter` wholesale when a page
 * doesn't define its own), so every shared link looked identical. This reuses
 * the same title/description for both instead of duplicating them a third time.
 */
export function pageMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}
