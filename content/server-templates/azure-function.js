// @ts-check
/**
 * Knock Codes — Azure Function (v4 programming model) server verification
 * template.
 *
 * Deploy: set two application settings — KNOCK_CODES_SERVER_HASH,
 * KNOCK_CODES_TOKEN_SECRET. Reuses the Function App's existing
 * AzureWebJobsStorage account for the rate-limit table (no extra storage
 * account needed) — create the table once before first use, e.g.
 * `az storage table create --name KnockCodesRateLimit --connection-string "$AzureWebJobsStorage"`.
 * Requires @azure/functions and @azure/data-tables — the official platform
 * SDKs, not a third-party add-on.
 *
 * Wire contract identical across all three server templates — see the
 * Cloudflare Worker template in this same folder for the full contract.
 */
import { app } from "@azure/functions";
import { TableClient } from "@azure/data-tables";
import { createHash, createHmac } from "node:crypto";

const RATE_LIMIT_MAX_ATTEMPTS = 5; // adjust per deployment
const RATE_LIMIT_WINDOW_SECONDS = 60;
const TOKEN_TTL_MS = 5 * 60_000; // 5 minutes
const RATE_LIMIT_TABLE = "KnockCodesRateLimit";

const tableClient = TableClient.fromConnectionString(
  /** @type {string} */ (process.env.AzureWebJobsStorage),
  RATE_LIMIT_TABLE
);

/** @param {string} input */
function sha256Hex(input) {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

/** @param {string} secret */
function signToken(secret) {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + TOKEN_TTL_MS })).toString("base64url");
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

/**
 * Azure Functions can scale to multiple instances, so the counter must live
 * outside the process (an in-memory counter would be unsafe here). Any error
 * reading the current window's entity (including "not found") is treated as
 * a fresh counter, since Table Storage has no dedicated "does not exist yet"
 * case distinct from a thrown 404.
 * @param {string} identifier
 */
async function checkRateLimit(identifier) {
  const windowStart = Math.floor(Date.now() / 1000 / RATE_LIMIT_WINDOW_SECONDS);
  const partitionKey = identifier;
  const rowKey = String(windowStart);

  let count = 0;
  try {
    const entity = await tableClient.getEntity(partitionKey, rowKey);
    count = Number(entity.count ?? 0);
  } catch {
    // No entity for this window yet — starts at 0.
  }
  if (count >= RATE_LIMIT_MAX_ATTEMPTS) return false;

  await tableClient.upsertEntity({ partitionKey, rowKey, count: count + 1 }, "Replace");
  return true;
}

app.http("verifyAccess", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request) => {
    const identifier = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!(await checkRateLimit(identifier))) {
      return { status: 429, jsonBody: { ok: false, reason: "network" } };
    }

    /** @type {unknown} */
    let code;
    try {
      ({ code } = /** @type {{ code?: unknown }} */ (await request.json()));
    } catch {
      code = undefined;
    }
    if (typeof code !== "string") {
      return { status: 500, jsonBody: { ok: false, reason: "network" } };
    }

    if (sha256Hex(code) !== process.env.KNOCK_CODES_SERVER_HASH) {
      return { jsonBody: { ok: false, reason: "invalid" } };
    }

    return {
      jsonBody: { ok: true, token: signToken(/** @type {string} */ (process.env.KNOCK_CODES_TOKEN_SECRET)) },
    };
  },
});
