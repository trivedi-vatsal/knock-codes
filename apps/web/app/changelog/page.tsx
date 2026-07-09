import type { Metadata } from "next";
import { SectionHeader } from "@/components/section-header";
import { BlueprintFrame } from "@/components/blueprint-frame";
import { pageMetadata } from "@/lib/seo";
import { getAllTemplates } from "@/lib/templates";

export const metadata: Metadata = pageMetadata(
  "Changelog — Knock Codes",
  "What changed on Knock Codes, release by release, plus the current version of each template."
);

const ENTRIES = [
  {
    date: "2026-07-09",
    added: [
      "A numbered section system on the homepage (01 Templates through 06 FAQ) and FIG.01-style labels on every live demo/preview (hero, feature grid, template and block detail pages).",
      "A self-demonstrating feature grid in \"How it works\" — five real, independent useKnockCodes instances (not screenshots) for local mode, server mode, session memory, timeout, and a wrong-knock error state, each paired with its real prop.",
      "// Open Source // MIT and a version badge (linked to this page) in the primary nav.",
      "A precise fade+slide unlock transition on the Knock Codes Template, alongside the existing shake-on-error.",
      "Subtle once-per-section fade-up entrances on the homepage, and a hover lift on template gallery preview thumbnails — transform/opacity only, no layout shift.",
      "prefers-reduced-motion support across all four full-page templates and the plain HTML gate — previously unguarded shake keyframes now disable cleanly instead of playing regardless of the setting.",
      "/llms.txt — a generated, agent-readable inventory of every template and block, their real props, and the security model summary.",
      "An \"Adapt with AI\" copy button on each template detail page: a ready prompt naming the template's real props and explicitly instructing an agent to preserve the verification logic rather than inventing new ones.",
      "A site-wide focus-visible ring and press state on plain text links (previously only shadcn Button had one).",
    ],
    changed: [
      "Homepage section eyebrows (Templates, How it works, Local vs. server, Threat model, Use cases, FAQ) now read \"01 › Templates\" etc. instead of a bare \"→\" — → is reserved for inline links and list markers again.",
      "The template set version shown in the nav and this page's table now reads from each template's own frontmatter (content/templates/*.mdx) instead of a separately hardcoded list.",
      "Footer rebuilt into Product / Resources / Author columns, with a version + copyright line at the bottom.",
    ],
  },
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
      "An FAQ section on the homepage, with FAQPage JSON-LD, including a question on why not just use your host's built-in password protection.",
      "An OG image, plus a unique og:title/og:description on every page instead of one shared description.",
      "Getting Started and GitHub links in the primary nav.",
      "Live, scaled-down visual previews on every template gallery card, in place of text-only cards.",
      "The template version now shows on each template's own detail page, next to its tags.",
      "A link from the homepage's threat-model section straight to the reference server code on the security page.",
      "A light door/knock metaphor in the hero line and in the live demo's wrong-code and success states.",
    ],
    changed: [
      "Landing page section order: Hero, Templates, How it works, Local vs. server mode, Threat model, Use cases, FAQ, final CTA.",
      "Homepage \"How it works\" now walks all five steps from Getting Started (was four steps, with step one pointing at the browser console instead of the hash generator).",
      "Template descriptions now lead with their differentiator instead of all opening the same way.",
      "Footer author byline now links to vatsal.xyz in addition to GitHub; the footer's \"How it works\" link is renamed \"Getting Started\" to match where it points.",
    ],
  },
];

export default function ChangelogPage() {
  const templates = getAllTemplates();

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
            {templates.map((t) => (
              <tr key={t.registryName} className="border-b border-border last:border-0">
                <td className="px-3 py-2 font-medium text-foreground">{t.title}</td>
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
