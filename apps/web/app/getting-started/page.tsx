import type { Metadata } from "next";
import { TriangleAlert } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionHeader } from "@/components/section-header";
import { BlueprintFrame } from "@/components/blueprint-frame";
import { CodeViewer } from "@/components/code-viewer";
import { HashGenerator } from "@/components/hash-generator";
import { Reveal } from "@/components/reveal";
import { HomeCtaButton } from "@/components/home-cta-button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getServerTemplates } from "@/lib/server-templates";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Getting Started — Knock Codes",
  "Protect a page with Knock Codes in five steps, no backend required to start."
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
  {
    step: "01",
    title: "Hash your code",
    body: "Use the generator below — type or generate a code, get the hash back. The plaintext never touches a file, only the hash does.",
  },
  {
    step: "02",
    title: "Copy the template",
    body: "Pick a style, then copy the one file it ships as — or run its install command. There's no package to add to node_modules.",
  },
  {
    step: "03",
    title: "Set the hash as an env var",
    body: "Store the hash (never the code) in your framework's public env var — VITE_KNOCK_CODES_HASH, NEXT_PUBLIC_KNOCK_CODES_HASH, or equivalent. The generator gives you this line pre-filled.",
  },
  {
    step: "04",
    title: "Choose storage and timeout behavior",
    body: "Pick where the unlocked session lives (memory, localStorage, or sessionStorage) and how long it lasts — a fixed timeout, or one that slides forward on activity. Session Provider and every template default to something reasonable; override via props when they don't fit.",
  },
  {
    step: "05",
    title: "Upgrade to server verification when needed",
    body: "If bypassing this gate would actually matter, swap expectedHash for a verify function pointing at a small endpoint — same component, same markup, one prop different. See the security model for reference server templates and rate-limiting guidance.",
  },
];

export default function GettingStartedPage() {
  const serverTemplates = getServerTemplates();

  return (
    <div>
      <PageHeader
        eyebrow="5-minute setup guide"
        title={
          <>
            Protect a page in <span className="text-primary">five steps.</span>
          </>
        }
        description="No account, no backend required to start. Hash your code locally, drop the template file into your project, wire your environment variable, and ship."
      >
        <HomeCtaButton href="#steps">Start setup</HomeCtaButton>
        <HomeCtaButton href="#generator" variant="ghost">
          Hash generator
        </HomeCtaButton>
      </PageHeader>

      <section id="steps" className="px-8 py-20">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <SectionHeader
              number="01"
              label="Workflow"
              title="How it works"
              description="Five clear steps from local hash generation to server-mode verification."
              className="mb-12"
            />
          </Reveal>
          <Reveal>
            <div className="grid gap-5 sm:grid-cols-2">
              {STEPS.map((s) => (
                <BlueprintFrame key={s.step} label={`Step ${s.step}`}>
                  <h2 className="mb-1.5 text-base font-semibold tracking-tight text-foreground">{s.title}</h2>
                  <p className="text-sm text-muted-foreground">{s.body}</p>
                </BlueprintFrame>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="generator" className="border-t border-border px-8 py-20">
        <div className="mx-auto max-w-[1120px]">
          <Reveal>
            <SectionHeader
              number="02"
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
                message. Only the hash from step 1 should ever leave your local machine.
              </p>
            </div>
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
              title="Reference verify endpoints"
              description="Swap expectedHash for a verify function pointing at one of these — same request/response contract in every runtime: POST { code } → { ok: true, token } or { ok: false, reason }."
              className="mb-10"
            />
          </Reveal>
          <Reveal>
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
            Pick from four complete reference screens or read our honest threat model.
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

