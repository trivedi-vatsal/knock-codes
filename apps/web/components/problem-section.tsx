const PROBLEMS = [
  {
    label: "The forwarded link",
    num: "001",
    title: "You shared it with one person.",
    body: "A preview link sent to one client gets forwarded to five people you've never met. The URL is the only thing standing between your draft and the open internet.",
  },
  {
    label: "The crawler",
    num: "002",
    title: "Google found your staging site.",
    body: "Pre-prod doesn't need to be discoverable to be indexed. One stray link and your half-finished redesign is a search result.",
  },
  {
    label: "The gray popup",
    num: "003",
    title: "Basic auth greets your client first.",
    body: "The browser's built-in password dialog is the ugliest screen on the internet — and it's the first thing your work is judged by.",
  },
  {
    label: "The plan upgrade",
    num: "004",
    title: "Your host sells the fix by the month.",
    body: "Password protection exists on most platforms — one pricing tier above yours, styled their way, locked to their infrastructure.",
  },
];

export function ProblemCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {PROBLEMS.map((problem) => (
        <div
          key={problem.num}
          className="rounded-xl border border-border bg-card p-7 transition-colors hover:border-border-strong"
        >
          <div className="mb-10 flex items-baseline justify-between">
            <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-fg-faint uppercase">{problem.label}</span>
            <span className="font-mono text-xs tracking-[0.1em] text-primary">{problem.num}</span>
          </div>
          <h3 className="text-[19px] font-semibold tracking-[-0.015em]">{problem.title}</h3>
          <p className="mt-2 max-w-[400px] text-sm leading-[1.6] text-muted-foreground">{problem.body}</p>
        </div>
      ))}
    </div>
  );
}
