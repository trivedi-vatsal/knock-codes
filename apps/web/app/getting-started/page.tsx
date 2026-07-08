import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { BlueprintFrame } from "@/components/blueprint-frame";
import { CodeViewer } from "@/components/code-viewer";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Getting Started — Access Gate",
  description: "Protect a page with Access Gate in four steps, no backend required.",
};

const HASH_SNIPPET = `// Run in your browser devtools console — nothing leaves your machine.
const bytes = new TextEncoder().encode("your-pin-here");
const digest = await crypto.subtle.digest("SHA-256", bytes);
console.log(Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join(""));
`;

const INSTALL_SNIPPET = `npx shadcn@latest add http://localhost:3000/r/react/access-gate.json`;

const USAGE_SNIPPET = `import { AccessGate } from "@/components/access-gate/react/AccessGate";

export default function App() {
  return (
    <AccessGate expectedHash={import.meta.env.VITE_ACCESS_GATE_HASH}>
      <YourRealApp />
    </AccessGate>
  );
}
`;

const STEPS = [
  {
    step: "01",
    title: "Hash your PIN",
    body: "Pick a PIN or passphrase and hash it — locally, in your own browser console. The plaintext never touches a file, only the hash does.",
    code: HASH_SNIPPET,
    filename: "browser console",
  },
  {
    step: "02",
    title: "Install a block",
    body: "Browse the gallery, pick a block, and run its install command. It copies real source into your project — there's no package to add to node_modules.",
    code: INSTALL_SNIPPET,
    filename: "terminal",
  },
  {
    step: "03",
    title: "Set the hash as an env var",
    body: "Store the hash (never the PIN) in your framework's public env var — VITE_ACCESS_GATE_HASH, NEXT_PUBLIC_ACCESS_GATE_HASH, or equivalent.",
    code: "VITE_ACCESS_GATE_HASH=<paste the hash from step 1>",
    filename: ".env",
  },
  {
    step: "04",
    title: "Wrap what you're protecting",
    body: "Wrap the page, layout, or component you want gated. Visitors see a PIN prompt; the right code unlocks it for as long as the session is configured to last.",
    code: USAGE_SNIPPET,
    filename: "App.tsx",
  },
];

export default function GettingStartedPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <SectionHeader
        label="Getting Started"
        title="Protect a page in four steps"
        description="No account, no backend, no dependency on Access Gate itself. Local mode is deterrence, not protection — see a block's Accessibility/Customization notes for the honest threat model, and swap in a verify function for server-mode protection later without changing your markup."
        className="mb-10"
      />

      <div className="space-y-6">
        {STEPS.map((s) => (
          <BlueprintFrame key={s.step} label={`Step ${s.step}`}>
            <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
              <div>
                <h2 className="mb-2 text-xl font-semibold tracking-tight text-foreground">{s.title}</h2>
                <p className="text-sm text-muted-foreground">{s.body}</p>
              </div>
              <CodeViewer code={s.code} filename={s.filename} wrap />
            </div>
          </BlueprintFrame>
        ))}
      </div>

      <div className="mt-12 flex items-center gap-3">
        <Link href="/blocks" className={buttonVariants({ size: "lg" })}>
          Browse blocks <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
