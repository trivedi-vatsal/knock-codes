# Knock Codes — Agent Installation Instructions

You are installing Knock Codes, a copy-owned access screen. Follow these steps exactly —
they exist specifically to guarantee no plaintext PIN ever lands in this repo.

## 1. Get a PIN
Ask the user for a PIN/passphrase, OR generate a strong one yourself and display it
to the user once in your response. Prefer a passphrase over a short numeric PIN —
a short PIN's hash is brute-forceable even though comparison happens client-side.
(A human doing this by hand can also use the site's own hash-generator widget,
embedded directly on every template page — same result, just interactive.)

## 2. Hash it locally
Compute the SHA-256 hash of the PIN using this exact command (Node.js, no
dependencies), substituting the real PIN for `<pin>`:

    node -e "process.stdout.write(require('crypto').createHash('sha256').update(process.argv[1],'utf8').digest('hex'))" "<pin>"

This prints a lowercase hex string — that is the value to write in step 3.
Do not trim, lowercase/uppercase, or otherwise transform the PIN before
hashing: the hash must be computed from the exact string the user gave you,
byte for byte — UTF-8 input, no trimming, no case-folding, lowercase hex
output. A different encoding or trimming choice here will silently produce a
hash that never matches what the site's generator or a server template
computes for the same PIN. Never send the PIN to a network service to hash it.

## 3. Write only the hash
Write the hash — never the PIN — to the project's env file (e.g. `.env`,
`.env.local`) under the appropriate framework-prefixed name
(`VITE_KNOCK_CODES_HASH`, `NEXT_PUBLIC_KNOCK_CODES_HASH`, etc.).
Before writing, confirm `.env`/`.env.local` is listed in `.gitignore`.
If it isn't, add it before writing the hash.

## 4. Add the template
Add a template via the registry command, e.g.:

    npx shadcn@latest add <site-url>/r/react/knock-codes-template.json

Other templates in the same registry: `minimal-access-template`,
`branded-access-template`, `modal-access-template` — swap the filename above
for the one the user wants, or copy the provided file directly instead of
using the CLI. Wire the env var into the `expectedHash` prop at the app's
entry point.

## 5. Confirm to the user
State explicitly, in your response, that the plaintext PIN was not written to any
file — only its hash was persisted.

## 6. Self-check
Before finishing, review your own diff/output for anything resembling a raw PIN
(the string the user gave you, or the one you generated) outside of your chat
response. If found anywhere in a file, remove it and re-run step 3. (If you are
an ambient-suggestion tool without diff-review authority over your own output,
follow your tool-specific instructions for the equivalent control instead.)

## 7. Troubleshooting
- **Hash mismatch on unlock**: regenerate the hash from the exact PIN string
  (check for trailing whitespace/newlines) and compare byte-for-byte.
- **Env var not loaded at build time**: confirm the framework's env-prefix rule
  was followed (e.g. `VITE_` for Vite, `NEXT_PUBLIC_` for Next.js client-side
  access) and that the dev/build server was restarted after the env file changed.
- **Session not persisting**: confirm the configured storage mode
  (`localStorage`/`sessionStorage`/`memory`) matches the user's expectation —
  `memory` intentionally does not survive a reload.
