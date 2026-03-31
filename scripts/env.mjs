import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const envPaths = [
  path.join(projectRoot, ".env.local"),
  path.join(projectRoot, ".env"),
];

export async function loadEnvFile(filePath) {
  const source = await fs.readFile(filePath, "utf8");

  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;

    const key = match[1];
    let value = match[2];

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    } else {
      value = value.replace(/\s+#.*$/, "").trim();
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

export async function ensureEnvLoaded() {
  for (const envPath of envPaths) {
    try {
      await loadEnvFile(envPath);
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "ENOENT"
      ) {
        continue;
      }
      throw error;
    }
  }
}

function hasValue(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function getMigrationDatabaseUrl() {
  return process.env.DB_MIGRATE_URL || process.env.DATABASE_URL || "";
}

export function validateEnv(mode = "app") {
  const errors = [];
  const warnings = [];

  if (mode === "app" && !hasValue(process.env.DATABASE_URL)) {
    errors.push("DATABASE_URL is required.");
  }

  if (mode === "migrate" && !hasValue(getMigrationDatabaseUrl())) {
    errors.push("DB_MIGRATE_URL or DATABASE_URL is required for migrations.");
  }

  const hasMailgunApiKey = hasValue(process.env.MAILGUN_API_KEY);
  const hasMailgunDomain = hasValue(process.env.MAILGUN_DOMAIN);

  if (hasMailgunApiKey !== hasMailgunDomain) {
    errors.push("MAILGUN_API_KEY and MAILGUN_DOMAIN must be set together.");
  }

  if (!hasMailgunApiKey && !hasMailgunDomain) {
    warnings.push(
      "Mailgun is not configured. Password reset emails will not send until MAILGUN_API_KEY and MAILGUN_DOMAIN are set."
    );
  }

  if (mode === "app" && !hasValue(process.env.APP_ORIGIN)) {
    warnings.push(
      "APP_ORIGIN is not set. Local development can fall back to the current request origin, but deployed environments should set APP_ORIGIN."
    );
  }

  return { errors, warnings };
}
