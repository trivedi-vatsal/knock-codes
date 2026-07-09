const STATS = [
  { n: "1", suffix: "", emphasized: true, label: "File to copy" },
  { n: "0", suffix: "", emphasized: true, label: "Dependencies" },
  { n: "0", suffix: "", emphasized: true, label: "Requests home" },
  { n: "~2", suffix: " min", emphasized: false, label: "To protected" },
];

export function StatsBand() {
  return (
    <div className="grid grid-cols-4 overflow-hidden rounded-xl border border-border bg-card max-[960px]:grid-cols-2 max-[640px]:grid-cols-1">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="border-r border-border px-7 py-[30px] last:border-r-0 max-[960px]:border-b max-[960px]:nth-[2n]:border-r-0 max-[960px]:nth-[n+3]:border-b-0 max-[640px]:border-r-0 max-[640px]:border-b max-[640px]:last:border-b-0"
        >
          <div className="text-[34px] leading-none font-medium tracking-[-0.03em]">
            <span className={stat.emphasized ? "text-primary" : ""}>{stat.n}</span>
            {stat.suffix && <span className="text-[20px]">{stat.suffix}</span>}
          </div>
          <span className="mt-2.5 block font-mono text-[11px] font-medium tracking-[0.14em] text-fg-faint uppercase">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
