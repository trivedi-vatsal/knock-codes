import Link from "next/link";
import { ArrowRight, KeyRound, Package, ShieldCheck, Terminal } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { BlockCard } from "@/components/block-card";
import { SectionHeader } from "@/components/section-header";
import { BlueprintFrame } from "@/components/blueprint-frame";
import { getAllBlocks } from "@/lib/blocks";

const FEATURED_SLUGS = ["access-gate", "protected-card", "session-provider", "protected-modal"];

const STEPS = [
  { icon: KeyRound, label: "Step 01", title: "Hash your PIN", body: "Locally, in your browser console. The plaintext never touches a file." },
  { icon: Package, label: "Step 02", title: "Install a block", body: "Copy real source into your project via the CLI — no package to maintain." },
  { icon: Terminal, label: "Step 03", title: "Set the env var", body: "The hash goes in your framework's public env var, never the PIN." },
  { icon: ShieldCheck, label: "Step 04", title: "Ship it", body: "Wrap what you're protecting. Upgrade to server mode later, same markup." },
];

export default function Home() {
  const featured = getAllBlocks().filter((block) => FEATURED_SLUGS.includes(block.slug));

  return (
    <div>
      <section className="border-b border-border bg-[#0b1220] text-white">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <p className="label-mono mb-4 text-white/60">→ Private beta of your demos, not your users</p>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            The <span className="text-[#7ba1f7] italic">access-control</span> layer for demos, previews, and
            staging
          </h1>
          <p className="mt-5 max-w-xl text-white/70">
            Copy-owned React blocks that gate a page behind a PIN. No backend required to start, no vendor
            lock-in ever — you own every line.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/blocks" className={buttonVariants({ size: "lg" })}>
              Browse blocks <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/getting-started"
              className={buttonVariants({ size: "lg", variant: "outline" }) + " border-white/20 bg-transparent text-white hover:bg-white/10"}
            >
              Getting started
            </Link>
          </div>
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
          label="Featured"
          title="A few of the blocks"
          description="Fifteen copy-paste components, all built on the same tested hash/session core."
          className="mb-8"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((block) => (
            <BlockCard key={block.slug} block={block} />
          ))}
        </div>
        <div className="mt-8">
          <Link href="/blocks" className="label-mono inline-flex items-center gap-1.5 text-primary hover:underline">
            View all blocks <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <BlueprintFrame label="Threat model">
          <h2 className="mb-3 text-xl font-semibold tracking-tight text-foreground">The honest version</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Access Gate stops casual visitors, search engines, and forwarded links. Local mode does not stop
            anyone who opens DevTools — the hash ships in your client bundle by design. Server mode (swap one
            prop) stops determined visitors. This is a velvet rope, with an optional real lock — never
            marketed as more than that.
          </p>
        </BlueprintFrame>
      </section>
    </div>
  );
}
