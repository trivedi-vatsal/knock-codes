import type { Metadata } from "next";
import { TriangleAlert } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionHeader } from "@/components/section-header";
import { CodeViewer } from "@/components/code-viewer";
import { HashGenerator } from "@/components/hash-generator";
import { Reveal } from "@/components/reveal";
import { HomeCtaButton } from "@/components/home-cta-button";
import { CopyButton } from "@/components/copy-button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getServerTemplates } from "@/lib/server-templates";
import { pageMetadata } from "@/lib/seo";
import { resolveSiteUrl } from "@/lib/site-url";
import Link from "next/link";

export const metadata: Metadata = pageMetadata(
  "Getting Started — Knock Codes",
  "Protect a page, no backend required. Hash a code, paste a template, set one env var."
);

const FRAMEWORK_SNIPPETS = [
  {
    id: "nextjs",
    label: "Next.js",
    filename: "app/layout.tsx",
    code: `import { KnockCodesTemplate } from "@/components/knock-codes/react/KnockCodesTemplate";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <KnockCodesTemplate expectedHash={process.env.NEXT_PUBLIC_KNOCK_CODES_HASH}>
          {children}
        </KnockCodesTemplate>
      </body>
    </html>
  );
}
`,
  },
  {
    id: "vite",
    label: "Vite",
    filename: "src/App.tsx",
    code: `import { KnockCodesTemplate } from "@/components/knock-codes/react/KnockCodesTemplate";

export default function App() {
  return (
    <KnockCodesTemplate expectedHash={import.meta.env.VITE_KNOCK_CODES_HASH}>
      <YourRealApp />
    </KnockCodesTemplate>
  );
}
`,
  },
  {
    id: "react",
    label: "Plain React",
    filename: "src/App.tsx",
    code: `import { KnockCodesTemplate } from "./components/knock-codes/react/KnockCodesTemplate";

// The hash is public information by design (see /security) — a constant is
// fine here. Never put the plaintext code in this file or any other.
const KNOCK_CODES_HASH = "paste-your-generated-hash-here";

export default function App() {
  return (
    <KnockCodesTemplate expectedHash={KNOCK_CODES_HASH}>
      <YourRealApp />
    </KnockCodesTemplate>
  );
}
`,
  },
];

const STEPS = [
  "Hash your access code locally — only the hash ever leaves your machine.",
  "Install a template (CLI below, or copy the file from the gallery).",
  "Wrap your app and set the hash as an environment variable.",
];

