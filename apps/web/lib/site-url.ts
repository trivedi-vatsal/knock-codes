/**
 * A misconfigured production deploy (NEXT_PUBLIC_SITE_URL unset) used to
 * silently fall back to a localhost install command in shipped output.
 * Production now defaults to the real origin instead — only override via
 * NEXT_PUBLIC_SITE_URL when deploying to a different domain (fork, preview).
 */
export const PRODUCTION_SITE_URL = "https://knock.codes";
const LOCAL_DEV_URL = "http://localhost:3000";

export function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  return process.env.NODE_ENV === "production" ? PRODUCTION_SITE_URL : LOCAL_DEV_URL;
}
