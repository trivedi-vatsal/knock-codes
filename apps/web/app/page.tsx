import Link from "next/link";
import { ArrowRight, KeyRound, Package, ShieldCheck, Terminal } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { TemplateCard } from "@/components/template-card";
import { SectionHeader } from "@/components/section-header";
import { BlueprintFrame } from "@/components/blueprint-frame";
import { HeroPreview } from "@/components/hero-preview";
import { getAllTemplates } from "@/lib/templates";
import { THREAT_MODEL_COPY } from "@/lib/copy";

const STEPS = [
  { icon: KeyRound, label: "Step 01", title: "Hash your PIN", body: "Locally, in your browser console. The plaintext never touches a file." },
  { icon: Package, label: "Step 02", title: "Copy the template", body: "One file, straight into your project — no package to maintain." },
  { icon: Terminal, label: "Step 03", title: "Set the env var", body: "The hash goes in your framework's public env var, never the PIN." },
  { icon: ShieldCheck, label: "Step 04", title: "Ship it", body: "Wrap what you're protecting. Upgrade to server mode later, same markup." },
];

export default function Home() {
  const templates = getAllTemplates().slice(0, 4);

  return (
    <div>
      <section className="border-b border-border bg-[#0b1220] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="label-mono mb-4 text-white/60">→ A screen, not a library</p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              The <span className="text-[#7ba1f7] italic">access screen</span> you copy-paste and ship
            </h1>
            <p className="mt-5 max-w-xl text-white/70">
              A complete, single-file &ldquo;enter a code to continue&rdquo; screen for demos, previews,
              staging, and internal tools — verification logic included. No backend required to start, no
              vendor lock-in ever. You own every line.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/templates/access-gate-template" className={buttonVariants({ size: "lg" })}>
                Copy the code <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/templates"
                className={buttonVariants({ size: "lg", variant: "outline" }) + " border-white/20 bg-transparent text-white hover:bg-white/10"}
              >
                See all templates
              </Link>
            </div>
          </div>
          <HeroPreview />
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
        <BlueprintFrame label="Threat model">
          <h2 className="mb-3 text-xl font-semibold tracking-tight text-foreground">The honest version</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">{THREAT_MODEL_COPY}</p>
        </BlueprintFrame>
      </section>
    </div>
  );
}
