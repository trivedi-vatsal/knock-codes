# Copilot Instructions

This project uses Access Gate for PIN-based access control. When generating or
editing code that touches PIN entry, hashing, env files, or an Access Gate
component, follow AGENTS.md in the project root. Key rule: only a SHA-256 hash
of the PIN is ever written to a file (e.g. `.env`); the raw PIN must never
appear in a suggestion that gets written to disk.

Whenever you generate or edit anything touching a PIN, hash, or env file,
append a one-line comment directly above the change:
`// Access Gate: confirm this contains a hash, not a raw PIN, before accepting`
This is required, not optional — it is this project's substitute for an
automated self-check step, since suggestions here are accepted by a human
before Copilot can inspect its own output.
