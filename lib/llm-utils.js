/**
 * LLM Utilities — Shared Groq API wrapper with retry, JSON extraction, and validation.
 *
 * Every pipeline stage and evaluator imports from here instead of making
 * raw fetch calls, guaranteeing consistent error handling and output parsing.
 */

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

// ─── Core Groq call (no retry, no parsing) ─────────────────────────────────

async function callGroqRaw(messages, { temperature = 0.7, max_tokens = 1024, model = DEFAULT_MODEL } = {}) {
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages, temperature, max_tokens }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    const err = new Error(`Groq API error ${response.status}: ${errorText}`);
    err.status = response.status;
    throw err;
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

// ─── JSON extraction ────────────────────────────────────────────────────────

/**
 * Robustly extract a JSON object or array from LLM text output.
 * Handles: ```json fenced blocks, trailing prose, nested braces.
 */
function extractJson(text) {
  if (!text || typeof text !== "string") return null;

  // Strip markdown code fences
  let cleaned = text.replace(/```(?:json)?\s*/gi, "").replace(/```\s*/g, "").trim();

  // Try direct parse first
  try {
    return JSON.parse(cleaned);
  } catch {
    // Fall through
  }

  // Find the outermost { ... } or [ ... ]
  const objMatch = cleaned.match(/\{[\s\S]*\}/);
  if (objMatch) {
    try {
      return JSON.parse(objMatch[0]);
    } catch {
      // Fall through
    }
  }

  const arrMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrMatch) {
    try {
      return JSON.parse(arrMatch[0]);
    } catch {
      // Fall through
    }
  }

  return null;
}

// ─── Lightweight schema validation ──────────────────────────────────────────

/**
 * Validate a parsed object against a schema definition.
 *
 * Schema format:
 *   { fieldName: "string" | "number" | "array" | "object" | "boolean" }
 *
 * Returns { valid: boolean, errors: string[] }
 */
function validateJsonResponse(data, schema) {
  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Response is not an object"] };
  }

  const errors = [];

  for (const [field, expectedType] of Object.entries(schema)) {
    if (!(field in data)) {
      errors.push(`Missing required field: "${field}"`);
      continue;
    }

    const value = data[field];
    const actualType = Array.isArray(value) ? "array" : typeof value;

    if (expectedType === "array" && !Array.isArray(value)) {
      errors.push(`"${field}" should be an array, got ${typeof value}`);
    } else if (expectedType !== "array" && actualType !== expectedType) {
      errors.push(`"${field}" should be ${expectedType}, got ${actualType}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

// ─── Retry wrapper with JSON parsing ────────────────────────────────────────

/**
 * Call Groq with automatic retry, JSON extraction, and schema validation.
 *
 * Options:
 *   temperature, max_tokens, model  — forwarded to Groq
 *   retries        — number of retry attempts (default 2)
 *   backoffMs      — initial backoff delay (doubles each retry, default 500)
 *   expectJson     — if true, extracts and returns parsed JSON (default false)
 *   schema         — if provided (with expectJson), validates against schema
 */
async function callGroqWithRetry(messages, options = {}) {
  const {
    temperature = 0.7,
    max_tokens = 1024,
    model = DEFAULT_MODEL,
    retries = 2,
    backoffMs = 500,
    expectJson = false,
    schema = null,
  } = options;

  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const raw = await callGroqRaw(messages, { temperature, max_tokens, model });

      if (!expectJson) {
        return raw;
      }

      // Parse JSON
      const parsed = extractJson(raw);
      if (!parsed) {
        throw new Error(`Failed to extract JSON from LLM response: ${raw.substring(0, 200)}`);
      }

      // Validate schema if provided
      if (schema) {
        const { valid, errors } = validateJsonResponse(parsed, schema);
        if (!valid) {
          throw new Error(`Schema validation failed: ${errors.join(", ")}`);
        }
      }

      return parsed;
    } catch (err) {
      lastError = err;
      console.warn(`[llm-utils] Attempt ${attempt + 1}/${retries + 1} failed: ${err.message}`);

      // Don't retry on 4xx errors (bad request, auth, etc.)
      if (err.status && err.status >= 400 && err.status < 500) {
        throw err;
      }

      if (attempt < retries) {
        const delay = backoffMs * Math.pow(2, attempt);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  throw lastError;
}

// ─── Text sanitization ─────────────────────────────────────────────────────

/**
 * Strip markdown formatting artifacts and normalize whitespace.
 */
function sanitizeLLMOutput(text) {
  if (!text) return "";
  return text
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/\*\*(.*?)\*\*/g, "$1") // Bold → plain
    .replace(/\*(.*?)\*/g, "$1") // Italic → plain
    .replace(/#{1,6}\s/g, "") // Headings → plain
    .replace(/\n{3,}/g, "\n\n") // Collapse newlines
    .trim();
}

module.exports = {
  callGroqRaw,
  callGroqWithRetry,
  extractJson,
  validateJsonResponse,
  sanitizeLLMOutput,
};