export default function GettingStartedPage() {
  const serverTemplates = getServerTemplates();
  const siteUrl = resolveSiteUrl();
  const isLocalDev = siteUrl === "http://localhost:3000";
  const installCommand = isLocalDev
    ? `npx shadcn@latest add ${siteUrl}/r/react/knock-codes-template.json`
    : "npx shadcn@latest add @knock-codes/knock-codes-template";

  return (
    <div>
      <PageHeader
        eyebrow="5-minute setup guide"
        title={
          <>
            Protect a page, <span className="text-primary">no backend required.</span>
          </>
        }
        description="Hash your code locally, drop the template file into your project, wire one environment variable, and ship."
      >
        <HomeCtaButton href="#generator">Hash generator</HomeCtaButton>
        <HomeCtaButton href="#install" variant="ghost">
          Install command
        </HomeCtaButton>
      </PageHeader>

      <section className="px-8 py-16">
        <div className="mx-auto max-w-[720px]">
          <ol className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            {STEPS.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="generator" className="scroll-mt-20 border-t border-border px-8 py-20">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <SectionHeader
              number="01"
              label="Interactive tool"
              title="Generate your hash"
              description="Enter any secret code below to generate its canonical SHA-256 hex string. The plaintext stays in your browser."
              className="mb-12"
            />
          </Reveal>
          <Reveal>
            <HashGenerator />
            <div className="mt-8 flex gap-3 rounded-lg border border-amber-600/30 bg-amber-600/10 p-4 text-sm text-amber-700 dark:text-amber-400">
              <TriangleAlert className="h-4 w-4 shrink-0 translate-y-0.5" aria-hidden="true" />
              <p>
                Never commit or ship the plaintext code — not in an env file, not in a comment, not in a commit
                message. Only the hash should ever leave your local machine.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="install" className="scroll-mt-20 border-t border-border px-8 py-20">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <SectionHeader
              number="02"
              label="Install"
              title="One command"
              description="This drops the Knock Codes template into your project. Other looks live on the templates page."
              className="mb-10"
            />
          </Reveal>
          <Reveal>
            <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-[#0e1311] px-3 py-2">
              <code className="overflow-x-auto text-xs whitespace-nowrap text-[#edeae0]">{installCommand}</code>
              <CopyButton text={installCommand} className="shrink-0 border-white/15 text-white/70 hover:bg-white/10 hover:text-white" />
            </div>
            {isLocalDev && (
              <p className="mt-2 text-xs text-muted-foreground">
                Showing the local dev registry. Set{" "}
                <code className="rounded bg-muted px-1 py-0.5">NEXT_PUBLIC_SITE_URL</code> to preview the deployed
                command instead.
              </p>
            )}
          </Reveal>
        </div>
      </section>

      <section id="snippets" className="border-t border-border px-8 py-20">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <SectionHeader
              number="03"
              label="Integration"
              title="Framework setup snippets"
              description="Drop your template and environment variable into Next.js, Vite, or plain React."
              className="mb-10"
            />
          </Reveal>
          <Reveal>
            <Tabs defaultValue="nextjs">
              <TabsList>
                {FRAMEWORK_SNIPPETS.map((fw) => (
                  <TabsTrigger key={fw.id} value={fw.id}>
                    {fw.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {FRAMEWORK_SNIPPETS.map((fw) => (
                <TabsContent key={fw.id} value={fw.id}>
                  <CodeViewer code={fw.code} filename={fw.filename} wrap />
                </TabsContent>
              ))}
            </Tabs>
          </Reveal>
        </div>
      </section>

      <section id="server-mode" className="border-t border-border px-8 py-20">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <SectionHeader
              number="04"
              label="Server mode"
              title="When a determined visitor would matter"
              description="Swap expectedHash for a verify function pointing at a small endpoint. Same component, one prop different. Server mode hides the hash — not children you already bundled."
              className="mb-10"
            />
          </Reveal>
          <Reveal>
            <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
              Full threat model, rate-limiting notes, and when this is the wrong tool:{" "}
              <Link href="/security" className="font-medium text-primary hover:underline">
                /security
              </Link>
              .
            </p>
            <Tabs defaultValue={serverTemplates[0]?.id}>
              <TabsList>
                {serverTemplates.map((tpl) => (
                  <TabsTrigger key={tpl.id} value={tpl.id}>
                    {tpl.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {serverTemplates.map((tpl) => (
                <TabsContent key={tpl.id} value={tpl.id}>
                  <CodeViewer code={tpl.code} filename={tpl.filename} wrap />
                </TabsContent>
              ))}
            </Tabs>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border px-8 py-24 text-center">
        <Reveal className="mx-auto max-w-[1120px]">
          <span className="mb-5 block font-mono text-[11px] font-medium tracking-[0.14em] uppercase">
            <b className="font-medium text-primary">05</b>
            <span className="text-fg-faint"> / Next steps</span>
          </span>
          <h2 className="text-[clamp(30px,4.5vw,48px)] leading-[1.1] font-medium tracking-[-0.025em]">
            Ready to choose your template?
          </h2>
          <p className="mx-auto mt-4 max-w-[480px] text-muted-foreground">
            Pick from four complete reference screens or read the threat model.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <HomeCtaButton href="/templates">Browse templates</HomeCtaButton>
            <HomeCtaButton href="/security" variant="ghost">
              Security model
            </HomeCtaButton>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
