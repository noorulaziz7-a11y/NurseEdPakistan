const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { Client } = require("pg");

require("dotenv").config();

const MIGRATIONS_DIR = path.join(__dirname, "migrations");
const JOURNAL_PATH = path.join(MIGRATIONS_DIR, "meta", "_journal.json");

function sha256(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL missing");
  }

  if (!fs.existsSync(JOURNAL_PATH)) {
    throw new Error("Missing migrations/meta/_journal.json");
  }

  const journal = JSON.parse(fs.readFileSync(JOURNAL_PATH, "utf8"));
  const entries = Array.isArray(journal.entries) ? journal.entries : [];

  const baselineTag =
    process.env.BASELINE_TAG || "0001_old_colonel_america";
  const baselineEntries = entries.filter(
    (entry) => entry.tag && entry.tag <= baselineTag
  );

  const client = new Client({ connectionString: databaseUrl });
  await client.connect();

  await client.query("CREATE SCHEMA IF NOT EXISTS drizzle;");
  await client.query(
    `CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    );`
  );

  if (process.env.RESET_DRIZZLE_MIGRATIONS === "true") {
    await client.query("TRUNCATE drizzle.__drizzle_migrations;");
  }

  const existing = await client.query(
    "SELECT hash FROM drizzle.__drizzle_migrations;"
  );
  const existingHashes = new Set(existing.rows.map((row) => row.hash));

  for (const entry of baselineEntries) {
    const migrationPath = path.join(MIGRATIONS_DIR, `${entry.tag}.sql`);
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Missing migration file: ${entry.tag}.sql`);
    }
    const sql = fs.readFileSync(migrationPath, "utf8");
    const hash = sha256(sql);
    if (existingHashes.has(hash)) continue;
    await client.query(
      "INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2);",
      [hash, entry.when]
    );
  }

  await client.end();
  console.log(`Baseline migrations recorded (<= ${baselineTag}).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
