const FAQ_ITEMS = [
  {
    question: "Is this real authentication?",
    answer:
      "No. There's no user identity, no accounts, no permissions — everyone who has the code gets the same access. It's a shared secret, not authentication. See the security model for exactly what it does and doesn't protect against.",
  },
  {
    question: "Why not use my host's built-in password protection?",
    answer:
      "If your host already offers one and it fits, use that instead. It's one less thing to maintain. Knock Codes is for when that option doesn't exist: a host with no built-in gate, a framework you don't want to configure at the platform layer, or a screen where the gate needs to live in your own app code instead.",
  },
  {
    question: "Does it work with Next.js App Router and RSC?",
    answer:
      "Yes. Every template is a small client component that a Server Component can render as a child — that's exactly how this homepage's own live demo works. Streaming, RSC payloads, and the App Router's caching are unaffected; the gate only touches what's rendered inside it.",
  },
  {
    question: "Can search engines bypass it?",
    answer:
      "Search engines that only read server-rendered HTML won't see what's behind the gate — local mode never renders the protected content until a matching code is entered, so there's nothing indexable in the initial markup. That's not a guarantee of invisibility, though — see the next question. Put noindex on any staging or preview deploy regardless; don't rely on the gate alone to keep it out of search results.",
  },
  {
    question: "In local mode, does the protected content still ship in the bundle?",
    answer:
      "Usually, yes. Whatever you pass as children is still part of your React tree and your JavaScript bundle — the template just doesn't render it to the DOM until the state flips to unlocked. If what's behind the gate is genuinely sensitive, don't rely on this alone: fetch it only after unlock, or move it behind server mode.",
  },
  {
    question: "How do I rotate a code?",
    answer:
      "Generate a hash for the new code and replace the old one — the env var in local mode, or your server's secret in server mode — then redeploy. Existing unlocked sessions keep working until they expire or are cleared, but nobody can unlock with the old code again.",
  },
  {
    question: "Can I use multiple codes?",
    answer:
      "Not out of the box in local mode — expectedHash compares against exactly one hash. For more than one valid code, use server mode: your verify function can check the submitted code's hash against a list or lookup table on your server, where the comparison logic is entirely up to you.",
  },
];

/** Kept from the previous homepage per the brief, restyled to the reference's surface/hairline/mono language and moved between the stats band and the CTA. */
export function FaqSection() {
  return (
    <>
      <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {FAQ_ITEMS.map((item) => (
          <details key={item.question} className="group p-6">
            <summary className="cursor-pointer list-none text-[15px] font-medium text-foreground marker:content-none">
              {item.question}
            </summary>
            <p className="mt-2.5 text-sm leading-[1.6] text-muted-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          }),
        }}
      />
    </>
  );
}
