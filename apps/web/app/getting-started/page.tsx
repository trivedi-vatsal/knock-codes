import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, TriangleAlert } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { BlueprintFrame } from "@/components/blueprint-frame";
import { CodeViewer } from "@/components/code-viewer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Getting Started — Access Gate",
  description: "Protect a page with Access Gate in five steps, no backend required to start.",
};

const FRAMEWORK_SNIPPETS = [
  {
    id: "nextjs",
    label: "Next.js",
    filename: "app/layout.tsx",
    code: `import { AccessGateTemplate } from "@/components/access-gate/react/AccessGateTemplate";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AccessGateTemplate expectedHash={process.env.NEXT_PUBLIC_ACCESS_GATE_HASH}>
          {children}
        </AccessGateTemplate>
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
    code: `import { AccessGateTemplate } from "@/components/access-gate/react/AccessGateTemplate";

export default function App() {
  return (
    <AccessGateTemplate expectedHash={import.meta.env.VITE_ACCESS_GATE_HASH}>
      <YourRealApp />
    </AccessGateTemplate>
  );
}
`,
  },
  {
    id: "react",
    label: "Plain React",
    filename: "src/App.tsx",
    code: `import { AccessGateTemplate } from "./components/access-gate/react/AccessGateTemplate";

// The hash is public information by design (see /security) — a constant is
// fine here. Never put the plaintext code in this file or any other.
const ACCESS_GATE_HASH = "paste-your-generated-hash-here";

export default function App() {
  return (
    <AccessGateTemplate expectedHash={ACCESS_GATE_HASH}>
      <YourRealApp />
    </AccessGateTemplate>
  );
}
`,
  },
];

const STEPS = [
  {
    step: "01",
    title: "Hash your code",
    body: "Every template page has a live hash generator built in — type or generate a code there, get the hash back. The plaintext never touches a file, only the hash does.",
  },
  {
    step: "02",
    title: "Copy the template",
    body: "Pick a style, then copy the one file it ships as — or run its install command. There's no package to add to node_modules.",
  },
  {
    step: "03",
    title: "Set the hash as an env var",
    body: "Store the hash (never the code) in your framework's public env var — VITE_ACCESS_GATE_HASH, NEXT_PUBLIC_ACCESS_GATE_HASH, or equivalent. The generator gives you this line pre-filled.",
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
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <SectionHeader
        label="How it works"
        title="Protect a page in five steps"
        description="No account, no backend to stand up first. Local mode is deterrence, not protection — see the security model for the honest threat model, and swap in a verify function for server-mode protection later without changing your markup."
        className="mb-10"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {STEPS.map((s) => (
          <BlueprintFrame key={s.step} label={`Step ${s.step}`}>
            <h2 className="mb-1.5 text-base font-semibold tracking-tight text-foreground">{s.title}</h2>
            <p className="text-sm text-muted-foreground">{s.body}</p>
          </BlueprintFrame>
        ))}
      </div>

      <div className="mt-8 flex gap-3 rounded-lg border border-amber-600/30 bg-amber-600/10 p-4 text-sm text-amber-700 dark:text-amber-400">
        <TriangleAlert className="h-4 w-4 shrink-0 translate-y-0.5" aria-hidden="true" />
        <p>
          Never commit or ship the plaintext code — not in an env file, not in a comment, not in a commit
          message. Only the hash from step 1 should ever leave your local machine.
        </p>
      </div>

      <div className="mt-8">
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
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Link href="/templates/access-gate-template" className={buttonVariants({ size: "lg" })}>
          Pick a template <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/security" className={buttonVariants({ size: "lg", variant: "outline" })}>
          Read the security model
        </Link>
      </div>
    </div>
  );
}
