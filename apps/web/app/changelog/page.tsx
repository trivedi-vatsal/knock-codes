import type { Metadata } from "next";
import { SectionHeader } from "@/components/section-header";
import { BlueprintFrame } from "@/components/blueprint-frame";

export const metadata: Metadata = {
  title: "Changelog — Knock Codes",
  description: "What changed on Knock Codes, release by release, plus the current version of each template.",
};

const TEMPLATE_VERSIONS = [
  { name: "Knock Codes Template", registryName: "knock-codes-template", version: "1.0.0" },
  { name: "Branded Access Template", registryName: "branded-access-template", version: "1.0.0" },
  { name: "Minimal Access Template", registryName: "minimal-access-template", version: "1.0.0" },
  { name: "Modal Access Template", registryName: "modal-access-template", version: "1.0.0" },
  { name: "Plain HTML Gate", registryName: "plain-html-gate", version: "1.0.0" },
];

const ENTRIES = [
  {
    date: "2026-07-08",
    added: [
      'Homepage hero is now a live, working demo ("Try code 4242") that renders on first paint with no loading state, plus a proof strip (file count, dependency count, license, file size).',
      "A client-side hash generator widget, now embedded on the homepage and Getting Started in addition to template detail pages.",
      "Express and Hono reference server-verification templates, alongside the existing Next.js/Cloudflare/Azure ones, plus a tabbed reference-implementations section on Getting Started.",
      "Segmented code entry gets autoComplete=\"one-time-code\" and inputMode=\"text\".",
      "All four full-page templates: a shake on a failed attempt, a brief success transition instead of an instant swap, and an optional remember=\"session\" prop (off by default, not a security boundary).",
      "Plain HTML Gate — one static .html file with an inline script, no React, no build step, no npm install.",
      "This changelog page, and a footer linking to it, the GitHub repo, the MIT license, and the author.",
      "An FAQ section on the homepage, with FAQPage JSON-LD.",
      "An OG image and refreshed page metadata.",
    ],
    changed: [
      "Landing page section order: Hero, Templates, How it works, Local vs. server mode, Use cases, Threat model, final CTA.",
      "Template descriptions now lead with their differentiator instead of all opening the same way.",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <SectionHeader
        label="Changelog"
        title="What changed"
        description="This project ships copy-paste, not as an npm package — see each template's own version below."
        className="mb-10"
      />

      <div className="mb-10 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="label-mono border-b border-border bg-muted/50 text-muted-foreground">
              <th className="px-3 py-2 font-medium">Template</th>
              <th className="px-3 py-2 font-medium">Version</th>
            </tr>
          </thead>
          <tbody>
            {TEMPLATE_VERSIONS.map((t) => (
              <tr key={t.registryName} className="border-b border-border last:border-0">
                <td className="px-3 py-2 font-medium text-foreground">{t.name}</td>
                <td className="px-3 py-2 font-mono text-muted-foreground">{t.version}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-8">
        {ENTRIES.map((entry) => (
          <BlueprintFrame key={entry.date} label={entry.date}>
            {entry.added.length > 0 && (
              <div className="mb-4">
                <p className="label-mono mb-2 text-muted-foreground">Added</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {entry.added.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true" className="text-primary">+</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {entry.changed.length > 0 && (
              <div>
                <p className="label-mono mb-2 text-muted-foreground">Changed</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {entry.changed.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true" className="text-primary">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </BlueprintFrame>
        ))}
      </div>
    </div>
  );
}
