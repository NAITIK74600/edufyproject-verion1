// Applies scripts/schema.sql to the Neon database in DATABASE_URL.
// Usage: npm run db:migrate   (loads .env.local via Node's --env-file flag)
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { neon } from "@neondatabase/serverless";

const __dirname = dirname(fileURLToPath(import.meta.url));

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set (check .env.local). Aborting migration.");
  process.exit(1);
}

const sql = neon(connectionString);
const schema = readFileSync(join(__dirname, "schema.sql"), "utf8");

// Split on blank-line-separated statements is unsafe for jsonb/dollar-quoted
// bodies in general, but this schema file has none — a simple `;` split is
// enough here and keeps this script dependency-free.
const statements = schema
  .split(/;\s*(?:\n|$)/)
  .map((s) => s.trim())
  .filter((s) => s.length > 0 && !s.startsWith("--"));

try {
  for (const statement of statements) {
    await sql.query(statement);
    const firstLine = statement.split("\n")[0].slice(0, 70);
    console.log(`✓ ${firstLine}`);
  }
  console.log(`\nMigration complete — ${statements.length} statements applied.`);
} catch (err) {
  console.error("Migration failed:", err);
  process.exit(1);
}
