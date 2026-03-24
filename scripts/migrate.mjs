import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, "..", "db", "migrations");

async function loadEnvFile(filePath) {
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

async function ensureDatabaseUrl() {
  if (process.env.DATABASE_URL) return;

  const envPaths = [
    path.join(__dirname, "..", ".env.local"),
    path.join(__dirname, "..", ".env"),
  ];

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

    if (process.env.DATABASE_URL) return;
  }

  throw new Error("DATABASE_URL is not set. Add it to .env or .env.local.");
}

await ensureDatabaseUrl();

const client = new Client({
  connectionString: process.env.DB_MIGRATE_URL,
});

await client.connect();

await client.query(`
  CREATE TABLE IF NOT EXISTS schema_migrations (
    name TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`);

const files = (await fs.readdir(migrationsDir))
  .filter((name) => name.endsWith(".sql"))
  .sort();

const applied = new Set(
  (await client.query("SELECT name FROM schema_migrations")).rows.map(
    (r) => r.name,
  ),
);

for (const file of files) {
  if (applied.has(file)) continue;

  const sql = await fs.readFile(path.join(migrationsDir, file), "utf8");

  await client.query("BEGIN");
  try {
    await client.query(sql);
    await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [
      file,
    ]);
    await client.query("COMMIT");
    console.log(`Applied ${file}`);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
}

await client.end();
