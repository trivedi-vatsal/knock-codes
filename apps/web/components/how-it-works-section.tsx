import Link from "next/link";

const STEPS = [
  {
    num: "01",
    label: "Copy the file",
    title: "One template, zero dependencies.",
    body: "Paste a single file into your project. Nothing to install, nothing to configure at the platform layer.",
  },
  {
    num: "02",
    label: "Generate a hash",
    title: "Turn your code into a SHA-256 hash.",
    body: "Type an access code into the on-page generator and copy the hash it produces — computed locally, never sent anywhere.",
    href: "/getting-started#generator",
    linkLabel: "Open the hash generator →",
  },
  {
    num: "03",
    label: "Wrap and deploy",
    title: "Wrap your app, set one env var.",
    body: "Wrap the page in the gate, set the hash as an environment variable, and deploy. That's the whole install.",
  },
];

export function HowItWorksSteps() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {STEPS.map((step) => (
        <div
          key={step.num}
          className="rounded-xl border border-border bg-card p-7 transition-colors hover:border-border-strong"
        >
          <div className="mb-10 flex items-baseline justify-between">
            <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-fg-faint uppercase">{step.label}</span>
            <span className="font-mono text-xs tracking-[0.1em] text-primary">{step.num}</span>
          </div>
          <h3 className="text-[19px] font-semibold tracking-[-0.015em]">{step.title}</h3>
          <p className="mt-2 max-w-[400px] text-sm leading-[1.6] text-muted-foreground">{step.body}</p>
          {step.href && (
            <Link
              href={step.href}
              className="mt-4 inline-block font-mono text-xs font-medium tracking-[0.1em] text-primary uppercase transition-colors hover:text-primary/80"
            >
              {step.linkLabel}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
