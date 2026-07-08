import Link from "next/link";
import { ArrowRight, Clock, KeyRound, Package, ShieldCheck, Terminal } from "lucide-react";
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
  { icon: Terminal, label: "Step 03", title: "Set the hash as an env var", body: "The hash goes in your framework's public env var, never the code." },
  { icon: Clock, label: "Step 04", title: "Choose storage and timeout behavior", body: "Memory, localStorage, or sessionStorage, with a fixed or sliding session timeout." },
  { icon: ShieldCheck, label: "Step 05", title: "Upgrade to server verification when needed", body: "Swap expectedHash for a verify function pointing at a small endpoint. Same markup, one prop different." },
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

const FAQ_ITEMS = [
  {
    question: "Is this real authentication?",
    answer:
      "No. There's no user identity, no accounts, no permissions — everyone who has the code gets the same access. It's a shared secret, not authentication. See the security model for exactly what it does and doesn't protect against.",
  },
  {
    question: "Why not use my host's built-in password protection?",
    answer:
      "If your host already offers one and it fits, use that instead. It's one less thing to maintain. Knock Codes is for when that option doesn't exist: a host with no built-in gate, a framework you don't want to configure at the platform layer, or a screen where the gate needs to live in your own app code instead.",
  },
  {
    question: "Does it work with Next.js App Router and RSC?",
    answer:
      "Yes. Every template is a small client component that a Server Component can render as a child — that's exactly how this homepage's own live demo works. Streaming, RSC payloads, and the App Router's caching are unaffected; the gate only touches what's rendered inside it.",
  },
  {
    question: "Can search engines bypass it?",
    answer:
      "Search engines that only read server-rendered HTML won't see what's behind the gate — local mode never renders the protected content until a matching code is entered, so there's nothing indexable in the initial markup. That's not a guarantee of invisibility, though — see the next question. Put noindex on any staging or preview deploy regardless; don't rely on the gate alone to keep it out of search results.",
  },
  {
    question: "In local mode, does the protected content still ship in the bundle?",
    answer:
      "Usually, yes. Whatever you pass as children is still part of your React tree and your JavaScript bundle — the template just doesn't render it to the DOM until the state flips to unlocked. If what's behind the gate is genuinely sensitive, don't rely on this alone: fetch it only after unlock, or move it behind server mode.",
  },
  {
    question: "How do I rotate a code?",
    answer:
      "Generate a hash for the new code and replace the old one — the env var in local mode, or your server's secret in server mode — then redeploy. Existing unlocked sessions keep working until they expire or are cleared, but nobody can unlock with the old code again.",
  },
  {
    question: "Can I use multiple codes?",
    answer:
      "Not out of the box in local mode — expectedHash compares against exactly one hash. For more than one valid code, use server mode: your verify function can check the submitted code's hash against a list or lookup table on your server, where the comparison logic is entirely up to you.",
  },
];

export default function Home() {
  const templates = getAllTemplates().slice(0, 4);
  const templateKb = getFlagshipTemplateKb();

  return (
    <div>
      <section className="border-b border-border bg-[#0e1311] text-[#edeae0]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="label-mono mb-4 text-[#edeae0]/60">→ Knock with the right code and the door opens.</p>
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
          title="Protected in five steps"
          description="No account, no backend to stand up first."
          className="mb-8"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
        <BlueprintFrame label="Threat model">
          <h2 className="mb-3 text-xl font-semibold tracking-tight text-foreground">The honest version</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">{THREAT_MODEL_COPY}</p>
          <Link
            href="/security#reference-server-code"
            className="label-mono mt-4 inline-flex items-center gap-1.5 text-primary hover:underline"
          >
            Read the reference server code <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </BlueprintFrame>
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
        <SectionHeader label="FAQ" title="Common questions" className="mb-8" />
        <div className="mx-auto max-w-3xl divide-y divide-border rounded-lg border border-border">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group p-4">
              <summary className="cursor-pointer list-none text-sm font-medium text-foreground marker:content-none">
                {item.question}
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQ_ITEMS.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            }),
          }}
        />
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
