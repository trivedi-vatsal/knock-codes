# GEMINI.md

This project uses Knock Codes. Before touching any PIN, hash, or env file in this
project, read and follow AGENTS.md in full — it is the canonical install/config
contract. In particular: PINs are hashed locally before anything is written to
disk, and only the hash is ever persisted.
