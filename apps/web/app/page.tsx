import Link from "next/link";
import { ArrowRight, KeyRound, Package, ShieldCheck, Terminal } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { TemplateCard } from "@/components/template-card";
import { SectionHeader } from "@/components/section-header";
import { BlueprintFrame } from "@/components/blueprint-frame";
import { HeroPreview } from "@/components/hero-preview";
import { HashGenerator } from "@/components/hash-generator";
import { getAllTemplates } from "@/lib/templates";
import { THREAT_MODEL_COPY, VELVET_ROPE_LINE } from "@/lib/copy";
import { getFlagshipTemplateKb } from "@/lib/proof-stats";

const STEPS = [
  { icon: KeyRound, label: "Step 01", title: "Hash your code", body: "Use the generator below — type or generate a code, get the hash back." },
  { icon: Package, label: "Step 02", title: "Copy the template", body: "One file, straight into your project — no package to maintain." },
  { icon: Terminal, label: "Step 03", title: "Set the env var", body: "The hash goes in your framework's public env var, never the code." },
  { icon: ShieldCheck, label: "Step 04", title: "Ship it", body: "Wrap what you're protecting. Upgrade to server mode later, same markup." },
];

const USE_CASES = [
  {
    label: "Client preview",
    title: "Share work before it's public",
    body: "Send a link to a client or stakeholder without it ending up indexed, forwarded, or crawled — the code is the only thing standing between the link and the open internet.",
  },
  {
    label: "Staging app",
    title: "Keep pre-prod off search engines",
    body: "A staging or preview deploy needs to be reachable by your team, not discoverable by everyone else. One shared code is usually all that's called for.",
  },
  {
    label: "Internal dashboard",
    title: "Soft-gate a low-risk internal tool",
    body: "Everyone who has the code is already trusted — you're not modeling per-user permissions, just keeping the tool off a public URL.",
  },
];

const MODE_COMPARISON = [
  { label: "Setup", local: "Paste a template, drop in a hash", server: "One prop swap + a small endpoint" },
  { label: "Hash visibility", local: "Ships in the client bundle", server: "Stays on your server" },
  { label: "Rate limiting", local: "Not possible", server: "Yes, per identifier" },
  { label: "Stops", local: "Casual visitors, crawlers, forwarded links", server: "Determined visitors too" },
];

export default function Home() {
  const templates = getAllTemplates().slice(0, 4);
  const templateKb = getFlagshipTemplateKb();

  return (
    <div>
      <section className="border-b border-border bg-[#0e1311] text-[#edeae0]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="label-mono mb-4 text-[#edeae0]/60">→ Private previews, opened with a code.</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              The <span className="text-[#dfff67] italic">access screen</span> you copy-paste and ship
            </h1>
            <p className="mt-5 max-w-xl text-white/70">
              A single-file &ldquo;enter a code to continue&rdquo; screen with verification built in.
              Copy it into your project, set one env var, ship. No backend, no package, no lock-in.
            </p>
            <p className="mt-3 max-w-xl text-sm text-white/50 italic">{VELVET_ROPE_LINE}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/templates" className={buttonVariants({ size: "lg" })}>
                Browse templates <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/security"
                className={buttonVariants({ size: "lg", variant: "outline" }) + " border-white/20 bg-transparent text-white hover:bg-white/10"}
              >
                Read the security model
              </Link>
            </div>
            <p className="label-mono mt-5 text-[#edeae0]/40">
              1 file · 0 dependencies · MIT · ~{templateKb}KB
            </p>
          </div>
          <HeroPreview />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeader
          label="Templates"
          title="Complete screens, ready to copy"
          description="Each one is a single file — background, card, form, and verification logic included. Pick the look, wire a hash, ship it."
          className="mb-8"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <TemplateCard key={template.slug} template={template} />
          ))}
        </div>
        <div className="mt-8">
          <Link href="/templates" className="label-mono inline-flex items-center gap-1.5 text-primary hover:underline">
            View all templates <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeader
          label="How it works"
          title="Protected in four steps"
          description="No account, no backend to stand up first."
          className="mb-8"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, label, title, body }) => (
            <BlueprintFrame key={label} label={label} className="p-6">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-foreground">{title}</h3>
              <p className="text-xs text-muted-foreground">{body}</p>
            </BlueprintFrame>
          ))}
        </div>
        <div className="mt-6">
          <HashGenerator />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeader
          label="Local mode vs. server mode"
          title="Start local, upgrade when it matters"
          description="Same component, one prop different — the honest trade-offs, in brief."
          className="mb-8"
        />
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="label-mono border-b border-border bg-muted/50 text-muted-foreground">
                <th className="px-3 py-2 font-medium"> </th>
                <th className="px-3 py-2 font-medium">Local mode</th>
                <th className="px-3 py-2 font-medium">Server mode</th>
              </tr>
            </thead>
            <tbody>
              {MODE_COMPARISON.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 font-medium text-foreground">{row.label}</td>
                  <td className="px-3 py-2 text-muted-foreground">{row.local}</td>
                  <td className="px-3 py-2 text-muted-foreground">{row.server}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <Link href="/security" className="label-mono inline-flex items-center gap-1.5 text-primary hover:underline">
            Read the full security model <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeader
          label="Use cases"
          title="Built for the times you don't need real auth"
          description="One shared code, not a login form — everyone who has it is already trusted."
          className="mb-8"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {USE_CASES.map((useCase) => (
            <BlueprintFrame key={useCase.label} label={useCase.label} className="p-6">
              <h3 className="mb-1.5 text-sm font-semibold text-foreground">{useCase.title}</h3>
              <p className="text-xs text-muted-foreground">{useCase.body}</p>
            </BlueprintFrame>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <BlueprintFrame label="Threat model">
          <h2 className="mb-3 text-xl font-semibold tracking-tight text-foreground">The honest version</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">{THREAT_MODEL_COPY}</p>
        </BlueprintFrame>
      </section>

      <section className="border-t border-border bg-[#0e1311] px-6 py-16 text-[#edeae0]">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Ready to lock something down?</h2>
          <p className="mt-3 text-white/70">Pick a template, copy the file, wire a hash. Ship it in minutes.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/templates" className={buttonVariants({ size: "lg" })}>
              Browse templates <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/security"
              className={buttonVariants({ size: "lg", variant: "outline" }) + " border-white/20 bg-transparent text-white hover:bg-white/10"}
            >
              Read the security model
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
