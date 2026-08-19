const MODE_COMPARISON = [
  { label: "Setup", local: "Paste a template, drop in a hash", server: "One prop swap + a small endpoint" },
  { label: "Hash visibility", local: "Ships in the client bundle", server: "Stays on your server" },
  { label: "Bundled children", local: "Still in the JavaScript", server: "Still in the JavaScript unless you fetch after unlock" },
  { label: "Stored session", local: "Client-writable unless validateSession", server: "Same — validateSession to reject a forged token" },
  { label: "Rate limiting", local: "Not possible", server: "Yes, per identifier" },
  { label: "Stops", local: "Casual visitors, crawlers, forwarded links", server: "Reading the hash — not bundled children on their own" },
];

/** Local-vs-server trade-offs, kept from the previous homepage per the brief — restyled to the reference's surface/hairline/mono-header language, placed after the bento. */
export function ModeComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-2">
            <th className="px-4 py-3 font-mono text-[11px] font-medium tracking-[0.14em] text-fg-faint uppercase"> </th>
            <th className="px-4 py-3 font-mono text-[11px] font-medium tracking-[0.14em] text-fg-faint uppercase">Local mode</th>
            <th className="px-4 py-3 font-mono text-[11px] font-medium tracking-[0.14em] text-fg-faint uppercase">Server mode</th>
          </tr>
        </thead>
        <tbody>
          {MODE_COMPARISON.map((row) => (
            <tr key={row.label} className="border-b border-border last:border-0">
              <td className="px-4 py-3 font-medium text-foreground">{row.label}</td>
              <td className="px-4 py-3 text-muted-foreground">{row.local}</td>
              <td className="px-4 py-3 text-muted-foreground">{row.server}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
