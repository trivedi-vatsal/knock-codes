// @ts-check
/**
 * Knock Codes — Hono server verification template.
 * Runs on Cloudflare Workers, Deno, Bun, or Node (via @hono/node-server) —
 * uses Web Crypto throughout so it's portable across all of them.
 *
 * Set two env vars/bindings: KNOCK_CODES_SERVER_HASH, KNOCK_CODES_TOKEN_SECRET.
 *
 * Wire contract identical across all server templates — see the
 * Cloudflare Worker template in this same folder for the full contract.
 */
import { Hono } from "hono";

const RATE_LIMIT_MAX_ATTEMPTS = 5; // adjust per deployment
const RATE_LIMIT_WINDOW_SECONDS = 60;
const TOKEN_TTL_MS = 5 * 60_000; // 5 minutes

// In-memory counter — acceptable ONLY for a single-instance/dev deployment.
// Swap in a shared store (Redis, KV, Durable Objects) before running
// multiple instances.
/** @type {Map<string, number>} */
const attemptsByKey = new Map();

/** @param {Uint8Array} bytes */
function base64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** @param {string} input */
async function sha256Hex(input) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** @param {string} secret */
async function signToken(secret) {
  const payload = base64Url(new TextEncoder().encode(JSON.stringify({ exp: Date.now() + TOKEN_TTL_MS })));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return `${payload}.${base64Url(new Uint8Array(signature))}`;
}

/** @param {string} identifier */
function checkRateLimit(identifier) {
  const windowStart = Math.floor(Date.now() / 1000 / RATE_LIMIT_WINDOW_SECONDS);
  const key = `${identifier}:${windowStart}`;
  const attempts = attemptsByKey.get(key) ?? 0;
  if (attempts >= RATE_LIMIT_MAX_ATTEMPTS) return false;
  attemptsByKey.set(key, attempts + 1);
  return true;
}

const app = new Hono();

app.post("/api/verify-access", async (c) => {
  const identifier = c.req.header("cf-connecting-ip") ?? c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(identifier)) {
    return c.json({ ok: false, reason: "network" }, 429);
  }

  /** @type {unknown} */
  let code;
  try {
    ({ code } = await c.req.json());
  } catch {
    code = undefined;
  }
  if (typeof code !== "string") {
    return c.json({ ok: false, reason: "network" }, 500);
  }

  if ((await sha256Hex(code)) !== c.env.KNOCK_CODES_SERVER_HASH) {
    return c.json({ ok: false, reason: "invalid" });
  }

  return c.json({ ok: true, token: await signToken(c.env.KNOCK_CODES_TOKEN_SECRET) });
});

export default app;
