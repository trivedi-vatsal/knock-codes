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

const USAGE_SNIPPET = `import { AccessGateTemplate } from "@/components/access-gate/react/AccessGateTemplate";

export default function App() {
  return (
    <AccessGateTemplate expectedHash={import.meta.env.VITE_ACCESS_GATE_HASH}>
      <YourRealApp />
    </AccessGateTemplate>
  );
}
`;

const STEPS = [
  {
    step: "01",
    title: "Hash your PIN",
    body: "Every template page has a live hash generator built in — type or generate a PIN there, get the hash back. The plaintext never touches a file, only the hash does.",
  },
  {
    step: "02",
    title: "Copy the template",
    body: "Pick a style, then copy the one file it ships as — or run its install command. There's no package to add to node_modules.",
  },
  {
    step: "03",
    title: "Set the hash as an env var",
    body: "Store the hash (never the PIN) in your framework's public env var — VITE_ACCESS_GATE_HASH, NEXT_PUBLIC_ACCESS_GATE_HASH, or equivalent. The generator gives you this line pre-filled.",
  },
  {
    step: "04",
    title: "Wrap what you're protecting",
    body: "Wrap the page, layout, or component you want gated. Visitors see the access screen; the right code unlocks it for as long as the session is configured to last.",
  },
];

export default function GettingStartedPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <SectionHeader
        label="How it works"
        title="Protect a page in four steps"
        description="No account, no backend, no dependency on Access Gate itself. Local mode is deterrence, not protection — see a template's Accessibility/Customization notes for the honest threat model, and swap in a verify function for server-mode protection later without changing your markup."
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

      <div className="mt-8">
        <CodeViewer code={USAGE_SNIPPET} filename="App.tsx" wrap />
      </div>

      <div className="mt-10 flex items-center gap-3">
        <Link href="/templates/access-gate-template" className={buttonVariants({ size: "lg" })}>
          Pick a template <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
